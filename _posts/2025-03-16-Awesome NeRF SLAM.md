---
layout: post
title: "Paper Survey之——Awesome NeRF SLAM"
date:   2025-03-16
tags: [SLAM,Deep Learning]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<!-- # 引言 -->

本博文记录本人调研NeRF-SLAM的时候做的学习记录，部分资料来源于网络，本博文仅仅供本人学习记录用~

* 原博客：[Link](https://blog.csdn.net/gwplovekimi/article/details/135083274)

NeRF SLAM（Neural Radiance Fields Simultaneous Localization and Mapping）是一种结合神经辐射场（NeRF）和SLAM（Simultaneous Localization and Mapping）的先进技术，用于实时地构建三维环境地图并同时估计相机的姿态。目前NeRF-SLAM主要有以下两个方向：
<ol><li>SLAM为NeRF训练提供位姿，然后建立稠密细腻的三维场景。简而言之就是NeRF只做mapping</li><li>在NeRF里建立各种损失函数反过来优化pose和depth。 简而言之就是full slam</li></ol> 
<p>那么基于这两个方向，目前的NeRF SLAM的工作主要分为以下三类：仅优化NeRF、仅优化位姿、位姿和NeRF联合优化。与此同时，本文也把最新的3D Gaussian Splatting也加入调研序列中。每个工作介绍的时候都会给出论文的下载链接、<span class="edu-hl hl hl-1" data-report-view="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;extra&quot;:&quot;{\&quot;word\&quot;:\&quot;源代码\&quot;}&quot;}" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;extra&quot;:&quot;{\&quot;word\&quot;:\&quot;源代码\&quot;}&quot;}" data-tit="源代码" data-pretit="源代码">源代码</span>（如有）、demo video（如有）</p> 
<p>本博文，意在记录本人调研NeRF-SLAM的时候做的学习记录，部分资料来源于网络，本博文仅仅供本人学习记录用~</p> 
<p></p> 

<h2 id="%E4%BB%80%E4%B9%88%E6%98%AFNeRF%EF%BC%9F"><a name="t0"></a>什么是NeRF？</h2> 
<p>NeRF 所做的任务是 Novel View Synthesis（新视角合成），即在若干已知视角下对场景进行一系列的观测（相机内外参、图像、Pose 等），合成任意新视角下的图像。传统方法中，通常这一任务采用三维重建再渲染的方式实现，NeRF 希望不进行显式的三维重建过程，仅根据内外参直接得到新视角渲染的图像。为了实现这一目的，NeRF 使用用<span class="words-blog hl-git-1" data-report-view="{&quot;spm&quot;:&quot;1001.2101.3001.10283&quot;,&quot;extra&quot;:&quot;{\&quot;words\&quot;:\&quot;神经网络\&quot;}&quot;}" data-tit="神经网络" data-pretit="神经网络">神经网络</span>作为一个 3D 场景的隐式表达，代替传统的点云、网格、体素、TSDF 等方式，通过这样的网络可以直接渲染任意角度任意位置的投影图像。</p> 
<p align="center"><img alt="" height="191" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e450bb5bc6c952ea509e9701625dfbdf.gif" width="500"></p> 
<p>​NeRF 的思想比较简单，就是通过输入视角的图像每个像素的射线对于密度（不透明度）积分进行体素渲染，然后通过该像素渲染的 RGB 值与真值进行对比作为 Loss。由于文中设计的体素渲染是完全可微的，因此该网络可学习：</p> 
<p><img alt="" height="264" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/a758713e57058f73fd79d6df0c105b4f.png" width="803"></p> 
<p></p> 
<p>关于更详细的什么是NeRF，我们接下来看看NeRF的开山之作，通过阅读这篇论文，看看到底什么是NeRF。由于这属于整个NeRF SLAM的基础，故此，此处做更深入的理解与学习。</p> 
<p></p> 
<h3 id="NeRF"><a name="t1"></a>NeRF</h3> 

