---
title: "The Voice Clone Migration: From Chatterbox to Qwen3-TTS"
date: "2026-03-20"
summary: "Migrating voice cloning from Chatterbox Turbo to Qwen3-TTS for better fidelity, and the optimization journey to match the original speed."
status: "Published"
category: "Relearn Engineering / Systems"
highlights:
  - "Voice Fidelity: Qwen3-TTS captures paralinguistic nuance better than Chatterbox Turbo, but requires audio-plus-transcript reference (Qwen Team, 2026)."
  - "AMD ROCm Friction: Bleeding-edge GPUs like the RX 9070 XT lack kernel support, requiring Triton backend and architecture-specific compilation (AMD ROCm, 2024)."
  - "CPU Orchestration: 3.4x speedup achieved by fixing MIOpen auto-tuning and OpenMP thread contention, not by upgrading hardware (Garofalo et al., 2023)."
audioUrl: "https://audio.relearn.ing/entry-045.mp3"
videoUrl: "https://relearn.ing/videos/entry-045.mp4"
linkedin_video_urn: "urn:li:digitalmediaAsset:D4E05AQHlL3DkUvN5pg"
publish_social: true
linkedin: |
  I migrated my voice cloning pipeline from Chatterbox Turbo to Qwen3-TTS.
  
  Why? Qwen captures my voice and tone better. More recent model, better zero-shot cloning.
  
  But there was a catch: on my AMD RX 9070 XT, Qwen took 2 minutes 15 seconds for 10 seconds of audio. Chatterbox Turbo? About 30 seconds.
  
  The problem wasn't the GPU. It was the CPU.
  
  → MIOpen was auto-tuning kernels on every inference pass
  → OpenMP was spawning threads across all 16 cores, causing contention
  → Flash Attention needed Triton backend, not the unsupported CK backend
  
  After optimization: 40 seconds. Still slower than Chatterbox, but acceptable for the quality gain.
  
  Tradeoffs:
  ✅ Better voice fidelity
  ✅ Natural language emotion control
  ❌ Requires transcript with reference audio
  ❌ More complex setup on AMD
  
  The GPU is the worker. The CPU is the manager. Don't starve the worker.
  
  Full write-up (with audio) on relearn.ing:
  
  https://relearn.ing/journal/entry-045/
threads: |
  Migrated from Chatterbox to Qwen3-TTS for voice cloning.
  
  Better voice fidelity. But 2:15 for 10s audio vs 30s on Chatterbox.
  
  Fixed: MIOpen tuning, thread contention, Triton backend.
  
  Now: 40 seconds. Acceptable tradeoff for the quality.
  
  The GPU is the worker. The CPU is the manager.
  
  relearn.ing/journal/entry-045/
---

I've been using Chatterbox Turbo for voice cloning on relearn.ing. It's fast, reliable, and integrates cleanly with my pipeline. But when Qwen3-TTS dropped with its 1.7B Base model for zero-shot voice cloning, I wanted to test if the quality improvement was worth the migration.

Spoiler: it was. But getting there required a 3.4x optimization journey.

### The Decision Matrix

- **Chatterbox Turbo**: Audio-only reference, paralinguistic tags like chuckle and sigh, stable AMD support, about 30 seconds for 10 seconds of audio
- **Qwen3-TTS 1.7B Base**: Requires audio plus transcript, natural language emotion control, bleeding-edge AMD support, initially 2 minutes 15 seconds for 10 seconds of audio

The voice quality difference is subtle but noticeable. Qwen3-TTS captures prosody and emotional undertones that Chatterbox sometimes flattens. The tradeoff: you must provide a transcript of your reference audio, and setup on AMD hardware is non-trivial.

### The Fallacy

The cultural script in ML inference is that speed is purely a function of GPU compute. If a model is slow, get a faster GPU. This ignores the orchestration layer—the CPU that schedules kernels, manages memory transfers, and handles pre/post-processing.

### The Model

On my AMD Radeon RX 9070 XT (gfx1201 architecture), Qwen3-TTS initially took 2 minutes 15 seconds to generate 10 seconds of audio. The GPU was underutilized. The CPU was pinned at 100%.

This is Amdahl's Law in heterogeneous computing [1]. The GPU is the worker. The CPU is the manager. If the manager spends all its time compiling kernels and spawning threads, the worker starves.

### The Protocol

**Phase 1: Architecture Alignment**

The RX 9070 XT is very new. The Composable Kernel (CK) backend doesn't support gfx1201 yet.

1. Force Triton backend with `FLASH_ATTENTION_TRITON_AMD_ENABLE=TRUE`
2. Rebuild Flash Attention with `PYTORCH_ROCM_ARCH=gfx1201`
3. Remove incorrect `HSA_OVERRIDE_GFX_VERSION` flags

**Phase 2: CPU Orchestration**

The real bottleneck wasn't the GPU—it was the CPU doing unnecessary work.

1. Disable MIOpen auto-tuning with `MIOPEN_FIND_MODE=2` and `MIOPEN_FIND_ENFORCE=1`
2. Constrain OpenMP to 4 threads with `OMP_NUM_THREADS=4`

**Phase 3: Audio Pipeline**

Neural TTS outputs waveforms in chunks. Naive concatenation introduces artifacts.

1. Crossfade chunks with 10ms fade-in/fade-out
2. Peak limiting after LUFS normalization
3. Single normalization pass at the end

### The Results

- Generation time: 2:15 → 40s (3.4x faster)
- CPU utilization: 100% → ~30%
- Audio quality: pops/clicks → clean

### The Verdict

I migrated to Qwen3-TTS because voice fidelity matters for content creation. The optimization work was a one-time cost. Now I get better voice cloning at acceptable speed.

If you're on NVIDIA hardware, the setup is probably trivial. On AMD ROCm with bleeding-edge GPUs, expect to debug the stack.

The GPU is the worker. The CPU is the manager. Don't starve the worker.

### References

[1] Garofalo, A., et al. (2023). "Is an AI Accelerator All You Need? Overcoming Amdahl's Law in Deep Learning Inference." IEEE International Solid-State Circuits Conference.

[2] AMD ROCm Documentation. (2024). "Using the find APIs and immediate mode in MIOpen." Advanced Micro Devices, Inc.

[3] Qwen Team. (2026). "Qwen3-TTS Technical Report." arXiv:2601.15621.
