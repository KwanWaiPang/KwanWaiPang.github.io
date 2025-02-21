---
layout: post
title: "Paper Survey之——Awesome Event-based Contrast Maximization"
date:   2025-02-18
tags: [Event-based Vision]
comments: true
author: kwanwaipang
toc: true
---


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言

在Event Camera领域基于Contrast Maximization(CMax,或CM)框架衍生了大量的工作，包括光流估计、深度估计、运动估计（2D、3D甚至6D）等等。
其实本质上，CM这个框架是通过对事件进行运动补偿，而在做运动补偿的过程中估算出事件的位移，而这个位移也就是所谓的event point trajectories，而基于像素的位移就可以推广到系列视觉的任务。
```CMax aligns point trajectories on the image plane with event data by maximizing the contrast of an image of warped events (IWE)```

本博文对Event-based Contrast Maximization进行较为全面的survey，并且将对应的经典论文都做简单的介绍，同时也列出了CMax相关或者用到CMax的文献以作mark



<!-- * 目录
{:toc} -->

<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 基本原理
Event-based vision的工作分类有很多种，而其中，按照处理事件的形式可以分为`event-by-event`和`groups of events`。而CMax则是属于第二种。
CMax 首次在文献[《A Unifying Contrast Maximization Framework for Event Cameras, with Applications to Motion, Depth and Optical Flow Estimation (CVPR2018)》](https://www.ifi.uzh.ch/dam/jcr:a22071c9-b284-43c6-8f71-6433627b2db2/CVPR18_Gallego.pdf)中提出：`The main idea of our framework is to find the point trajectories on the image plane that are best aligned with the event data by maximizing an objective function: the contrast of an image of warped events`
而其中的寻找point trajectories可以看成是一种隐式的data association，也是Event-based vision种的关键部分,比如short characteristic time (optical flow)或longer estimation time (monocular depth estimation)；
此外，CM可以生成motion-corrected event images，既可以看成是对`groups of events`的运动补偿，也可以看成是由事件产生的图像的梯度或edge image。

下图较好解析了CM的基本原理，其实就是寻找 point的轨迹，使其较好的与event相align：

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Event_camera/event_in_voxel.gif" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219113408.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

事件相机是motion-active的，一般是由亮度变化或相对运动（相机与场景）产生事件的，并且大部分的事件都是由相对运动的edge来产生的，因此事件相机中的数据关联应该是`establishing which events were triggered by the same scene edge`。
而移动的edge实际上是描述了在平面上的point trajectory，因此将沿着point trajectory生成的event关联起来也就是数据关联的过程。
如上面右图所示，point trajectory近似于直线。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219120444.png" width="60%" />
<figcaption>
数学描述所谓的point trajectory  
</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219152239.png" width="80%" />
<figcaption>  
</figcaption>
</div>

CM算法的框架如上图所示，由以下三步组成：
1. Warp the events into an image H, according to the point trajectories defined by the geometric model and candidate parameters θ. 所谓的geometric model就是基于optical flow, depth estimation, motion estimation等问题，来描述how points move on the image plane（也就是怎么对event point进行投影）
2. Compute a score f based on the image of warped events（也就是score function,也就是累积IWE，然后计算对比的score function）
3. Optimize the score or objective function with respect to the parameters θ of the model.这步其实就是优化的过程了，比如采用梯度下降或Newton方法来估算最好的θ值。而这个θ其实就是所求的point trajectory了，因为`x=x+θ*t`

数学描述如下：

<div align="center">
<table style="border: none; background-color: transparent;">
  <tr>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219161647.png" width="100%" />
    </td>
    <td style="width: 40%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219161822.png" width="100%" />
    </td>
    <td style="width: 40%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219161937.png" width="100%" />
    </td>
  </tr>
</table>
<figcaption>
</figcaption>
</div>


对于CM算法，其有两个副产品：
1. 估算出point trajectory，隐式建立事件之间的数据关联
2. 估算出的point trajectory可以用来对运动的edge做校正（correct）

而此工作作为CM算法的基础工作也给出了CM三大基本应用：[Rotational motion estimation](#rotational-velocity-estimation)（还有[motion estimation in planar scenes](#motion-estimation-in-planar-scenes)）, [Depth estimation](#depth-estimation), 和 [Optical Flow estimation](#optical-flow-estimation)

## 计算复杂度
而CM算法的时间复杂度应该是`O（n）`,也就是跟事件量成线性关系。其中warp event应该是耗时最大的，想求对比度这些操作几乎可以忽略。此外，优化方法也是影响的重要因素。

## loss function
[Focus is all you need: Loss functions for event-based vision (CVPR2019)](https://openaccess.thecvf.com/content_CVPR_2019/papers/Gallego_Focus_Is_All_You_Need_Loss_Functions_for_Event-Based_Vision_CVPR_2019_paper.pdf)中，介绍了基于CM框架的22个目标函数，不过这篇论文中是针对Motion Compensation这个主题的。
所谓的loss function其实就是[Rotational motion estimation](#rotational-velocity-estimation)，[motion estimation in planar scenes](#motion-estimation-in-planar-scenes), [Depth estimation](#depth-estimation), 和 [Optical Flow estimation](#optical-flow-estimation)几个section中提到的公式3，就是上面CM算法框架图中描述的`measure event alignment`.
汇总如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219161028.png" width="60%" />
<figcaption>  
</figcaption>
</div>
对应的公式如下（实在太多了，只能是真正开发的时候要用到再细读了hh~）：
<div align="center">
<table style="border: none; background-color: transparent;">
  <tr>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219162425.png" width="100%" />
    </td>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219162445.png" width="100%" />
    </td>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219162543.png" width="100%" />
    </td>
  </tr>
</table>

<img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219162659.png" width="60%" />

<table style="border: none; background-color: transparent;">
  <tr>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219162837.png" width="100%" />
    </td>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219162845.png" width="100%" />
    </td>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219162857.png" width="100%" />
    </td>
  </tr>
</table>

<table style="border: none; background-color: transparent;">
  <tr>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219162939.png" width="100%" />
    </td>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219162951.png" width="100%" />
    </td>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219163003.png" width="100%" />
    </td>
  </tr>
</table>

<table style="border: none; background-color: transparent;">
  <tr>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219163208.png" width="100%" />
    </td>
    <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
      <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219163225.png" width="100%" />
    </td>
  </tr>
</table>

<figcaption>
</figcaption>
</div>

此外，论文[《Event Cameras, Contrast Maximization and Reward Functions: An Analysis (CVPR2019)》](https://openaccess.thecvf.com/content_CVPR_2019/papers/Stoffregen_Event_Cameras_Contrast_Maximization_and_Reward_Functions_An_Analysis_CVPR_2019_paper.pdf)也是对各种loss function（此处换称呼为reward function）进行了分析，不过当然20多种那么多了。


## Event Collapse
所谓的Event Collapse直译就是“事件崩溃”（也有称为over fitting），表现出来的线性就是事件被warped到少数的pixel区域(`events accumulate into too few pixels`)，也就是退化/失真，场景中的事件被投到一块（陷入所谓的局部最小值了），而Prof. Gallego团队的两篇论文[Event Collapse in Contrast Maximization Frameworks (Sensor 2022)](https://web.archive.org/web/20220813065935id_/https://depositonce.tu-berlin.de/bitstream/11303/17328/1/sensors-22-05190-v3.pdf)和[A Fast Geometric Regularizer to Mitigate Event Collapse in the Contrast Maximization Framework (AIS2023)](https://advanced.onlinelibrary.wiley.com/doi/pdfdirect/10.1002/aisy.202200251)的研究也证明，添加正则化项是唯一的有效，消除Event Collapse的方案.

PS:说是两篇，我个人觉得是一篇，因为两篇论文的结果图也就是换个排序而已😂
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219171050.png" width="80%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219171731.png" width="80%" />
<figcaption>  
</figcaption>
</div>

从上图可以看到，甚至在单自由度（直线运动）的时候，也会出现event collapse。
实际上，如果是测过CMax-SLAM就会发现，除非对事件切分得很好，不然会出现大量的event collapse的情况~

除了正则化以外，解决event collapse的方式有：
1. 把参数初始化为非常接近真值（`initializing the parameters sufficiently close to the desired solution`）emmmm这点怎么说呢，简单说应该就是：给真值加个高斯noise然后让算法估算获得estimated value再跟真值对比（还真有顶会甚至TPAMI、TRO级别的这样做的😂）
2. 降低问题的自由度（但个人人为没啥用，毕竟实际中CM是在1D下也可能出现event collapse），也有通过global optimal或者通过设置 reward functions的upper and lower bounds来实现更好的效果的
3. 采用其他传感器提供更多约束（比如深度图）

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219174809.png" width="80%" />
<figcaption>  
</figcaption>
</div>

如下图所示，
`If the warp does not enable event collapse (contraction or accumulation of flow vectors cannot happen due to the geometric properties of the warp), as in the case of feature flow (2 DOF) (Figure 3b) or rotational motion flow (3 DOF) (Figure 3c), then the optimization problem is well posed and multiple objective functions can be designed to achieve event alignment`
event collapse是由motion hypothesis（也就是wrap的模型）来决定，某些运行（比如光流或者rotational motion）是不会产生event collapse的

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220105110.png" width="80%" />
<figcaption>  
</figcaption>
</div>


而所设计的正则化器也应该由motion hypothesis（也就是wrap的模型）来，因此对于下面构建的CM优化问题：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220110211.png" width="25%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220110216.png" width="40%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220110222.png" width="25%" />
<figcaption>  
</figcaption>
</div>

所谓的正则化则是把优化函数改为以下的形式：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220110405.png" width="50%" />
<figcaption>  
</figcaption>
</div>

而针对不同的运行模型正则化函数R是不一样的。具体的推导分析请见原文了。
不过在该作者的最新的工作中[Secrets of Event-based Optical Flow, Depth and Ego-motion Estimation by Contrast Maximization (TPAMI2024)](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10517639)，前面两篇工作的正则化器全部不用😂，直接改为采用total variation (TV)

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220113242.png" width="50%" />
<figcaption>  
</figcaption>
</div>


类似地，文献[Density Invariant Contrast Maximization for Neuromorphic Earth Observations (CVPR2023)](https://openaccess.thecvf.com/content/CVPR2023W/EventVision/papers/Arja_Density_Invariant_Contrast_Maximization_for_Neuromorphic_Earth_Observations_CVPRW_2023_paper.pdf)也针对1D和2D的运动来对CM框架产生的noise进行了处理，使得在更长的time windows以及高噪声下的CM算法恢复的图像更好，并应用到太空数据观测中。


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# CMax的主要应用
理论上CM框架可以用到所有的event-based vision的topic中，特别是以`groups event`的方式来处理event数据的。本质上CM是一个`event processing framework`.

此处主要列出的是基于CMax的原理来实现的framework，而不仅仅是作为数据处理的形式

## Optical Flow Estimation
所谓的光流实际上就说每个pixel的motion vector（在小的时间段内）。而在理想的情况下（无穷小）在图像平面上的点的轨迹应该是一条直线，那么可以用下面公式来表达：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219120444.png" width="60%" />
<figcaption>  
</figcaption>
</div>

而数据关联的过程，就是把在这个轨迹（直线）上的事件给关联起来。
具体的做法则是：
首先将event累积在一起，通过proposed trajectories将他们warp到参考时间t<sub>ref</sub>下:

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219121240.png" width="60%" />
<figcaption>  
</figcaption>
</div>

公式2其实可以看成event累积的image（an image patch of warped events），求它的方差就可以得到下面公式

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219121823.png" width="60%" />
<figcaption>  
</figcaption>
</div>

θ，也就是光流速度，可视化为heat map（如下图所示），可以看到它是smooth以及有明显的峰值的。并且在针对不同的θ，对应的IWE（image of warped event）也可视化到右子图中了。可以看到更高的方差对应IWE更高对比度（更sharp）。因此估算光流的问题可以转换为通过上面公式3（最大化方差函数）来寻找θ参数的过程。

PS：因为这个求最优的过程，其实也就是对于IWE要求对比度（contrast）最大，因此这个方法命名为`contrast maximization`

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219121945.png" width="60%" />
<figcaption>  
</figcaption>
</div>

对于上面公式2中b<sub>k</sub>,作者在附加材料<sup>[link](https://www.ifi.uzh.ch/dam/jcr:a22071c9-b284-43c6-8f71-6433627b2db2/CVPR18_Gallego.pdf)</sup>中做了深入的分析。

所谓的考不考虑极性是指在计算IWE的时候的公式2，对应下面两个公式：
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219151227.png" width="60%" />
<figcaption>  
</figcaption>
</div>

效果如下图所示.首先从优化函数来说，是否使用极性的优化速度是近似的。但是采用了极性显然中间部分要明显一些，可以理解为更集中（optimal value is slightly narrower and more pronounced）。
而通过IWE的对比分析则发现，如果带有极性，会使得 contrast function（公式3）下降得更加明显（因为存在正负极性相抵消）

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219151430.png" width="80%" />
<figcaption>  
</figcaption>
</div>

## Depth Estimation

此部分是基于[EMVS](https://www.researchgate.net/profile/Davide-Scaramuzza-3/publication/320914498_EMVS_Event-Based_Multi-View_Stereo-3D_Reconstruction_with_an_Event_Camera_in_Real-Time/links/5a663bff0f7e9b6b8fde4241/EMVS-Event-Based-Multi-View-Stereo-3D-Reconstruction-with-an-Event-Camera-in-Real-Time.pdf)的框架的.
首先相机的pose、intrinsic都是是已知的。

其次，其 geometric model 为：一个图像点的trajectory可以通过将一个3D点（同时有已知的6 DoF相机pose和相对于参考视角下3D点的深度）进行投影获得的。如下图所示。此时参数θ为深度,假设一个小的区域（patch）内所有的点都具有相同的深度。
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219142622.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219143658.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  左图为Event-based space-sweep  
  </figcaption>
</div>

基于CM框架下的深度估计步骤如下：
1. Transfer the events (triggered at the image plane of the moving event camera) onto the reference view using the candidate depth parameter. 
对于一个事件点 e<sub>k</sub> 采用 warp (W) function转换到e<sup>'</sup><sub>k</sub>=(x<sup>'</sup><sub>k</sub>,t<sub>ref</sub>,p<sub>k</sub>)下:

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219143824.png" width="60%" />
<figcaption>
</figcaption>
</div>

然后，类似于上面公式2（也就是下图公式），通过计算沿着candidate point trajectory事件的数量

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219144013.png" width="60%" />
<figcaption>
</figcaption>
</div>

2. 通过测量上面获得的图片的对比度（或者说方差）来测试event以及depth value θ的匹配对：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219144203.png" width="60%" />
<figcaption>
</figcaption>
</div>

3. 最大化对比度来获取深度值θ

下图通过可视化两个patch的优化过程来看CM算法的深度估计效果：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219144537.png" width="80%" />
<figcaption>
</figcaption>
</div>


## Rotational Velocity Estimation 
这其实是角速度的估计,最经典的应该是这篇工作[《Accurate angular velocity estimation with an event camera (RAL2017)》](https://www.zora.uzh.ch/id/eprint/138896/1/RAL16_Gallego.pdf)

首先，此任务是针对在静态环境下相机仅有rotational motion的，同时相机的intrinsic也是已知且去失真~

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219145133.png" width="60%" />
<figcaption>
</figcaption>
</div>

1. 其 geometric model如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219145522.png" width="60%" />
<figcaption>
</figcaption>
</div>

2. 通过下面构思构建 image of warped events

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219144013.png" width="60%" />
<figcaption>
</figcaption>
</div>

3. 更前面两个子任务一样，采用下式来构建优化方程

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219144203.png" width="60%" />
<figcaption>
</figcaption>
</div>

估算的角速度的精度还是比较高的~

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219150052.png" width="60%" />
<figcaption>
</figcaption>
</div>


## Motion Estimation in Planar Scenes 
这是在平面下的rotation 和translation运动估计，属于3 DoF吧~

在此场景，图像点的变换如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219150439.png" width="60%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219150728.png" width="60%" />
<figcaption>
</figcaption>
</div>

同样地，采用上面的公式2和3来构建IWE以及求最优化

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219144013.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219144203.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

效果如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219150909.png" width="60%" />
<figcaption>
</figcaption>
</div>

并且下图也展示了采用或者不采用CM框架下的VIO效果。可以看到采用CM算法恢复的平面点是要平整一些~

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250219151034.png" width="60%" />
<figcaption>
</figcaption>
</div>



<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
## SLAM or 6DoF Pose Tracking
此处的基于SLAM的应用是指full-SLAM或6DoF Pose Tracking，因为大部分的CMax中所谓的motion estimation都是指 rotational 或者fronto-parallel motion estimation，这其实应用场景非常局限的，比如工作[《CMax-SLAM: Event-based Rotational-Motion Bundle Adjustment and SLAM System using Contrast Maximization (TRO2024)》](https://arxiv.org/pdf/2403.08119)</sup>

<!-- [《Visual Odometry with an Event Camera Using Continuous Ray Warping and Volumetric Contrast Maximization (Sensor2022)》](https://arxiv.org/pdf/2107.03011)实现了contrast maximization in 3D -->

文献<sup>[ref](https://ieeexplore.ieee.org/abstract/document/10855459)</sup>则是是首次实现了将CM framework用到EVIO问题中；而更早的文献<sup>[ref](https://ieeexplore.ieee.org/abstract/document/10275026)</sup>则是首次将CM框架拓展到EVO（event+image odometry）问题中，论文中也宣称首次拓展到6 DoF motion。

本质上这两个能基于CM实现6DoF Pose Tracking的基本原因都是仅仅用CM来作为运动补偿，并不是直接采用CM的原理来计算pose，受限于局部最优以及容易退化，基于CM原理的motion estimation一般都是限制在rotational 或者fronto-parallel motion estimation.


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
## Learning-based Framework
其中CMax framework也被广泛应用于deep learning中，特别地，是用来构建Self-Supervised Learning loss：
<!-- * [Reducing the sim-to-real gap for event cameras（ECCV2020）](https://arxiv.org/pdf/2003.09078) 这个不属于 -->

* [Unsupervised event-based learning of optical flow, depth, and egomotion (CVPR2019)](https://openaccess.thecvf.com/content_CVPR_2019/papers/Zhu_Unsupervised_Event-Based_Learning_of_Optical_Flow_Depth_and_Egomotion_CVPR_2019_paper.pdf)
<!-- * [Unsupervised learning of a hierarchical spiking neural network for optical flow estimation: From events to global motion perception (TPAMI2019)](https://arxiv.org/pdf/1807.10936) -->
* [Back to event basics: Self-supervised learning of image reconstruction for event cameras via photometric constancy (CVPR2021)](https://openaccess.thecvf.com/content/CVPR2021/papers/Paredes-Valles_Back_to_Event_Basics_Self-Supervised_Learning_of_Image_Reconstruction_for_CVPR_2021_paper.pdf)
* [Self-supervised learning of event-based optical flow with spiking neural networks (NIPS2021)](https://proceedings.neurips.cc/paper_files/paper/2021/file/39d4b545fb02556829aab1db805021c3-Paper.pdf)
* [Taming contrast maximization for learning sequential, low-latency, event-based optical flow (CVPR2023)](https://openaccess.thecvf.com/content/ICCV2023/papers/Paredes-Valles_Taming_Contrast_Maximization_for_Learning_Sequential_Low-latency_Event-based_Optical_Flow_ICCV_2023_paper.pdf)
* [Fully neuromorphic vision and control for autonomous drone flight (SRO2024)](https://www.science.org/doi/epdf/10.1126/scirobotics.adi0591)
* [Motion-prior Contrast Maximization for Dense Continuous-Time Motion Estimation (ECCV2024)](https://arxiv.org/pdf/2407.10802)

对于光流估算的网络，可以通过CM框架来实现Unsupervised或者Self-supervised learning(首次应该是在论文《 [Unsupervised event-based learning of optical flow, depth, and egomotion (CVPR2019)](https://openaccess.thecvf.com/content_CVPR_2019/papers/Zhu_Unsupervised_Event-Based_Learning_of_Optical_Flow_Depth_and_Egomotion_CVPR_2019_paper.pdf)》中提出的)。原理如下：

对于估算出来的光流：u(x, y), v(x, y)可以构建warp function如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220121922.png" width="60%" />
<figcaption>
</figcaption>
</div>

如果网络估算的光流是正确的，那么就可以将这段事件内的事件都进行投影，获得的IWE的对比度是最大的。当然如果单纯用对比度最大化这个loss function，网络很容易overfit(应该也就是出现类似于Event Collapse)的情况。
`the network would easily overfit to this loss, by predicting flow values that push all events within each region of the image to a line. `
那么作者通过分离事件的极性，生成an image of the average timestamp at each pixel for each polarity：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220122850.png" width="60%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220122941.png" width="60%" />
<figcaption>
</figcaption>
</div>

而采用的最终的loss实际上就是两种图片的平方和:

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220123059.png" width="60%" />
<figcaption>
</figcaption>
</div>

再进一步的，使用这个参考时间t'会存在一定的尺度问题(对于离参考事件不一样的事件，梯度相差很大)，那么就进一步的把loss转换为backwards 和 forwards也就是 t′ = t<sub>1</sub> 和 t′ = t<sub>N</sub>（可以理解为用头与为分别作为参考时间来warp）:

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220123439.png" width="60%" />
<figcaption>
</figcaption>
</div>

同时，在上面的contrast loss的基础上，额外引入了一个Charbonnier smoothness prior (local smoothness regularization):

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220123734.png" width="60%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220124359.png" width="60%" />
<figcaption>
</figcaption>
</div>

其实论文《[EV-FlowNet: Self-supervised optical flow estimation for event-based cameras (RSS2018)](https://arxiv.org/pdf/1802.06898)》[Github](https://github.com/daniilidis-group/EV-FlowNet)也是用了类似的思路，只不过是基于photometric loss而已

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220132113.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220132124.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

论文《[Unsupervised event-based learning of optical flow, depth, and egomotion (CVPR2019)](https://openaccess.thecvf.com/content_CVPR_2019/papers/Zhu_Unsupervised_Event-Based_Learning_of_Optical_Flow_Depth_and_Egomotion_CVPR_2019_paper.pdf)》应该是CM用到self-supervised learning里面最经典的论文，不过可惜的是作者并没有开源代码，但是网上找到了一个非官方实现[Github](https://github.com/mingyip/Motion_Compensated_FlowNet)后续可以测试看看~

接下来论文《[Back to event basics: Self-supervised learning of image reconstruction for event cameras via photometric constancy (CVPR2021)](https://openaccess.thecvf.com/content/CVPR2021/papers/Paredes-Valles_Back_to_Event_Basics_Self-Supervised_Learning_of_Image_Reconstruction_for_CVPR_2021_paper.pdf)》实际上就是沿用了CM for SSL的思路，只是改为SSL估算的光流来监督image reconstruction，并且轻量化了这个光流网络

<div align="center">
  <img src="../images/微信截图_20250221165806.png" width="60%" />
<figcaption>
</figcaption>
</div>

而在论文《[Self-supervised learning of event-based optical flow with spiking neural networks (NIPS2021)](https://proceedings.neurips.cc/paper_files/paper/2021/file/39d4b545fb02556829aab1db805021c3-Paper.pdf)》中作者则是把CNN改为SNN（Spiking neurons network）。
此外，作者也提到，每次输入的event需要足够的多才可以保证这个loss是有效的,但是如果是采用高频的处理以期获得高频的光流（fine discretization of the event stream），就不适用了~

因此，作者对CM loss提出改进`improves its convexity`也就是额外除以pixel数：

<div align="center">
  <img src="../images/微信截图_20250221173602.png" width="60%" />
<figcaption>
</figcaption>
</div>

如下图所示，确实通过添加了scaling factor，loss function显得更“凸”了~

<div align="center">
  <img src="../images/微信截图_20250221173749.png" width="60%" />
<figcaption>
</figcaption>
</div>

此外作者也提到，CM算法是需要有足够的linear blur才是有效的，而此处采用SNN的结构，每次输入都是`small number of event`,因此作者提出相应的解决方案：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220135703.png" width="60%" />
<figcaption>
PS: 这点还不是太理解，后续看看代码：https://github.com/tudelft/event_flow
</figcaption>
</div>

如下图（左下）所示。这些用CM来做self-supervised learning的方法都是需要假设`events move linearly within the time window of the loss`.因此在文献《[Taming contrast maximization for learning sequential, low-latency, event-based optical flow (CVPR2023)](https://openaccess.thecvf.com/content/ICCV2023/papers/Paredes-Valles_Taming_Contrast_Maximization_for_Learning_Sequential_Low-latency_Event-based_Optical_Flow_ICCV_2023_paper.pdf)》中，首先通过使用循环模型来处理小分区（small partitions）的事件流，而不是处理大量输入事件(也就是沿着他们上一篇论文《[Self-supervised learning of event-based optical flow with spiking neural networks (NIPS2021)](https://proceedings.neurips.cc/paper_files/paper/2021/file/39d4b545fb02556829aab1db805021c3-Paper.pdf)》来做)。这样可以很好利用event camera的high temporal resolution。这也就是论文中提到的`sequential processing`

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220144810.png" width="80%" />
<figcaption>
</figcaption>
</div>

对于`sequential processing`作者通过实验验证了其有效性

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220175806.png" width="60%" />
<figcaption>
</figcaption>
</div>

同时再通过`iterative event warping`进而可以实现多段时间的event warp来避免假设事件是线性motion的~

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220180553.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220180601.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

其次通过multiple temporal scales，也就是多种时间尺寸来累积事件，来处理CM framework。

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220181125.png" width="100%" />
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220181444.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220181139.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

而传统的其他CM方法则是如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220181228.png" width="60%" />
<figcaption>
</figcaption>
</div>


论文也通过大量的实验证明了这种multi-timescale CM framework超越所有基于CM的framework，仅仅不如用GT数据训练的纯supervised learning方法
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220145754.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250220145754.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
supervised learning (SL) methods trained with ground truth, 
self-supervised learning (SSL) methods trained with grayscale images (SSLF) or events (SSLE), 
and model-based approaches (MB, non-learning method).

  </figcaption>
</div>


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# Paper Resource
此处列出CMax相关或者用到CMax的文献。

* A Unifying Contrast Maximization Framework for Event Cameras, with Applications to Motion, Depth and Optical Flow Estimation (CVPR2018)
  * [paper](https://openaccess.thecvf.com/content_cvpr_2018/papers/Gallego_A_Unifying_Contrast_CVPR_2018_paper.pdf)
  * [supplementary material](https://www.ifi.uzh.ch/dam/jcr:a22071c9-b284-43c6-8f71-6433627b2db2/CVPR18_Gallego.pdf)

* Accurate angular velocity estimation with an event camera (RAL2017)
  * [paper](https://www.zora.uzh.ch/id/eprint/138896/1/RAL16_Gallego.pdf)

* Focus is all you need: Loss functions for event-based vision (CVPR2019)
  * [paper](https://openaccess.thecvf.com/content_CVPR_2019/papers/Gallego_Focus_Is_All_You_Need_Loss_Functions_for_Event-Based_Vision_CVPR_2019_paper.pdf)

* Event Cameras, Contrast Maximization and Reward Functions: An Analysis (CVPR2019)
  * [paper](https://openaccess.thecvf.com/content_CVPR_2019/papers/Stoffregen_Event_Cameras_Contrast_Maximization_and_Reward_Functions_An_Analysis_CVPR_2019_paper.pdf)
  * [Github](https://github.com/TimoStoff/events_contrast_maximization): A python library for contrast maximization and voxel creation using events.

* Unsupervised event-based learning of optical flow, depth, and egomotion (CVPR2019)
  * [paper](https://openaccess.thecvf.com/content_CVPR_2019/papers/Zhu_Unsupervised_Event-Based_Learning_of_Optical_Flow_Depth_and_Egomotion_CVPR_2019_paper.pdf)
  * [非官方的github实现](https://github.com/mingyip/Motion_Compensated_FlowNet)

* Globally optimal contrast maximisation for event-based motion estimation (CVPR2020)
  * [paper](https://openaccess.thecvf.com/content_CVPR_2020/papers/Liu_Globally_Optimal_Contrast_Maximisation_for_Event-Based_Motion_Estimation_CVPR_2020_paper.pdf)

* Real-Time Rotational Motion Estimation With Contrast Maximization Over Globally Aligned Events (RAL2021)
  * [paper](https://ieeexplore.ieee.org/abstract/document/9454404)

<!-- * Reducing the sim-to-real gap for event cameras（ECCV2020）
  * [paper](https://arxiv.org/pdf/2003.09078)
  * [github](https://github.com/TimoStoff/event_cnn_minimal) -->

* Globally-optimal event camera motion estimation (ECCV2020)
  * [paper](https://arxiv.org/pdf/2203.03914)

* Globally-optimal contrast maximisation for event cameras (TPAMI2021)
  * [paper](https://arxiv.org/pdf/2206.05127)
  * 此篇是上一篇的期刊版本

<!-- * Unsupervised learning of a hierarchical spiking neural network for optical flow estimation: From events to global motion perception (TPAMI2019)
  * [paper](https://arxiv.org/pdf/1807.10936)
  * [github](https://github.com/tudelft/cuSNN) -->

* Self-supervised learning of event-based optical flow with spiking neural networks (NIPS2021)
  * [paper](https://proceedings.neurips.cc/paper_files/paper/2021/file/39d4b545fb02556829aab1db805021c3-Paper.pdf)
  * [Supplementary Material](https://arxiv.org/pdf/2106.01862)
  * [github](https://github.com/tudelft/event_flow)

* Back to event basics: Self-supervised learning of image reconstruction for event cameras via photometric constancy (CVPR2021)
  * [paper](https://openaccess.thecvf.com/content/CVPR2021/papers/Paredes-Valles_Back_to_Event_Basics_Self-Supervised_Learning_of_Image_Reconstruction_for_CVPR_2021_paper.pdf)
  * [github](https://github.com/tudelft/ssl_e2vid)

* Visual Odometry with an Event Camera Using Continuous Ray Warping and Volumetric Contrast Maximization (Sensor2022)
  * [paper](https://arxiv.org/pdf/2107.03011)

* Contrast maximization-based feature tracking for visual odometry with an event camera (Processes2022)

* Recursive Contrast Maximization for Event-Based High-Frequency Motion Estimation (IEEE Access2022)

* Event Collapse in Contrast Maximization Frameworks (Sensor 2022)
  * [paper](https://web.archive.org/web/20220813065935id_/https://depositonce.tu-berlin.de/bitstream/11303/17328/1/sensors-22-05190-v3.pdf)

* A Fast Geometric Regularizer to Mitigate Event Collapse in the Contrast Maximization Framework (AIS2023)
  * [paper](https://advanced.onlinelibrary.wiley.com/doi/pdfdirect/10.1002/aisy.202200251)
  * [github](https://github.com/tub-rip/event_collapse)
  * 这篇应该是上一篇的拓展版

* Taming contrast maximization for learning sequential, low-latency, event-based optical flow (CVPR2023)
  * [paper](https://openaccess.thecvf.com/content/ICCV2023/papers/Paredes-Valles_Taming_Contrast_Maximization_for_Learning_Sequential_Low-latency_Event-based_Optical_Flow_ICCV_2023_paper.pdf)
  * [Supplementary Material](https://openaccess.thecvf.com/content/ICCV2023/supplemental/Paredes-Valles_Taming_Contrast_Maximization_ICCV_2023_supplemental.pdf)
  * [github](https://github.com/tudelft/taming_event_flow)

* Density Invariant Contrast Maximization for Neuromorphic Earth Observations (CVPR2023)
  * [paper](https://openaccess.thecvf.com/content/CVPR2023W/EventVision/papers/Arja_Density_Invariant_Contrast_Maximization_for_Neuromorphic_Earth_Observations_CVPRW_2023_paper.pdf)
  * [github](https://github.com/neuromorphicsystems/event_warping)

* MC-VEO: A visual-event odometry with accurate 6-DoF motion compensation (TIV2023)
  * [paper](https://ieeexplore.ieee.org/abstract/document/10275026)
  * [github](https://cslinzhang.github.io/MC-VEO/MC-VEO.html)

* CMax-SLAM: Event-based Rotational-Motion Bundle Adjustment and SLAM System using Contrast Maximization (TRO2024)
  * [paper](https://arxiv.org/pdf/2403.08119)
  * [github](https://github.com/tub-rip/cmax_slam)

* Secrets of Event-based Optical Flow (ECCV2022)
  * [paper](https://arxiv.org/pdf/2207.10022)

* Secrets of Event-based Optical Flow, Depth and Ego-motion Estimation by Contrast Maximization (TPAMI2024)
  * [paper](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10517639)
  * [github](https://github.com/tub-rip/event_based_optical_flow)
  * 这篇是上一篇的期刊版本

* Motion-prior Contrast Maximization for Dense Continuous-Time Motion Estimation (ECCV2024)
  * [paper](https://arxiv.org/pdf/2407.10802)
  * [github](https://github.com/tub-rip/MotionPriorCMax)

* Secrets of Edge-Informed Contrast Maximization for Event-Based Vision
  * [paper](https://arxiv.org/pdf/2409.14611)

* EROAM: Event-based Camera Rotational Odometry and Mapping in Real-time
  * [paper](https://arxiv.org/pdf/2411.11004)
  * [github](https://wlxing1901.github.io/eroam/)

* Fully neuromorphic vision and control for autonomous drone flight (SRO2024)
  * [paper](https://www.science.org/doi/epdf/10.1126/scirobotics.adi0591)
  * [github](https://github.com/tudelft/event_planar)

* Event-Frame-Inertial Odometry Using Point and Line Features Based on Coarse-to-Fine Motion Compensation (RAL2025)
  * [paper](https://ieeexplore.ieee.org/abstract/document/10855459)
  * [github](https://github.com/choibottle/C2F-EFIO)




<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 复现或测试CM相关工作

* [CMax-SLAM-comment](https://github.com/KwanWaiPang/CMax-SLAM-comment)


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<!-- # 参考资料 -->