<p><a href="https://arxiv.org/pdf/2003.08934.pdf" rel="nofollow" title="NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis">NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis</a></p> 
<p><a href="https://www.matthewtancik.com/nerf" rel="nofollow" title="论文主页">论文主页</a></p> 
<p>论文采用的只是fully-connected（non-convolutional）deep network，也就是只是MLP而不是CNN。论文中一个示意的网络结构如下：</p> 
<p align="center"><img alt="" height="261" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e57c682ae929de8bd4227b6bd039b96e.png" width="597"></p> 
<p>而这个网络的输输入则是一个5D的数据，包括了3D 位置 x=(x,y,z)&nbsp;和 2D 视角方向(θ,ϕ)，一共5D。对于其中的 2D 视角方向可以用下图进行直观解释（个人理解其实就是6-DoF pose中的x、y、z、row、pitch）。</p> 
<p align="center"><img alt="" height="350" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/6f8e114976f4b2358b84ac687285b017.png" width="536"></p> 
<p>&nbsp;在实际实现中，论文将视角方向表示为一个三维笛卡尔坐标系单位向量d，也就是图像中的任意位置与相机光心的连线，我们用一个 MLP 全连接网络表示这种映射（x为3D位置）：</p> 
<p align="center"><img alt="" height="51" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/47efd8fecde67a7b84778937672644fb.png" width="237"></p> 
<p>通过优化这样一个网络的参数&nbsp;Θ&nbsp;来学习得到这样一个 5D 坐标输入到对应颜色c和密度σ输出的映射。</p> 
<p>而网络的输出则是volume density （体积密度） and view-dependent emitted radiance at that spatial location（对应位置的辐射radiance ）。对于每个5D位置都输出一个对应的辐射（radiance 其实也就是RGB信息）以及density（其实也就是不透明度）。</p> 
<p>所谓的不透明度就是控制光线通过位置xyz的累计的幅度。</p> 
<p>通过沿着相机光线查询5D坐标来合成视图，并使用经典的体积渲染技术将输出的颜色和密度投影到图像中。</p> 
<p>此外，还需要<span class="words-blog hl-git-1" data-report-view="{&quot;spm&quot;:&quot;1001.2101.3001.10283&quot;,&quot;extra&quot;:&quot;{\&quot;words\&quot;:\&quot;image\&quot;}&quot;}" data-tit="image" data-pretit="image">image</span>对应的camera pose已知来作为输入（也就是经典的SLAM中已知pose纯mapping的问题）。</p> 
<p><span style="color:#fe2c24;"><strong>总而言之</strong></span>，所谓的“神经辐射场（<strong>Neural Radiance Field</strong>）”可以理解为物体发出辐射，从而在观察者传感器（人眼）上形成颜色。在NeRF中是5D的，用来表达复杂的几何+材质连续场景的方法，该辐射场使用 MLP 网络进行参数化，而这个MLP的网络的输入与输出如下：</p> 
<ul><li>输入为：3D 位置 x=(x,y,z)&nbsp;和 2D 视角方向(θ,ϕ)，一共5D</li><li>输出为：发射颜色 c=(r,g,b)&nbsp;和体积密度（不透明度）σ。</li></ul> 
<p>最后，再通过经典的体素渲染（<strong>Volume Rendering</strong>）将获得的一系列颜色和密度累计到一个2D图像上。由于这个过程是可微的，因此采用梯度下降法来对观测到的image以及渲染的视角（views rendered from our representation）进行优化。将这个误差在多个视图之间最小化，鼓励网络通过分配高体积密度和准确颜色给包含真实场景内容的位置来预测场景的一致模型。下图为NeRF的流程</p> 
<p align="center"><img alt="" height="535" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d0b05fc8de81124dc2ce84c6d1c71a5c.png" width="958"></p> 
<p>这篇论文主要工作和创新点如下：<br> 1）提出一种用 5D 神经辐射场 (<strong>Neural Radiance Field</strong>) 来表达复杂的几何+材质连续场景的方法，该辐射场使用 MLP 网络进行参数化；（这个神经辐射场是用来通过优化来保证真实感）<br> 2）提出一种基于经典体素渲染 (<strong>Volume Rendering</strong>) 改进的可微渲染方法，能够通过可微渲染得到 RGB 图像，并将此作为优化的目标。该部分包含采用分层采样的加速策略，来将 MLP 的容量分配到可见的内容区域；<br> 3）提出一种位置编码 (<strong>Position Encoding</strong>) 方法将每个 5D 坐标映射到更高维的空间，这样使得我们可以让我们优化神经辐射场更好地表达高频细节内容。</p> 
<p>个人认为：前面的两个contribution算是NeRF中最主要的思想，第三点算是一个提升。因为最基本的形式并不足以handle复杂的场景下的高分辨率渲染。通过<strong>Position Encoding</strong>来让MLP实现高频的表达，通过hierarchical sampling策略来降低高频场景表达所需的采样。</p> 
<p align="center"><img alt="" height="447" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/bac45fe1773b8f9c52e52cbd1911351d.png" width="887"></p> 
<p>为了让网络学习到多视角的表示，论文有如下两个合理假设：</p> 
<ul><li>体积密度（不透明度）&nbsp;σ&nbsp;只与三维位置&nbsp;x&nbsp;有关而与视角方向&nbsp;d&nbsp;无关。物体不同位置的密度应该和观察角度无关，这一点比较显然。</li><li>颜色&nbsp;c&nbsp;与三维位置&nbsp;x&nbsp;和视角方向&nbsp;d&nbsp;都相关。（这也是natural的）</li></ul> 
<p>预测体积密度&nbsp;σ&nbsp;的网络部分输入仅仅是输入位置&nbsp;x，而预测颜色&nbsp;c&nbsp;的网络输入是视角和方向&nbsp;d。在具体实现上：</p> 
<ul><li>MLP 网络 <img alt="" height="21" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/cb3db54d8e73c6bf530723b4cff6fd34.png" width="39">首先用 8 层的全连接层（使用 ReLU 激活函数，每层有 256 个通道），处理 3D 坐标&nbsp;x，得到&nbsp;σ&nbsp;和一个 256 维的特征向量。</li><li>将该 256 维的特征向量与视角方向&nbsp;d&nbsp;与视角方向一起拼接起来，喂给另一个全连接层（使用 ReLU 激活函数，每层有 128 个通道），输出方向相关的 RGB 颜色。</li></ul> 
<p>如下图所示</p> 
<p align="center"><img alt="" height="261" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e57c682ae929de8bd4227b6bd039b96e.png" width="597"></p> 
<p>接下来看看，如何基于辐射场进行体素渲染（Volume Rendering with Radiance Fields）</p> 
<p>采用经典的渲染方式来对场景中的颜色进行渲染。对于基于辐射场的体素渲染。为了理解文中的 Volume Rendering 和 Radiance Field 的概念首先我们回顾下图形学中最基础的渲染方程：</p> 
<p align="center"><img alt="" height="72" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/2fe8bde285f1a1039d6b249f08dcaca2.png" width="515"></p> 
<p>如下图所示，渲染方程表达了 3D 空间位置&nbsp;x&nbsp;在方向&nbsp;d&nbsp;的辐射（出射光）<img alt="" height="27" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/9cca4fa555c1fc4a37e463910c89292e.png" width="69">。该辐射表达为该点自身向外的辐射（发射光）<img alt="" height="29" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/3e2f9c7150331450f090f382e7d3855c.png" width="79"> 和该点反射外界的辐射（反射光）之和。</p> 
<p align="center"><img alt="" height="349" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/da058236a83039eb50a267c390d1b4e4.png" width="649"></p> 
<p align="center"><img alt="" height="311" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/2e4f33783ee404f3cd8abd1b5abdb4bd.png" width="1109"></p> 
<p>简单理解辐射概念，在物理学中，光就是电磁辐射，电磁波长&nbsp;λ&nbsp;与频率&nbsp;ν&nbsp;的关系式为</p> 
<p align="center"><img alt="" height="57" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/46cb3746821ee08b87fb339d8bb2ac0a.png" width="134"></p> 
<p>也就是二者的乘积为光速&nbsp;c。而我们又知道可见光的颜色 RGB 就是不同频率的光辐射作用于相机的结果。因此在 <span style="color:#fe2c24;"><strong>NeRF 中认为辐射场就是对于颜色的近似建模</strong></span>。</p> 
<p>经典的体素渲染方法有网格渲染、体素渲染等，对于很多类似云彩、烟尘等等特效。而5D 神经辐射场将场景可以表示为：其所在空间中任意点的体素密度和有方向的辐射亮度。体素密度&nbsp;σ(x)&nbsp;定义为光线停留在位置&nbsp;x&nbsp;处无穷小粒子的可导概率（或者也可以理解为光线穿过此点后终止的概率）。使用经典的立体渲染的原理，我们可以渲染出任意射线穿过场景的颜色。因此对于某个视角&nbsp;o&nbsp;发出的方向为&nbsp;d&nbsp;的光线，其在t&nbsp;时刻到达点为：</p> 
<p align="center"><img alt="" height="56" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e609a544f4a149ae98a397cb5973f0d6.png" width="206"></p> 
<p>那么沿这个方向在时间范围(tn​,tf​)&nbsp;对颜色积分，获得最终的颜色值C(r)&nbsp;为：</p> 
<p align="center"><img alt="" height="72" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/da9d88d0c5e374f625429623dba0a69b.png" width="563"></p> 
<p>函数T(t)&nbsp;表示光线从&nbsp;tn​&nbsp;到&nbsp;t&nbsp;累积的透明度 (Accumulated Transmittance)。换句话说，就是光线从tn​&nbsp;到&nbsp;t&nbsp;穿过没有碰到任何粒子的概率。按照这个定义，视图的渲染就是表示成对于&nbsp;C(r)&nbsp;的积分，它是就是虚拟相机穿过每个像素的相机光线，所得到的颜色。</p> 
<p align="center"><img alt="" height="470" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/9d3188bd78780db3030c7444942ed560.png" width="694"></p> 
<p>不过在实际的渲染中，并不能进行连续积分。因此论文通过采用分层采样 (stratified sampling) 的方式对&nbsp;[tn​,tf​]&nbsp;划分成均匀分布的N个小区间，对每个区间进行均匀采样，划分的方式如下：</p> 
<p align="center"><img alt="" height="97" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/ffb899b02683215cccf329b37f855fe0.png" width="521"></p> 
<p>对于采样的样本，论文采用离散的积分方法：</p> 
<p align="center"><img alt="" height="111" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/f21c8c262204fcc81933a618a72e3eda.png" width="657"></p> 
<p>其中，<img alt="" height="27" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/891308a7f37e42863a757c4d87d36f44.png" width="87">是相邻样本之间的距离。下图非常形象地演示了体素渲染的流程：</p> 
<p align="center"><img alt="" height="202" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/44074babccba48c75b33115288d713a9.gif" width="362"></p> 
<p>上述方法就是 NeRF 的基本内容，但基于此得到的结果并能达到最优效果，存在例如细节不够精细、训练速度较慢等问题。为了进一步提升重建精度和速度，论文还引入了下面两个策略来优化一个神经辐射场（Optimizing a Neural Radiance Field ）：</p> 
<ul><li>Positional Encoding (位置编码)：通过这一策略，能够使得 MLP 更好地表示高频信息，从而得到丰富的细节；</li><li>Hierarchical Sampling Procedure (分层采样方案/金字塔采样方案)：通过这一策略，能够使得训练过程更高效地采样高频信息。</li></ul> 
<p>对于Positional Encoding (位置编码)。尽管神经网络理论上可以逼近任何函数，但是通过实验发现仅用 MLP 构成的&nbsp;FΘ​&nbsp;处理输入 (x,y,z,θ,ϕ)&nbsp;不能够完全表示出细节。即：神经网络倾向于学习到频率较低的函数。同时通过将输入通过高频函数映射到高维空间中，可以更好地拟合数据中的高频信息。通过这些发现应用到神经网络场景表达任务中，论文将&nbsp;FΘ​&nbsp;修改成两个函数的组合：</p> 
<p align="center"><img alt="" height="126" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/52e8027f935d7e590127d665ef79db76.png" width="182"></p> 
<p>通过这样的方式可以明显提升细节表达的性能，其中：</p> 
<p><img alt="" height="100" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/ac3ba93127c4c533932caa70139e4f0b.png" width="378"></p> 
<p>论文使用的编码函数如下：</p> 
<p align="center"><img alt="" height="57" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/26eb081a175aa361995ef63f22eac1e6.png" width="561"></p> 
<p>该函数&nbsp;γ(⋅)&nbsp;会应用于三维位置坐标&nbsp;x&nbsp;（归一化到 [−1,1]）和三维视角方向笛卡尔坐标&nbsp;d。在论文中对于&nbsp;γ(x)&nbsp;设置&nbsp;L=10；对于γ(d)&nbsp;设置&nbsp;L=4。因此可以得到对于三维位置坐标的编码长度为：3×2×10=60，对于三维视角方向的位置编码为&nbsp;3×2×4=24，这也与网络结构图上的输入维度相对应。</p> 
<p align="center"><img alt="" height="261" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e57c682ae929de8bd4227b6bd039b96e.png" width="597"></p> 
<p>接下来看看Hierarchical Sampling Procedure (分层采样方案)</p> 
<p>分层采样方案来自于经典渲染算法的加速工作，在前述的体素渲染 (Volume Rendering) 方法中，对于射线上的点如何采样会影响最终的效率，如果采样点过多计算效率太低，采样点过少又不能很好地近似。那么一个很自然的想法就是希望对于颜色贡献大的点附近采样密集，贡献小的点附近采样稀疏，这样就可以解决问题。基于这一想法，NeRF 很自然地提出由粗到细的分层采样方案（Coarse to Fine）。</p> 
<p align="center"><img alt="" height="307" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/940570a622511b6eb1141ef835f417bd.png" width="375"></p> 
<p><strong>Coarse 部分</strong>：首先对于<strong>粗网络</strong>，采样&nbsp;Nc​&nbsp;个稀疏点（c 表示 Coarse），并将公式<img alt="" height="54" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/3a8805e564d2f98200dba8e46458240b.png" width="307">用新的形式修改（加入权重）：</p> 
<p align="center"><img alt="" height="73" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/8f5247f237b05a1ac299ccaec471c74f.png" width="366"></p> 
<p>其中权重需要进行归一化：</p> 
<p align="center"><img alt="" height="75" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d4dbf14ebd5d12efa4bbb6ba5c9eb5f3.png" width="154"></p> 
<p>这里面的权重<img alt="" height="30" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/f46130a9c77ab08e3dc4ef8ac54d23a3.png" width="19">可以看成沿着射线的分段常数概率密度函数 (Piecewise-constant PDF)。通过这个概率密度函数可以粗略地得到射线上物体的分布情况。</p> 
<p align="center"><img alt="" height="294" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/c6dd932f0a3da7e72d4dc8e688f9d508.png" width="574"></p> 
<p><strong>Fine 部分</strong>：在第二阶段，论文使用逆变换采样 (Inverse Transform Sampling)，根据上面的分布采样出第二个集合&nbsp;Nf​，最终我们仍然使用公式<img alt="" height="54" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/3a8805e564d2f98200dba8e46458240b.png" width="307"> 来计算&nbsp;<img alt="" height="30" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/0dbca79cce01a19f30194ffec308475e.png" width="43">。但不同的是使用了全部的<img alt="" height="28" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d5446d77608336cf2a691dd6e62ae0b2.png" width="64">个样本。使用这种方法，第二次采样可以根据分布采样更多的样本在真正有场景内容的区域，实现了重要性抽样 (Importance Sampling)。如上图所示，白色点为第一次均匀采样的点，通过白色均匀采样后得到的分布，第二次再根据分布对进行红色点采样，概率高的地方密集，概率低的地方稀疏 (很像粒子滤波)。</p> 
<p>至于在训练优化函数方面，论文的定义非常简单直接，就是对于粗网络和精网络都用渲染的&nbsp;L2​&nbsp;Loss，公式如下：</p> 
<p align="center"><img alt="" height="67" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/96c2502a6006b8614bdaaac44299a01c.png" width="373"></p> 
<p><img alt="" height="166" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/b327dd6715a3c3349b46e57526d3a7d1.png" width="318"></p> 
<p>与其他的多视角合成（View Synthesis）的方法对比。</p> 
<p>定量对比可以发现NeRF优异于其他经典的渲染方法的。</p> 
<p align="center"><img alt="" height="502" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/440c5f689bbd1d35040867488bc9f941.png" width="949"></p> 
<p>定性对比的效果如下。在合成的数据集上，纹理恢复的效果也是好很多的，跟GT非常的接近。</p> 
<p align="center"><img alt="" height="1200" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/0d63510b4ab4d472a319f780ca971d2a.png" width="949"></p> 
<p>而在真是的数据集上性能也是非常强大的。</p> 
<p align="center"><img alt="" height="1200" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/a95bb86885a9902d8a4f5643ce4272ec.png" width="928"></p> 
<p></p> 
<h2 id="%E4%BB%85%E4%BC%98%E5%8C%96NeRF"><a name="t2"></a>仅优化NeRF</h2> 
<p>这部分介绍的就是仅仅用NeRF来做mapping的工作，image的pose需要已知或者通过其他算法提供。这也是原本的NeRF提出的时候主要的解决问题（三维重建），大量NeRF的各种变种也属于这个类别。</p> 
<h3 id="NeRF%2B%2B"><a name="t3"></a>NeRF++</h3> 
<p><a href="https://arxiv.org/pdf/2010.07492.pdf" rel="nofollow" title="Nerf++: Analyzing and improving neural radiance fields">Nerf++: Analyzing and improving neural radiance fields</a></p> 
<p><a href="https://github.com/Kai-46/nerfplusplus" title="GitHub - Kai-46/nerfplusplus: improves over nerf in 360 capture of unbounded scenes">GitHub - Kai-46/nerfplusplus: improves over nerf in 360 capture of unbounded scenes</a></p> 
<p>&nbsp;NeRF++是在NeRF基础上进行的研究，主要分析了NeRF能够处理三维形状歧义性的原因；以及给出NeRF在大规模无边界场景的360°视角合成的一种处理方案。</p> 
<p align="center"><img alt="" height="427" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/402520a1cc5f712e1ea6f7d342ba9986.png" width="695"></p> 
<p><strong>Shape-Radiance Ambiguity</strong></p> 
<ul><li> <p>问题：使用二维图像做渲染，目标是渲染出新视角下的颜色分布，而无须特别关注真实的几何形状，并且根据三维点到相机原点的射线上所有点的成像特征也无法确定深度，导致几何解的不唯一，存在歧义性。</p> </li><li> <p>NeRF能够处理歧义性的原因在于，不同的观测角度下同一点产生的颜色值不同，采用原始点(颜色)与坐标点(位置)的分开输入和分开进行编码，使得观测角度独立，保证了渲染的细节信息，消除歧义性。</p> </li></ul> 
<p align="center"><img alt="" height="364" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d8b8a909747d5fd6d003c021f85009d6.png" width="725"></p> 
<p><strong>Parameterization of Unbounded Scenes</strong></p> 
<ul><li> <p>问题：较小的场景深度范围内，NeRF可以通过积分(离散求和)还原辐射场和体密度。但户外360°场景的背景景深可能非常大(如山脉、天空)，巨大的动态深度范围使得积分逼近变得困难，无法兼顾近景和远景的分辨率。</p> </li><li> <p>NeRF++将原始NeRF扩展到无边界场景中。利用两个NeRF分别处理前景和背景，解决NeRF前景清晰背景模糊的问题。</p> </li></ul> 
<p align="center"><img alt="" height="442" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/b82e2399843402eb96f249283b3ffe18.png" width="488"></p> 
<p>NeRF++引入逆球面参数化的方法优化无边界场景。球内部使用原始的NeRF进行渲染；对于球外点</p> 
<p align="center"><img alt="" height="52" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/fa34f21f5db0e23aef0ed48d1531f59f.png" width="268"></p> 
<p>重新使用一个四元组来表示，如下：</p> 
<p align="center"><img alt="" height="58" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/1bbd35ca806462197df1f4aa11a89814.png" width="399"></p> 
<p>r能够唯一确定这个方向上的一个球外点。在这样的表示下，四元组中的每个参数都是有界的，1/r相当于将外部点逆转到球内部，然后可套用NeRF进行渲染这个四元组。</p> 
<p>于穿过球体内外两部分的光线分别积分，将两个NeRF的渲染结果进行融合，得到一条射线上的颜色和透明度，因此重新渲染积分公式如下：</p> 
<p align="center"><img alt="" height="286" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/fabadb2c00a7cfc210354c091041f95d.png" width="907"></p> 
<p>在单位球外的点(x,y,z)，通过几何变换即可映射到球面上的点(x',y',z')，该点由圆心o和p点连线与球面交点确定，同时记录距离r。</p> 
<p align="center"><img alt="" height="325" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/cd55cd134a5a3f21040fa1849c5c8101.png" width="439"></p> 
<p>效果如下：确实在一些纹理细节上的恢复比传统的NeRF有提升~</p> 
<p align="center"><img alt="" height="783" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/3dcdbba6b23f3a63235fec79237103c6.png" width="759"></p> 
<p></p> 
<h3 id="Instant-NGP"><a name="t4"></a>Instant-NGP</h3> 
<p><a class="link-info" href="https://dl.acm.org/doi/pdf/10.1145/3528223.3530127" rel="nofollow" title="Instant neural graphics primitives with a multiresolution hash encoding">Instant neural graphics primitives with a multiresolution hash encoding</a></p> 
<p><a class="link-info" href="https://nvlabs.github.io/instant-ngp/" rel="nofollow" title="论文主页">论文主页</a></p> 

<p>下面介绍的比较有意思的两个工作Orbeez-SLAM与GO-SLAM都是基于Instan-NGP来实现实时的渲染的，为此，深入了解一下这个工作~</p> 
<p>这是英伟达一个工作，最快可以将训练 NeRF 模型缩至 5 秒。而这一实现这是来自于论文所提出的多分辨率哈希编码技术（multiresolution hash encoding）。论文在4 个代表性任务中对多分辨率哈希编码技术进行验证，它们分别是<strong>神经辐射场（NeRF）、十亿（Gigapixel）像素图像近似、神经符号距离函数（SDF）和神经辐射缓存（NRC）</strong>。每个场景都使用了 tiny-<span class="words-blog hl-git-1" data-report-view="{&quot;spm&quot;:&quot;1001.2101.3001.10283&quot;,&quot;extra&quot;:&quot;{\&quot;words\&quot;:\&quot;cuda\&quot;}&quot;}" data-tit="cuda" data-pretit="cuda">cuda</span>-nn 框架训练和渲染具有多分辨率哈希输入编码的 MLP。</p> 
<p align="center"><img alt="" height="648" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/95c66e635bd5a43b28d17290cc23e95a.png" width="1050"></p> 
<p>将神经网络输入映射到更高维空间的编码过程，从紧凑模型中提取高近似精度。在这些编码中，通过可训练、特定于任务的数据结构，承担了很大一部分学习任务。进而可以使用更小、更高效的多层感知机。因此，本文提出一种多分辨率哈希编码。</p> 
<p>通过对输入做哈希encoding的方式，来让很小的网络也能学到很高的质量。之所以小网络就可以学到很好结果是因为，它把很多可学习的特征存在了多个不同分辨率的哈希表里，让那些feature来承担了很大部分的学习负担。</p> 
<p>对于神经网络，它们把数据信息存储在了网络权重中，但信息完全存在网络中会导致计算很慢，网络表达能力也会受到的限制。于是考虑把latent feature用结构化的方式存储，比如存在3d grid上，这样表达能力不会受到网络权重数量的限制，每次bp的参数也只和3d grid对应的cell还有小网络相关，训练时间大大缩短。但是，3d grid这种结构化数据其实是很浪费的，因为只有表面信息是有意义的，绝大多数cell是空的。用acorn那样的树形数据结构可以减少内存以及需要训练的数据量，但是训练过程中动态维护树的结构，带来比较大的开销。所以论文就提出了一种多层次的hash encoding方式，来解决像acorn这样的树形结构存在的弊端。它其实就是提出了用多分辨率的哈希表这个数据结构来存feature。</p> 
<p>对于一个3维空间，我们可以认为它是由两个部分的信息组成的。</p> 
<p>1、低分辨率（coarse部分）相当于低频部分，此部分可以大致刻画局部趋势。低分辨率下，网格点与阵列条目呈现 1:1 映射；</p> 
<p>2、高分辨率部分（fine）相当于高频部分，此部分可以刻画局部细节。高分辨率下，阵列被当作哈希表，并使用空间哈希函数进行索引，其中多个网格点为每个阵列条目提供别名。这类哈希碰撞导致碰撞训练梯度平均化，意味着与损失函数最相关的最大梯度将占据支配地位。因此，哈希表自动地优先考虑那些具有最重要精细尺度细节的稀疏区域。</p> 
<p>因此，通过multi-resolution grids就是为了兼顾不同方面（低分辨率局部趋势）（高分辨率局部细节）而设置的结构。​ 最后不同分辨率的特征将被concat在一起。</p> 
<p>不同分辨率下的哈希表都可以并行地查询，进而保证了高效性。</p> 
<p>步骤：</p> 
<p>1、分层（Hashing of voxel verticles）。先把现在的定义域划分成不同resolution的L层，比如下图（1）中的红色和蓝色线就划分了不同resolution的格点。确定好最精细和最粗糙的grid划分的resolution之后，中间层的resolution通过等比级数计算得到。</p> 
<p align="center"><img alt="" height="164" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/40de4627d0a38c3ca33e96ca3ccf56d2.png" width="403"></p> 
<p>这里的b是通过Nmax（最精细resolution）和Nmin（最粗糙resolution）算出来的一个系数。然后l是指第多少层。</p> 
<p align="center"><img alt="" height="403" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/8203194a86c4776cbfa5f0c668e612c9.png" width="842"></p> 
<p>2、hash encoding（Look up - Hashing）。把不同层的grid全都映射到这个层对应的一个哈希表里（如图2所示）。最理想的情况当然是最精细的resolution下，每个格点也能有一个在哈希表上对应的位置来存它的feature，但是这会很费空间。所以这篇文章设定了哈希表最大的一个T。现在蓝色和红色情况下，格点数小于T，所以每一个grid都有一个对应的哈希槽来存它的feature。但如果grid数大于这个T，那通过哈希函数的映射后，很多格点会对应到哈希表上同一个位置。这里为了节省时间/空间，它不对hash collision（哈希冲突）做任何处理，如果算出来哈希值一样，那就用同一个feature来刻画这些格点。</p> 
<p>3、线性插值（Linear interpolation）。每个点都是由周围格点的线性插值来得到自己的feature（如图3所示）。</p> 
<p>4、网络学习（Concatenation and Network learning）。然后它把这个点和它对应的所有层的feature全都concat起来喂给网络去学习。见上图的(4)操作。</p> 
<p>之后论文就对这个处理方式进行了论证，包括F（每个feature的维度），L（multiresolution的层数），T（每层哈希表的最大entry个数）等进行了大量的消融实验。此外，由于不处理hash collision，会出现在较高resolution的层出现很多个格点对应同一个feature的现象。那这就会带来歧义。这就体现了multiresolution的好处，虽然这某几个个格点在这一层对应了同一个feature，但是它俩不太可能在所有层都对应同一个feature。而网络input又是这个点以及它对应的所有feature一起送到网络里的，所以网络在学习的过程中是可以区分不同点的。</p> 
<p>但同时，虽然在比较精细的层，很多点都在优化同一个feature。但是最重要的点，比如nerf里表面的点，它对应的梯度会比空间中那些空的点更大，因此它也会对这个feature的优化起主导作用，从而让真正重要的点的信息去支配这个最精细feature的学习。</p> 
<p>由于本博文主要是关于NeRF的，所以关注&nbsp;NeRF 场景的效果。对于大型的&nbsp;360 度场景（左）以及具有许多遮蔽和镜面反射表面的复杂场景（右）都得到了很好的支持。实时渲染这两种场景模型，并在 5 分钟内通过随意捕获的数据进行训练：左边的一个来自 iPhone 视频，右边的一个来自 34 张照片。效果可以说是很惊艳了，而且这篇论文在本人写这篇博客的时候citation已经达1000+了，也有大量基于这个工作的延申了，故此后续开发直接基于源代码做就好了，这个图结构以及压缩编码的具体原理应该是不需要深入推敲的。</p> 
<p align="center"><img alt="" height="239" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/0411991a849d40f1c02537117aa13e7e.gif" width="787"></p> 
<p></p> 
<h3 id="RO-MAP"><a name="t5"></a>RO-MAP</h3> 
<p><a class="link-info" href="https://arxiv.org/pdf/2304.05735.pdf" rel="nofollow" title="RO-MAP：Real-Time Multi-Object Mapping with Neural Radiance Fields">RO-MAP：Real-Time Multi-Object Mapping with Neural Radiance Fields</a></p> 
<p><a class="link-info" href="https://github.com/XiaoHan-Git/RO-MAP" title="论文主页">论文主页</a></p> 

<p>第一个不依赖于3D先验的单目多对象建图pipeline。同时可以定位object的位置以及渲染。（由于不是相机的自定位只是物体的定位，所以不归为下面SLAM中，但这其实也属于SLAM的一种，Object-SLAM，利用语义等信息来定位以及重建物体）。对于每个检测的物体都单独每个目标都单独训练一个MLP，建立物体级NeRF地图。</p> 
<p align="center"><img alt="" height="433" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/0e0a066caa6031ec38aecbad39bbd2cc.png" width="513"></p> 
<p>整个框架分为物体级SLAM和物体级NeRF两部分。物体级SLAM基于<a href="https://so.csdn.net/so/search?q=ORB-SLAM2&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-view="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=ORB-SLAM2&amp;spm=1001.2101.3001.7020&quot;,&quot;extra&quot;:&quot;{\&quot;searchword\&quot;:\&quot;ORB-SLAM2\&quot;}&quot;}" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=ORB-SLAM2&amp;spm=1001.2101.3001.7020&quot;,&quot;extra&quot;:&quot;{\&quot;searchword\&quot;:\&quot;ORB-SLAM2\&quot;}&quot;}" data-tit="ORB-SLAM2" data-pretit="orb-slam2">ORB-SLAM2</a>实现，识别目标没有使用学习方法，而是使用一种轻量级的手工方法来定位。还采用一种基于稀疏点云的语义信息和统计信息的方法来自动关联多视图观测与目标地标。在估计 了物体级SLAM的边界框和相机姿态后，就可以用NeRF学习物体的稠密几何形状。每当检 测到一个新的对象实例，初始化一个新的NeRF模型（也是用Instant-NGP）。注意，这里的 NeRF不重建整个场景，而是只表示单个对象，也就是可以使用轻量级网络加快训练速度。</p> 
<p align="center"><img alt="" height="427" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/7513f119c8888b60e4a5dba3c5551612.png" width="970"></p> 
<p>实验效果如下：</p> 
<p align="center"><img alt="" height="841" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d50788c2115367b26324301f3189735f.png" width="749"></p> 
<p align="center"><img alt="" height="794" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/0cdcdf43c645264532585d21a8557351.png" width="726"></p> 
<p align="center"><img alt="" height="551" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/82ce02549982a415b5a463c83767d2f4.png" width="754"></p> 
<p></p> 
<h3 id="vMAP"><a name="t6"></a>vMAP</h3> 
<p><a class="link-info" href="https://arxiv.org/pdf/2302.01838.pdf" rel="nofollow" title="vMAP：Vectorised Object Mapping for Neural Field SLAM">vMAP：Vectorised Object Mapping for Neural Field SLAM</a></p> 
<p><a class="link-info" href="https://kxhit.github.io/vMAP" rel="nofollow" title="论文主页">论文主页</a></p> 

