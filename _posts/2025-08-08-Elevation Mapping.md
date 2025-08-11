---
layout: post
title: "调研笔记之——高程地图（Elevation Map）"
date:   2025-08-08
tags: [SLAM]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


之前[博客](https://kwanwaipang.github.io/File/Blogs/Poster/%E8%A7%86%E8%A7%89SLAM.html#slam%E4%B8%AD%E7%9A%84%E5%90%84%E7%A7%8D%E5%9C%B0%E5%9B%BE%E8%A1%A8%E8%BE%BE%E6%96%B9%E5%BC%8F)调研过SLAM的各种地图表征，本博文深入调研一下Elevation Map。


高程地图（Elevation Map）也称2.5D地图。如果是平坦地面、二维场景，用栅格地图就可以；如果是无人机，需要用到三维场景体素地图；但如果是无人车在非平坦路面运行、或者是四足/轮式机器人在野外的行进，需要对地形进行建模，常用的方式就是高程地图。在栅格地图的基础上增加了一个维度即高度。

<div align="center">
  <img src="https://kwanwaipang.github.io/SLAM_DEMO/SLAM_Introduction/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20240810182512.png" width="80%" />
<figcaption>  
</figcaption>
</div>


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言

对于足式机器人来说，相比自动驾驶等所需的全局导航，由于其需要主动选择落足点，因此对于局部高程图来说更加关心.这也就是本博文的重点Elevation Map。

<div align="center">
  <img src="../images/anymal_sdf_demo.gif" width="80%" />
<figcaption>  
</figcaption>
</div>

目前常用的解决方案是：雷达提供长期可靠的里程计信息，采用深度视觉获取局部深度来建立高程图。

高程地图分为实时和全局高程图：
前者可以直接采用深度信息快速建立高程地图;
后者先建立全局的地图在从其中基于里程计信息提取局部的信息。
前者在实现起来比较容易速度也快甚至可以不需要全局定位数据，但是由于视角和深度图质量问题可能会存在噪声和空洞；
后者需要全局定位信息并需要而外的计算来构建全局地图，但可以通过机器人多个视角下的采集对全局高程地图不断优化修正，最终提取的局部高程图质量更高。

## 高程地图的一些开源工作
* [Grid Map](https://github.com/ANYbotics/grid_map)
* [Robot-Centric Elevation Mapping](https://github.com/ANYbotics/elevation_mapping): RTAB定位输出Odom，elevation mapping采用深度点云和里程计输出全局高程图
* [Elevation Mapping cupy](https://github.com/leggedrobotics/elevation_mapping_cupy)



## 代表性论文阅读

### Probabilistic Terrain Mapping for Mobile Robots with Uncertain Localization

* [PDF](https://www.research-collection.ethz.ch/bitstream/handle/20.500.11850/272110/fankhauser2018.pdf?sequence=1)
* [Github](https://github.com/anybotics/elevation_mapping)





# 参考资料
* [四足机器人雷达-视觉导航2：Elevation mapping局部高程图测试](https://zhuanlan.zhihu.com/p/469921393)
