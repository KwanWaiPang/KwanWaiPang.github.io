---
layout: post
title: "Paper Survey之——LiDAR-SLAM中的退化检测"
date:   2025-03-16
tags: [SLAM, LiDAR]
comments: true
author: kwanwaipang
toc: true
# 强制定义摘要为纯文本，彻底隔绝脚本进入首页或摘要区
excerpt: "本文系统性地综述了 LiDAR-SLAM 过程中的退化检测（Degeneracy Detection）与补偿（Mitigation）方法。"
---


<!-- * 目录
{:toc} -->


# 引言
{: #引言 }

本文主要介绍了一些用于检测和解决激光雷达SLAM中退化问题的算法。
目前LiDAR-SLAM对退化处理的方法基本都是退化检测和退化补偿.

退化检测要么是通过几何结构对点云分析，要么就是优化的方法，对优化问题的矩阵分析，要么就是通过learning判断。

而对于退化的补偿一般都要额外信息的引入，因为退化本质上就是约束不够和噪声混了。
引入信息最少的方案一般是只要点云配准的先验位姿(一般需要比较准的里程计)，然后作约束优化，这样点云配准的时候不会在退化的方向发散。要么就直接加传感器，比如或者相机(比如fast-livo,r3live等等),不过这些是不检测退化，直接加多的约束方程。
也有部分工作是仅仅对于退化的时候,对退化的维度进行补偿,这样可以减少work load以及避免引入的视觉等传感器会带来更多的噪声(在lidar不退化的时候加入image可能会让系统变得更差)。

Lidar-based SLAM一般就是求点云的配准（Point Cloud Registration），其中有分为scan-to-scan registration以及scan-to-map registration。两者的本质其实都是基于ICP。

<details>
<summary>LiDAR-SLAM ICP匹配求pose的推导见</summary>
<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231151149.png" width="80%" />
<figcaption>  
ICP匹配转换成最小二乘问题，而上面的公式3中的A也就是优化问题中的hessian矩阵了
</figcaption>
</div> 
    进一步的要求解状态，其实也就是对上面公式3求导取0。有很多方法可以求解（比如优化库、Gauss-Newton或者LM算法）。下面通过SVD分解的方法来求解
    <div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231151437.png" width="80%" />
<figcaption>  

</figcaption>
</div> 
    而通过上面推导过程可以看到，hessian矩阵A是求解过程的重中之重，因此退化检测及补偿也基本围绕着对Hessian矩阵的分析展开
  </details>

# 退化检测（Degeneracy Detection）
{: #退化检测（degeneracy-detection） }

一般的退化检测方法有以下几种：

* Registration Uncertainty：侧重于通过建模优化/点云匹配过程中的不确定性来检测退化。通过估计姿态估计过程的协方差，来捕捉优化问题的退化情况。

* Learning-based approaches：通过学习的方法来判断lidar信息是否退化，但是一般认为泛化性都是有限的

* Optimization stability based approaches：这是对优化变量进行分析的。从优化变量的几何稳定性角度出发，分析ICP（点到平面）算法的几何稳定性。（比如能观性分析等，可能需要对每个lidar点都进行分析，比如LION中的）

* Degeneracy awareness：通过分析优化的Hessian矩阵的最小特征值，识别退化方向，也就是下面几个工作中主要介绍到的进行奇异值分解，然后判断特征值大小的方法(感觉跟上面一种很像，虽然有些文献分为四类，但是其实三类也可)

## Selective Kalman Filter: When and How to Fuse Multi-Sensor Information to Overcome Degeneracy in SLAM
{: #selective-kalman-filter-when-and-how-to-fuse-multi-sensor-information-to-overcome-degeneracy-in-slam }

*[链接]（https://arxiv.org/pdf/2412.17235）

这篇论文主要的思路是:多传感器融合确实是可以解决SLAM退化的问题,但是不应该"all in"的融合,而是应该根据传感器的退化情况来选择性的融合,这样可以减少计算量(less processing visual data),提高精度(introduce fewer errors from visual measurement)。也就是"when"与"how"的问题。

为此,作者提出了LiDAR的退化检测(也就是when),只有当lidar退化时才引入视觉观测量.而作者提出的lidar退化检测方法还是直接识别特定的退化方向(考虑了rotational 与translational的约束).
至于(how),作者则是用视觉测量,仅仅对特定的退化状态来进行更新.

`If LIO subsystem is degenerative, to minimally introduce visual information and prevent deterioration in state estimation, we analyze the LiDAR’s degenerative direction.
We then selectively fuse visual data pertinent to this degenerative direction and discard data from non-degenerative directions, which helps prevent a decline in the accuracy of the LiDAR’s nondegenerative dimensions.`

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230180040.png" width="80%" />
<figcaption>  

</figcaption>
</div>

作者采用R3LIVE作为baseline,而lidar退化的检测则是基于lidar的测量量实现的.
基于fast-lio,lidar的point-to-plane constraints可以写为下面的公式:

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230180934.png" width="80%" />
<figcaption>  
x为系统的状态也就是rotation 和 translation
</figcaption>
</div>

对上式进行加权线性最小二乘法可以得到下面的公式:

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230181135.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230181222.png" width="100%" />
      </td>
    </tr>
  </table>
<figcaption>

</figcaption>
</div>

`Degeneracy-aware factors with applications to underwater slam(下面介绍)`是通过对比上面公式的H1的最小的eigenvalue与阈值来判断是否退化.
然而,矩阵H1前3个维度是来自于rotation,后3个维度是来自于translation,而奇异值分解所获得的eigenvalue包含了旋转与平移的信息,,并不能直接用来判断退化的方向.此外,哪怕在同一个H1的奇异值分解中,奇异值都有不同的单位,因此很难设定一个阈值来作为是否退化的判断标准.并且这些奇异值所对应的eigenvector也不代表实际物理意义的方向.

而在LION中,作者提出退化及对应的方向可以通过分析H1的对角线元素来判断.并分别对对角线的矩阵进行奇异值分解(这样应该是为了把旋转与平移分开),然后通过设置两个阈值来分别判断平移与旋转两个方向的退化情况.

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230182239.png" width="80%" />
<figcaption>  

</figcaption>
</div>

但是却又忽略了两外两个矩阵的元素,这样可能会导致退化的方向不准确.如下图所示

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230182635.png" width="80%" />
<figcaption>  
LION neglects the mutual influence between rotational and translational constraints
</figcaption>
</div>

那么作者的做法其实就是对矩阵H1进行求逆,进而获取协方差矩阵

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230182830.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230183117.png" width="100%" />
      </td>
    </tr>
  </table>
<figcaption>

</figcaption>
</div>

而在分别对两个协方差矩阵进行奇异值分解的时候,实际上是考虑到了平移与旋转的相互影响的.并且这个协方差矩阵也是有实际的物理意义的:

`the diagonal blocks of the covariance matrix represent the variances of the state,
while the off-diagonal blocks indicate the correlations between different states.
Variance serves as an intuitive measure of degeneracy level.
For instance, a high variance indicates significant uncertainty in the estimation of that direction, signifying degeneracy.`

最后分别设置两个阈值来判断是否退化.而退化的时候仅仅更新对应位置的状态(详细过程见原文,推导并不复杂).

## Degeneracy-aware factors with applications to underwater slam
{: #degeneracy-aware-factors-with-applications-to-underwater-slam }

*[链接]（https://www.cs.cmu.edu/~kaess/pub/Hinduja19iros.pdf）

**IROS2019**
本文是针对基于ICP（scan matching）方法的退化感知问题（degeneracy-aware ICP algorithm），然后基于感知的退化结果（剔除掉退化的部分用来做回环约束），采用a partially constrained loop closure factor来整合到图优化SLAM中。
在进一步的把该方法用于水下sonar factor来整合到图优化SLAM中。

本质上可以理解为基于图优化框架的scan matching退化检测，虽然不是针对lidar的，但是传感器测量的退化检测方法是类似的。毕竟检测退化是基于因子图与H矩阵的。

无论是基于RGB-D还是基于基于Laser 的传感器，在特征点或者几何特征不够的情况下，都容易遇到退化问题（更进一步的应该是能观性分析了~）。而针对SLAM中的退化问题处理的方式一般有两个种：
（1）limiting，所谓的limiting可以理解为通过多传感器融合，本身就限制了退化的发生。
（2）actively handling degenerate situations。通过转换不同的特征或者算法来减少退化的发生（比如直接法与特征点法结合等）。
而无论是哪种方法，都需要对退化的情况进行检测，然后对退化的部分进行补偿。

而对于SLAM中的优化问题，状态空间任何一个维度的退化（或者没有很好的约束）都会导致退化，但是，即使有些方向是退化的，约束好的方向却仍然可以较好的更新状态。因此，将退化及没有退化的方向分开来处理是很重要的。对于退化的方向进行补偿，对于没有退化的方向则进行继续的更新。

对于图优化SLAM中，最基本的非线性最小二乘表达式如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231104924.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而基于ICP的scan matching的回环约束可以写为下式

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231133629.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而作者采用的退化检测方法是通过对A矩阵的奇异值分解来判断是否退化，而对于退化的部分则剔除掉，仅仅将没有退化的部分作为回环因子加入。其步骤如下

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231133922.png" width="80%" />
<figcaption>  
其中第七步是根据特征值与阈值对比来判断是否退化
</figcaption>
</div>

## Lion: Lidar-inertial observability-aware navigator for vision-denied environments
{: #lion-lidar-inertial-observability-aware-navigator-for-vision-denied-environments }

*[链接]（https://arxiv.org/pdf/2102.03443）

**Experimental robotics: The 17th international symposium**
这篇工作主要其实是提出一个LIO系统（带有在线lidar-imu外参估计），且该算法获得了second and first places in the Tunnel and Urban circuits （DARPA Subterranean Challenge） in August 2019 and February 2020, respectively.
而本博文关注的则是其退化检测的部分。LION可以通过一个能观性的评价矩阵来衡量自身的性能，从而判断其估算的姿态是否在几何上不受约束。

`LION is able to self-assess its performance using an observability metric that evaluates whether the pose estimate is geometrically ill-constrained`

而作者采用的则是来自于论文`Gelfand, Natasha, et al. "Geometrically stable sampling for the ICP algorithm." Fourth International Conference on 3-D Digital Imaging and Modeling, 2003. 3DIM 2003. Proceedings.. IEEE, 2003.`对点云的能观性采样的方法（打分），进而使得LION可退预测可能的退化。
并且根据打分，转换不同的状态估计算法（比如轮式里程计或者VIO/thermal-imu）来应对退化的情况。（PS：转换不同估算方法来保持系统的稳定性也是参考额外的一篇工作）

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231140147.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而所谓的“Observability Metric”则是通过对point-to-plane的ICP提取hessian矩阵进行分析的

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231140735.png" width="80%" />
<figcaption>  
其实跟前面的类似，提取H矩阵后进行重组，然后利用奇异值分解判断奇异值的大小（此处仅仅考虑平移）
</figcaption>
</div>

## X-icp: Localizability-aware lidar registration for robust localization in extreme environments
{: #x-icp-localizability-aware-lidar-registration-for-robust-localization-in-extreme-environments }

*[链接]（https://arxiv.org/pdf/2211.16335）

**IEEE Transactions on Robotics (2023)**

X-ICP的创新主要是两个：（1）fine-grained localizability detection module（通过利用scan与map的correspondence来分析他们之间在不同维度的对齐强度）和（2）localizability-aware constrained ICP optimization module（其实也就是把退化的方向不纳入优化的考虑，一次实现drift-free的pose update）。

X-icp中的localizability detection module（实际就是退化检测）的做法其实跟上面的LION的很类似，也就是对H矩阵进行分解，然后分别考虑rr和tt作为rotation和translation的退化分析（LION应该是只考虑了translation）

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231154426.png" width="80%" />
<figcaption>  
The localizability detection module 是基于优化的eigenspace实现的
</figcaption>
</div>

X-ICP整体的系统框架如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102134922.png" width="80%" />
<figcaption>  

</figcaption>
</div>

# 退化补偿（Degeneracy Mitigation）
{: #退化补偿（degeneracy-mitigation） }

对于退化补偿的方法，基于它们如何应对和补偿退化信息,现有的研究方法可以大致分为被动退化补偿(Passive degeneracy mitigation)和主动退化补偿(Active degeneracy mitigation)两类。

* Passive degeneracy mitigation:通过结合额外的传感器信息或外部里程计数据来缓解LiDAR退化的影响。这些方法不直接修改优化目标函数或LiDAR配准的相对姿态估计，而是通过外部信息来提供补充和辅助，以减少退化带来的负面影响。

* Active degeneracy mitigation:主动退化补偿方法直接修改优化过程，以减少退化对估计结果的影响。这些方法通过引入额外的约束、调整优化目标函数或使用正则化项等方式，主动地改变优化过程中的退化情况。

## Informed, constrained, aligned: A field analysis on degeneracy-aware point cloud registration in the wild
{: #informed,-constrained,-aligned-a-field-analysis-on-degeneracy-aware-point-cloud-registration-in-the-wild }

*[链接]（https://arxiv.org/pdf/2408.11809）

[Github Page](https://github.com/leggedrobotics/perfectlyconstrained)

lidar退化一般是通过额外的信息来进行代替或者添加额外的约束来弥补。
这篇论文对于lidar退化的补偿方法进行了详细的分析以及对比。与此同时作者也提出了三种方法来保证点云的注册是鲁棒的：

* the incorporation of different types of constraints into the ICP algorithm(添加多种约束到ICP，可以理解为通过添加新的约束，进而把退化部分所带来的影响去掉)

* the effect of using active or passive degeneracy mitigation techniques （采用退化补偿）

* the choice of utilizing global point cloud registration methods on the ill-conditioned ICP problem in LiDAR degenerate environments (在退化场景采用全局的点云注册)

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231143708.png" width="80%" />
<figcaption>  
各种退化补偿的方法及其效果请见原文（涉及较多的推导与分析~）
</figcaption>
</div>

# 参考资料
{: #参考资料 }

* [Awesome-Algorithms-Against-Degeneracy](https://github.com/thisparticle/Awesome-Algorithms-Against-Degeneracy)