<p></p> 
<p>这也是一篇物体级NeRF SLAM方案，同样是为每个目标单独分配一个MLP。vMAP的输入包括RGB图像、深度图、位姿、实例分割结果。位姿由ORB-SLAM3计算， 实例分割由Detic计算，再根据实例分割区域对RGB和深度图进行采样，之后就可以使用 NeRF进行训练和渲染。此外还需要执行一个帧间对象关联，包括语义一致性关联（类别 相同）和空间一致性关联（位置相同），用来判断是否是同一个物体。</p> 
<p>vMAP处理的一个场景最多可以有50个独立的物体，并且有以5HZ的输出更新map。性能上挺不错的~同时论文也展示了在单个GPU下同时训练及优化大量的MLP object model。</p> 
<p align="center"><img alt="" height="571" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/6d33b08aaa09e9bb203056dbac46ebce.png" width="972"></p> 
<p></p> 
<h3 id="Point-NeRF"><a name="t7"></a>Point-NeRF</h3> 

<p><a href="https://arxiv.org/pdf/2201.08845.pdf" rel="nofollow" title="Point-NeRF：Point-based Neural Radiance Fields">Point-NeRF：Point-based Neural Radiance Fields</a></p> 
<p><a href="https://xharlie.github.io/projects/project_sites/pointnerf/" rel="nofollow" title="论文主页">论文主页</a></p> 
<p>传统的NeRF渲染需要很长的时间，因为要求MLP把整个图像的一切都渲染出来，需要对每个场景进行优化。而另一方面，deep multi-view stereo方法可以较快进行场景的重建，因此Point-NeRF就是结合MVS和NeRF，过neural features相关联，使用neural 3D point cloud来渲染，实现训练时间快30倍。</p> 
<p>Point-NeRF使用其他方法获得初始的点云来指导NeRF。Point-NeRF 表现形式为：每个点云都有一个neural feature，而每个neural point都编码了3D几何信息和点表面信息（appearance）。对于每个3D位置，采用MLP网络来累计它的体素密度（volume densiy）以及辐射信息（radiance）。</p> 
<p>初始点云的获得使用了learning-based的MVS。然后采用deep CNN（用图像与2D特征点来做训练）来获取点云特征（这一波操作就属实有点很cv了hhh）。而多个视角下的这些点组成所谓的point-based radiance field。然后通过网络训练如何由这些neural point变成渲染后的三维模型。从下图也确实可以看到，Point-NeRF训练了10k steps（21分钟）的渲染效果要比NeRF训练2天的效果好上不少~</p> 
<p>至于为什么呢？我也感到好奇，难道真的是加入的网络越多，网络越大效果就越好？如果把deep CNN提取特征点，改为非learning提取特征点。MVS产生的点云改为其他方式产生的点云，那是否也是效果更好呢？还是因为是MVS已经恢复出来一个比较好的三维结构，在此上做渲染，所以耗费不多就可以超越NeRF呢？</p> 
<p align="center"><img alt="" height="343" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/a011d5fdcf9ba55663243f6c17d4a9a2.png" width="959"></p> 
<p>论文的主要contribution：</p> 
<ul><li>提出了以神经点云表征为基础的神经渲染方法。相较于 NeRF，Point-NeRF 的MLP 额外使用了神经点云（neural 3D point cloud）作为输入。这样做的好处是将三维场景表征的任务从MLP中分离出来，加快了训练速度。</li><li>结合传统 MVS 方法和CNN图像表征网络，Point-NeRF 的初始点云可以通过可泛化的神经网络由图像和其相应位姿推理得到。经过针对每一个场景的微调，Point-NeRF得以结合传统三维重建方法和神经渲染方法的优势，快速有效地获得高质量渲染结果。</li><li>传统 MVS 方法生成点云有时包含部分噪音以及表面孔洞，影响最终的神经渲染结果，本文通过对神经点云进行增长（growing）和剪枝（pruning）的方法解决这一问题。如上图右侧，COLMAP产生的点云是有空洞的，但是Point-NeRF就可以直接恢复得良好（那问题来了，输入多线激光雷达点云或者livox的点云也行吗？）</li></ul> 
<p>Point-NeRF的ppeline如下图所示。以图像序列及其对应的相机位姿为输入，通过 MVSNet 预测这些图像的深度图从而生成一个初始点云，再通过一个 VGG 网络提取多级图像特征将初始点云扩展为神经点云。这个初始的神经点云。为了合成新视图，只在神经点云附近进行可微射线积分和计算阴影。在每个阴影位置，聚集K个神经点邻域的特征，并计算辐射率和体密度。整个过程可以端到端训练。</p> 
<p align="center"><img alt="" height="374" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d61a432d482d7c42f756e4987ad14486.png" width="864"></p> 
<p>至于具体的神经点云的渲染以及点云的增长和剪枝此处就不介绍了。下面直接看看它的实验效果。首先是定量分析。这里虽然有标出point-NeRF不同代数的结果，但是没有标出其他方法的代数。以及还有一个很大的疑问就是代数跟计算量相关联吗？就是会不会存在一种情况就是：Point-NeRF的参数量远大于某个baseline，而计算量也大于某个baseline。那如果代数*单代的计算量并不能划等号，单纯这样的对比好像没有什么意义。就相当于我用台超算跑一个小时比你用2048GPU跑10个小时要好，那能说明什么？</p> 
<p>目前看来NeRF跟之前做过的超分是很类似的，都只是评估相似度，但是三维重建不是应该评价深度恢复的精度吗？还是说以及默认learning恢复的精度比较好，单纯只评估恢复的场景的纹理相似度？</p> 
<p align="center"><img alt="" height="372" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/37d5e75f48c33b8f9ab15318feb0702a.png" width="855"></p> 
<p>定性分析：还是存在定量的问题啦~至于视觉效果，选一下总能选到比较好的~</p> 
<p align="center"><img alt="" height="798" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/090ba995bd82f22e25da2c4a7946a919.png" width="879"></p> 
<p>下图的这个实验比较有意思，这其实就是跟depth completion比较类似，或者image inapinting很像。理论上按这个思路，通过如此稀少的点就重建稠密深度，那完全就可以用于lidar或livox了。</p> 
<p align="center"><img alt="" height="258" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/9824f83abf3813eb71dcd54be7dec1b2.png" width="535"></p> 
<p></p> 
<h3 id="NeRF-SLAM%C2%A0"><a name="t8"></a>NeRF-SLAM&nbsp;</h3> 

<p><a href="https://arxiv.org/pdf/2210.13641.pdf" rel="nofollow" title="NeRF-SLAM：Real-Time Dense Monocular SLAM with Neural Radiance Fields">NeRF-SLAM：Real-Time Dense Monocular SLAM with Neural Radiance Fields</a></p> 
<p><a href="https://github.com/ToniRV/NeRF-SLAM" title="论文主页">论文主页</a></p> 
<p>这是第一个实现基于dense SLAM与NeRF的环境重建的pipeline，但它的NeRF部分其实也是做mapping的工作。</p> 
<p>基于learning的单目三维重建已经是比较的成熟。但是单目稠密SLAM也好，直接进行单目深度估计也好，得到的深度图很多数值是不能用的（难以用来恢复几何geometrically和光度photometrically较精确的3D map）。而NeRF的发展，带来了光度恢复较好的优势（哦！这大概也就是NeRF系列的论文只看光度恢复效果的原因？），但是却不能实时，同时也是需要ground truth pose来作为输入的。（虽然像BARF这些工作也证明了pose并不是必须的）</p> 
<p>本文利用单目稠密SLAM与分层体积神经辐射场（hierarchical volumetric neural radiance fields）的各自优势，通过单目dense SLAM来提供信息（pose与depth map，同时带有它们相应的uncertainty），利用这些信息进行深度边缘协方差加权的稠密深度损失训练，进而来实现实时构建环境的神经辐射场。通过所提出的uncertainty-based depth loss来实现良好的光度恢复以及几何结构的恢复。</p> 
<p>整个算法的流程如下图所示</p> 
<p align="center"><img alt="" height="581" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/55ab50be2f4e2a40b6ecbdfb6b8de1f5.png" width="412"></p> 
<p>NeRF-SLAM的输入是连续的单目序列，采用Droid-SLAM （<a class="link-info" href="https://github.com/princeton-vl/DROID-SLAM" title="DROID-SLAM：Deep Visual SLAM for Monocular, Stereo and RGB-D Cameras">DROID-SLAM：Deep Visual SLAM for Monocular, Stereo and RGB-D Cameras</a>，此处不展开介绍，下方给出该论文的视频）。Droid-SLAM的流程种也就是包括了图中的这个ConvGRU来估计稠密光流和光流权重，之后就是一个稠密BA问题估计位姿和深度，并将系统方程线性化为近似相机/深度箭头块状的稀疏Hseeian矩阵（以及舒尔补等处理了）最后把图像、位姿、深度图、位姿不确定性、深度不确定性全部馈送给NeRF进行训练。</p> 

