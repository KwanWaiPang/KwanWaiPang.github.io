---
layout: post
title: "Paper Survey之——Awesome Vision-Language-Action (VLA)"
date:   2025-09-19
tags: [VLN/VLA]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->



本博客对VLA(Vision-Language-Action)进行调研整理。

在VLA模型出现之前，机器人技术和人工智能主要分布在彼此割裂的几个子领域：
* 视觉系统能够“看”并识别图像。传统的CV可以通过CNN来识别物体或者进行分类，但是并不能理解语言、也没有将视觉转换为action的能力。
* 语言系统能够理解和生成文本。语言模型，特别是基于LLM的虽然可以革新了文本的理解以及生成，但是他们仍然只能处理语言文本，而不能感知或者推理物理世界。
* 动作系统则能够控制物体运动。机器人中基于action的系统一般都是依赖于传统控制策略（hand-crafted policies）或者强化学习来实现例如目标抓取等等，但是这需要复杂的工程实现。

VLA即视觉-语言-动作，是一种将视觉感知与语言理解结合，实现自主操作决策的多模态任务。

* [Paper List](https://github.com/KwanWaiPang/Awesome-VLN#VLA)
* [Blog for VLN](https://kwanwaipang.github.io/VLN/)
* [论文阅读笔记之——《Vision-language-action models: Concepts, progress, applications and challenges》](https://kwanwaipang.github.io/VLA-survey-2025/)


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->

# VLA概述
VLA 模型即视觉-语言-动作（Vision-Language-Action）模型，是一种将视觉感知与语言理解结合，实现自主操作决策的多模态任务。
预编程机器人在动态环境中会失效：传统的机器人就像是照本宣科的演员，只能按照工程师设定的程序去做。
观察、理解和行动的统一架构：结合了视觉、语言理解和控制，让机器人感知世界，遵循自然语言命令，并采取行动。
VLA模型通常由视觉与语言编码器、跨模态融合机制、动作解码器和可选的反馈模块组成，共同支持从感知到行动的全流程学习.
通过端到端的统一流程、出色的语义泛化能力以及跨平台的广泛通用性，VLA为机器人智能化带来了新的范式，极大地降低了系统复杂性、提升了适应未知环境和多任务迁移的能力。
* 端到端框架：
  * 打破传统感知-规划-控制的割裂架构
  * 简化训练与部署流程
* 泛化能力:
  * 理解指令背后的隐含推理逻辑
  * 借助大语言模型的“语义迁移”能力

# VLA经典方法阅读

在深入看各种方法之前，先通过下面表格来总览VLA的发展脉络

<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| 年份 | 单位 | 方法 | 说明 |
|:-----:|:-----:|:-----:|:-----:|
|2023|Google|[RT-1](https://arxiv.org/pdf/2212.06817)|---|


## RT-1
* [VLA论文阅读笔记之——《Rt-1: Robotics transformer for real-world control at scale》](https://kwanwaipang.github.io/VLA-RT1/)






~~~
未完待续
~~~








# 参考资料
* [Vision-language-action models: Concepts, progress, applications and challenges](https://arxiv.org/pdf/2505.04769?)
* [Vision Language Action Models in Robotic Manipulation: A Systematic Review](https://arxiv.org/pdf/2507.10672)
* [Large VLM-based Vision-Language-Action Models for Robotic Manipulation: A Survey](https://arxiv.org/pdf/2508.13073?)
* [Exploring Embodied Multimodal Large Models:Development, Datasets, and Future Directions](https://arxiv.org/pdf/2502.15336?)
* [A Survey on Vision-Language-Action Models: An Action Tokenization Perspective](https://arxiv.org/pdf/2507.01925)


