---
layout: post
title: "Paper Survey之——Awesome Dynamic SLAM"
date:   2025-03-07
tags: [SLAM]
comments: true
author: kwanwaipang
toc: false #true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
之前博客以图片的形式将Dynamic-SLAM相关的调研工作共享出来，但实际阅读是非常困难的，加上容易混乱，因此本博文将完整版ppt给出，并且后续新增的调研也可实时更新，这样避免了每次截图的繁琐操作。

<!-- {% raw %}
<div align="center" style="
  position: relative; 
  width: 100%; 
  height: 500px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe src="https://onedrive.live.com/embed?resid=893B607C76D94A76!120&authkey=!AI5r_iQJbZJQqhw&em=2&wdAr=1.777&wdHideHeaders=true&wdEmbedCode=0" width="100%" height="100%" frameborder="0"></iframe>
</div>
{% endraw %} -->

<div align="center" style="
  position: relative; 
  width: 100%; 
  height: 500px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe width="100%" height="100%"
    src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/Survey for Dynamic SLAM.pdf#toolbar=0&navpanes=0&scrollbar=0" ></iframe>
</div>

<br>

* 😁原创不易，如果使用请给出引用以及给个star <a class="github-button"   href="https://github.com/KwanWaiPang/KwanWaiPang.github.io"   data-icon="octicon-star"   data-size="large"  data-show-count="true"  aria-label="Star 你的用户名/你的仓库名 on GitHub">Star</a>谢谢😊
* Previous Survey for Dynamic-SLAM: [Blog](https://kwanwaipang.github.io/File/Blogs/Poster/survey_dynamic_SLAM.html)
* 基于3DGS以及Transformer的也有大量跟Dynamic-SLAM相关的工作，具体请见：
  * Awesome-Transformer-based-SLAM: [Paper List](https://github.com/KwanWaiPang/Awesome-Transformer-based-SLAM) 
  * Awesome-3DGS-SLAM: [Paper List](https://github.com/KwanWaiPang/Awesome-3DGS-SLAM)

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->
* Keep update the paper list:

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`CVPR`|[Time of the Flight of the Gaussians: Optimizing Depth Indirectly in Dynamic Radiance Fields](https://arxiv.org/pdf/2505.05356)|[![Github stars](https://img.shields.io/github/stars/brownvc/gftorf.svg)](https://github.com/brownvc/gftorf)|[website](https://visual.cs.brown.edu/projects/gftorf-webpage/)| 
|2025|`arXiv`|[DynaGSLAM: Real-Time Gaussian-Splatting SLAM for Online Rendering, Tracking, Motion Predictions of Moving Objects in Dynamic Scenes](https://arxiv.org/pdf/2503.11979)|[![Github stars](https://img.shields.io/github/stars/BlarkLee/DynaGSLAM_official.svg)](https://github.com/BlarkLee/DynaGSLAM_official)|[website](https://blarklee.github.io/dynagslam/)| 
|2025|`arXiv`|[DynoSAM: Open-Source Smoothing and Mapping Framework for Dynamic SLAM](https://arxiv.org/pdf/2501.11893)|[![Github stars](https://img.shields.io/github/stars/ACFR-RPG/DynOSAM.svg)](https://github.com/ACFR-RPG/DynOSAM)|---|
|2025|`CVPR`|[Dynamic Camera Poses and Where to Find Them](https://arxiv.org/pdf/2504.17788)|---|[website](https://research.nvidia.com/labs/dir/dynpose-100k/)<br>[dataset](https://huggingface.co/datasets/nvidia/dynpose-100k)|
|2025|`arXiv`|[Back on Track: Bundle Adjustment for Dynamic Scene Reconstruction](https://arxiv.org/pdf/2504.14516)|---|[website](https://wrchen530.github.io/projects/batrack/)|
|2022|`RAL`|[DynaVINS: A Visual-Inertial SLAM for Dynamic Environments](https://arxiv.org/pdf/2208.11500)|[![Github stars](https://img.shields.io/github/stars/url-kaist/dynaVINS.svg)](https://github.com/url-kaist/dynaVINS)|---|
|2021|`RAL`|[DynaSLAM II: Tightly-coupled multi-object tracking and SLAM](https://arxiv.org/pdf/2010.07820)|---|---|
|2020|`ICRA`|[Flowfusion: Dynamic dense rgb-d slam based on optical flow](https://arxiv.org/pdf/2003.05102)|---|---|
|2020|`TPAMI`|[Rgb-d slam in dynamic environments using point correlations](https://arxiv.org/pdf/1811.03217)|---|[video](https://www.youtube.com/watch?v=WCOoaaVaHTw)|
|2018|`RAL`|[DynaSLAM: Tracking, mapping, and inpainting in dynamic scenes](https://arxiv.org/pdf/1806.05620)|---|---|


<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