<p></p> 
<p>定量实验的结果如下。光度学误差用PSNR来对比，几何误差用L1，所谓的L1是：we use the L1 depth error between the estimated and the ground-truth depth-maps as a proxy for geometric accuracy (Depth L1)，应该也就是深度精度评估中的depth error了</p> 
<p align="center"><img alt="" height="502" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/6fc5e224cc81488a5c1d08951976f9ff.png" width="903"></p> 
<p>关于depth error，常用的指标应该是下面几个。而所谓的L1应该是Mean Absolute Error（绝对平均误差）<img alt="" height="48" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/ea3ba73690a61a9f875e529f070683ce.png" width="138"></p> 
<p align="center"><img alt="" height="504" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/ae09f0fbe20ac599e066a4f24d0601ae.png" width="906"></p> 
<p>而视觉对比的话，则是如下：</p> 
<p align="center"><img alt="" height="792" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/99b71265109edcc8167b96bc5b02680d.png" width="417"></p> 
<p>而下面这个对比实验比较有意思：作者的应该就是noisy pose与noisy depth了，视觉效果上还是比较好的，可以跟用了GT depth的持平。但是跟GT Pose No Depth相比好像差别不大~</p> 
<p align="center"><img alt="" height="483" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/8593a09464b54d17246f58d4af0ad5ce.png" width="414"></p> 
<p>论文也分析了这个framework的缺陷就是内存占用比较大~</p> 
<p>感觉这篇论文还是带来一些inspiration的，应该也算是NeRF进军SLAM的引路？</p> 
<p></p> 
<h3 id="SMERF"><a name="t9"></a>SMERF</h3> 
<p><a href="https://arxiv.org/pdf/2312.07541.pdf" rel="nofollow" title="SMERF: Streamable Memory Efficient Radiance Fields for Real-Time Large-Scene Exploration">SMERF: Streamable Memory Efficient Radiance Fields for Real-Time Large-Scene Exploration</a></p> 
<p><a href="https://smerf-3d.github.io/" rel="nofollow" title="论文主页">论文主页</a></p> 

<p>该成果最主要的突破就是没有利用3D Gaussian Splatting（关于Gaussian Splatting请见下面介绍）技术就可以实现NeRF大场景在笔记本以及手机端的实时流式加载和渲染。主要是通过分层模型（a hierarchical model）与蒸馏训练（distillation training strategy）。&nbsp;</p> 
<p>SMERF是以<a class="link-info" href="https://arxiv.org/pdf/2302.12249.pdf" rel="nofollow" title="Merf: Memory-efficient radiance fields for real-time view synthesis in unbounded scenes">Merf: Memory-efficient radiance fields for real-time view synthesis in unbounded scenes</a>为基础的，然后构建自主约束的MERF子模块的分层结构。由于还涉及到其他的结构，暂时理论部分看得比较迷糊，这里就先跳过了~</p> 
<p>根据论文的描述，SMERF的提出有几个比较重要的研究基础：</p> 
<p><em><strong>1、提升NeRF的速度</strong></em>，NeRF虽然在效果上还不错，但是其在训练速度以及实时方面都存在耗时过长的问题，所以也就针对这个问题出现了不少的研究方案，比如通过预先计算一些与视角无关的颜色以及透明度，并将他们存储到一些稀疏的体数据结构，或者将一个大的场景分解为一些小的MLPs网格，可以提升训练以及渲染的效率，但是这种以空间换时间的做法一般会导致内存的消耗增加。</p> 
<p>所以针对如何平衡内存使用以及渲染时间这个问题，又产生了类似MERF这方案，该方案就研究如何在受限的内存上实现这种MLPs网格的快速表达，这也是SMERF的研究基础。</p> 
<p><strong><em>2、提升NeRF的质量</em></strong>，NeRF在抗锯齿，去除毛刺以及稳定性方面提出了很多方法，但是这种方案在高分辨的情况下难以满足实时渲染的效率要求，因而论文就考虑使用蒸馏技术将训练好的模型蒸馏到MERF的子模型中，从而来提升渲染速度。</p> 
<p><strong><em>3、基于栅格化的视图合成</em></strong>，其实在这个方面比较具备代表性的就是3D Gaussian Splatting技术，这个技术其实是介于点云以及NeRF中间的一种表达方式，在表达上没有直接使用点，也没有用辐射场，而是使用了类似高斯椭圆这种“软点”，然后再利用神经网络训练优化进行这些软点的融合和叠加，从而取得比较好的表达效果，同时又可以利用当前GPU的栅格化渲染的能力，所以可以实现实时渲染，但是这种方法会在一些地方形成比较明显的“毛刺”，这也是SMERF重点对比的对象。</p> 
<p><strong><em>4、大尺度场景NeRF表达</em></strong>，NeRF最早的构建方式主要还是针对围绕对象的局部场景，但是要扩展到更大的场景目前在这个方面的两个主要做法就是：第一、融合抗锯齿技术的基于网格的辐射场；第二、基于相机的位置将大的场景分成多个区域的场景，分开为每个区域训练NeRF，但是这里面需要针对一些重迭的区域设置冗交叉的场景，所以难以扩展到城市级别。</p> 
<p>而在SMERF的方案中，其将整个场景氛围多个子模型区域，每个子模型使用局部坐标，每个子模型都可以表达整个场景，但是大部门的模型容量只用于自己归属的区域，然后每个么分区中都实例化了一系列和当前空间位置铆定的MLPs权重，参数化延迟外观模型，它是一个渲染期间和相机位置相关的三线性插值函数，下图的b&amp;c呈现的就是相机位于子模型内和子模型外的可视化处理方式。</p> 
<p align="center"><img alt="" height="341" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/5d30619146566d2ee3e159f87e8f0173.png" width="941"></p> 
<p><strong><em>5、蒸馏和NeRF</em></strong>，蒸馏的核心就是通过训练一个小模型来近似一个大模型的能力，把大场景的MLPs蒸馏到一个小的网格MLPs中以及把一些代价比较高的二次光线反射能力蒸馏到一个清凉的模型中。而Google SMERF的关键工作就是要将预训练好的大尺度、高质量的Zip-NeRF模型蒸馏到一系列的类似MERF的子模型中。</p> 
<p align="center"><img alt="" height="314" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/52944a980b17b387944c780bbff4a4db.png" width="837"></p> 
<p>下面看看实验效果</p> 
<p align="center"><img alt="" height="635" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/8c4469325fd898b368cce6c83774f325.png" width="1011"></p> 
<p align="center"><img alt="" height="524" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/691d9ef609bb88e4b1e171b16ae7ed11.png" width="1031"></p> 
<p>说实话，这些图上我没有看出很明显的差异（就是一些模糊，sharp不sharp的区别吧？）数值指标差异也不太大，但是论文网站中给出的示例，可以发现根据视角的变化，后台持续在加载一系列的RAW文件，然后马上渲染出三维结构，这点倒是很惊艳的。</p> 
<p>当然啦，此处所谓的大场景更多是一种相对的说法，指的是全部的室内空间（但也比下面几个工作中提到的large scale要大些~论文中提到最大可达300平米），而不是像城市那样的大级别的地图，且目前主页只是demo没有代码开源，这也是目前看到的第一个在手机端可以实现实时的NeRF渲染的工作了。</p> 
<p></p> 
<h3 id="Nerfies"><a name="t10"></a>Nerfies</h3> 
<p><a href="https://openaccess.thecvf.com/content/ICCV2021/papers/Park_Nerfies_Deformable_Neural_Radiance_Fields_ICCV_2021_paper.pdf" rel="nofollow" title="Nerfies：Deformable Neural Radiance Fields">Nerfies：Deformable Neural Radiance Fields</a></p> 
<p><a href="https://nerfies.github.io/" rel="nofollow" title="论文主页">论文主页</a></p> 

<p>这是第一个可变形场景的NeRF（主要就是针对场景并不是刚体的，是可以形变的），如下图所示，就是从多个不同的视角下拍的图片，合成一个新的视角。这是通过continuous volumetric deformation field以及对应的elastic regularization来实现的。</p> 
<p align="center"><img alt="" height="280" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/2961770407bdd046429c968a1e2e69c3.png" width="894"></p> 
<p>Pipeline 方面应该就是在传统的NeRF前面多加了个code以及deformation field进而生成canonical（范式） 的表达，利用这个表达来反应不同的观测量。</p> 
<p align="center"><img alt="" height="306" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d7cfa271f9905ddb5e6cc0a54ab67ab4.png" width="1029"></p> 
<p></p> 
<h2 id="%E4%BB%85%E4%BC%98%E5%8C%96%E4%BD%8D%E5%A7%BF"><a name="t11"></a>仅优化位姿</h2> 
<p>与采用NeRF来进行mapping相反，这个类型的工作是使用NeRF反过来优化pose，但如果只是设计损失函数再梯度回传的话，定位精度应该很难和传统SLAM比。</p> 
<p>Photorealistic and differentiable rendering of NeRF enables many applications such as direct pose optimization and training set expansion！</p> 
<h3 id="iNeRF"><a name="t12"></a>iNeRF</h3> 

<p><a href="https://arxiv.org/pdf/2012.05877.pdf" rel="nofollow" title="INeRF：Inverting Neural Radiance Fields for Pose Estimation">INeRF：Inverting Neural Radiance Fields for Pose Estimation</a></p> 
<p><a href="https://yenchenlin.me/inerf/" rel="nofollow" title="论文主页">论文主页</a></p> 
<p>本文就是使用NeRF来反过来优化位姿。通过image获取camera相对于3D 物体或者场景的6-DoF pose。通过NeRF渲染的图像与observed image的光度误差来计算位姿。</p> 
<p>iNeRF的输入有三个：</p> 
<ol><li>当前观测的图像</li><li>初始估计的位姿</li><li>NeRF表征的3D场景或者oject</li></ol> 
<p>这其实就有点像PTAM中的2D-3D model alignment，用直接法来估算pose，只是需要解决如何构建NeRF与image直接的光度误差。那么这个思路就非常的直接了~如下图所示。通过不停的迭代，直到渲染的image与观测的image对齐</p> 
<p align="center"><img alt="" height="447" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/ad124f30d986f26f442313d411979ff0.gif" width="968"></p> 
<p>当然这个计算量应该是巨大的，INeRF中还通过一些策略来sampling合适的point来构建优化。同时采用INeRF也可以给NeRF提供pose（这应该就是鸡生蛋、蛋生鸡的最基本的SLAM问题）。整个pipeline如下图所示</p> 
<p align="center"><img alt="" height="292" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/674692e5ebe5acbb6a90cdd83518359b.png" width="846"></p> 
<p>前面和传统的NeRF一样，只不过后面渲染图像和真实图像的光度误差反过来又优化位姿。</p> 
<p></p> 
<p>一个定性的实验如下：其中的百分比代表了用了百分之多少的数据来训练NeRF，而后面+INeRF就代表用INeRF的pose来提供训练的pose。右侧四栏其实可以看到用了INeRF来提供pose的效果更好。</p> 
<p align="center"><img alt="" height="422" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/c8dd2e2794b6c8b621474d88c0e54365.png" width="1130"></p> 
<p>至于pose估计的精度嘛~感觉这个验证不够说服力</p> 
<p align="center"><img alt="" height="219" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/73ae402f28a288385f13100604a9294d.png" width="584"></p> 
<p>个人感觉这篇论文是提供了一个很好的思路，但是实验感觉没有太大的说服力，也没有很好验证算法的有效性。</p> 
<p></p> 
<h3 id="NeRF-Loc"><a name="t13"></a>NeRF-Loc</h3> 
<p><a href="https://arxiv.org/pdf/2304.07979.pdf" rel="nofollow" title="NeRF-Loc：Visual Localization with Conditional Neural Radiance Field">NeRF-Loc：Visual Localization with Conditional Neural Radiance Field</a></p> 
<p><a href="https://github.com/JenningsL/nerf-loc" title="论文主页">论文主页</a></p> 
<p><a href="https://github.com/TencentYoutuResearch/NeRF-Loc" title="GitHub - TencentYoutuResearch/NeRF-Loc: Code for ICRA2023 paper &quot;NeRF-Loc: Visual Localization with Conditional Neural Radiance Field&quot;">GitHub - TencentYoutuResearch/NeRF-Loc: Code for ICRA2023 paper "NeRF-Loc: Visual Localization with Conditional Neural Radiance Field"</a></p> 
<p>这也是一篇NeRF模型和图像直接匹配进行定位的文章。论文的框架如下。这篇论文是re-localization，那应该只是一个解决重定位的问题（不过INeRF本质上也是一个重定位而不是轨迹推进吧）？利用学习到的条件NeRF三维模型，计算3D描述子，直接与图像匹配，实现由粗到精的视觉定位。</p> 
<p>类似于INeRF，也是采用NeRF来作为3D场景的表达（不同的是，INeRF只能在pre-training scene下定位，泛化能力与场景的先验之间是互相矛盾的~），通过利用feature matching以及场景对应的坐标，模型学习可推广知识和场景先验。也提出一个appearance adaptation layer的结构解决training和testing之间的gap。</p> 
<p align="center"><img alt="" height="338" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e240116395d5a3d3160d352c2a9164b8.png" width="830"></p> 
<p>整个Pipeline里场景表示为可泛化NeRF，从3D场景中随机采样点，并将3D点馈送到NeRF模型中以生成3D描述子。然后直接根据3D和2D描述符来匹配，由PnP解算相机位姿。因此大大提升了泛化能力以及对pre-training scene的要求降低了。<br> 作者采用conditional NeRF model，它可以产生任意3D locations下的3D特征。为了保持泛化性，该conditional NeRF model建立在一个支持集（support set）上，支持集由几幅给定的参考图像和深度图组成。基于这个支持集来产生3D描述子。模型不仅在多个场景的联合训练学习了一般匹配，还在每个场景优化过程中以残差的方式记忆了基于坐标的场景。</p> 
<p>论文中conditional NeRF模型的架构，通过新视图合成和3D-2D匹配来共享任意三维位置的特征生成器。</p> 
<p>为了解决训练支持图像和查询图像之间的外观变化，还提出了一个外观自适应层，在匹配之前查询图像和三维模型之间的图像风格对齐。</p> 
<p>虽然前面吹嘘了一顿。但从contribution中可以看到，所谓的conditional NeRF model是multi-scenes pretraining then per-scene finetuning。简而言之就是“50步笑百步”，总之就是比INeRF等更好🤭</p> 
<p>而提出的conditional NeRF模型架构如下：</p> 
<p align="center"><img alt="" height="301" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/8851a4c2fd4c9b99b50148eb3032c68c.png" width="1031"></p> 
<p>appearance adaptation layer的结构如下：</p> 
<p align="center"><img alt="" height="197" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/6f7803532079e47c52420c7ab53d9ccc.png" width="684"></p> 
<p>这里就不深入去看了。直接看看结果如何：定量分析（localization基本就是只看定量分析啦~），确实比其他的learning的方法都好些（当然是没有跟非learning的方法对比的，同样的实验也是很不solid的）</p> 
<p align="center"><img alt="" height="318" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/6fddea0c9bca04d1c1fa272a0c0a9db6.png" width="962"></p> 
<p align="center"><img alt="" height="541" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/de29dc2eebc5321e3c764c85e0417f7c.png" width="712"></p> 
<p></p> 
<h3 id="Loc-NeRF"><a name="t14"></a>Loc-NeRF</h3> 

