---
layout: post
title: "Paper Survey之——Deep IMU-Bias Inference"
date:   2025-02-02
tags: [SLAM, Deep Learning]
comments: true
author: kwanwaipang
toc: false
---


# 引言

对于IMU-based odometry，或者说所有包含IMU的framework，如LIO或VIO，IMU的bias建模是重中之重。
特别是VIO，标定及sensor modeling是影响系统性能最关键的部分。一般传统的方法都是把IMU的bias建模为additive Gaussian noise + random walk.
得益于深度学习强大的性能，基于learning的IMU bias建模也将具备很大的发展潜力。

之前[博客](https://kwanwaipang.github.io/File/Blogs/Poster/Learning_based_VO.html)已经较为系统的介绍了基于learning的VO以及VIO工作。
但是对于使用learning的方法来handle IMU bias仍然没有调研。
为此，写下本博客，作为本人学习相关工作的学习笔记。
本博客仅供本人学习记录用~




* 目录
{:toc}



<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# Deep IMU Bias Inference for Robust Visual-Inertial Odometry with Factor Graphs
* [RAL 2022](https://arxiv.org/pdf/2211.04517)

低成本、小型化的微机电系统（MEMS）惯性测量单元（IMU）已在机器人学和行人追踪领域得到广泛应用。
然而，单纯依赖IMU的状态估计会受到严重漂移影响。
这种漂移源于IMU积分过程中各类误差的累积，这些误差通常被统一建模为additive Gaussian noise + random walk。
由于漂移的累积，仅通过IMU测量积分进行状态估计的有效时间窗口通常不超过数秒。

该工作实现以及对比了 LSTMs 和 Transformers两个模型对IMU bias的推断性能。
网络不是学习运动模型，而是显式地学习IMU bias，这样也可以使得模型可以泛化到训练中没见过的运行模式。
下图展示了，如果模型只是学习运动的模型，当泛化到不同的环境（比如从行人手持到四足机器人，或者平地走训练的模型用到上下楼梯的场景）就会导致发散。
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202160846.png" width="60%" />
<figcaption>  
</figcaption>
</div>

论文的主要贡献点如下:
1. 设计一个神经网络可以从历史的IMU测量及bias中推断出IMU的bias
2. 对比了LSTMs 和 Transformers两个模型，并且将他们融入VIO的因子图中

论文的基于NN估算IMU-bias的VIO图优化的framework如下：
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202161751.png" width="60%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202161803.png" width="60%" />
<figcaption>  
</figcaption>
</div>

而所谓的可以从历史的IMU测量及bias中推断出IMU的bias的神经网络则是如下表示：
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202162236.png" width="60%" />
<figcaption>  
</figcaption>
</div>
此外设计了IMU-bias的因子如下：
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202162735.png" width="60%" />
<figcaption>  
注意，此处的方差给定的是常数，当然也可以通过网络来估算uncertainty
</figcaption>
</div>

至于network的结构，论文中设计了两个结构并且进行了对比
<div align="center">
  <table style="background-color: transparent;">
    <tr>
      <td style="border: none; background-color: transparent;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202155453.png" width="100%" />
      </td>
      <td style="border: none; background-color: transparent;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202155520.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  基于LSTM以及Transformer的IMU-bias Interference结构
  </figcaption>
</div>

网络的训练则是用lidar辅助，估算出bias的真值，或者用数据集提供的bias真值。用真值bias来作为监督的.

此处用数据集提供的bias作为真值，让我对其性能产生质疑，因为网络最大化也就是模拟接近传感器标定对bias，那跟传统方法基于传感器的bias来做预积分建模区别能有多大呢？
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-120804@2x.png" width="60%" />
<figcaption>  
</figcaption>
</div>

作者测试了多种场景，包括手持、四足、飞机。
但可惜的是既没有开源代码，似乎也没有说baseline VIO指的是哪个具体算法

<div align="center">
  <table style="background-color: transparent;">
    <tr>
      <td style="border: none; background-color: transparent;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202163309.png" width="100%" />
      </td>
      <td style="border: none; background-color: transparent;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202163500.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
手持实验（Newer College Multi-Camera Dataset(NCD-Multi)）
  </figcaption>
</div>


<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202163627.png" width="60%" />
<figcaption>  
在四足上的测试效果（网络都是用手持的数据进行训练的，也没有进行fine-tuning）
</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202163831.png" width="60%" />
<figcaption>  
Euroc飞行数据集（平移和旋转误差）
</figcaption>
</div>



<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# IMU Data Processing For Inertial Aided Navigation:A Recurrent Neural Network Based Approach
* [ICRA 2021](https://arxiv.org/pdf/2103.14286)

该工作采用recurrent neural network (RNN)计算可观测的IMU测量量(而并非related position or orientation，如下图所示)，并跟多传感器融合来获取性能的增益。

论文对于imu的建模推导如下：

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/1738815777404.jpg" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/1738815812482.jpg" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>
RNN methods to compute the learnable terms ∆γ, ∆β, and ∆q instead of the relative poses (学习的为预积分而非related pose)。
至于训练过程则如下图所示，RNN估算量会传到积分层来计算预积分值，然后用预积分来作为监督学习。但是在interference的时候，IMU的测量会直直接输入图优化中，而并非输入预积分值～
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250203154310.png" width="60%" />
<figcaption>
In the training stage, the output of RNN layer will be passed to the integration layer for calculating the training loss. In the reference stage, the RNN layer computes the learned IMU measurements, which will be directly used as the input for the probabilistic sensor fusion 
</figcaption>
</div>
由于imu的观测量真值并不好获取，因此作者设计loss function是基于预积分的，但是网络输出在应用的时候则是IMU测量值，如下：
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-130535@2x.png" width="60%" />
<figcaption>
基于公式6和7，可以通过真值来反推预积分量
</figcaption>
</div>
此外，由于传感器融合的时间分辨率可能不一样，训练中，预积分也会formulated多个loss

~~~
to enhance the training, integration is conducted by integrating 20%, 40%, 60%, 80%, and 100% data to formulate multiple loss terms. 
This is designed since sensor fusion algorithm using IMU measurements might need integration for different duration times and this is naturally the ‘data augmentation’ for better training results.
~~~

虽然作者设计了很多策略，但是论文中提到 ***For each dataset, we randomly chose half of the sequences for training and the others for testing.*** 因此，个人认为泛化能力还是不够的，只是比起学习relative motion，学习预积分会好些，不会依赖于前面的积分值，这样从某种程度下使得在同一个数据集下不同序列有较好的泛化能力，但是本质上还是学了某个数据集的motion pattern，如果要泛化到其他数据集（比如从手持到飞行）基本也是不可能的。
当然作者也没有开源代码，不然可以进行测试来验证猜想了～


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# Improved state propagation through AI-based pre-processing and down-sampling of high-speed inertial data
* [ICRA 2022](https://www.aau.at/wp-content/uploads/2022/03/imu_preprocessing.pdf)

论文也是分别提出基于LSTM和Transformer结构网络来最小化IMU state propagation error。此外是针对UAV的。
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-133846@2x.png" width="80%" />
<figcaption>  
</figcaption>
</div>
跟上一个工作其实是很像的，只是上一个工作是基于RNN且为手持的数据集，此处为飞机数据集，并且提出LSTM和Transformer两个结构。

至于训练，如文章所述：首先19个序列中的16个序列用于网络训练，而loss function跟上一个工作是差不多的（但此处监督的不是预积分而是relative pose，并通过动捕来提供relative pose以及速度）：
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-143631@2x.png" width="80%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-144146@2x.png" width="80%" />
<figcaption>  
</figcaption>
</div>

至于实验部分，个人感觉没有上面两个工作soild且也没有开源代码，无法测试效果，此处就略过了～




<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# AirIMU: Learning uncertainty propagation for inertial odometry
* [code](https://github.com/haleqiu/AirIMU)
* [paper](https://arxiv.org/pdf/2310.04874)
* [website](https://airimu.github.io/)
关于这篇工作的解读额外写在了博客[论文复现之——《AirIMU: Learning uncertainty propagation for inertial odometry》](https://kwanwaipang.github.io/AirIMU/)中


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# AirIO: Learning Inertial Odometry with Enhanced IMU Feature Observability
* [code](https://github.com/Air-IO/Air-IO)
* [paper](https://arxiv.org/pdf/2501.15659)
* [website](https://air-io.github.io/)

关于这篇工作的解读额外写在了博客[论文复现之——《AirIO: Learning Inertial Odometry with Enhanced IMU Feature Observability》](https://kwanwaipang.github.io/AirIO/)中



<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# Learned inertial odometry for autonomous drone racing
* [code](https://github.com/uzh-rpg/learned_inertial_model_odometry)
* [paper RAL 2023](https://arxiv.org/pdf/2210.15287)
* [Youtube](https://www.youtube.com/watch?v=DHQzaDVWXrc)

在复现上一篇工作AirIO的时候，发现作者特意对比了一个称为“IMO”的方法，也就是此工作。
该工作也是基于learning的inertial odometry，但是网络除了需要IMU输入以外，还需要控制输入（thrust）。
不过，从视频效果来看，比起AirIO更加的惊艳(宣称可以实现无人机飞70 km/h下的状态估计)。并且也通过实验对比验证了超越VIO（openvins和SVO）和TLIO（一个learning-based IO）

<div align="center">
<iframe width="80%" height="316" src="https://www.youtube.com/embed/2z2Slyt0WlE?si=l24WEyq43CCM3MHV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

如下图所示。
网络采用的为一个temporal convolutional network (TCN)，其输入为推力（mass-normalized collective thrust），陀螺仪的测量量，而输出则为无人机飞行的距离（从某种程度上讲，这个方法应该是以related motion作为监督的，因此大几率仅仅学习了飞机的运动模式，也就是前面几个工作提到的，泛化能力有限的因素之一~）；
而EKF则是以IMU的测量量作为propagation，以网络估算的relative positional displacement作为滤波器的更新。

TCN是一个recurrent network模型来处理temporal sequences，但同时更容易训练。
输入的陀螺仪测量量都会转换到世界坐标系。在训练过程则用动捕提供的orientation信息（加入高斯噪声，提供鲁棒性），在测试的过程用EKF来提供。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250214151100.png" width="60%" />
<figcaption>  
</figcaption>
</div>

该工作的实验是比较solid的，对比包括了：TLIO（一个learning-based IO），openvins，SVO,和Gate-IO（一个VIO，fuses the detection of the gate corners with IMU measurements in an EKF）
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250214154150.png" width="60%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250214154258.png" width="60%" />
<figcaption>  
</figcaption>
</div>

不过作者在论文中也提到了他们主要的limitation还是泛化能力，而所提到的```train the network to estimate the positional displacements in the drone body frame```实际上也就是AirIO的主要贡献之一了~
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250214154533.png" width="60%" />
<figcaption>  
</figcaption>
</div>