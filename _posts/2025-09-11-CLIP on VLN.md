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

# CLIP-NAV: USING CLIP FOR ZERO-SHOT VISIONAND-LANGUAGE NAVIGATION

VLN要面对的场景都是比较






# ESC: Exploration with Soft Commonsense Constraints for Zero-shot Object Navigation





# VLFM: Vision-Language Frontier Maps for Zero-Shot Semantic Navigation




# 参考资料
* [10年VLN之路：详解具身智能「视觉-语言-导航」三大技术拐点！](https://mp.weixin.qq.com/s/FvPMMnaHNovsU28xC-agRg)