<p><a href="https://arxiv.org/pdf/2209.09050.pdf" rel="nofollow" title="Loc-NeRF：Monte Carlo Localization using Neural Radiance Fields">Loc-NeRF：Monte Carlo Localization using Neural Radiance Fields</a></p> 
<p><a class="link-info" href="https://github.com/MIT-SPARK/Loc-NeRF" title="论文主页">论文主页</a></p> 
<p>这是将Monte Carlo定位与NeRF结合的一篇工作。大部分的NeRF-based 的定位方法需要较好的初值位姿，这其实是很搞笑的，一个定位系统每次计算都需要一个良好的位姿作为输入（甚至ground truth pose），那就没有意义了。因此本文采用Monte Carlo来提供NeRF-based localization所需要的初值。由于这篇论文本质上就是多加了蒙特卡洛而已，所以理论甚至连图都没有可以展示的，也没有跟其他算法对比定位的精度~</p> 
<p></p> 
<h3 id="NeRF-VINS"><a name="t15"></a>NeRF-VINS</h3> 

<p><a href="https://arxiv.org/pdf/2309.09295.pdf" rel="nofollow" title="NeRF-VINS：A Real-time Neural Radiance Field Map-based Visual-InertialNavigation System">NeRF-VINS：A Real-time Neural Radiance Field Map-based Visual-InertialNavigation System</a></p> 
<p>这项工作是OpenVINS的扩展（huangguoquan老师团队的工作），首先离线训练NeRF，然后基于NeRF地图进行定位和导航。充分利用NeRF新视角合成的能力，处理有限视角和回环问题（感觉更像是用NeRF来做回环匹配中的一环，其余应该就是原本的Open-VINS），实现基于NeRF地图的定位和导航规划。同时要求整个系统可以在嵌入式设备上运行。</p> 
<p>传统的基于关键帧进行定位的策略，由于FOV较小，容易陷入局部优化，因此效果比较差。因此本文提出了基于NeRF的VINS，采用基于滤波的优化框架来处理单目image、IMU以及NeRF合成的地图。同时可以pose estimation的频率可达15HZ（在Jetson AGX平台上）。</p> 
<p>其实思路很简单，就是合成当前图像的临近视角图像，用这两幅图像进行匹配和定位，特征提取使用的是SuperPoint。整篇论文其实更像一个工程问题，为了在嵌入式设备上落地，用了大量的TRT、CUDA等技巧，生成图像的时候为了实时运行也降低了分辨率。</p> 
<p align="center"><img alt="" height="367" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/03f95470673c42d221441e8b9e9973ff.png" width="507"></p> 
<p>实验效果如下：可以看到论文所提出的算法确实效果比较优异，比VINS-Fusion、ROVIO、OpenVINS等都要好不少。</p> 
<p align="center"><img alt="" height="349" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/ed787855e6b632290956ee031d3d5d8c.png" width="974"></p> 
<p>并且对于环境的变换也有较好的robustness（当然，这个所谓的环境变换个人认为比较牵强，某种程度上还是同一个环境，但这也是learning的局限了）。</p> 
<p align="center"><img alt="" height="261" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/8089e34e5e08cdf240d144a9c293d807.png" width="779"></p> 
<p>个人认为本文比前面几篇NeRF-localization虽然创新性不一定好很多，但至少实验是有说服力，且实际很多的。但是个人觉得NeRF做localization不是很有必要，虽然NeRF-VINS实验上取得了比非learning的效果要好，但是这也可能只是单一的场景，且以大量的计算量与对场景的预学习带来了，实用性还是不如传统方法。</p> 
<p></p> 
<h2 id="%E4%BD%8D%E5%A7%BF%E5%92%8CNeRF%E8%81%94%E5%90%88%E4%BC%98%E5%8C%96"><a name="t16"></a>位姿和NeRF联合优化</h2> 
<p>将位姿和NeRF放到一起优化，也就是SLAM中的localization与mapping。在NeRF SLAM应用里，位姿和NeRF联合优化是最主要的方向</p> 
<h3 id="iMAP"><a name="t17"></a>iMAP</h3> 

<p><a href="https://arxiv.org/pdf/2103.12352.pdf" rel="nofollow" title="iMAP：Implicit Mapping and Positioning in Real-Time">iMAP：Implicit Mapping and Positioning in Real-Time</a></p> 
<p><a href="https://github.com/tymoteuszb/implicit-slam" title="论文主页">论文主页</a></p> 
<p>这是首个基于RGB-D相机，用MLP做场景表征实时SLAM系统。传统的稠密建图<a href="https://so.csdn.net/so/search?q=SLAM&amp;spm=1001.2101.3001.7020" title="SLAM">SLAM</a>使用占用栅格图 occupancy map 或者 signed distance function 做场景表征，占用的内存空间很大；为此，论文提出利用一个MLP网络达到了整个场景的表征，然后给定相机视野，可以恢复给定角度下的图片。 因此，在保存地图时，不需要再保存整个房间的稠密的点云了，只需保存1M的网络参数。 甚至可以渲染房间各个地方的视野。&nbsp;</p> 
<p>论文验证MLP可以作为RGBD SLAM的唯一场景表征。同时也是第一个既优化NeRF又优化位姿的NeRF SLAM方案（虽然前面的abstract和introduction等都没有提及NeRF，但所采用的Implicit Scene Neural Network就是NeRF），基于RGBD跟踪，同时优化NeRF和位姿。论文采用PTAM的框架，两个线程，一个负责tracking，一个负责建隐式表征地图。论文里面的地图和常用的slam的地图不一样，这里没有保存地图的点云信息（关键点或者稠密点云），只有一个网络用来表征地图。传统的tracking都是根据显式地图里面保存的信息进行tracking的，但是现在没有显式地图。</p> 
<p align="center"><img alt="" height="293" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e8e16bc051ad4ae815d7ca559a289814.png" width="548"></p> 
<p>Tracking&nbsp;固定网络（场景表征），优化当前帧对应的相机位姿（就是经典的2D-3D model alignment用RGB-D与逆渲染深度进行匹配计算出pose的增量）；Mapping&nbsp;对网络和选定的关键帧做联合优化。优化的损失函数也包括光度损失和深度损失两部分，后面很多工作也都是使用这两个损失。针对网络参数和相机位姿做联合优化（网络的参数其实就是对应的map，所以就是map与pose的联合优化）。使用ADAM优化器，使用的loss是光度误差和几何误差的加权。</p> 
<p>其中定义的光度误差（photometric error）：</p> 
<p align="center"><img alt="" height="138" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d9c40c74e9bbc72a0b95d02de1ae5efe.png" width="418"></p> 
<p>几何误差 geometric error，使用到了深度的方差 :</p> 
<p align="center"><img alt="" height="168" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/9c9a8519a3a3c09b32dbcd73d48f091b.png" width="418"></p> 
<p>具体的关键帧选取策略，是用逆渲染深度与RGBD获取的深度值比对，超过一定阈值则认为是关键帧。</p> 
<p>同时论文也验证了iMAP在SLAM建图中可以进行很好的空洞补全。</p> 
<p align="center"><img alt="" height="444" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/2bc709525fd11e99a10bdd1ad5f0c971.png" width="568"></p> 
<p align="center"><img alt="" height="834" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/60a7dcb6f372ad11eb958f9475ef9b96.png" width="847"></p> 
<p>同时了，论文也在TUM数据集上对定位精度进行了验证：</p> 
<p align="center"><img alt="" height="165" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/bb22ec8df0521454178b45eb4c1d4383.png" width="450"></p> 
<p>作者强调虽然定位精度不够，但是mapping的效果还是比较好的~</p> 
<p align="center"><img alt="" height="316" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/a0ca1959eb91fc17c7f55b57154a4d46.png" width="437"></p> 
<p></p> 
<h3 id="BARF"><a name="t18"></a>BARF</h3> 

<p><a href="https://arxiv.org/pdf/2104.06405.pdf" rel="nofollow" title="BARF：Bundle-Adjusting Neural Radiance Fields">BARF：Bundle-Adjusting Neural Radiance Fields</a></p> 
<p><a href="https://chenhsuanlin.bitbucket.io/bundle-adjusting-NeRF/" rel="nofollow" title="论文主页">论文主页</a></p> 
<p>传统的NeRF训练需要非常精确的位姿，而NeRF SLAM反向传播优化位姿时，对位姿初值很敏感，容易陷入局部最优。本文提出了Bundle-Adjusting NeRF (BARF) ，可以用不完美的（甚至不知道）相机位姿进行训练，同时学习三维表示（reconstruction，就是mapping）和配准相机帧（registration，也就是localization）。对于传统的sfm或者SLAM问题，就是把定位与建图用BA来进行处理计算的，因此，这篇文章也将BA引入NeRF SLAM的工作，给定不完美的位姿也可以训练NeRF。主要工作是应用传统图像对齐理论（image alignment）来联合优化位姿和NeRF，并且提出一个由粗到精的策略来优化位姿，使其对位置编码的噪声不敏感。</p> 
<p align="center"><img alt="" height="469" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/90007364d9dc7f097e48e30abcf68c6c.png" width="444"></p> 
<p>对于经典的图像对齐求pose，其实就是下面的光度误差最小化：</p> 
<p align="center"><img alt="" height="76" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/27b194324c682248aa892f3fdc8ceb1a.png" width="318"></p> 
<p>W就是warp function从2维映射到2维，由p维向量作为权重参数化，由于是个非线性问题，可以用梯度下降法，其中</p> 
<p align="center"><img alt="" height="52" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/bdbd8b5cb5c571f33db4ad12cff21827.png" width="432"></p> 
<p>如果用随机梯度下降法A就是一个标量学习率，而J(&nbsp;dsteepest descent imag)则可以表示为：</p> 
<p align="center"><img alt="" height="84" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/02a089509b463e65c7ec9a66794dfb2b.png" width="301"></p> 
<p>其中<img alt="\frac{\partial W(x; \textbf{p})}{\partial \textbf{p}} \in R^{2 \times P}" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/eq">是warp雅可比矩阵限制对预定义warp的像素位移。基于梯度方法的配准核心是图像梯度<img alt="\frac{\partial \mathcal{I}(\textbf{x})}{ \partial \textbf{x}} \in R^{3 \times 2}" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/eq(1)">建模了一个局部的逐像素的表面和空间位移之间的线性关系，经常由有限差分来估计。显然的是如果每像素的预测之间有关系（即信号是光滑的），那么<img alt="\Delta \textbf{p}" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/eq(2)">的估计会更有效。</p> 
<p align="center"><img alt="" height="412" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/ebc21545041a0b6d53db1423198bc356.png" width="451"></p> 
<p>因此，通过在配准的早期阶段模糊图像，有效地扩大吸引区域和smoothening the alignment landscape，实践了从粗到细的策略。</p> 
<p>另外一种计算P的方式，就是采用神经网络来学习coordinate-based image representation，神经网络参数是<img alt="\Theta" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/eq(3)"></p> 
<p align="center"><img alt="" height="88" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/c9df901f72abb265c6a874821624f59c.png" width="304"></p> 
<p>或者对每个图分别学一个p：</p> 
<p align="center"><img alt="" height="82" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/a69f56cd3aa1b98e946120ad8aa09397.png" width="345"></p> 
<p>神经网络使得梯度不再是数值估计而是网络参数对位置的偏导，不再依赖图像，这使得能泛化到三维情况。（这个推论有点没搞懂。。。）而后续的基于NeRF来对p进行求解，就是经过一系列推导得出：</p> 
<p>一个相机的参数<img alt="p \in R^6" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/eq(4)">，而相机坐标系下的x也可以通过W映射变到世界坐标系下，那么颜色可以写成关于像素坐标u和相机位姿p的函数</p> 
<p align="center"><img alt="" height="88" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e214526c9a2a3a44cf890e4b2ce42921.png" width="738"></p> 
<p>这个网络参数<img alt="\Theta" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/eq(3)">就是学习的神经辐射场的三维表示。如果有M张图，那么目标就是优化NeRF学习三维表示，并且优化相机位姿<img alt="\left \{ {p_i} \right \} _{i=1}^M" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/eq(5)"></p> 
<p align="center"><img alt="" height="67" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/9694e064e835880fa58f23794ec13441.png" width="354"></p> 
<p>同样地可以推导出J的表达式用于更新p</p> 
<p align="center"><img alt="" height="79" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/97a77aa2c0cc92b6d15d7b424420864d.png" width="472"></p> 
<p>接下来看看实验。如下图所示。通过给gt pose加入高斯噪声来获得imperfect pose，可以看到BARF确实可以handleimperfect pose而传统的NeRF就会出现比较明显的失真。&nbsp;</p> 
<p align="center"><img alt="" height="426" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/eed5ea7a146573009c8ccc82eb797f7f.png" width="927"></p> 
<p align="center"><img alt="" height="547" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/560d447c4aefe7523faf8855fe0327c9.png" width="892"></p> 
<p>至于pose error方面，并没有有效的实验支撑~基本是要imperfect pose（加了高斯噪声的GT pose）个人认为这其实不够说服力的~</p> 
<p></p> 
<h3 id="NeRF--"><a name="t19"></a>NeRF--</h3> 
<p></p> 
<p><a href="https://arxiv.org/pdf/2102.07064.pdf" rel="nofollow" title="NeRF--：Neural Radiance Fields Without Known Camera Parameters">NeRF--：Neural Radiance Fields Without Known Camera Parameters</a></p> 
<p><a href="https://nerfmm.active.vision/" rel="nofollow" title="论文主页">论文主页</a></p> 
<p>没有相机参数（包括内参和位姿），只有RGB图像时无法训练NeRF。因此NeRF--提出将相机内参、外参（位姿）设置成可学习的参数，其余部分与NeRF步骤相同。</p> 
<p align="center"><img alt="" height="321" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/f23aab0a51f5a7eeb59b53c05810f2cb.png" width="685"></p> 
<p>将相机内参和外参设置为可学习的参数，在训练时先将相机参数设为一个固定的初始化值，通过这个相机参数和并根据NeRF射线积分，从而获得对应点的体密度和RGB，获得完整图像后计算光度误差。NeRF--可以未知相机的RGB图像来端到端地训练整个pipeline。</p> 
<p align="center"><img alt="" height="292" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/767857aae006b841646174b19c655602.png" width="703"></p> 
<p>论文将NeRF--的framework建模为：</p> 
<p align="center"><img alt="" height="60" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/9268bac4e441d78140c7382fafc8e352.png" width="305"></p> 
<p>其中Π 代表了相机的参数，包括了内参与6DoF pose.Θ是NeRF对应的mapping映射的参数（NeRF model）。这一思路应该是类似于sfm中的BA，也跟上面的BARF类似（至于具体如何求解这个优化函数，就看看原文吧哈，此处直接跳过了~）。</p> 
<p>此外，为了提高模型的效果，可以重复优化相机内参，即将训练完后的相机内参保存为新的初始化值，重新训练。</p> 
<p>在不知内参和位姿的情况下，也可以达到与NeRF相当的重建效果，恢复的位姿也和COLMAP持平。</p> 
<p align="center"><img alt="" height="341" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/0f8f9cb0e2e969119f13d226ad3f543d.png" width="717"></p> 
<p></p> 
<p></p> 
<h3 id="NICE-SLAM"><a name="t20"></a>NICE-SLAM</h3> 

