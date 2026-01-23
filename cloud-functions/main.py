"""
Social Media Fan-Out Publisher - Cloud Functions

Separate HTTP-triggered functions for LinkedIn and Threads publishing.
Called by Cloud Workflows with independent retry logic per platform.

Key design decisions:
- Separate functions allow Workflows to retry each platform independently
- NO AI transformation here (done locally in OpenCode publish-content skill)
- Secrets fetched from Secret Manager (not environment variables)
- Idempotent by design
"""

import json
import logging
import os

import functions_framework
from google.cloud import secretmanager
import requests

# Configure structured logging for Cloud Logging
logging.basicConfig(
    level=logging.INFO, format='{"severity":"%(levelname)s","message":"%(message)s"}'
)
logger = logging.getLogger(__name__)

# Initialize Secret Manager client (lazy)
_secrets_client = None
PROJECT_ID = os.getenv("GCP_PROJECT") or os.getenv("GOOGLE_CLOUD_PROJECT")


def get_secrets_client():
    """Lazy initialization of Secret Manager client."""
    global _secrets_client
    if _secrets_client is None:
        _secrets_client = secretmanager.SecretManagerServiceClient()
    return _secrets_client


def get_secret(name: str) -> str:
    """Fetch a secret from Secret Manager."""
    client = get_secrets_client()
    resource = f"projects/{PROJECT_ID}/secrets/{name}/versions/latest"
    response = client.access_secret_version(request={"name": resource})
    return response.payload.data.decode("UTF-8")


# =============================================================================
# LinkedIn Publisher
# =============================================================================


@functions_framework.http
def publish_linkedin(request):
    """
    Publish to LinkedIn - called by Workflow.

    Expected JSON body:
    {
        "content": "The post content...",
        "audio_url": "https://relearn.ing/audio/..."  (optional),
        "image_urn": "urn:li:image:..."  (optional - pre-uploaded image URN),
        "video_urn": "urn:li:digitalmediaAsset:..."  (optional - pre-uploaded video URN)
    }

    Note: image_urn and video_urn are mutually exclusive. If both provided, video takes priority.
    """
    try:
        data = request.get_json(silent=True) or {}
        content = data.get("content", "")
        audio_url = data.get("audio_url", "")
        image_urn = data.get("image_urn", "")
        video_urn = data.get("video_urn", "")

        if not content:
            return json.dumps({"success": False, "error": "No content provided"}), 400

        logger.info(
            f"Publishing to LinkedIn: {len(content)} chars, image: {bool(image_urn)}, video: {bool(video_urn)}"
        )

        # Get credentials from Secret Manager
        access_token = get_secret("linkedin-access-token")
        person_urn = get_secret("linkedin-urn")  # Full URN like urn:li:person:xxx

        # Escape reserved characters for LinkedIn
        import re

        escaped = re.sub(r"([|{}@\[\]()<>#\*_~\\])", r"\\\1", content)

        # If audio URL provided, append it
        if audio_url:
            escaped = f"{escaped}\n\n🎧 Listen: {audio_url}"

        # Build the post payload
        post_payload = {
            "author": person_urn,  # Use the full URN directly
            "commentary": escaped,
            "visibility": "PUBLIC",
            "distribution": {
                "feedDistribution": "MAIN_FEED",
                "targetEntities": [],
                "thirdPartyDistributionChannels": [],
            },
            "lifecycleState": "PUBLISHED",
            "isReshareDisabledByAuthor": False,
        }

        # If video URN provided, use the ugcPosts API (different format for video)
        if video_urn:
            logger.info(f"Including video: {video_urn}")

            # Video posts use the older ugcPosts API
            post_payload = {
                "author": person_urn,
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {"text": escaped},
                        "shareMediaCategory": "VIDEO",
                        "media": [
                            {
                                "status": "READY",
                                "media": video_urn,
                            }
                        ],
                    }
                },
                "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
            }

            response = requests.post(
                "https://api.linkedin.com/v2/ugcPosts",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "X-Restli-Protocol-Version": "2.0.0",
                    "Content-Type": "application/json",
                },
                json=post_payload,
                timeout=30,
            )
        else:
            # If image URN provided, add it to the post
            if image_urn:
                post_payload["content"] = {
                    "media": {
                        "id": image_urn,
                    }
                }
                logger.info(f"Including image: {image_urn}")

            response = requests.post(
                "https://api.linkedin.com/rest/posts",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "X-Restli-Protocol-Version": "2.0.0",
                    "LinkedIn-Version": "202601",
                    "Content-Type": "application/json",
                },
                json=post_payload,
                timeout=30,
            )

        if response.status_code == 201:
            post_id = response.headers.get("x-restli-id", "unknown")
            logger.info(f"LinkedIn published successfully: {post_id}")
            return json.dumps(
                {"success": True, "platform": "linkedin", "post_id": post_id}
            )
        else:
            error_msg = f"LinkedIn API error: {response.status_code} - {response.text}"
            logger.error(error_msg)
            return json.dumps(
                {"success": False, "platform": "linkedin", "error": error_msg}
            ), 500

    except Exception as e:
        logger.exception(f"LinkedIn publish failed: {e}")
        return json.dumps(
            {"success": False, "platform": "linkedin", "error": str(e)}
        ), 500


