---
layout: post
title: "实验笔记之——《Lightning-Speed Lidar Localization and Mapping》"
date:   2025-12-15
tags: [LiDAR, SLAM]
comments: true
author: kwanwaipang
# toc: true
excerpt: "" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->

本博文对高翔开源的Lightning-LM（即Lightning-Speed Lidar Localization and Mapping）
进行测试与复现。

本博文仅供本人学习记录用~

* [Github源码](https://github.com/gaoxiang12/lightning-lm)
* 本博文复现过程采用的代码及代码注释（如有）：[My github repository](https://github.com/R-C-Group/Lightning-LM)


# 安装配置

* 采用ubuntu22.01(ROS2 humble)
* 首先创建一个工作空间

```bash
mkdir -p colcon_ws/src
cd ~/colcon_ws/src

git clone https://github.com/gaoxiang12/lightning-lm.git
# 或者采用我的代码
git clone git@github.com:R-C-Group/Lightning-LM.git
```

* 安装依赖（包含：Pangolin）

```bash
bash ./scripts/install_dep.sh
sudo apt-get install libunwind-dev
sudo apt-get install libgoogle-glog-dev

# 解压Pangolin，然后进入到对应目录
cd /lightning-lm/thirdparty/Pangolin-0.9.3/
./scripts/install_prerequisites.sh

# Configure and build
sudo apt-get install python3-wheel #可能缺少
cmake -B build
cmake --build build

cd build
sudo make install #必须
# 5. 更新动态链接库缓存
sudo ldconfig
```

* 编译

```bash
colcon build

# 注意要安装colcon包
sudo apt install python3-colcon-common-extensions

#最后要记得source一下
# source ~/colcon_ws/install/local_setup.bash
echo "source ~/colcon_ws/install/local_setup.bash" >> ~/.bashrc
```

* 编译过程如果报错`c++: fatal error: Killed signal terminated program cc1plus compilation terminated.`则是由于是由于系统内存不足导致的。

* 数据准备是需要将数据转换为ros2的db3格式的，不过作者提供了转换后的数据：BaiduYun: https://pan.baidu.com/s/1XmFitUtnkKa2d0YtWquQXw?pwd=xehn 提取码: xehn


# debug

## GDB debug

```bash
# 1. 安装GDB
sudo apt-get install gdb

# 2. 使用GDB运行程序
gdb --args /home/kwanwaipang/colcon_ws/src/install/lightning/lib/lightning/run_slam_online --config ./config/default_nclt.yaml

# 在gdb提示符下运行
(gdb) run

# 程序崩溃后，获取回溯信息
(gdb) bt
(gdb) bt full

# 查看所有线程的堆栈
(gdb) thread apply all bt

# 退出gdb
(gdb) quit
```

如果打开Pangolin后出现`Segmentation fault`，应该是WSL 的图形子系统与 OpenGL/Pangolin 不兼容。

* 安装必要的图形库：

```bash
# 更新系统
sudo apt update
sudo apt upgrade -y

# 安装 Mesa 和 OpenGL 相关库
sudo apt install -y \
    mesa-utils \
    libgl1-mesa-glx \
    libgl1-mesa-dri \
    libglu1-mesa \
    libegl1-mesa \
    libgles2-mesa \
    libosmesa6

# 安装 X11 相关
sudo apt install -y \
    x11-apps \
    x11-utils \
    x11-xserver-utils \
    xauth \
    xorg \
    xvfb

# 测试 OpenGL
glxinfo | grep -E "OpenGL|renderer"
glxgears  # 应该能看到旋转的齿轮
```

似乎都无效，最终采用强制使用X11后端而不是Wayland

```bash
# 禁用Wayland，强制使用X11
export WAYLAND_DISPLAY=""
export QT_QPA_PLATFORM="xcb"
export GDK_BACKEND="x11"
export SDL_VIDEODRIVER="x11"
export PANGOLIN_WINDOW_URI="x11://"

# 然后运行程序
ros2 run lightning run_slam_online --config ./config/default_nclt.yaml
```

# 实验测试


### 建图测试

1. 实时建图（实时播包）
    - 启动建图程序:
      ```ros2 run lightning run_slam_online --config ./config/default_nclt.yaml```
    - 播放数据包
      ```ros2 bag play /home/kwanwaipang/NCLT/20130110```
    - 保存地图（保存地址为`data/new_map`） ```ros2 service call /lightning/save_map lightning/srv/SaveMap "{map_id: new_map}"```
2. 离线建图（遍历跑数据，更快一些）
    - ```ros2 run lightning run_slam_offline --config ./config/default_nclt.yaml --input_bag 数据包```
    - 结束后会自动保存至data/new_map目录下
3. 查看地图
    - 查看完整地图：```pcl_viewer ./data/new_map/global.pcd```
    - 实际地图是分块存储的，global.pcd仅用于显示结果
    - map.pgm存储了2D栅格地图信息
    - 请注意，在定位程序运行过程中或退出时，也可能在同目录存储动态图层的结果，所以文件可能会有更多。

<div align="center">
  <img src="https://github.com/R-C-Group/Lightning-LM/raw/main/doc/微信截图_20251218084605.png" width="90%" />
<figcaption>  
</figcaption>
</div>


最后看看建图效果：

<div align="center">
  <img src="https://github.com/R-C-Group/Lightning-LM/raw/main/doc/微信截图_20251218091851.png" width="90%" />
  <img src="https://github.com/R-C-Group/Lightning-LM/raw/main/doc/微信截图_20251218092013.png" width="90%" />
<figcaption>  
</figcaption>
</div>


### 纯定位测试

1. 实时定位
    - 将地图路径写到yaml中的 system-map_path 下，默认是new_map（和建图默认一致)
    - 将车放在建图起点处
    - 启动定位程序：
      ```ros2 run lightning run_loc_online --config ./config/default_nclt.yaml```
    - 播包或者输入传感器数据即可

首先启动定位程序即可看到加载地图的情况

<div align="center">
  <img src="https://github.com/R-C-Group/Lightning-LM/raw/main/doc/微信截图_20251218092519.png" width="90%" />
<figcaption>  
</figcaption>
</div>

<div align="center">
  <img src="https://github.com/R-C-Group/Lightning-LM/raw/main/doc/微信截图_20251218094454.png" width="90%" />
<figcaption>  
</figcaption>
</div>


2. 离线定位
    - ```ros2 run lightning run_loc_offline --config ./config/default_nclt.yaml --input_bag 数据包```

3. 接收定位结果
    - 定位程序输出与IMU同频的TF话题（50-100Hz）

<div align="center">
  <img src="https://github.com/R-C-Group/Lightning-LM/raw/main/doc/微信截图_20251218094612.png" width="90%" />
<figcaption>  
</figcaption>
</div>

# 算力分析

Full SLAM情况下，查看CPU占用情况如下：

<div align="center">
  <img src="https://github.com/R-C-Group/Lightning-LM/raw/main/doc/微信截图_20251218090051.png" width="90%" />
<figcaption>  
</figcaption>
</div>

* 处理器是11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz (2.30 GHz)，机带RAM为32.0 GB（分到WSL中只有16GB）
* 【CPU占用分析】
    * 程序使用了约1.2个物理核心（占用率为121.3%；100% = 1个CPU核心满负荷）【PS：对于i7-11800H（8核16线程）来说最大可达1600%】
    * CPU使用情况：7.1% (其中run_slam_online占主要部分)
* 【内存占用分析】：
    * RES（常驻内存）：753,484 KB ≈ 736 MB【此处显示总内存15864.2 MiB（约16GB），占用约4.6%】



存定位模式情况下，查看CPU占用情况如下：

<div align="center">
  <img src="https://github.com/R-C-Group/Lightning-LM/raw/main/doc/微信截图_20251218093856.png" width="90%" />
<figcaption>  
</figcaption>
</div>

那么同步到之前调研的[Thor](https://kwanwaipang.github.io/Thor/)上，两者架构差异如下：


|指标 |当前性能<br>11th Gen Intel(R) Core(TM) i7-11800H |预测性能 <br> Arm® Neoverse®-V3AE|
|:-----:|:-----:|:-----:|
| 架构 | x86-64 (Intel) |ARMv9 (Neoverse) |
|核心数       | 8核16线程     |14核             |
| 主频        | 2.3GHz   | 2.6GHz           |
| 内存带宽     | ~50GB/s       | 273 GB/s (预测)    |
| SIMD指令集  | AVX2/AVX512    |SVE2 (可伸缩向量)   |
|内存         |  16G（32G）           | 128G |
|Full SLAM CPU占用情况   |  （121.3%）1.2个Intel核 | V3AE 的架构领先 约 3 代左右（应该相当于Intel Core i7-12700 / i5-13500 级别）,主频提升了约 13%;预测单核占用率为75%~85% |
|Full SLAM 内存占用情况   |  736MB | 内存带宽更高。占用率可能会因为等待 I/O 的时间减少而进一步下降。 |
|纯定位模式CPU占用情况| 80%~90%| ---|
|纯定位模式内存占用情况| 612MB| ---|

# 在Thor上配置安装

而然，实测lightning-lm在Thor上运行的CPU占用率为2~2.8个物理核（一共14个，占总资源的不到30%），内存消耗约370+MB。

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/微信图片_20251229143256.jpg" width="90%" />
  <img src="https://r-c-group.github.io/blog_media/images/微信图片_20251229143308.jpg" width="90%" />
  <img src="https://r-c-group.github.io/blog_media/images/微信图片_20251229143312.jpg" width="90%" />
<figcaption>  
</figcaption>
</div>

注意对于Thor由于采用的是ARM架构，编译可能存在某些依赖库的问题，注释掉即可（部分库ARM架构下没有）~