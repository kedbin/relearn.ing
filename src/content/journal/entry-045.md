---
title: "The Throughput Trap: Migrating to Qwen3-TTS on RDNA 4"
date: "2026-03-20"
summary: "Debugging the heterogeneous compute stack for real-time audio generation on bleeding-edge AMD hardware."
status: "Published"
category: "Relearn Engineering / Systems"
highlights:
  - "Heterogeneous Bottlenecks: A faster GPU cannot overcome a CPU that is bogged down by thread contention and kernel compilation (Garofalo et al., 2023)."
  - "Heuristic Overhead: Disabling exhaustive convolution searches in MIOpen reclaims CPU cycles and prevents GPU starvation (AMD ROCm, 2024)."
  - "Signal Integrity: Naive tensor concatenation causes phase mismatch; proper crossfading and LUFS normalization are required to prevent audio artifacts (Smith, 2010)."
audioUrl: "https://audio.relearn.ing/entry-045.mp3"
videoUrl: "urn:li:digitalmediaAsset:D4E05AQE1TB2ILGGG9Q"
linkedin_video_urn: "urn:li:digitalmediaAsset:D4E05AQE1TB2ILGGG9Q"
publish_social: true
linkedin: |
  I dropped AMD's bleeding-edge Radeon RX 9070 XT into my rig, expecting to crush voice cloning workloads.
  
  Instead, my first attempt resulted in a hard GPU hang. When I finally got it running, generating 10 seconds of audio took 2 minutes and 15 seconds.
  
  The GPU was practically asleep. The CPU was pinned at 100%.
  
  I had fallen into the classic hardware trap: assuming a faster accelerator automatically yields faster throughput.
  
  → The GPU is the worker. The CPU is the manager.
  → If the manager spends all its time compiling kernels, the worker sits idle.
  → Fix: MIOpen fast mode, thread constraints, proper audio crossfading.
  
  Result: 3.4x speedup. 40 seconds instead of 2:15.
  
  A bleeding-edge accelerator is just an expensive heater until the CPU learns how to feed it.
  
  Full write-up (with audio) on relearn.ing:
  
  https://relearn.ing/journal/entry-045/
threads: |
  Bought a bleeding-edge GPU. Got 2:15 for 10 seconds of audio.
  
  Turns out the CPU was the bottleneck all along.
  
  Fixed: kernel compilation, thread contention, audio pipeline.
  
  Result: 40 seconds. 3.4x faster.
  
  The GPU is the worker. The CPU is the manager. Don't starve the worker.
  
  relearn.ing/journal/entry-045/
---

I recently dropped AMD's bleeding-edge Radeon RX 9070 XT (RDNA 4) into my rig, expecting to instantly crush voice cloning workloads. Instead, my first attempt to run Qwen3-TTS resulted in a hard GPU hang. When I finally got it running, generating 10 seconds of audio took 2 minutes and 15 seconds. The GPU was practically asleep, while the CPU was pinned at 100%. I had fallen into the classic hardware trap: assuming a faster accelerator automatically yields faster throughput, ignoring the orchestration layer that feeds it.

### The Fallacy

The cultural script in machine learning is that inference speed is entirely a function of GPU compute (TFLOPS) and memory bandwidth. This leads to the "GPU-centric fallacy"—the belief that if a model is slow, you just need a bigger, newer GPU. We treat the CPU as a passive bystander and audio post-processing as an afterthought, ignoring the reality that a system is only as fast as its most constrained bottleneck.

### The Model

In systems engineering, this is a manifestation of **Amdahl's Law in Heterogeneous Computing** [1]. The GPU is an incredibly fast worker, but the CPU is the manager. If the manager spends all its time compiling kernels, searching for optimal convolution algorithms, or spawning too many threads, the worker sits idle.

This dynamic is especially pronounced when migrating between TTS architectures. Legacy systems like Chatterbox rely on older, stable architectures that are easier to deploy but lack zero-shot capabilities. In contrast, the Qwen3-TTS Base model—specifically when utilizing `create_voice_clone_prompt()` for voice cloning—offers superior fidelity but demands a significantly more complex orchestration layer.

Furthermore, in audio generation, raw tensor output is not the final product. Neural TTS models output raw waveforms in chunks. If these chunks are naively concatenated without DSP (Digital Signal Processing) fundamentals—like zero-crossing alignment or crossfading—you introduce high-frequency artifacts (pops, clicks, and "radio noise"). The model isn't broken; the assembly line is.

### The Data

- **Hardware**: AMD Radeon RX 9070 XT (`gfx1201`).
- **Initial State**: 2 minutes 15 seconds to generate 10s of audio. GPU hangs due to unsupported Composable Kernel (CK) backend.
- **Optimized State**: 40 seconds for 10s of audio (a 3.4x speedup).
- **Root Causes**: MIOpen auto-tuning overhead, OpenMP thread contention, and missing Triton backend compilation for `gfx1201`.

### The Protocol

#### Phase 1: Kernel and Architecture Alignment

You cannot run bleeding-edge hardware on legacy assumptions. The RX 9070 XT uses the `gfx1201` architecture.

1. **Bypass unsupported backends**: The Composable Kernel (CK) backend doesn't yet support `gfx1201`. Force the Triton backend with `FLASH_ATTENTION_TRITON_AMD_ENABLE=TRUE`.
2. **Recompile dependencies**: Rebuild Flash Attention explicitly for the new architecture using `PYTORCH_ROCM_ARCH=gfx1201`.
3. **Fix the override**: Remove incorrect `HSA_OVERRIDE_GFX_VERSION` flags that cause silent kernel failures or hard hangs.

#### Phase 2: CPU Orchestration (The Manager)

Stop the CPU from doing unnecessary work during inference.

1. **Disable exhaustive kernel searches**: Set `MIOPEN_FIND_MODE=2` (Fast mode) and `MIOPEN_FIND_ENFORCE=1` to prevent the CPU from benchmarking convolution algorithms on every forward pass [2].
2. **Constrain thread spawning**: Set `OMP_NUM_THREADS=4`. Deep learning frameworks often default to using all available CPU cores, causing massive context-switching overhead that starves the GPU.

#### Phase 3: Audio Pipeline Stabilization

Raw tensor-to-audio conversion requires strict DSP boundaries to prevent clipping and artifacts [3].

1. **Implement Crossfading**: Never concatenate raw audio chunks abruptly. Apply a 10-20ms fade-in/fade-out at chunk boundaries to prevent phase mismatch clicks.
2. **Prevent Clipping**: Neural models occasionally output values outside the [-1.0, 1.0] range. Apply hard limiting or dynamic range compression before saving the WAV file.
3. **LUFS Normalization**: Normalize the final output to a standard loudness (e.g., -23 LUFS) to eliminate the "radio noise" floor caused by low-amplitude quantization errors.

A bleeding-edge accelerator is just an expensive heater until the CPU learns how to feed it.

### References

[1] Garofalo, A., et al. (2023). "Is an AI Accelerator All You Need? Overcoming Amdahl's Law in Deep Learning Inference." IEEE International Solid-State Circuits Conference.

[2] AMD ROCm Documentation. (2024). "Using the find APIs and immediate mode in MIOpen." Advanced Micro Devices, Inc.

[3] Smith, J. O. (2010). "Physical Audio Signal Processing." W3K Publishing.
