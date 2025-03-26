---
layout: post
title: "Survey——Humanoid/Legged  Robot Localization and Mapping"
date:   2025-03-25
tags: [SLAM]
comments: true
author: kwanwaipang
toc: false
---


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
本博文为本人针对基于人形机械狗等足式机器人的SLAM进行技术洞察的记录

本技术洞察从3DSLAM到基于足式机器人的SLAM，以求给与相关领域开发者启发,由于本人水平有限，不足之处，敬请谅解。

<!-- 本博文仅供本人学习记录用~ -->

* 目录
{:toc}

# Paper List

* 注意，此处非最新版，仅仅是写此博客的时候的记录
* Keep update the paper list in: [Awesome-Humanoid-Robot-Localization-and-Mapping](https://github.com/KwanWaiPang/Awesome-Humanoid-Robot-Localization-and-Mapping)

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`IEEE Signal Processing Letters`|[A 3D reconstruction and relocalization method for humanoid welding robots](https://github.com/KwanWaiPang/Awesome-Humanoid-Robot-Localization-and-Mapping/blob/pdf/A_3D_Reconstruction_and_Relocalization_Method_for_Humanoid_Welding_Robots.pdf)|---|---|
|2025|`arXiv`|[Humanoid locomotion and manipulation: Current progress and challenges in control, planning, and learning](https://arxiv.org/pdf/2501.02116)|---|---|
|2024|`IEEE/CAA Journal of Automatica Sinica`|[Advancements in humanoid robots: A comprehensive review and future prospects](https://www.ieee-jas.net/article/doi/10.1109/JAS.2023.124140)|---|---|
|2024|`RAL`|[Leg-KILO: Robust Kinematic-Inertial-Lidar Odometry for Dynamic Legged Robots](https://github.com/KwanWaiPang/Awesome-Humanoid-Robot-Localization-and-Mapping/blob/pdf/Leg-KILO%20Robust%20Kinematic-Inertial-Lidar%20Odometry%20for%20Dynamic%20Legged%20Robots.pdf)|[![Github stars](https://img.shields.io/github/stars/ouguangjun/Leg-KILO.svg)](https://github.com/ouguangjun/Leg-KILO)|[dataset](https://github.com/ouguangjun/legkilo-dataset)|
|2023|`International Conference on Robotics and Mechatronics`|[Comparative evaluation of rgb-d slam methods for humanoid robot localization and mapping](https://arxiv.org/pdf/2401.02816)|---|---|
|2023|`TASE`|[Humanoid loco-manipulations using combined fast dense 3D tracking and SLAM with wide-angle depth-images](https://hal.science/hal-04125159v1/file/2023_TASE_Chappellet.pdf)|---|---|
|2018|`Mechatronics`|[Novel lightweight odometric learning method for humanoid robot localization](https://github.com/KwanWaiPang/Awesome-Humanoid-Robot-Localization-and-Mapping/blob/pdf/1-s2.0-S0957415818301338-main.pdf)|---|---|


# Related Resource
* Survey for Learning-based VO,VIO,IO：[Paper List](https://github.com/KwanWaiPang/Awesome-Learning-based-VO-VIO) and [Blog](https://kwanwaipang.github.io/Learning-based-VO-VIO/)
* Survey for Transformer-based SLAM：[Paper List](https://github.com/KwanWaiPang/Awesome-Transformer-based-SLAM) and [Blog](https://kwanwaipang.github.io/Transformer_SLAM/)
* Survey for Diffusion-based SLAM：[Paper List](https://github.com/KwanWaiPang/Awesome-Diffusion-based-SLAM) and [Blog](https://kwanwaipang.github.io/Diffusion_SLAM/)
* Survey for NeRF-based SLAM：[Blog](https://kwanwaipang.github.io/Awesome-NeRF-SLAM/)
* Survey for 3DGS-based SLAM: [Blog](https://kwanwaipang.github.io/File/Blogs/Poster/survey_3DGS_SLAM.html)
* [Paper Survey之——LiDAR-SLAM中的退化检测](https://kwanwaipang.github.io/Lidar_Degeneracy/)
* [学习笔记之——激光雷达SLAM（LOAM系列的复现与学习）](https://blog.csdn.net/gwplovekimi/article/details/119711762?spm=1001.2014.3001.5502)
* [Awesome-LiDAR-Visual-SLAM](https://github.com/sjtuyinjie/awesome-LiDAR-Visual-SLAM)
* [Awesome-LiDAR-Camera-Calibration](https://github.com/Deephome/Awesome-LiDAR-Camera-Calibration)
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
|2022|`TRO`|[GVINS: Tightly coupled GNSS–visual–inertial fusion for smooth and consistent state estimation](https://arxiv.org/pdf/2103.07899)|[![Github stars](https://img.shields.io/github/stars/HKUST-Aerial-Robotics/GVINS.svg)](https://github.com/HKUST-Aerial-Robotics/GVINS)|---|
|2019|`arXiv`|[A General Optimization-based Framework for Global Pose Estimation with Multiple Sensors](https://arxiv.org/pdf/1901.03642)|[![Github stars](https://img.shields.io/github/stars/HKUST-Aerial-Robotics/VINS-Fusion.svg)](https://github.com/HKUST-Aerial-Robotics/VINS-Fusion)|VINS-Fusion|
|2018|`TRO`|[Vins-mono: A robust and versatile monocular visual-inertial state estimator](https://arxiv.org/pdf/1708.03852)|[![Github stars](https://img.shields.io/github/stars/HKUST-Aerial-Robotics/VINS-Mono.svg)](https://github.com/HKUST-Aerial-Robotics/VINS-Mono) |---|
|2014|`Robotics: Science and systems`|[LOAM: Lidar odometry and mapping in real-time](https://www.ri.cmu.edu/pub_files/2014/7/Ji_LidarMapping_RSS2014_v8.pdf)|---|非官方实现A-LOAM<br>[![Github stars](https://img.shields.io/github/stars/HKUST-Aerial-Robotics/A-LOAM.svg)](https://github.com/HKUST-Aerial-Robotics/A-LOAM)|


# PPT Demonstration


# Paper Reading

## Humanoid locomotion and manipulation: Current progress and challenges in control, planning, and learning
首先建议看一下这篇人形机器人相关的综述。对人形机器人领域进行了系统性回顾。

<div align="center">
  <img src="../images/微信截图_20250326163015.png" width="80%" />
<figcaption>  
</figcaption>
</div>

## Advancements in humanoid robots: A comprehensive review and future prospects
这也是一篇综述性论文，其中的`Perception & Interaction`一节对人形机器人相关的感知与交互做了介绍

## Comparative Evaluation of RGB-D SLAM Methods for Humanoid Robot Localization and Mapping
* [参考资料](https://mp.weixin.qq.com/s/-rMezi2-hMNj0jPT0Srv0Q)

本研究通过对比评估了三种RGB-D SLAM算法在SURENA-V人形机器人的定位和地图构建任务中的性能。在定位精度方面，ORB-SLAM3表现最佳，其ATE为0.1073，次之为RTAB-Map（0.1641）和OpenVSLAM（0.1847）。然而，ORB-SLAM3和OpenVSLAM在机器人遇到具有有限特征点的墙壁时存在准确里程计的挑战。OpenVSLAM表现出在机器人接近初始位置时检测循环闭合并成功重新定位的能力。地图制作方面，RTAB-Map通过提供多样化的地图输出（密集地图、OctoMap和占据格地图）领先于ORB-SLAM3和OpenVSLAM，它们仅提供稀疏地图。

这篇论文只是普通的会议论文，只是把三种开源的方法(ORB-SLAM3, RTAB-MAP, OpenVSLAM)在人形平台上测试了一下，也没用结合人形机器人的特点来进行分析，单纯就是三个算法的分析，个人感觉参考价值不大~

<div align="center">
  <img src="../images/微信截图_20250326162252.png" width="60%" />
<figcaption>  
</figcaption>
</div>

## A 3D Reconstruction and Relocalization Method for Humanoid Welding Robots
本文的关键是给焊接机器人加上一个移动载体以及双臂，同时结合SLAM来进行姿态估计与三维重建。
其架构如下图所示。
通过RGB-D+IMU实现位姿的估计（应该是基于ORB-SLAM3开发的），同时结合深度相机可以获取三维环境信息。基于构建的3D地图，通过点云的匹配额外提供一个重定位的约束来进一步提升精度。
此外，对于3D地图会进行语义分割，并且结合YOLOv10来进行目标识别以此确认作业目标的位置。

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
          <img src="../images/微信截图_20250326171255.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="../images/微信截图_20250326172033.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

## Humanoid loco-manipulations using combined fast dense 3D tracking and SLAM with wide-angle depth-images



## Novel lightweight odometric learning method for humanoid robot localization
