---
layout: post
title: "Paper Survey——CLIP on VLN"
date:   2025-09-1
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




# CLIP-NAV: USING CLIP FOR ZERO-SHOT VISIONAND-LANGUAGE NAVIGATION





# ESC: Exploration with Soft Commonsense Constraints for Zero-shot Object Navigation





# VLFM: Vision-Language Frontier Maps for Zero-Shot Semantic Navigation




# 参考资料
* [10年VLN之路：详解具身智能「视觉-语言-导航」三大技术拐点！](https://mp.weixin.qq.com/s/FvPMMnaHNovsU28xC-agRg)
