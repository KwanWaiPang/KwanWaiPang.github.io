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

## 理论解读

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202193858.png" width="80%" />
<figcaption>  
</figcaption>
</div>


Inertial odometry(IO)中对于IMU的建模可以分为两种：kinematic motion model-based （也就是传统的使用基于kinematics模型的IMU预积分<sup>[paper](https://infoscience.epfl.ch/server/api/core/bitstreams/e23a9898-f5a4-44ce-bbb0-e70854b170d2/content)</sup>） 和 data-driven method（也就是基于learning的）。
而本文则是提出混合两者的方法，用data-driven methods来估算不确定性（特别是 non-deterministic errors），而model-based methods可以提升系统的泛化能力（就是结合版）。
如下图所示。通过利用data-driven method对非确定性噪声和运动模型进行建模，以确保在新环境中的泛化能力。
为了使AirIMU能够学习不确定性和噪声模型，构建了一个可微IMU积分器（differentiable IMU integrator）和一个可微分协方差传播器（differentiable covariance propagator）。
可以预测长时间IMU预积分的累积协方差。
此外，通过将不确定性模块（uncertainty module）与噪声校正模块（ noise correction module）联合训练，可以捕获更好的IMU特征，并使两项任务都受益。
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202195327.png" width="60%" />
<figcaption>  
airiMU学习的是IMU预积分，并且loss也是用预积分来监督的（这可能容易导致学习了具体某个imu而影响泛化能力）
</figcaption>
</div>
PS：虽然网络输出的看似是IMU的motion model，但是训练监督的是related pose（或者说是related position和orientation）因此最终网络是否真的学到正确的IMU测量量是不被关注的，网络仅仅学习的是motion model因此会影响泛化能力～

论文的贡献点如下：

1. the first to train a deep neural network that models IMU sensor uncertainty through differentiable covariance propagation。也就是网络可以预测IMU的不确定性（协方差）
2. kinematic motion model-based 和 data-driven method混合imu-建模；
3. 将不确定性模块（uncertainty module）与噪声校正模块（ noise correction module）联合训练

### Data-driven module
如上面图(Fig. 4)中所示。采用encoder-decoder网络结构处理原始的IMU数据（加速度和角速度）。
网络输出加速度和角速度的校正，此外，也输出对应的uncertainty。

对于```encoder network```首先采用 1D CNN network来学习lower-level features,然后通过一个 gated recurrent unit (GRU)来学习时间维度的关联。
两个task都（correction和uncertainty）采用相同的encoder网络（shared encoder network）来处理原始的IMU。

对于```decoder network```,如下：
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202203945.png" width="60%" />
<figcaption>  
</figcaption>
</div>

最终的网络输出的IMU观测量可以表达如下：
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202204045.png" width="60%" />
<figcaption>  
</figcaption>
</div>

### Differentiable Integration and Covariance Module

基于获得的网络输出的IMU数据，再采用IMU kinematic model（也就是IMU预积分）来估算系统的状态：
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.001; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202204226.png" style="width: 100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.001; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202204755.png" style="width: 100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  积分传播模型与协方差传播模型
  </figcaption>
</div>

并基于预积分的结果来supervise data-driven module而不是对上面的IMU原始输出做监督，也就是Differentiable Integration and Covariance Module（其实跟DPVO和Droid-SLAM中的Differentiable BA的概念是很像的~）

### Loss Function and Training strategy
论文定义了noise correction的state loss以及covariance loss如下
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250203112353.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250203112405.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  state loss for noise correction VS. covariance loss
  </figcaption>
</div>
最终联合优化的loss如下
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250203112617.png" width="60%" />
<figcaption>
ε = 1×10<sup>−3</sup>
</figcaption>
</div>

### IMU-GPS PGO system
虽然采用了强大的learning来估算IMU的模型，但仍然需要外部校正来避免累积误差，而作者采用的是GPS+IMU~
最终refined的状态及协方差则跟GPS一起通过pose graph optimization来进行融合。如下图所示
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202202738.png" width="60%" />
<figcaption>  
</figcaption>
</div>


## 代码复现
论文的实验是非常惊艳的，比如下面的，展示了在直升机上估算的轨迹明显比原始IMU预积分的要更接近ground truth
<div align="center">
<video playsinline autoplay loop muted src="https://airimu.github.io/static/images/alto_show.mp4" poster="https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif" alt="sym" width="80%" style="padding-top:0px;padding-bottom:0px;border-radius:15px;"></video>
</div>
接下来通过代码复现来看看真实的效果如何~

* [AirIMU_comment](https://github.com/KwanWaiPang/AirIMU_comment)
* 其中的环境依赖是基于[pypose](https://github.com/pypose/pypose)
* pypose: a robotics-oriented, PyTorch-based library that combines deep perceptual models with physics-based optimization techniques.
* 运行```pip install pypose```后可以看到conda环境自动安装了系列依赖

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250203115750.png" width="60%" />
<figcaption>  
</figcaption>
</div>


### 安装配置
1. 安装[pypose](https://github.com/pypose/pypose)
* pypose is a PyTorch-based library that combines deep perceptual models with physics-based optimization techniques.

```bash
conda create -n airIMU python=3.10.11
conda activate airIMU
pip install pypose

# 安装系列依赖
pip install "numpy<2"
pip install tqdm
pip install pyproj
pip install scipy
pip install matplotlib
pip install pyhocon
pip install pykitti
pip install opencv-python==4.7.0.72

```

### 实验验证
1. 下载预训练模型（For EuRoC）并放置于```experiments/EuRoC/codenet/ckpt/```

~~~
wget https://github.com/sleepycan/AirIMU/releases/download/pretrained_model_euroc/EuRoCWholeaug.zip
~~~

2. 下载数据集[Euroc](https://projects.asl.ethz.ch/datasets/doku.php?id=kmavvisualinertialdatasets)：**Note**: Remember to reset the `data_root` in `configs/datasets/${DATASET}/${DATASET}.conf`.

3. generate network inference file net_output.pickle（这应该是网络估算出来的IMU结果）

~~~
python inference.py --config configs/exp/EuRoC/codenet.conf --load  EuRoCWholeaug/ckpt/best_model.ckpt
~~~

网络的输出（应该也就是每个序列的网络估算的IMU以及协方差）保存出来
<div align="center">
  <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/微信截图_20250203155329.png" width="80%" />
<figcaption>  
</figcaption>
</div>

4. 基于网络输出的结果来验证系统的系统

~~~
python evaluation/evaluate_state.py --dataconf configs/datasets/BaselineEuroc/Euroc_1000.conf --exp experiments/EuRoC/codenet/
~~~

5. 结果如下：
从实验效果来看还是比较惊艳的，但是作者在原文也提到这篇工作的limitation，
***AirIMU model trained on a single IMU does not readily generalize to a different IMU with different specifications and operating frequencies***
换言之就是泛化能力是有限的，需要在特定数据集下训练才可～
* MH_02_easy
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/微信截图_20250203162610.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_02_easy_orientation_compare.png" width="100%" />
      </td>
    </tr>
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_02_easyinte_error_compare.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_02_easystate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* MH_03_medium
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_03_medium_orientation_compare.png" width="100%" />
      </td>
       <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_03_mediuminte_error_compare.png" width="100%" />
      </td>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_03_mediumstate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* MH_04_difficult
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/微信截图_20250203162640.png" width="100%" />
      </td>
       <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_04_difficult_orientation_compare.png" width="100%" />
      </td>
    </tr>
     <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_04_difficultinte_error_compare.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_04_difficultstate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* MH_01_easy
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_01_easy_orientation_compare.png" width="100%" />
      </td>
       <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_01_easyinte_error_compare.png" width="100%" />
      </td>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_01_easystate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* MH_05_difficult
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_05_difficult_orientation_compare.png" width="100%" />
      </td>
       <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_05_difficultinte_error_compare.png" width="100%" />
      </td>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/MH_05_difficultstate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* V1_03_difficult
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/微信截图_20250203163931.png" width="100%" />
      </td>
       <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_03_difficult_orientation_compare.png" width="100%" />
      </td>
    </tr>
     <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_03_difficultinte_error_compare.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_03_difficultstate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* V1_01_easy
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_01_easy_orientation_compare.png" width="100%" />
      </td>
       <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_01_easyinte_error_compare.png" width="100%" />
      </td>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_01_easystate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* V1_02_medium
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_02_medium_orientation_compare.png" width="100%" />
      </td>
       <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_02_mediuminte_error_compare.png" width="100%" />
      </td>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_02_mediumstate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* V1_03_difficult
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_03_difficult_orientation_compare.png" width="100%" />
      </td>
       <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_03_difficultinte_error_compare.png" width="100%" />
      </td>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V1_03_difficultstate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* V2_01_easy
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V2_01_easy_orientation_compare.png" width="100%" />
      </td>
       <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V2_01_easyinte_error_compare.png" width="100%" />
      </td>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V2_01_easystate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

* V2_02_medium
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V2_02_medium_orientation_compare.png" width="100%" />
      </td>
       <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V2_02_mediuminte_error_compare.png" width="100%" />
      </td>
      <td style="width: 30%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/AirIMU_comment/raw/main/result/loss_result/V2_02_mediumstate_error_compare.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>


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
  <img src="../images/微信截图_20250214151100.png" width="60%" />
<figcaption>  
</figcaption>
</div>

该工作的实验是比较solid的，对比包括了：TLIO（一个learning-based IO），openvins，SVO,和Gate-IO（一个VIO，fuses the detection of the gate corners with IMU measurements in an EKF）
<div align="center">
  <img src="../images/微信截图_20250214154150.png" width="60%" />
  <img src="../images/微信截图_20250214154258.png" width="60%" />
<figcaption>  
</figcaption>
</div>

不过作者在论文中也提到了他们主要的limitation还是泛化能力，而所提到的```train the network to estimate the positional displacements in the drone body frame```实际上也就是AirIO的主要贡献之一了~
<div align="center">
  <img src="../images/微信截图_20250214154533.png" width="60%" />
<figcaption>  
</figcaption>
</div>