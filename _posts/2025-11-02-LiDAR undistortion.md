---
layout: post
title: "雷达点云去除运动失真/LiDAR Undistoration"
date:   2025-11-02
tags: [LiDAR]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 什么是激光雷达的运动畸变？

对于大多数激光雷达而言，尽管激光的发射和接收速度很快，但构成点云的每个点并非在同一时刻生成。
例如，我们将100ms内（对应于10HZ频率）累积的数据作为一个点云帧输出。
如果在这100毫秒内，激光雷达本体或安装激光雷达的载具的绝对位置发生变化，则该帧点云中每个点的坐标系都将不同（如下右图所示）。
直观地说，这一帧点云数据将会“畸变/distorted”，无法真实反映所探测到的环境信息。
这就像拍照时，如果手抖，照片就会模糊一样。这就是激光雷达的自运动畸变。

<div align="center">
  <img src="../images/WX20251102-210334.png" width="80%" />
<figcaption>  
</figcaption>
</div>



# 参考资料
* Catkin package that provides lidar motion undistortion based on an external 6DoF pose estimation input, from [ETHZ ASL](https://github.com/ethz-asl/lidar_undistortion)
* [livox_cloud_undistortion](https://github.com/Livox-SDK/livox_cloud_undistortion)
* 利用IMU数据对2D激光雷达数据进行运动畸变校正（仅限于旋转校正）:[2d_lidar_undistortion](https://github.com/elewu/2d_lidar_undistortion)
* [Livox Open Source Sharing: About LiDAR Distortion Removal](https://www.livoxtech.com/showcase/211220)