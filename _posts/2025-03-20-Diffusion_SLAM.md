---
layout: post
title: "Paper Survey之——Awesome Diffusion-based SLAM"
date:   2025-03-20
tags: [SLAM, Deep Learning]
comments: true
author: kwanwaipang
toc: false #true
---


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
之前博客在对Transformer-based SLAM进行调研的时候，无意中发现竟然还要基于Diffusion的SLAM相关的工作，为此针对其进行调研，看看Diffusion在SLAM、光流、深度估计、数据关联、姿态估计等任务上表现如何~

本博文仅供本人学习记录用~

* 目录
{:toc}


其他相关链接：

* [What is Diffusion?](https://kwanwaipang.github.io/Diffusion/)
* Learning-based VO,VIO,IO：[Paper List](https://github.com/KwanWaiPang/Awesome-Learning-based-VO-VIO) 以及[博客](https://kwanwaipang.github.io/Learning-based-VO-VIO/)
* Transformer-based SLAM：[Paper List](https://github.com/KwanWaiPang/Awesome-Transformer-based-SLAM) 以及[博客](https://kwanwaipang.github.io/Transformer_SLAM/)
* NeRF-based SLAM：[博客](https://kwanwaipang.github.io/Awesome-NeRF-SLAM/)
* 3DGS-based SLAM: [博客](https://kwanwaipang.github.io/File/Blogs/Poster/survey_3DGS_SLAM.html)


# Paper List

* 注意，此处非最新版，仅仅是写此博客的时候的记录
* Keep update the paper list in: [Awesome-Diffusion-based-SLAM](https://github.com/KwanWaiPang/Awesome-Diffusion-based-SLAM)


## Matching

or data association

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`arXiv`|[MATCHA: Towards Matching Anything](https://arxiv.org/pdf/2501.14945)|---|---|


## Depth Estimation

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`CVPR`|[Difix3D+: Improving 3D Reconstructions with Single-Step Diffusion Models](https://arxiv.org/pdf/2503.01774?)|---|[website](https://research.nvidia.com/labs/toronto-ai/difix3d/)|
|2025|`CVPR`|[Multi-view Reconstruction via SfM-guided Monocular Depth Estimation](https://arxiv.org/pdf/2503.14483)|[![Github stars](https://img.shields.io/github/stars/zju3dv/Murre.svg)](https://github.com/zju3dv/Murre)|[website](https://zju3dv.github.io/murre/)|
|2025|`CVPR`|[Align3r: Aligned monocular depth estimation for dynamic videos](https://arxiv.org/pdf/2412.03079)|[![Github stars](https://img.shields.io/github/stars/jiah-cloud/Align3R.svg)](https://github.com/jiah-cloud/Align3R)|---|
|2024|`ECCV`|[Diffusiondepth: Diffusion denoising approach for monocular depth estimation](https://arxiv.org/pdf/2303.05021)|[![Github stars](https://img.shields.io/github/stars/duanyiqun/DiffusionDepth.svg)](https://github.com/duanyiqun/DiffusionDepth)|[website](https://igl-hkust.github.io/Align3R.github.io/)|
|2023|`NIPS`|[The surprising effectiveness of diffusion models for optical flow and monocular depth estimation](https://proceedings.neurips.cc/paper_files/paper/2023/file/7c119415672ae2186e17d492e1d5da2f-Paper-Conference.pdf)|---|[website](https://diffusion-vision.github.io/)|
|2023|`arXiv`|[Monocular depth estimation using diffusion models](https://arxiv.org/pdf/2302.14816)|---|[website](https://depth-gen.github.io/)| 


## Pose Estimation

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2023|`ICCV`|[Posediffusion: Solving pose estimation via diffusion-aided bundle adjustment](https://openaccess.thecvf.com/content/ICCV2023/papers/Wang_PoseDiffusion_Solving_Pose_Estimation_via_Diffusion-aided_Bundle_Adjustment_ICCV_2023_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/facebookresearch/PoseDiffusion.svg)](https://github.com/facebookresearch/PoseDiffusion)|[website](https://posediffusion.github.io/)|




# Paper Reading
接下来重点阅读几篇论文

