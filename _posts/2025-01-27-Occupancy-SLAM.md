---
layout: post
title: "论文阅读笔记之——Occupancy-SLAM"
date:   2025-01-27
tags: [SLAM, LiDAR]
comments: true
author: kwanwaipang
toc: true
excerpt: "" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->


# 引言
本博文对Occupancy-SLAM系列工作进行阅读与学习

本博客仅供本人学习记录用～

2D-LiDAR-SLAM一般都是基于占据栅格地图（Occupancy Grid Map, OGM）。根据环境中障碍物的存在与否，将地图中的单元划分为占据、空闲和未知区域。
早期2D-LiDAR-SLAM基于粒子滤波（比如FastSLAM或Gmapping），将每个单元的占据值集成到状态表示中，而每个粒子中包含了机器人轨迹（pose）及其相关联的OGM。然而，由于粒子滤波需要在每个粒子中维护整个系统的状态，当机器人的运动轨迹变长时，就会带来内存和计算资源的消耗。

而基于优化的2D-LiDAR-SLAM则是在准确性和资源消耗方面表现更优。然而，这类方法的一个挑战在于如何避免随着机器人轨迹增长而累积的误差。Hector SLAM通过在SLAM框架的前端采用扫描与地图匹配的方法，避免了误差的累积。Karto-SLAM进一步引入了闭环检测，并通过稀疏位姿调整实现全局优化，从而减少长期误差的累积。Cartographer还引入了分支定界策略以加速闭环检测。SLAM Toolbox基于Karto-SLAM开发，使用Ceres作为位姿图求解器，以提供更快速和灵活的优化设置。

然而，对于这些基于优化的方法，基本都是先通过位姿图优化获取位姿，然后将优化后的位姿视为正确的位姿，用来构建OGM。但是，图优化中获得的机器人位姿的不确定性在构建地图时未被考虑，进而会导致mapping出现次优解。为此，Occupancy-SLAM同时优化pose和OGM，对所有激光束进行采样以收集采样点作为观测值，并构造观测值与全局OGM之间的误差项。机器人位姿和全局占据地图都被视为优化变量，进而可以大大的提升精度。但是由于将所有位姿和二维网格地图中所有单元的占据值一起优化，又会带来计算量和存储量的消耗（特别是在大场景下）。

因此，作者引入了局部子图拼接，但又不同于Cartographer等仅仅优化位姿而不优化网格地图，作者提出一种高效的仅位姿高斯-牛顿（GN）方法，该方法等价于完整GN方法，能够求解同时优化全局地图和子地图坐标系的非线性最小二乘（NLLS）问题。

~~~
PS：直观理解就是对于Cartographer的改进，子图中不仅仅优化pose，还一起优化了网格地图，并且提出相应的方法来提升计算的效率。
不过可惜的是作者并没有开源代码，不然可以测试一下看看效果了~~~
~~~

论文：

~~~
@inproceedings{wang2024grid,
  title={Grid-based Submap Joining: An Efficient Algorithm for Simultaneously Optimizing Global Occupancy Map and Local Submap Frames},
  author={Wang, Yingyu and Zhao, Liang and Huang, Shoudong},
  booktitle={2024 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)},
  pages={10121--10128},
  year={2024},
  organization={IEEE}
}

@article{zhao2024occupancy,
  title={Occupancy-slam: Simultaneously optimizing robot poses and continuous occupancy map},
  author={Zhao, Liang and Wang, Yingyu and Huang, Shoudong},
  journal={arXiv preprint arXiv:2405.10743},
  year={2024}
}
~~~

# 论文中的效果

论文的实验分析仿真的和实际的，直接看看实际的效果如下：

<div align="center">
  <table style="background-color: transparent;">
    <tr>
      <td style="border: none; background-color: transparent;">
        <img src="https://kwanwaipang.github.io/Poster_files/md_blog/微信截图_20250127125335.png" width="100%" />
      </td>
      <td style="border: none; background-color: transparent;">
        <img src="https://kwanwaipang.github.io/Poster_files/md_blog/微信截图_20250127125324.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  从建图效果来看感觉跟Cartographer差别不会太大，当然，确实是有提升，边界明显更加sharp一些
  </figcaption>
</div>

下图则是大场景下的建图效果（都是150~200m级别的）
<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/md_blog/微信截图_20250127125715.png" width="80%" />
<figcaption>  

</figcaption>
</div>

定位精度分析只有在仿真的数据集下有，单位为米，如下图所示。
<div align="center">
  <table style="background-color: transparent;">
    <tr>
      <td style="border: none; background-color: transparent;">
        <img src="https://kwanwaipang.github.io/Poster_files/md_blog/微信截图_20250127130036.png" width="100%" />
      </td>
      <td style="border: none; background-color: transparent;">
        <img src="https://kwanwaipang.github.io/Poster_files/md_blog/微信截图_20250127130044.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption></figcaption>
</div>




# 参考资料
* [超越经典Cartographer：将二维基于网格的子地图拼接问题表述为非线性最小二乘形式(IROS'24)](https://mp.weixin.qq.com/s/XqsOPfo90mGnzPtVfHlZrQ)
* [Grid-based Submap Joining: An Efficient Algorithm for Simultaneously Optimizing Global Occupancy Map and Local Submap Frames](https://arxiv.org/pdf/2501.12764)
* [Occupancy-slam: Simultaneously optimizing robot poses and continuous occupancy map](https://arxiv.org/pdf/2405.10743)