<p><a href="https://arxiv.org/pdf/2112.12130.pdf" rel="nofollow" title="NICE-SLAM：Neural Implicit Scalable Encoding for SLAM">NICE-SLAM：Neural Implicit Scalable Encoding for SLAM</a></p> 
<p><a href="https://pengsongyou.github.io/nice-slam" rel="nofollow" title="论文主页">论文主页</a></p> 
<p>现有的NeRF-SLAM由于仅仅采用全连接层，没有包含局部的信息（比如iMAP仅仅有一个MLP来代表整个场景）。具有以下问题：</p> 
<p>1、场景重建过于平滑，丢失高频细节<br> 2、大场景存在网络遗忘问题，难以处理大尺度下的mapping</p> 
<p>因此，本文通过引入基于特征网格的层次场景表达（hierarchical scene representation），嵌入多层局部信息（multi-level local information，使用多个MLP组合多分辨率空间网格），并使用预训练的几何先验实现大尺度室内场景重建。</p> 
<p>对于一个真正有意义的SLAM系统应该具备以下几点要求：</p> 
<ol><li>实时性</li><li>对于没有观测到的区域能做出合理的预测</li><li>可以用于大尺寸环境</li><li>对于噪声或者遗漏的观测具有鲁棒性</li></ol> 
<p>NICE-SLAM分为Tracking和Mapping两部分，Tracking根据输入的RGBD信息估计位姿</p> 
<p align="center"><img alt="" height="357" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/986f3256991d82e58c9dcb78a99229b9.png" width="421"></p> 
<p>Mapping生成RGB和Depth来做深度和光度损失（引用前面iMAP提到过的光度误差和几何误差）。</p> 
<p align="center"><img alt="" height="214" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/c066248741e0eb8ad2919110f455d428.png" width="382"></p> 
<p>Mapping包含Mid &amp; Fine-level、Coarse-level、Color-level。首先由Mid Level进行重建，然后使用Fine level进行refine精细化。Mid level优化网格特征，Fine level捕获更小的高频几何细节。Coarse-level用来捕捉高层的几何场景，例如墙，地板，等具有几何结构的物体（可以保证Tracking不会太差），用于预测未观测到的几何特征，还有外插的能力（未见视角的合成）。Color-level储存颜色信息，用于生成场景中更为细致的颜色表征，从而提高在追踪线程的准确度。</p> 
<p align="center"><img alt="" height="504" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/0ac226a9642c918cab2a63b8396f5fd3.png" width="904"></p> 
<p>关于提到的几种特征的表达方式就先不深入学习了，直接看看效果吧。mapping方面确实比iMAP好不少</p> 
<p align="center"><img alt="" height="390" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/7fb19204965cb5f448c80cedb12b0e24.png" width="560"></p> 
<p align="center"><img alt="" height="606" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/850e94510c8a5d2b03933a993fa49f7c.png" width="801"></p> 
<p>在TUM数据集上的定位精度的对比，可以发现还是不如ORB-SLAM2这些传统方法。</p> 
<p align="center"><img alt="" height="286" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/7c64d423618ce0365aaf17750ad76192.png" width="385"></p> 
<p></p> 
<h3 id="Vox-Fusion"><a name="t21"></a>Vox-Fusion</h3> 

<p><a href="https://arxiv.org/pdf/2210.15858.pdf" rel="nofollow" title="Vox-Fusion：Dense Tracking and Mapping with Voxel-based Neural ImplicitRepresentation">Vox-Fusion：Dense Tracking and Mapping with Voxel-based Neural ImplicitRepresentation</a></p> 
<p><a href="https://github.com/zju3dv/Vox-Fusion" title="论文主页">论文主页</a></p> 
<p>传统的NeRF使用单个MLP，所以难以表达几何细节，并且很难扩展到大场景。将NeRF与稀疏体素网格（volumetric fusion methods，采用voxel-based neural implicit surface representation来渲染每个voxel中的场景）结合，使用八叉树结合莫顿码实现体素的快速分配和检索。同时，再通过多线程技术来实现实时。</p> 
<p align="center"><img alt="" height="322" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/70de46a4119b3d8fade1480a3aedb768.png" width="837"></p> 
<p>Vox-Fusion将体密度更改为了体素，存储的是SDF和RGB。Vox-Fusion由三部分组成：1、体渲染，将场景编码为MLP和嵌入向量，并输出给定像素的渲染颜色和SDF值；2、跟踪过程，将RGB-D作为输入，并通过微分优化相机姿态；3、建图过程，重构场景的几何形状。Vox-Fusion支持场景的动态扩展，这就意味着它不需要像之前的NeRF一样先预定义地图大小，而是可以像SLAM一样增量得去构建地图。</p> 
<p align="center"><img alt="" height="564" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/2d419e50f01ec4c35c8f231d6689570a.png" width="1033"></p> 
<p>体素渲染的网络结构如下图所示。输出中包含了SDF与RGB信息</p> 
<p align="center"><img alt="" height="286" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/5434c83e545bd1041fcb75de86e7488c.png" width="470"></p> 
<p>相较于iMap和NICE-SLAM，各项指标都有了全面的提升。主要对比的点是Vox-Fusion使用更大的分辨率也可以得到更多的高频细节。如下面的定性对比，即使使用比NICE-SLAM更大的分辨率，还是对桌腿、花这种更细小的物体重建效果更好，而NICE-SLAM对这些高频细节不敏感。</p> 
<p align="center"><img alt="" height="400" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/2ad21eaeddee47ba461d597aa2159189.png" width="823"></p> 
<p align="center"><img alt="" height="549" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/f2b6cc398b0a01c167b6601a2e8d58fe.png" width="802"></p> 
<p>而定位精度上却没有跟传统方法进行对比</p> 
<p align="center"><img alt="" height="235" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/cd9c01413aa73104ee87f5ac17e07650.png" width="748"></p> 
<p></p> 
<h3 id="NoPe-NeRF"><a name="t22"></a>NoPe-NeRF</h3> 

<p><a href="https://arxiv.org/pdf/2212.07388.pdf" rel="nofollow" title="NoPe-NeRF：Optimising Neural Radiance Field with No Pose Prior">NoPe-NeRF：Optimising Neural Radiance Field with No Pose Prior</a></p> 
<p><a href="https://nope-nerf.active.vision/" rel="nofollow" title="论文主页">论文主页</a></p> 
<p>虽然已经有好些用NeRF来联合优化pose与map的工作了，但是在相机运动较大（dramatic camera movement，等同于large camera motion）时还是存在挑战。因此，本文引入无畸变单目深度先验（undistorted monocular depth priors），它是通过在训练期间校正尺度和平移参数生成的，从而能够约束连续帧之间的相对姿态，同时构建新的loss function来实现这一约束。</p> 
<p>其他的基于NeRF的pose estiimation 方法局限于forward-facing scenes，很难处理大运动的情况。这主要有以下两个原因：</p> 
<ol><li>没有考虑images之间的相对位姿。</li><li>存在shape-radiance ambiguity（几何-辐射模糊性）（几何-辐射模糊性（shape-radiance ambiguity）指的是一种现象：即在缺少正则化处理的情况下，本应该出现结果退化（degenerate solution，不同的shape在训练时都可以得到良好的表现，但是在测试时效果会明显退化）的情况。这也是NeRF++解决的点）</li></ol> 
<p>NoPe-NeRF的输入是RGB序列，首先从单目深度估计网络（DPT）生成单目深度图，并重建点云，然后优化NeRF、相机位姿、深度失真参数。训练主要也是依靠单目深度估计的深度图和渲染出来的深度图做损失。<br> 具体来说，无畸变深度图提供了两个约束条件（Chamfer Distance loss与depth-based surface rendering loss,）。通过在无畸变深度图中反投影出的两个点云距离的来提供相邻图像的相对姿态，从而约束全局姿态估计。然后通过将无畸变深度视为表面，使用基于表面的光度一致性来约束相对姿态估计。</p> 
<p align="center"><img alt="" height="578" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/72794fc2a41278973d17347ac175d3ed.png" width="1057"></p> 
<p>联合优化pose和NeRF的方程跟NeRF--一样：</p> 
<p align="center"><img alt="" height="70" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/1fb043674c1749eee29a3c5f70669ac9.png" width="356"></p> 
<p>在训练时，整体的优化函数可以写为：</p> 
<p align="center"><img alt="" height="101" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/31987c4100bb13a3096b4742f7353a95.png" width="759"></p> 
<p>其中优化了NeRF的参数Θ,、canera poseΠ,以及失真参数Ψ。而对应的loss为：</p> 
<p align="center"><img alt="" height="73" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/65fb5eb084ee8091dc6bbf119ed6a9f9.png" width="583"></p> 
<p>包含了photometric error，depth loss，point cloud loss，surface-based photometric loss。简而言之就是想方设法加些不同的loss，调出好一点点的效果，然后再给这些loss赋予意义。</p> 
<p>相比起其他方法，pose的精度确实要好些。不过这里有个疑问，GT标着的是COLMAP呢，而所有的pose estimation trajectory都是跟COLMAP就没有跟真正的GT pose对比，这就有点不够说服力了。。。</p> 
<p align="center"><img alt="" height="540" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/b19d2d3debf9c3311c357a8dc001a800.png" width="1042"></p> 
<p align="center"><img alt="" height="350" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/4c3892e288fa8f5c8d2aff25ff9ebae4.png" width="998"></p> 
<p>而渲染的效果也是比NeRFmm、BARF、SC-NeRF等几个方法要好的：</p> 
<p align="center"><img alt="" height="440" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/fffb19f9b1af981c864064ac375e9f1d.png" width="961"></p> 
<p></p> 
<h3 id="RoDynRF"><a name="t23"></a>RoDynRF</h3> 

