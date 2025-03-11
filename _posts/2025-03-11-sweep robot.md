---
layout: post
title: "实验笔记之——Sweep Robot/扫地机器人"
date:   2025-03-11
tags: [SLAM]
comments: true
author: kwanwaipang
toc: false #true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
比特有灵开源了一个名为ZIMA的激光扫地机器人项目。把智能小车的控制技术、基础的2D雷达SLAM算法、经典的路径规划算法等等结合到一起。
本博文对其进行配置以及测试，本博文仅供本人学习记录用~

# 配置

原本的配置四采用Docker镜像的
```bash
docker pull bitsoullab/ros:zima-dev
# Password for user zima is 123456

#容器创建启动方式
if [ -e /dev/nvidia0 ]; then
  echo "Launch with nvidia support."
  docker run \
    -it \
    -u zima \
    --name="zima_demo" \
    --net=host \
    --privileged \
    -v /dev:/dev \
    -e DISPLAY=$DISPLAY \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    --runtime=nvidia \
    --device /dev/nvidia0 \
    --device /dev/nvidia-uvm \
    --device /dev/nvidia-uvm-tools \
    --device /dev/nvidiactl \
    --runtime=nvidia \
    --gpus all \
    bitsoullab/ros:zima-dev
else
  echo "Launch without nvidia support."
  docker run \
    -it \
    -u zima \
    --name="zima_demo" \
    --net=host \
    --privileged \
    -v /dev:/dev \
    -e DISPLAY=$DISPLAY \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    bitsoullab/ros:zima-dev
fi
```

此处先不用docker，先进行编译安装
1. 在zima_base目录下，运行`bash build.sh build_dir`
2. 在zima_core目录下，运行`bash build.sh build_dir`

<div align="center">
  <img src="https://github.com/KwanWaiPang/ZIMA/raw/master/Figs/2025-03-11%2010-30-38%20的屏幕截图.png" width="60%" />
<figcaption>  
</figcaption>
</div>

3. 新建一个ros workspace，然后使用catkin_make编译。

<div align="center">
  <img src="https://github.com/KwanWaiPang/ZIMA/raw/master/Figs/2025-03-11 10-33-39 的屏幕截图.png" width="60%" />
<figcaption>  
</figcaption>
</div>

运行前先确保已经source了工作空间
```bash
source /your_path_to_workspace/devel/setup.bash
```

<div align="center">
  <img src="https://github.com/KwanWaiPang/ZIMA/raw/master/Figs/2025-03-11 10-34-52 的屏幕截图.png" width="60%" />
<figcaption>  
</figcaption>
</div>


# 测试

测试用的代码及代码解读请见：[Link](https://github.com/KwanWaiPang/ZIMA)

1. 启动仿真环境
```bash
roslaunch zima_gazebo gazebo.launch

# 加载可能比较慢，可以尝试离线启动（但似乎也还是很慢）
roslaunch zima_gazebo gazebo.launch verbose:=true

```

<div align="center">
  <img src="https://github.com/KwanWaiPang/ZIMA/raw/master/Figs/2025-03-11 10-44-22 的屏幕截图.png" width="60%" />
<figcaption>  
</figcaption>
</div>

2. 启动demo
~~~
roslaunch zima_ros gazebo_demo.launch
~~~

若遇到报错 `Open: Open /tmp/zima_config.json failed.`，那么就在zima_base/json_config中复制一份zima_dev_gazebo_config.json到/tmp/zima_config.json。

<div align="center">
  <img src="https://github.com/KwanWaiPang/ZIMA/raw/master/Figs/2025-03-11 10-47-54 的屏幕截图.png" width="60%" />
  <img src="https://github.com/KwanWaiPang/ZIMA/raw/master/Figs/2025-03-11 10-50-04 的屏幕截图.png" width="60%" />
<figcaption> 
注意要重命名为zima_config.json 
</figcaption>
</div>

按键操作：
* a 是自动清洁
* s 是自动扫描房间
* q 是退出

3. 启动rviz
~~~
roslaunch zima_ros rviz.launch
~~~

`rqt_graph`如下图所示

<div align="center">
  <img src="https://github.com/KwanWaiPang/ZIMA/raw/master/Figs/2025-03-11 11-27-48 的屏幕截图.png" width="60%" />
<figcaption>  
</figcaption>
</div>

如下图所示，会标记出机器人运动的轨迹以及已经清洁的区域，不过对于机器人规划的路径感觉有进一步优化的空间，有些区域不知为何空着先不处理留到后续才清洁，这会导致额外的多余任务

<div align="center">
  <img src="https://github.com/KwanWaiPang/ZIMA/raw/master/Figs/2025-03-11 13-03-21 的屏幕截图.png" width="60%" />
<figcaption>  
</figcaption>
</div>

测试效果请见视频：

<div align="center" style="
  position: relative; 
  width: 80%; 
  height: 400px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe width="100%" height="100%"
    src="//player.bilibili.com/player.html?isOutside=true&aid=114142061004880&bvid=BV1KMRHYJE6N&cid=28806481727&p=1&autoplay=0" 
    title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen  style="opacity: 0; transition: opacity 0.5s; border-radius: 15px;" onload="this.style.opacity='1'"
  ></iframe>
</div>


时间太长了，因此视频没有全部录制，最终跑了一个多小时才完成整个空间的清洁任务

<div align="center">
  <img src="https://github.com/KwanWaiPang/ZIMA/raw/master/Figs/2025-03-11 13-28-09 的屏幕截图.png" width="60%" />
<figcaption>  
</figcaption>
</div>