# =============================================================================
# Threads Publisher
# =============================================================================


@functions_framework.http
def publish_threads(request):
    """
    Publish to Threads - called by Workflow.

    Expected JSON body:
    {
        "content": "The post content...",
        "audio_url": "https://relearn.ing/audio/..."  (optional)
    }
    """
    try:
        data = request.get_json(silent=True) or {}
        content = data.get("content", "")
        audio_url = data.get("audio_url", "")

        if not content:
            return json.dumps({"success": False, "error": "No content provided"}), 400

        logger.info(f"Publishing to Threads: {len(content)} chars")

        # Get credentials from Secret Manager
        access_token = get_secret("threads-access-token")
        user_id = get_secret("threads-user-id")

        # If audio URL provided, append it
        full_content = content
        if audio_url:
            full_content = f"{content}\n\n🎧 {audio_url}"

        base_url = f"https://graph.threads.net/v1.0/{user_id}"

        # Step 1: Create media container
        container_response = requests.post(
            f"{base_url}/threads",
            data={
                "media_type": "TEXT",
                "text": full_content,
                "access_token": access_token,
            },
            timeout=30,
        )
        container_data = container_response.json()

        if "id" not in container_data:
            error_msg = f"Threads container error: {container_data}"
            logger.error(error_msg)
            return json.dumps(
                {"success": False, "platform": "threads", "error": error_msg}
            ), 500

        container_id = container_data["id"]

        # Brief pause for container processing
        import time

        time.sleep(1)

        # Step 2: Publish container
        publish_response = requests.post(
            f"{base_url}/threads_publish",
            data={
                "creation_id": container_id,
                "access_token": access_token,
            },
            timeout=30,
        )
        publish_data = publish_response.json()

        if "id" not in publish_data:
            error_msg = f"Threads publish error: {publish_data}"
            logger.error(error_msg)
            return json.dumps(
                {"success": False, "platform": "threads", "error": error_msg}
            ), 500

        post_id = publish_data["id"]
        logger.info(f"Threads published successfully: {post_id}")
        return json.dumps({"success": True, "platform": "threads", "post_id": post_id})

    except Exception as e:
        logger.exception(f"Threads publish failed: {e}")
        return json.dumps(
            {"success": False, "platform": "threads", "error": str(e)}
        ), 500


# =============================================================================
# Local Testing
# =============================================================================

if __name__ == "__main__":
    print("Cloud Functions for Social Fan-Out Pipeline")
    print("=" * 50)
    print("\nFunctions:")
    print("  - publish_linkedin: HTTP-triggered, posts to LinkedIn")
    print("  - publish_threads:  HTTP-triggered, posts to Threads")
    print("\nExpected request body:")
    print(
        json.dumps(
            {
                "content": "Your post content here...",
                "audio_url": "https://relearn.ing/audio/entry-xxx.mp3",
            },
            indent=2,
        )
    )
    print("\nThese functions are called by the Workflow, not directly.")