<p><a href="https://arxiv.org/pdf/2301.02239.pdf" rel="nofollow" title="Robust Dynamic Radiance Fields">Robust Dynamic Radiance Fields</a></p> 
<p><a href="https://robust-dynrf.github.io/" rel="nofollow" title="RoDynRF: Robust Dynamic Radiance Fields">RoDynRF: Robust Dynamic Radiance Fields</a></p> 
<p>本身这篇文章研究的是动态NeRF（就是场景是动态的，里面有运动物体。但看论文里的图，估计也只支持小范围内的动态NeRF，并不支持大场景），但是和NeR--一样都可以在没有位姿和内参的情况下联合优化位姿和NeRF（但NeRF--只能用于静态环境），所以也算是NeRF SLAM的一种。</p> 
<p align="center"><img alt="" height="269" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/6b9bd69908fa97920eec13f9d551e2d6.png" width="796"></p> 
<p>上面表格对基于NeRF的一些方法进行了对比。其中他们有以下缺陷：</p> 
<ol><li>传统的NeRF基于静态环境假设</li><li>动态环境下通常需要由SfM（COLMAP）估计的位姿不准确</li></ol> 
<p>因此，本文联合优化静态、动态辐射场（static and dynamic radiance fields）和相机参数（位姿和焦距）。</p> 
<p>对于运动的目标论文是采用光流与Mask R-CNN结合的方式，同时也仅仅考虑场景中出现小量或者运动一致性比较强动态物体。</p> 
<p>用静态和动态辐射场分别建模静态和动态场景。</p> 
<p>静态辐射场就是一个普通的NeRF，使用坐标和方向作为输入，并预测体密度和颜色。静态部分的密度不随时间和观察方向而变化，因此可以使用查询特征的总和作为密度（而不是使用MLP），静态区域loss同时优化静态体素场和相机参数。静态场景采用Coarse-to-fine的形式，同时获取静态辐射场与camera pose</p> 
<p>动态辐射场取采样坐标和时间t，得到正则空间中的变形坐标（deformed coordinates）。然后利用这些变形坐标对动态体素场中的特征进行查询，并将特征随时间指数传递给随时间变化的浅层MLP，得到动态部分的颜色、密度和非刚性。最后在体渲染之后，从静态和动态部分以及非刚性Mask获得RGB图像和深度图。</p> 
<p align="center"><img alt="" height="708" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/9d3f8607f84efa1511bb55e719511c6d.png" width="1061"></p> 
<p></p> 
<p>对于静态和动态部分，作者引入了三个辅助损失以促进建模的一致性：重新投影损失、视差损失和单目深度损失。重新投影损失鼓励将3D体渲染点投影到相邻帧上，使其与预先计算的流相似。视差损失强制要求来自相邻帧对应点的体渲染3D点具有相似的z值。最后，单目深度损失计算了体渲染深度与预先计算的 MiDaS 深度之间的尺度和平移不变损失。在（a）中，使用运动掩码将动态区域排除在损失计算之外。在（b）中，使用场景流 MLP 来建模体渲染3D点的3D移动。</p> 
<p align="center"><img alt="" height="471" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/fef38f50e07d74e37bd5bd401eb3c1e7.png" width="976"></p> 
<p>从实验对比可以发现其他SOTA方案在动态场景下表现都稍差些。</p> 
<p align="center"><img alt="" height="461" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/7e3231ef8f71443b37f8f3cfd10245e8.png" width="1013"></p> 
<p>而对于pose estimation的精度，跟大部分的NeRF-based localization一样，也就是做了而已。</p> 
<p align="center"><img alt="" height="328" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/f3f8a88e9360697a99beefae55de4343.png" width="532"></p> 
<h3 id="DIM-SLAM"><a name="t24"></a>DIM-SLAM</h3> 
<p><a href="https://arxiv.org/pdf/2301.08930.pdf" rel="nofollow" title="Dense RGB SLAM with Neural Implicit Maps">Dense RGB SLAM with Neural Implicit Maps</a></p> 
<p><a href="https://poptree.github.io/DIM-SLAM/" rel="nofollow" title="论文主页">论文主页</a></p> 
<p>这篇论文宣称这是第一个具有神经隐式建图表示的稠密RGB SLAM（没有使用深度信息），只有RGB的情况下训练NeRF。DIM-SLAM是一个完全RGB的SLAM系统，不需要任何单目深度估计和光流预训练模型 （这个还是挺亮眼的），就能同时优化场景和相机位姿，相机位姿的精度甚至超过了一 些RGB-D SLAM方法。NeRF在没有深度监督的情况下难以收敛，为了解决这个问题，DIM-SLAM引入了一个分层的特征体素（hierarchical feature volume）以提高场景表示能力。DIM-SLAM在给定摄像机姿态的情况下，对多尺度特征沿射线进行采样，并通过MLP解码器将多尺度特征计算出每个像素的深度和颜色。 这样，通过将所呈现的图像与观察到的图像进行匹配，可以同时求解相机位姿和三维场景建图。同时，还用了不同视角下的warping loss来提高精度。</p> 
<p align="center"><img alt="" height="407" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/c7384f92e7583c8ec9d61f74a9bdc0f7.png" width="991"></p> 
<p>看看定位精度的定量对比，已经可以媲美ORB-SLAM2这种传统方法和DROID-SLAM这种学习方法。</p> 
<p align="center"><img alt="" height="446" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/343de623ccaf17c078fea84b99944177.png" width="986"></p> 
<p>而建图方面也比iMAP（RGB-D）在细节恢复的sharp程度上要好些</p> 
<p align="center"><img alt="" height="823" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d7745c302fd935d75295122ffef5aa1d.png" width="1001"></p> 
<p></p> 
<h3 id="Orbeez-SLAM"><a name="t25"></a>Orbeez-SLAM</h3> 
<p><a href="https://arxiv.org/pdf/2209.13274.pdf" rel="nofollow" title="Orbeez-SLAM：A Real-time Monocular Visual SLAM with ORB Features and NeRF-realized Mapping">Orbeez-SLAM：A Real-time Monocular Visual SLAM with ORB Features and NeRF-realized Mapping</a></p> 
<p><a href="https://github.com/MarvinChung/Orbeez-SLAM" title="论文主页">论文主页</a></p> 

<p>这是一篇传统SLAM和NeRF结合很好的一篇文章，使用的是ORB-SLAM2和InstantNGP的组合方案，同样不需要深度信息。跟踪和建图同时运行，首先使用ORB-SLAM2 进行跟踪获取pose。mapping线程会通过三角化产生map points（稀疏的点云）以及联合pose一起做BA优化。如果定位精度较高并且建图线程不繁忙则添加为关键帧，再用map points和位姿去训练NeRF（Instant-NGP，NeRF的改进版可以提升traing speed）。同时通过NeRF的光度误差来进一步的优化pose。实际上，这一framework可以用于任何可以提供稀疏点云的SLAM（这一点个人认为是很好的inspiration）。</p> 
<p align="center"><img alt="" height="390" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/5548af743ac51abf14b85622acbf6936.png" width="948"></p> 
<p>很多NeRF SLAM需要针对每个新场景重新训练，实际应用要求SLAM具备泛化性（<span style="color:#000000;">without pre-training and generates dense maps for downstream tasks in real-time</span>）。传统SLAM可以在NeRF训练初期提供较为准确的位姿，使其没有深度信息也可以快速收敛。作者宣称可以比NICE-SLAM快800倍（360~800）。至于所谓的pre-training-free准确来说应该是the training process is online and real-time without pre-training。</p> 
<p>在TUM数据集下的定位精度对比，这个不太好，本身就是ORB-SLAM2提供的初始位姿，优化后还不如ORB-SLAM2了（但也只是稍弱于）。</p> 
<p align="center"><img alt="" height="407" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/5862983731eb951f18d764f582ecf2ec.png" width="623"></p> 
<p>至于mapping效果，个人觉得是有点为了速度牺牲掉mapping精度了，那篇同样是RGB-D输入，感觉比NICE-SLAM要差些。</p> 
<p align="center"><img alt="" height="353" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/29406a2380b3ab47eccc876b99ee1ae5.png" width="1006"></p> 
<p></p> 
<h3 id="GO-SLAM"><a name="t26"></a>GO-SLAM</h3> 
<p><a href="https://arxiv.org/pdf/2309.02436.pdf" rel="nofollow" title="GO-SLAM：Global Optimization for Consistent 3D Instant Reconstruction">GO-SLAM：Global Optimization for Consistent 3D Instant Reconstruction</a></p> 
<p><a href="https://youmi-zym.github.io/projects/GO-SLAM/" rel="nofollow" title="论文主页">论文主页</a></p> 

<p>NeRF SLAM定位精度较低，且重建的时候存在失真。因此GO-SLAM使用BA和回环来优化全局的位姿，同时实现实时的重建。GO-SLAM本身是基于DROID-SLAM和Instant-NGP的组合（有点类似与前面的Orbeez-SLAM，只不过上面用的是ORB-SLAM2+Instan-NGP），主要工作是引入了BA和回环模块。GO-SLAM由三个并行线程组成：前端跟踪、后端跟踪，以及实例建图。GOSLAM的前端跟踪线程是直接用的DROID-SLAM的跟踪模块，后面训练过程也是直接调用DROID-SLAM的预训练权重，只不过加入了新的回环和BA优化。然后使用RAFT来计算新一帧相对于最后一个关键帧的光流，如果平均流大于阈值，则创建新关键帧。后端跟踪线程的重点是通过全BA生成全局一致的位姿和深度预测。最后，实例建图线程根据最新的位姿信息实时更新三维重建。GO-SLAM的输入支持单目、双目与RGBD。</p> 
<p align="center"><img alt="" height="482" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/2f2b78aeca3a098c359175bed12ecde0.png" width="827"></p> 
<p>GO-SLAM主要还是基于NeRF进行稠密重建，可以发现相较于NICE-SLAM这些SOTA方案，GO-SLAM重建场景的全局一致性更好，这主要是因为它引入了回环和全局BA来优化累计误差。对比效果如下所示，虽然单目的效果好像比较差，但是RGBD的重建效果比其他的几个算法都要好上不少~</p> 
<p align="center"><img alt="" height="310" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/f9d5656f570ed816d4705412c71b6a71.png" width="1023"></p> 
<p>而比起DROID-SLAM在纹理恢复上要好些</p> 
<p align="center"><img alt="" height="592" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/3f3783bfd6adbe7df41a16cf34d1051a.png" width="1006"></p> 
<p>下面来看看定位的效果。实验还是比较solid的，首先在EuRoc下，比ORB-SLAM，SVO这些方法都要好些，并且在传统方法failed的情况下仍然可以提供比较稳定的pose estimation。</p> 
<p align="center"><img alt="" height="220" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/4493b09a00511cf99b9583c244b7885e.png" width="979"></p> 
<p>而在TUM数据集上，效果就更加明显了。这应该是目前看到效果比较好也比较有实验说服力的工作了。</p> 
<p align="center"><img alt="" height="280" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/23ca4a957abb0d8a96b34fa1857156b6.png" width="1000"></p> 
<p>当然这么好的性能在硬件要求上可能要高些：</p> 
<p align="center"><img alt="" height="345" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/3db936fc043f92e4a855c348c99a3397.png" width="771"></p> 
<p></p> 
<h3 id="NICER-SLAM"><a name="t27"></a>NICER-SLAM</h3> 
<p><a href="https://arxiv.org/pdf/2302.03594.pdf" rel="nofollow" title="NICER-SLAM：Neural Implicit Scene Encoding for RGB SLAM">NICER-SLAM：Neural Implicit Scene Encoding for RGB SLAM</a></p> 

<p>这是NICE-SLAM的升级版，由RGBD输入改为了RGB输入。RGB数据没有深度信息，无法产生高质量的NeRF渲染结果。因此，论文引入了单目深度估计进行监督，同时还引入了warping loss来保证几何结构的一致性，此外还为SDF表征建立分层神经隐式编码。</p> 
<p align="center"><img alt="" height="506" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/939c79d73b0d7b1874237fadfb95eaa7.png" width="1037"></p> 
<p>NICER-SLAM以RGB流作为输入，并输出相机位姿，以及学习的几何和颜色的分层场景表示。实际上是在NICE-SLAM的基础上引入单目深度估计，同时融合了重建、颜色、位姿、光流、warping-loss、深度、Eikonal Loss损失等等。其实这篇文章的启发意义不大，但是证明了引入各种各种的损失可以提升性能（CV或者learning的常规操作~）。</p> 
<p>重建效果对比，在只是用RGB的方法里效果不错，甚至和RGBD方法持平。</p> 
<p align="center"><img alt="" height="901" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/6e72e6be1386af67cf019d5452b86fb8.png" width="1038"></p> 
<p>而定位精度方面，并不如Vox-fusion或者DROID等方法，更没有跟非learning的方法进行对比了。整体看上去不如前面的GO-SLAM与Orbeez-SLAM。</p> 
<p align="center"><img alt="" height="298" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/29fad8139443459a0045714e5499203d.png" width="600"></p> 
<p align="center"><img alt="" height="352" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/81d21496cf12f7cd59235aa5e3a627a8.png" width="672"></p> 
<p></p> 
<h3 id="Co-SLAM"><a name="t28"></a>Co-SLAM</h3> 
<p><a href="https://arxiv.org/pdf/2304.14377.pdf" rel="nofollow" title="Co-SLAM：Joint Coordinate and Sparse Parametric Encodings for Neural Real-Time SLAM">Co-SLAM：Joint Coordinate and Sparse Parametric Encodings for Neural Real-Time SLAM</a></p> 
<p><a href="https://hengyiwang.github.io/projects/CoSLAM" rel="nofollow" title="论文主页">论文主页</a></p> 

<p>Co-SLAM将场景表示为多分辨率哈希网格，以利用其高收敛速度和表示高频局部特征的能力。此外，Co-SLAM结合了one-blob编码，以促进未观察区域的表面一致性和补全。这种联合参数坐标编码通过将快速收敛和表面孔填充这两方面的优点结合起来，实现了实时性和鲁棒性。此外，通过射线采样策略允许Co-SLAM在所有关键帧上执行全局BA，而不是像其它的神经SLAM方法那样需要关键帧选择来维持少量活动关键帧。</p> 
<p>1、使用one-blob编码提高哈希编码的连续性。从而保证了表面的完整性（smoothness and coherence，fast convergence and surface hole filling）</p> 
<p>2、在所有关键帧上采样来训练NeRF（进行全局的BA优化），而不是像NICE-SLAM那样维护一个关键帧列表。</p> 
<p>关于第一点。Optimizable feature grids, also known as parametric embeddings最近已经成为单片MLP的一种强大的场景表示替代方案，因为它们能够表示高保真的局部特征，并且具有极快的收敛速度(快几个数量级)。最近的研究集中在这些参数嵌入的稀疏替代方案上，如八叉树、三平面、哈希网格（Instant-NGP）或稀疏体素网格，以提高稠密网格的存储效率。虽然这些表示可以快速训练，非常适合实时操作，但它们从根本上缺乏MLP固有的平滑性和一致性先验，在没有观察到的区域难以填补孔洞。NICE-SLAM是一个基于多分辨率特征网格的SLAM方法的最新例子。虽然它没有过于平滑，能捕捉到局部细节（如下图所示），但它不能进行补孔，补孔可能会导致相机位姿估计出现漂移。</p> 
<p align="center"><img alt="" height="483" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/095c47a0d2ea4d3f8e1834d6f26c5195.png" width="1021"></p> 
<p>因此，Co-SLAM为输入点设计一个联合坐标和稀疏网格编码，将两者的优点结合到实时SLAM框架中。一方面，坐标编码提供的平滑性和一致性先验(本文使用one-blob编码)，另一方面，稀疏特征编码(本文使用哈希网格)的优化速度和局部细节，能得到更鲁棒的相机跟踪和高保真建图，更好的补全和孔洞填充。此外。大多数NeRF-SLAM系统都使用从所选关键帧的一个非常小的子集中采样的光线来执行BA。将优化限制在非常少的视点数量会降低相机跟踪的鲁棒性，并由于需要关键帧选择策略而增加计算量。相反，Co-SLAM执行全局BA，从所有过去的关键帧中采样光线，这在位姿估计的鲁棒性和性能上得到了重要的提高。</p> 
<p>Co-SLAM可以实现10+HZ的输出。</p> 
<p>Co-SLAM首先将传统NeRF中的体密度改为TSDF，训练也是联合优化NeRF和相机位姿。Co-SLAM的输入是RGBD序列，场景表示: 使用新的联合坐标+参数编码，输入坐标通过两个浅MLP映射到RGB和SDF值。2)跟踪: 通过最小化损失来优化每帧相机的位姿。3)建图: 用从所有帧采样的射线进行全局BA，联合优化场景表示和相机位姿。（对于Co-SLAM的理论部分，特别是one-blob编码看得有点迷糊，先mark一下，后面再深入学习~）</p> 
<p align="center"><img alt="" height="481" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/505dc017705b37626be85a87ee3fd90b.png" width="1034"></p> 
<p>实现效果轨迹精度的对比，在TUM上相比NICE-SLAM精度有所提升，但还是不如传统的ORB-SLAM2。</p> 
<p align="center"><img alt="" height="415" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/28904de76b8199605c0996d8943f5d12.png" width="693"></p> 
<p>mapping方面比RGBD的NICE-SLAM有一点提升。但感觉没有特别明显，可能就是实时性好些吧？</p> 
<p align="center"><img alt="" height="534" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/26e274200e36082a4e787f884c665b07.png" width="1032"></p> 
<p></p> 
<h2 id="%E9%9B%B7%E8%BE%BENeRF%20SLAM"><a name="t29"></a>雷达NeRF SLAM</h2> 
<p></p> 
<h3 id="LiDAR-NeRF"><a name="t30"></a>LiDAR-NeRF</h3> 
<p><a href="https://arxiv.org/pdf/2304.10406.pdf" rel="nofollow" title="LiDAR-NeRF：Novel LiDAR View Synthesis via Neural Radiance Fields">LiDAR-NeRF：Novel LiDAR View Synthesis via Neural Radiance Fields</a></p> 
<p><a href="https://tangtaogo.github.io/lidar-nerf-website/" rel="nofollow" title="论文主页">论文主页</a></p> 

