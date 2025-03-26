---
layout: post
title: "Survey——Humanoid/Legged  Robot Localization and Mapping"
date:   2025-03-25
tags: [SLAM]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
本博文为本人针对基于人形机械狗等足式机器人的SLAM进行技术洞察的记录

本技术洞察从3DSLAM到基于足式机器人的SLAM，以求给与相关领域开发者启发,由于本人水平有限，不足之处，敬请谅解。

<!-- 本博文仅供本人学习记录用~ -->

# Paper List

* 注意，此处非最新版，仅仅是写此博客的时候的记录
* Keep update the paper list in: [Awesome-Humanoid-Robot-Localization-and-Mapping](https://github.com/KwanWaiPang/Awesome-Humanoid-Robot-Localization-and-Mapping)

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2024|`RAL`|[Leg-KILO: Robust Kinematic-Inertial-Lidar Odometry for Dynamic Legged Robots](https://github.com/KwanWaiPang/Awesome-Humanoid-Robot-Localization-and-Mapping/blob/pdf/Leg-KILO%20Robust%20Kinematic-Inertial-Lidar%20Odometry%20for%20Dynamic%20Legged%20Robots.pdf)|[![Github stars](https://img.shields.io/github/stars/ouguangjun/Leg-KILO.svg)](https://github.com/ouguangjun/Leg-KILO)|[dataset](https://github.com/ouguangjun/legkilo-dataset)|


# Related Resource
* Survey for Learning-based VO,VIO,IO：[Paper List](https://github.com/KwanWaiPang/Awesome-Learning-based-VO-VIO) and [Blog](https://kwanwaipang.github.io/Learning-based-VO-VIO/)
* Survey for Transformer-based SLAM：[Paper List](https://github.com/KwanWaiPang/Awesome-Transformer-based-SLAM) and [Blog](https://kwanwaipang.github.io/Transformer_SLAM/)
* Survey for Diffusion-based SLAM：[Paper List](https://github.com/KwanWaiPang/Awesome-Diffusion-based-SLAM) and [Blog](https://kwanwaipang.github.io/Diffusion_SLAM/)
* Survey for NeRF-based SLAM：[Blog](https://kwanwaipang.github.io/Awesome-NeRF-SLAM/)
* Survey for 3DGS-based SLAM: [Blog](https://kwanwaipang.github.io/File/Blogs/Poster/survey_3DGS_SLAM.html)
* [Paper Survey之——LiDAR-SLAM中的退化检测](https://kwanwaipang.github.io/Lidar_Degeneracy/)
* [学习笔记之——激光雷达SLAM（LOAM系列的复现与学习）](https://blog.csdn.net/gwplovekimi/article/details/119711762?spm=1001.2014.3001.5502)
* [Awesome-LiDAR-Visual-SLAM](https://github.com/sjtuyinjie/awesome-LiDAR-Visual-SLAM)
* PPT中记录的3D SLAM相关工作：

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2024|`TPAMI`|[R3LIVE++: A Robust, Real-time, Radiance Reconstruction Package with a Tightly-coupled LiDAR-Inertial-Visual State Estimator](https://arxiv.org/pdf/2209.03666)|[![Github stars](https://img.shields.io/github/stars/hku-mars/r3live.svg)](https://github.com/hku-mars/r3live)|数据集[![Github stars](https://img.shields.io/github/stars/ziv-lin/r3live_dataset.svg)](https://github.com/ziv-lin/r3live_dataset)|
|2022|`ICRA`|[R3LIVE: A Robust, Real-time, RGB-colored, LiDAR-Inertial-Visual tightly-coupled state Estimation and mapping package](https://arxiv.org/pdf/2109.07982)|[![Github stars](https://img.shields.io/github/stars/hku-mars/r3live.svg)](https://github.com/hku-mars/r3live)|---|
|2021|`RAL`|[R2LIVE: A Robust, Real-Time, LiDAR-Inertial-Visual Tightly-Coupled State Estimator and Mapping](https://arxiv.org/pdf/2102.12400)|[![Github stars](https://img.shields.io/github/stars/hku-mars/r2live.svg)](https://github.com/hku-mars/r2live)|---|
|2024|`TRO`|[FAST-LIVO2: Fast, Direct LiDAR–Inertial–Visual Odometry](https://arxiv.org/pdf/2408.14035)|[![Github stars](https://img.shields.io/github/stars/hku-mars/FAST-LIVO2.svg)](https://github.com/hku-mars/FAST-LIVO2)|---|
|2022|`IROS`|[Fast-livo: Fast and tightly-coupled sparse-direct lidar-inertial-visual odometry](https://arxiv.org/pdf/2203.00893)|[![Github stars](https://img.shields.io/github/stars/hku-mars/FAST-LIVO.svg)](https://github.com/hku-mars/FAST-LIVO)|---|
|2023|`TRO`|[Immesh: An immediate lidar localization and meshing framework](https://arxiv.org/pdf/2301.05206)|[![Github stars](https://img.shields.io/github/stars/hku-mars/ImMesh.svg)](https://github.com/hku-mars/ImMesh)|---|
|2023|`Advanced Intelligent Systems`|[Point‐LIO: Robust high‐bandwidth light detection and ranging inertial odometry](https://advanced.onlinelibrary.wiley.com/doi/pdf/10.1002/aisy.202200459)|[![Github stars](https://img.shields.io/github/stars/hku-mars/Point-LIO.svg)](https://github.com/hku-mars/Point-LIO)|---|
|2022|`TRO`|[FAST-LIO2: Fast Direct LiDAR-inertial Odometry](https://arxiv.org/pdf/2107.06829)|[![Github stars](https://img.shields.io/github/stars/hku-mars/FAST_LIO.svg)](https://github.com/hku-mars/FAST_LIO)|---| 
|2021|`RAL`|[Fast-lio: A fast, robust lidar-inertial odometry package by tightly-coupled iterated kalman filter](https://arxiv.org/pdf/2010.08196)|[![Github stars](https://img.shields.io/github/stars/hku-mars/FAST_LIO.svg)](https://github.com/hku-mars/FAST_LIO)|---|
|2019|`ICRA`|[Tightly coupled 3d lidar inertial odometry and mapping](https://arxiv.org/pdf/1904.06993)|[![Github stars](https://img.shields.io/github/stars/hyye/lio-mapping.svg)](https://github.com/hyye/lio-mapping)|LIO-Mapping|
|2018|`IROS`|[Scan context: Egocentric spatial descriptor for place recognition within 3d point cloud map](https://gisbi-kim.github.io/publications/gkim-2018-iros.pdf)|[![Github stars](https://img.shields.io/github/stars/gisbi-kim/SC-LIO-SAM.svg)](https://github.com/gisbi-kim/SC-LIO-SAM)|SC-LIO-SAM| 
|2021|`ICRA`|[Lvi-sam: Tightly-coupled lidar-visual-inertial odometry via smoothing and mapping](https://arxiv.org/pdf/2104.10831)|[![Github stars](https://img.shields.io/github/stars/TixiaoShan/LVI-SAM.svg)](https://github.com/TixiaoShan/LVI-SAM)|---|
|2020|`IROS`|[Lio-sam: Tightly-coupled lidar inertial odometry via smoothing and mapping](https://arxiv.org/pdf/2007.00258)|[![Github stars](https://img.shields.io/github/stars/TixiaoShan/LIO-SAM.svg)](https://github.com/TixiaoShan/LIO-SAM)|---| 
|2018|`IROS`|[Lego-loam: Lightweight and ground-optimized lidar odometry and mapping on variable terrain](https://static.ux5.de/Moving-Object-Detection-with-OpenCV/archiv/learnopencv-master/LeGO-LOAM-ROS2/Shan_Englot_IROS_2018_Preprint.pdf)|[![Github stars](https://img.shields.io/github/stars/RobustFieldAutonomyLab/LeGO-LOAM.svg)](https://github.com/RobustFieldAutonomyLab/LeGO-LOAM)|---| 
|2020|`ICRA`|[Loam livox: A fast, robust, high-precision LiDAR odometry and mapping package for LiDARs of small FoV](https://arxiv.org/pdf/1909.06700)|[![Github stars](https://img.shields.io/github/stars/hku-mars/loam_livox.svg)](https://github.com/hku-mars/loam_livox)|---|
|2014|`Robotics: Science and systems`|[LOAM: Lidar odometry and mapping in real-time](https://www.ri.cmu.edu/pub_files/2014/7/Ji_LidarMapping_RSS2014_v8.pdf)|---|非官方实现A-LOAM<br>[![Github stars](https://img.shields.io/github/stars/HKUST-Aerial-Robotics/A-LOAM.svg)](https://github.com/HKUST-Aerial-Robotics/A-LOAM)|




# PPT Demonstration
