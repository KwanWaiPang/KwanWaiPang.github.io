---
layout: post
title: "实验笔记之——基于移动机器人的自主探索与地图构建"
date:  2025-12-04
tags: [SLAM]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->

本博文对移动机器人自主建图的功能进行部署测试，特别地，是基于自主探索的功能包+SLAM算法来实现的。

本博文仅供本人学习记录用~


好多年前针对`rrt_exploration`这个功能包写过一篇博客[ROS仿真笔记之——基于rrt_exploration的单个机器人自主探索建图](https://blog.csdn.net/gwplovekimi/article/details/119045783),此处对代码进行再次的复现，详细的原理请见原博客。

* 测试使用的代码：[Github](https://github.com/R-C-Group/auto-slam-turtlebot3)

* 代码下载

```bash

git clone --recursive git@github.com:R-C-Group/auto-slam-turtlebot3.git

# 编译
cd ~/catkin_ws && catkin_make
```

* 开启仿真模型,并用键盘控制建图

```bash
# export TURTLEBOT3_MODEL=burger
TURTLEBOT3_MODEL=waffle roslaunch turtlebot3_gazebo turtlebot3_world.launch

# 开启SLAM
TURTLEBOT3_MODEL=waffle  roslaunch turtlebot3_slam turtlebot3_slam.launch set_base_frame:=base_footprint set_odom_frame:=odom set_map_frame:=map

# 开启键盘控制
TURTLEBOT3_MODEL=waffle roslaunch turtlebot3_teleop turtlebot3_teleop_key.launch

```


* 开启仿真模型，并采用`explore_lite`实现自动探索

```bash
TURTLEBOT3_MODEL=waffle roslaunch turtlebot3_gazebo single_world.launch

TURTLEBOT3_MODEL=waffle roslaunch explore_lite explore.launch
# sudo apt install ros-noetic-dwa-local-planner
```

* `rosrun rqt_tf_tree rqt_tf_tree`TF关系如下图： 

<div align="center">
  <img src="https://github.com/R-C-Group/auto-slam-turtlebot3/raw/main/assert/2025-12-05 08-13-19 的屏幕截图.png" width="80%" />
  <img src="https://github.com/R-C-Group/auto-slam-turtlebot3/raw/main/assert/2025-12-05 08-50-24 的屏幕截图.png" width="80%" />
  <img src="https://github.com/R-C-Group/auto-slam-turtlebot3/raw/main/assert/2025-12-05 08-50-36 的屏幕截图.png" width="80%" />
<figcaption>  
</figcaption>
</div>



# 参考资料
* ROS packages for multi robot exploration：[Wiki explore_lite](https://wiki.ros.org/explore_lite),[Github](https://github.com/hrnr/m-explore)
* rrt_exploration: [Github](https://github.com/hasauino/rrt_exploration)
* 自主清洁机器人仿真:[Github](https://github.com/li-haojia/Clean-robot-turtlebot3)
* [实验笔记之——Sweep Robot/扫地机器人](https://kwanwaipang.github.io/sweep-robot/)此部分也有自主建图的功能，不过似乎只是SDK