<p>该工作提出第一个可微框架用于LiDAR新视图合成（differentiable end-to-end LiDAR rendering framework）；本论文意在给定一个物体的多个LiDAR 视角，可以从任意的视角下的点云对物体进行渲染（学习3D点云的几何结构以及特征信息）。然而，传统的NeRF不能直接作用于点云（由于它只关注于学习独立的pixel而忽略局部信息，准确来说应该是只有photometric loss这对于点云是不适用的），而模拟器产生的却不够真实。</p> 
<p>因此，首先将LiDAR点云转换为Range图像，在不同的视图中会突出显示一个对象以便于可视化。然后在每个伪像素上生成距离（x、y、深度）、强度（反射光强）和射线下降概率（ray-drop）的三维表示。通过利用多视图一致性的三维场景，以帮助网络产生准确的几何形状。注意，LiDAR-NeRF还会 学习LiDAR模型的物理性质，例如地面主要表现为连续的直线。同时，作者还提出一种结构正则化方法，以有效保持局部结构细节，从而引导模型更精确的几何估计；建立NeRF-MVL数据集，以评估以对象为中心的新LiDAR视图合成。</p> 
<p align="center"><img alt="" height="572" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/d4cbcfcf9c20dc761d7dbd3ffcc8155a.png" width="977"></p> 
<p>理论上，LiDAR-NeRF可以应用到所有自动驾驶LiDAR数据集。但目前大多数数据集都只有场景级的LiDAR观测，这篇文章对应的提出了以对象为中心的数据NeRF-MVL用于新 视图合成。</p> 
<p>而所提出的NeRF-MVL数据集使用带有多个LiDAR的自动驾驶车辆来收集，车辆在一个正方形的路径上绕着物体行驶两次，一个大正方形，一个小正方形，还标注了常见的9个目标。</p> 
<p align="center"><img alt="" height="869" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/722e0da15d96f202b8646f870c4bcb43.png" width="1055"></p> 
<p>如上图a所示，把lidar 点云转变为range image representation。对于一个具有垂直平面上H束激光和水平方向上W个发射的LiDAR，返回的属性（例如，距离d和强度i）构成了一个H × W的伪图像。具体而言，对于伪图像（range pseudo image）中的2D坐标（h，w），有：</p> 
<p align="center"><img alt="" height="84" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/4054c7b0e3cfa9020983ace2bbb411d5.png" width="379"></p> 
<p>其中<img alt="" height="35" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/014ff7bfe8ed6bacd55e11d9bbdba1ba.png" width="167">是 LiDAR 传感器的垂直视场角。相反，LiDAR 帧中的每个3D点（x，y，z）都可以投影到大小为 H × W 的伪图像上，如下：</p> 
<p align="center"><img alt="" height="71" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/fce2d7130f992910431761e6c0bec628.png" width="537"></p> 
<p>请注意，如果多个点投影到相同的伪像素上，则仅保留距离最小的点。未投影点的像素用零填充。除了距离之外，该范围图像还可以编码其他点的特征，如强度。</p> 
<p>而由于上面所产生的伪图像跟普通的image不一样，因此对于NeRF也应该有所改变。详细的就请见原本解说吧，本质上这篇论文是把lidar变成特别的image然后再设计对应的loss以及正则化来实现渲染。</p> 
<p></p> 
<h3 id="IR-MCL"><a name="t31"></a>IR-MCL</h3> 
<p><a href="https://arxiv.org/pdf/2210.03113.pdf" rel="nofollow" title="IR-MCL：Implicit Representation-Based Online Global Localization">IR-MCL：Implicit Representation-Based Online Global Localization</a></p> 
<p><a href="https://github.com/PRBonn/ir-mcl" title="论文主页">论文主页</a></p> 
<p>本文提出一种神经占据场（neural occupancy field， NOF），将NeRF扩展到机器人定位任务中的2D LiDAR地图。对于2D栅格地图而言，其离散的特性会损失很多场景的细节，从而导致定位不够精确。因此采用NeRF-based representtation来作为环境的地图表示。</p> 
<p>利用一组已知准确姿态的2D激光扫描来训练，根据每个样本的姿态和2D雷达内参计算得到激光雷达每条射线的方向，接着在每条射线上均匀采样N个空间点。之后，NeRF将采样得到的每个空间点作为输入，并输出该空间点所对应的占据概率。对每条射线利用光线投射算法根据采样点深度及其占据概率渲染得到深度值。最终，估计出当前机器人姿态下可能会观测到的2D激光扫描，通过计算几何损失以及对预测的占据概率添加正则化来优化网络参数。基于该隐式地图，计算渲染扫描和真实扫描之间的相似性，并将其集成到MCL系统中就进行定位。</p> 
<p align="center"><img alt="" height="472" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/b14d7b50d7a0d0b337931884170d2915.png" width="679"></p> 
<p>NOF是一个神经网络，以2D位置p =（x，y）为输入，并输出其占用概率，通过体渲染沿着LiDAR光束的所有预测来合成范围值。学习在场景中生成任意传感器位置的2D LiDAR扫描（scan），也就是学习pose与对应的LiDAR scan的关系，从而实现给一个pose就可以预测栅格的概率。</p> 
<p align="center"><img alt="" height="337" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/160bc5a449a329f54ad379269ff18211.png" width="1000"></p> 
<p>而对于观测模型，为每个粒子渲染一个2D LiDAR扫描，然后通过将合成的测量与来自LiDAR传感器的真实测量进行比较来更新粒子的权重。</p> 
<p align="center"><img alt="" height="536" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/9f5d6a935b5f0f17522cd289b9543057.png" width="771"></p> 
<p>实验也确实证明了用NeRF作为map representation的方式来做map-based localization可以提高定位的精度。并且地图的存储容量更少。</p> 
<p align="center"><img alt="" height="625" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/5d4eff9b6489529dc2582811c1c5558f.png" width="1046"></p> 
<p></p> 
<h3 id="NeRF-LOAM" style="background-color:transparent;"><a name="t32"></a>NeRF-LOAM</h3> 
<p><a href="https://arxiv.org/pdf/2303.10709.pdf" rel="nofollow" title="NeRF-LOAM：Neural Implicit Representation for Large-Scale Incremental LiDAR Odometry and Mapping">NeRF-LOAM：Neural Implicit Representation for Large-Scale Incremental LiDAR Odometry and Mapping</a></p> 
<p><a href="https://github.com/JunyuanDeng/NeRF-LOAM" title="论文主页">论文主页</a></p> 
<p>这篇论文应该是真正意义上的第一个LiDAR NeRF SLAM（同时实现odometry与dense mapping）。它主要包含以下三个模块：</p> 
<ol><li>neural odometry。以预处理的lidar scan作为输入，通过查询neural SDF来优化位姿</li><li>neural mapping。在选择关键帧（key scan）时联合优化Voxel embeddings map以及位姿</li><li>mesh reconstruction。</li></ol> 
<p>这三个模块都主要基于提出的神经符号距离函数（Neural SDF），该函数将激光雷达点分离为地面和非地面点，以减少z轴漂移，同时优化里程计和体素的嵌入（Voxel embeddings ），并最终生成环境的稠密光滑mesh地图。而这种联合优化使NeRF-LOAM不需要预训练，直接泛化到新场景，这个算是摆脱了 NeRF对场景的依赖性。前两个模块作为前端和后端并行运行。第三个模块单独运行以获得全局网格地图和细化的扫描位姿。主要contribution如下：</p> 
<ol><li>基于Lidar数据 采用隐式神经方式计算里程计和建图</li><li>将基于稀疏八叉树的体素（sparse octree-based voxels）与神经隐式嵌入（neural implicit embeddings）结合，然后通过神经隐式decoder来解码为SDF（符号距离函数，signed distance function）。embeddings、decoder以及pose一起联合优化使得SDF误差最小</li><li>结合SFD模块采用动态生成策略（a dynamic voxel embedding generation strategy）和key-scans优化策略</li><li>动态生成策略是用来handle未知的大尺度室外环境，而key-scans优化是进一步refine pose和map，同时缓解灾难性的遗忘或预训练过程。</li><li>online联合优化使得不需要预训练适应不同环境，增强泛化能力</li></ol> 
<p align="center"><img alt="" height="539" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e5e81642977e78d518540cd8460532e6.png" width="519"></p> 
<p>对于所提出的neural SDF如下图所示。感觉单纯从图上看，这个结构与上面的LiDAR-NeRF的很类似，只是上面是变为range representation而此处是voxel embeddings。</p> 
<p>对激光雷达发射的光线上的点进行采样，进行voxel embeddings操作后输入MLP（Neural SDF Query）。在当前给定的体素上，与该体素相交的射线并且和该体素产生交点 设置一个阈值来避免表面遮挡的影响 由于Lidar光线是由扫描位姿变换得到的，所以每条射线包含姿态信息 这样优化时就能同时优化位姿和体素嵌入。</p> 
<p align="center"><img alt="" height="360" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e839c96686fd20d96253dfcaa5409b0d.png" width="805"></p> 
<p>与基于视觉的NeRF方法不同 SDF是直接表示场景的方法，所以不适合室外环境的Lidar数据所以对每个采样点通过体素嵌入的三线性插值进行回归</p> 
<p align="center"><img alt="" height="64" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/291b771399c8ee69713fce2ba8cbf012.png" width="434"></p> 
<p>激光雷达提供了精确的距离测量 能够得到从采样点到射线端点的符号距离，即SDF值。如图所示 蓝线代表SDF的真实值 红线为近似值 当角度&nbsp;θ \thetaθ接近0时 两个距离之间的差异可以显著 这个问题在z轴上更加显著 因为在Lidar扫描中约束z轴漂移的点较少。这里提出将Lidar点分为地面点和非地面点</p> 
<p align="center"><img alt="" height="403" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/f4b47c583b8b6100428fbdf3a55d1eba.png" width="701"></p> 
<p align="center"><img alt="" height="73" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/ea88c9913e3589f6cd89d46280b70304.png" width="252"></p> 
<p>论文定义了三种不同的loss来优化Neural SDF。此处就直接直接跳过了~</p> 
<p>接下来直接看看实验效果：首先是mapping效果，感觉跟baseline相比提升没有很明显~</p> 
<p align="center"><img alt="" height="412" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/09b306b495c30b612dd0e6f08712dd6a.png" width="1070"></p> 
<p>定位精度方面比ICP系列有提升，但没跟LOAM等对比~</p> 
<p align="center"><img alt="" height="228" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e5c7a176015e0dfe950dc5f8a760daf3.png" width="448"></p> 
<p></p> 
<h3 id="LONER%C2%A0"><a name="t33"></a>LONER&nbsp;</h3> 
<p><a href="https://arxiv.org/pdf/2309.04937.pdf" rel="nofollow" title="LONER：LiDAR Only Neural Representations for Real-Time SLAM">LONER：LiDAR Only Neural Representations for Real-Time SLAM</a></p> 
<p><a href="https://umautobots.github.io/loner" rel="nofollow" title="论文主页">论文主页</a></p> 

<p>这是第一个可以实时的LiDAR-based NeRF-SLAM框架。LONER首先将雷达扫描降采样（将为5 Hz），然后用ICP跟踪（point-to-plane，相当于只用NeRF做mapping），并从场景几何中分割出天空区域。对于建图线程，是使用当前关键帧和随机选择的过去关键帧来更新，并维护一个滑窗来优化。跟踪和建图两个线程并行运行，但是建图线程的帧率较低，并准备关键帧用来训练NeRF。最后使用专门设计的损失函数（information-theoretic loss function）来更新位姿和MLP权重，生成的隐式地图可以离线渲染为各种格式，比如深度图和Mesh。</p> 
<p align="center"><img alt="" height="288" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/2f1df76130a1fd0fa3b7b635b2906aaa.png" width="941"></p> 
<p>接下来看看实验。首先是一个跟NICE-SLAM和Lego-LOAM的精度对比，LONER的精度明显优于LeGO-LOAM，这个还挺惊讶的，因为本身LONER没有为SLAM设计什么特殊的模块。而NICE-SLAM的精度明显比其他两个低，还容易跟丢，这也很容易理解，因为NICE-SLAM本身 就是为室内场景设计的。这个实验也证明了LONER自身的损失函数是有效的。</p> 
<p align="center"><img alt="" height="178" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/e6647776d7f1d17cca8b47b1a153aa8d.png" width="429"></p> 
<p>然后是一个地图重建性能的定量评估，包括准确性(估计地图中每个点到真值中每个点的 平均距离)和完整性(真值地图中每个点到估计地图中每个点的平均距离)。LONER效果也 很不错。</p> 
<p align="center"><img alt="" height="409" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/6e0e744d6e9cd11f6a74b9fed5ef8385.png" width="445"></p> 
<p>同时也对不同的loss的效果进行杜比：</p> 
<p align="center"><img alt="" height="427" src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/4032e57ffbaeca23cd63728e07e663e0.png" width="883"></p> 
<p></p> 


<!-- <h2 id="%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE"><a name="t35"></a>参考文献</h2>  -->
<p></p> 
<p></p> 
<p></p>
                </div><div><div></div></div>
        </div>
    </article>