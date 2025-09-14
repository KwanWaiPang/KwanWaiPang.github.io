---
layout: post
title: "Paper Survey——CLIP on VLN"
date:   2025-09-11
tags: [Deep Learning]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->

<!-- # 引言 -->

2022年OpenAI发布的CLIP模型，大大提升了模型的跨模态理解能力，实习了视觉与语言的统一，也给VLN带来新的突破————零样本学习的能力使得机器人无需依赖人工标注，即可理解自然语言指令并执行高效导航。

本博文针对基于CLIP的VLN几篇论文对其进展进行调研。

本博文仅供本人学习记录用~

* [Paper List](https://github.com/KwanWaiPang/Awesome-VLN)
* [Blog for VLN](https://kwanwaipang.github.io/VLN/)
* [Blog for CLIP](https://kwanwaipang.github.io/CLIP/)
* [论文阅读笔记之《Vision-and-language navigation today and tomorrow: A survey in the era of foundation models》](https://kwanwaipang.github.io/VLNsurvery2024/)

<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->


# 1. Cows on pasture: Baselines and benchmarks for language-driven zero-shot object navigation

* [cvpr2023](https://openaccess.thecvf.com/content/CVPR2023/papers/Gadre_CoWs_on_Pasture_Baselines_and_Benchmarks_for_Language-Driven_Zero-Shot_Object_CVPR_2023_paper.pdf)
* [website](https://cow.cs.columbia.edu/)
* [code](https://github.com/columbia-ai-robotics/cow)

对于一般能用的机器人，他们需要能够寻找人类描述（也就是语言）的任意物体，即使没有对域内数据进行昂贵的导航训练（也就是要实现zero-shot性能）。因此，作者提出language-driven zero-shot object navigation (L-ZSON)。

受到最近图像分类中的开放词汇模型（open-vocabulary models）的启发，作者提出一个直接的框架——CLIP on Wheels (CoW)，也就是将开放词汇模型用到这个任务中（without fine-tuning）。从这个维度上说其实就跟，CLIP用到传统CV的任务是很类似的。

而为了验证L-ZSON，作者提出了PASTURE benchmark，需要考虑到寻找查找不常见的object、由空间和外观属性描述的object，以及相对于可见object描述的隐藏object。
而作者一共验证了90k个导航的集（90k navigation episodes），发现：
1. Cow baseline通常很难利用语言描述，但擅长发现不常见的对象；
2. 基于CLIP的object定义及经典的探索（不需要额外training）

<div align="center">
  <img src="../images/微信截图_20250911150618.png" width="80%" />
<figcaption>  
</figcaption>
</div>

本文主要是for object localization的，但是由于有语言的输入，且属于寻找物体，因此跟目标导向的VLN几乎是一样的。对于探索的方法有基于前沿的探索（Frontier based exploration，FBE，可以理解为用地图的探索 ）也有基于learning的（可以理解为用trainable GRU的hidden state来记录）

而对于采用的开发词汇分类器（open-vocabulary classifiers），通过三种策略来fine-turn CLIP模型为object localizers：
1. 采用CLIP的文本编码器来编码k个引用表达，特别指定目标物体在图像的哪个区域。比如`a plant in the top left of the image`。然后匹配当前观测的语言的embedding与CLIP的视觉embedding。计算图像和文本特征的相似性来决定区域的相关分数。
2. 将图像离散化为k个小的patches，然后或者CLIP的patch embedding。然后将每个patch embedding与CLIP文本embeding进行卷积。如果object在patch中，对这个patch的相关分数就会很高。
3. 修改一个可解析（interpretability）的方法，从ViT中提取物体的相关性。使用一个目标CLIP文本embedding以及CLIP视觉编码器的累积梯度信息，进而可以构建输入pixel的相关性的图，当object在视野中可以定性的分割目标。

对于开放词汇检测器与分割器（open-vocabulary detectors and segmentors）采用了两个额外的开发词汇模型来做object localization
* MDETR segmentation model，输入文本和图像，输出box检测。
* OWL-ViT detector用了一系列预测微调配方来将类似CLIP的方法转为物体检测。

实验测试测试了一系列基于CLIP的baseline的SR和SPL（Success weighted by inverse path length）

# 2. CLIP-NAV: USING CLIP FOR ZERO-SHOT VISIONAND-LANGUAGE NAVIGATION

* [PDF](https://arxiv.org/pdf/2211.16649)

本文与上一篇是同期提出的，开创了CLIP在导航中的另一条技术路径。相较于前者依赖全局热力图的暴力搜索策略，CLIP-NAV采用局部增量规划框架，将导航过程分解为单步决策序列：通过CLIP实时计算视觉场景与子指令（如「找厨房门」）的匹配度，直接预测最优动作（左转/直行）。

VLN要面对的场景都是比较复杂的：如任意的语言指令、多样性的环境。而CLIP等视觉语言模型在zero-shot目标识别等都展示了强大的性能，因此作者在本文中尝试探究这些方法能否实现zero-shot的language grounding。本质上跟上文是有点像的，都是把CLIP用到VLN中（without any dataset-specific finetuning），作为尝试性论文，只是上一篇以object navigation为主题，本篇更细化到VLN上。

此前的VLN方法都是采用监督学习,模型首先在"seen"环境及指令下训练的,然后在"seen"以及"unseen"环境下验证.这类型的方法没见过的环境中通常有明显的性能drop.如下图所示:

<div align="center">
  <img src="../images/微信截图_20250914100033.png" width="80%" />
<figcaption>  
</figcaption>
</div>

此外,现有的VLN模型也都是dataset specific的,也就是在一个数据集下训练的模型难以泛化到另一个数据集上.比如在REVERIE上训练的,在SOON上可能得不到类似的结果(虽然这两个数据集都是很像的,都是coarse-grained instruction following task).不过这主要是由于训练数据不够导致的。虽然可以通过一些数据增强来改善，但是提升还是有限的。

作者所提出的方法包含三步：
1. 指令分解-将粗粒度（coarse-grained）指令分解为关键短语。
2. 视觉语言定位（Vision-Language Grounding）-使用CLIP在环境中找到keyphrase
3. 采用CLIP的分数来做导航决策

下面也对用作者提出的指令分解方法与GPT-3做指令分解的区别
<div align="center">
  <img src="../images/微信截图_20250914102140.png" width="80%" />
  <img src="../images/微信截图_20250914102200.png" width="80%" />
<figcaption>  
作者将指令分解的时候会分为：Navigational components (NC) and Activity components (AC)
</figcaption>
</div>

将指令分解为keyphrases后，作者就用于在Matterport3D的导航中，而Matterport3D的每个节点但都是agent的360度的全景图像，而为了选择全景图中的导航方向，作者将其分为4个分开的image，每张图包含了agent大概90度的空间。然后图片分别与语言指令通过CLIP进行匹配，选择匹配最大的为方向。其中AC指令如果超过一定的阈值或满足停止的条件时就会执行`stop`

<div align="center">
  <img src="../images/微信截图_20250914103003.png" width="80%" />
<figcaption> 
上图的红色就是选定的图像 
</figcaption>
</div>

下图则是为整个CLIP-Nav的框架。每一步将全景图分为4张图像。通过CLIP选择一张图像。进而可以获得该图片对应的可以导航邻近节点，然后选择最近的节点。
此外，NC grouding score也会决定什么时候选择下一个keyphrase。比如，`Go to the kitchen`如果 grounding score一直高于一定的阈值，我们就假设agent可以成功导航到kitchen，并且可以执行next keyphrase。因此CLIP不仅仅是选择导航的方向，还是决定agent什么时候到达中间的目标位置。

<div align="center">
  <img src="../images/微信截图_20250914103509.png" width="80%" />
<figcaption> 
</figcaption>
</div>

同时由于选择节点的时候采用的是最近的节点，因此作者额外提出了一个 backtracking mechanism，如下图所示。用来决定agent是否需要回溯一些节点。

<div align="center">
  <img src="../images/微信截图_20250914104435.png" width="80%" />
<figcaption> 
</figcaption>
</div>

不过从实验的表格上来看，似乎并没有作者所宣称的效果，只是额外定义了Relative Change in Success (RCS)指标来证明效果更好，但是成功率这些是远不如supervised learning的

<div align="center">
  <img src="../images/微信截图_20250914104854.png" width="80%" />
<figcaption> 
</figcaption>
</div>


# ESC: Exploration with Soft Commonsense Constraints for Zero-shot Object Navigation





# VLFM: Vision-Language Frontier Maps for Zero-Shot Semantic Navigation




# 参考资料
* [10年VLN之路：详解具身智能「视觉-语言-导航」三大技术拐点！](https://mp.weixin.qq.com/s/FvPMMnaHNovsU28xC-agRg)
