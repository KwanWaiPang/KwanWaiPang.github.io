---
layout: post
title: "Fast-LIVO2复现及论文阅读"
date:   2025-01-26
tags: [SLAM, LiDAR]
comments: true
author: kwanwaipang
toc: true
excerpt: "" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->


# 引言
HKU-MARSLAB的新作FAST-LIVO2终于开源了,用本博文记录下测试过程，并记录学习代码及论文的一些笔记。

本博客仅供本人学习记录用～

* [测试与配置代码](https://github.com/KwanWaiPang/Fast-LIVO2_comment)

论文：

~~~
@article{zheng2024fast,
  title={Fast-livo2: Fast, direct lidar-inertial-visual odometry},
  author={Zheng, Chunran and Xu, Wei and Zou, Zuhao and Hua, Tong and Yuan, Chongjian and He, Dongjiao and Zhou, Bingyang and Liu, Zheng and Lin, Jiarong and Zhu, Fangcheng and others},
  journal={IEEE Transactions on Robotics},
  year={2024},
  publisher={IEEE}
}
~~~

# 代码配置
按照官方给出的[Github仓库](https://github.com/hku-mars/FAST-LIVO2) step by step配置
1. Ubuntu, ROS, Sophus都是原本系统安装好的，直接跳过。
2. Mimalloc是可选项，也跳过
3. Vikit

~~~
cd catkin_ws/src
git clone https://github.com/xuankuzcr/rpg_vikit.git
~~~

4. livox_ros_driver。
Follow [livox_ros_driver Installation](https://github.com/Livox-SDK/livox_ros_driver).
5. 下载源码

~~~
cd ~/catkin_ws/src
git clone https://github.com/hku-mars/FAST-LIVO2
# 直接cm
cd ../
catkin_make
source ~/catkin_ws/devel/setup.bash
~~~

6. 出现Sophus相关的报错.在"/home/kwanwaipang/catkin_ws/src/rpg_vikit/vikit_common/CMakeLists.txt"中添加下面代码即可

~~~
#添加Sophus_LIBRARIES
SET(Sophus_LIBRARIES "/usr/local/lib/libSophus.so")
~~~

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/fast_livo2_testing/2025-01-26 12-19-37 的屏幕截图.png" width="60%" />
<figcaption>  
编译成功
</figcaption>
</div>


# 实验测试
运行代码：

~~~
roslaunch fast_livo mapping_avia.launch
rosbag play YOUR_DOWNLOADED.bag
~~~

修改launch文件直接开启的时候播包会方便些，修改代码请见[link](https://github.com/KwanWaiPang/Fast-LIVO2_comment/blob/main/launch/mapping_avia.launch)

效果如下所示：

<div align="center">
<iframe width="560" height="315" src="//player.bilibili.com/player.html?isOutside=true&aid=113893036789521&bvid=BV12nFKeXESh&cid=28087748648&p=&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<div align="center">
<iframe width="560" height="315" src="//player.bilibili.com/player.html?isOutside=true&aid=113893036788689&bvid=BV1mnFKeXEPQ&cid=28087749771&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<div align="center">
<iframe width="560" height="315" src="//player.bilibili.com/player.html?isOutside=true&aid=113893120674574&bvid=BV1DVFKetECB&cid=28087943719&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<div align="center">
<iframe width="560" height="315" src="//player.bilibili.com/player.html?isOutside=true&aid=113893120672263&bvid=BV1QVFKetELz&cid=28087944954&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>


<div align="center">
<iframe width="560" height="315" src="//player.bilibili.com/player.html?isOutside=true&aid=113893120672020&bvid=BV1QVFKetE3c&cid=28087946735&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>


<div align="center">
<iframe width="560" height="315" src="//player.bilibili.com/player.html?isOutside=true&aid=113893120672258&bvid=BV1QVFKetELi&cid=28087814070&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<div align="center">
<iframe width="560" height="315" src="//player.bilibili.com/player.html?isOutside=true&aid=113893120672267&bvid=BV1QVFKetEL4&cid=28088009962&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>



其中对于CBD_Building_02的测试发现有存在比较明显的drift的情况。如下图所示，实验人员应该是试图回到起点的，但是最终的位置与起始的位置差别较大。并且从生成的彩色点云也可以看到柱子的地方有较为明显的偏移。
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/fast_livo2_testing/2025-01-26 12-52-32 的屏幕截图.png" width="80%" />
<figcaption>  
</figcaption>
</div>
对于序列HIT_Graffiti_Wall_01，也是一个长走廊的序列，且路径比上面的序列更长，但却可以较好的回到原点，看似不是由于长走廊带来的drift吧~
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/fast_livo2_testing/2025-01-26 13-20-12 的屏幕截图.png" width="80%" />
<figcaption>  
</figcaption>
</div>
再次测试CBD_Building_02序列，又是正常的，可以回归原点～～～
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/fast_livo2_testing/2025-01-26 13-38-41 的屏幕截图.png" width="80%" />
<figcaption>  
</figcaption>
</div>


~~~
PS:对于FAST-LIVO2-Dataset中不同的序列可能对应不同的参数，具体请见calibration.yaml文件，上面运行的时候忘记修改参数了~

但似乎即使没有改外参效果还是不错的~
~~~


# 论文阅读
Fast-LIVO2是基于Fast-LIVO的升级版本，一个基于ESIKF的lidar-image-imu里程计。跟前作一样，图像与lidar都是采用直接法（避免额外提取特征的开销同时也可以保证在少纹理或结构的场景提供更多的信息）。
同时引入voxelmap（最近的系列工作的lio系统貌似都从fast-lio2改为了voxelmap，比如immesh等）且image和lidar都是基于一个统一的voxel map下进行处理的。
此外通过引入on-demanding raycast operation （光线投射操作）和估算图像的曝光时间（这似乎是r3live里面的一个重要贡献）来增强系统的鲁棒性。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/md_blog/微信截图_20250126212319.png" width="80%" />
<figcaption>  
</figcaption>
</div>

论文的主要贡献点如下：
1. 相比起的Fast-LIVO是异步更新雷达与视觉的观测量，Fast-LIVO2是顺序更新的（sequential update）
2. image的直接法alignment采用了LiDAR的平面先验（plane priors，其实也就是把lio部分改为voxelmap，并要让image部分适配）
3. 改进了视觉部分的patch更新策略来提升视觉alignment的精度
4. 估算图像的曝光时间（Fast-LIVO没有这部分，但r3live有）
5. on-demanding raycast operation，对于近处没有激光点的区域采用基于voxel的光线投射，来提升系统的鲁棒性

除了上述贡献点以外作者还做了大量的实验，对比分析，总体来说，感觉是一个系统性的工作👍




<!-- # 代码解读
代码解读部分直接将注释添加到代码中，具体请见：[Fast-LIVO2代码解读](https://github.com/KwanWaiPang/Fast-LIVO2_comment) -->


# 参考资料
* [FAST-LIVO2 Github](https://github.com/hku-mars/FAST-LIVO2)
* [paper link](https://arxiv.org/pdf/2408.14035)
* [Fast-LIVO Self Comment](https://github.com/KwanWaiPang/fast_livo_comment)
* [ROS实验笔记之——FAST-LIVO](https://blog.csdn.net/gwplovekimi/article/details/127844810?spm=1001.2014.3001.5501)