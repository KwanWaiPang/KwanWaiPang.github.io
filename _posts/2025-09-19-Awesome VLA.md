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


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->

# VLA概述
在传统的自动化场景中，我们常常看到这样的景象：机器人高效、精准地重复着预设动作，但一旦遇到未经编程的细微变化——比如流水线上一个零件被意外放歪——整个系统就可能陷入停滞或错误。这背后的根本原因在于，传统机器人更像一个“照本宣科的演员”，其行为完全依赖于工程师事无巨细的代码编写，缺乏对动态环境的理解和自主决策能力。
为了突破这一瓶颈，人工智能领域正涌现出一种革命性的架构：视觉-语言-动作模型（Vision-Language-Action）。VLA模型旨在为机器人构建一个能够像人一样“观察、思考、行动”的统一大脑。它通过将视觉感知、语言理解与物理动作控制深度融合，使机器人能够直接理解人类的自然语言指令，感知周围的三维世界，并自主生成与之对应的复杂动作序列。

一个典型的VLA模型由几个核心部分组成：视觉与语言编码器负责分别处理图像信息和文本指令；跨模态融合机制（通常基于强大的Transformer架构）是模型的核心，它能将视觉特征与语言语义进行深度对齐，理解例如“请把桌子上的那个红色杯子拿给我”这类指令中“桌子上的”、“红色杯子”所指代的具体视觉实体；最后，动作解码器会将这种融合后的高级理解转化为具体的、可执行的电机控制指令（如关节角度、末端位姿等）。部分先进的模型还引入了反馈模块，通过实时视觉信息对动作进行闭环修正，进一步提升操作的鲁棒性。

VLA模型的巨大潜力主要体现在以下三大优势上：
1. 端到端的统一框架：它彻底打破了传统机器人技术中“感知-规划-控制”三个模块相互割裂的架构。通过一个模型实现从原始信号（图像像素和语言文字）到最终动作（机器人末端控制指令）的直接映射，极大地简化了系统设计和部署流程，降低了整体的复杂性。
2. 卓越的语义泛化能力：得益于背后的大语言模型（LLM、VLM）与大规模视觉-语言预训练，VLA模型具备出色的推理和泛化能力。它不仅能理解指令的字面意思，更能捕捉其背后的隐含逻辑。例如，当被要求“让房间更整洁”时，模型可以推理出需要将散落的玩具放入收纳箱、将书本放回书架等一系列具体动作，而无需对每一种物品和场景进行单独编程。
3. 广泛的跨平台通用性：一个在大量多样化数据集上预训练好的VLA模型，可以相对容易地部署到不同的机器人硬件平台上。由于其已经具备了通用的世界知识和任务理解（common sense），针对特定场景或新机器人的适配只需进行少量数据的微调，极大地降低了迁移成本，为实现“一个模型控制万千机器人”的愿景奠定了基础。

综上所述，VLA模型不仅仅是一项技术改进，它更代表着机器人智能化研究的一次范式转移。它将机器人的能力边界从预设的、结构化的环境，拓展到了开放的、动态的真实世界，为开发能够真正理解人类意图、灵活适应未知环境的通用型机器人，照亮了前行的道路。



# VLA经典方法阅读

在深入看各种方法之前，先通过下面表格来总览VLA的发展脉络

<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

|  年份 |  单位  | 模型  |  方法  | 说明 |
|:-----:|:-----:|:-----:|:-----:|:-----:|
|2025|Russia|[AnywhereVLA](https://arxiv.org/pdf/2509.21006)|SmolVLA+传统SLAM导航(Fast-LIVO2)+frontier-based探索|消费级硬件上实时运行VLA<br>移动机械臂|
|2023|Google|[RT-1](https://arxiv.org/pdf/2212.06817)|EfficientNet+Transformer|首次用到实际机械臂|



## RT-1
* 详细请见博客：[VLA论文阅读笔记之——《Rt-1: Robotics transformer for real-world control at scale》](https://kwanwaipang.github.io/VLA-RT1/)

其架构如下图所示：
1. 输入处理：图像和文本首先通过一个基于ImageNet预训练的EfficientNet进行处理。在FiLM层嵌入预训练的指令（将指令转换为嵌入向量），进而提取与任务相关的视觉特征。
2. Token Learner：将提取的视觉特征转换为Token的形式；
3. Transformer对获取的Token做一系列的attention操作生成action token；
4. 最终输出的action包括：手臂的七个自由度的运动：xyz，rpy，双指夹持器开合。此外，action还需要包括移动地盘的xy和航向角（yaw）。并且还需控制手臂、控制底盘、终止，三个模块的切换。

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250916134816.png" width="100%" />
<figcaption>  
</figcaption>
</div>

而其关键的contribution应该是数据集部分：17个月，13个机器人，13万此示范，700多个任务。

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250930153623.png" width="100%" />
  <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250916135343.png" width="100%" />
<figcaption>  
</figcaption>
</div>

RT-1 在真实机器人平台上进行了大量实验，展示了其在多任务、多目标环境中的鲁棒性与泛化能力，在定量准确率和演示视频中均表现良好。



## AnywhereVLA

本文通过将微调的VLA操纵，与探索、SLAM等传统任务结合，实现了移动机械臂（Mobile manipulation）的VLA任务。
系统架构如下图所示。
<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250930142254.png" width="100%" />
<figcaption>  
</figcaption>
</div>

workflow通过语言指令作为输入，然后同时执行VLA模块实现基于task的操纵以及自主探索。主要分为三个部分：
1. 3D语义建图。通过雷达-惯性-视觉SLAM（Fast-LIVO2）构建3D点云地图，而语义部分来自于目标检测模块。
2. 主导环境探索(Active Environment Exploration,AEE)，基于语言指令推导出的目标物体类来执行frontier-based exploration。一旦检测到目标对象并在语义图中定位，探索就会停止。而探索部分则是将LiDAR点云投影成2D栅格地图。
3. VLA操作，采用的为fine-tune（在SO-101机械臂上训练）的SmolVLA模型。

主体推理框架仍然采用预训练的VLM（对机器人轨迹数据和互联网规模的视觉语言任务进行联合微调）。
而为了保证可移动性，利用了传统的navigation stacks。
既利用了传统SLAM导航的鲁棒性，同时也利用了VLA模型对环境的泛化理解能力。
属于传统方法跟VLA的结合版本。但个人认为只是让其可移动（Mobile manipulation），对于VLA任务本身，SLAM与导航似乎是不起任何帮助的😂

其他补充：
* 感知及VLA部分运行在Jetson Orin NX上，而SLAM，探索以及控制则是运行在Intel NUC上；
* 任务成功率：46%
* 目前项目还没开源，但后续应该是有开源的打算吧[Website](https://selfai-research.github.io/AnywhereVLA/), [Github](https://github.com/SelfAI-research/AnywhereVLA)


























<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<br><br><br>

```bash
下面是待更新的论文：

#Act
Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware

# DexVLA
DexVLA: Vision-Language Model with Plug-In Diffusion Expert for General Robot Control

# DiVLA
Diffusion-VLA: Scaling Robot Foundation Models via Unified Diffusion and Autoregression

# Go-1
AgiBot World Colosseo: Large-scale Manipulation Platform for Scalable and Intelligent Embodied Systems

# GR-1
UNLEASHING LARGE-SCALE VIDEO GENERATIVE PRE-TRAINING FOR VISUAL ROBOT MANIPULATION

# GR-2
GR-2: A Generative Video-Language-Action Model with Web-Scale Knowledge for Robot Manipulation

# HiRT
HiRT: Enhancing Robotic Control with Hierarchical Robot Transformers

# LAPA
LATENT ACTION PRETRAINING FROM VIDEOS

# Moto
Moto: Latent Motion Token as the Bridging Language for Learning Robot Manipulation from Videos

# Octo
Octo: An Open-Source Generalist Robot Policy

# OpenVLA
OpenVLA: An Open-Source Vision-Language-Action Model

# OpenVLA-OFT
Fine-Tuning Vision-Language-Action Models: Optimizing Speed and Success

# ReKep
ReKep: Spatio-Temporal Reasoning of Relational Keypoint Constraints for Robotic Manipulation

# RoboDual
TOWARDS SYNERGISTIC, GENERALIZED AND EFFICIENT DUAL-SYSTEM FOR ROBOTIC MANIPULATION

# RoboFlamingo
VISION-LANGUAGE FOUNDATION MODELS AS EFFECTIVE ROBOT IMITATORS

# RT-2
RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control

# saycan
Do As I Can, Not As I Say: Grounding Language in Robotic Affordances

# TinyVLA
TinyVLA: Towards Fast, Data-Efficient Vision-Language-Action Models for Robotic Manipulation

# VoxPoser
VoxPoser: Composable 3D Value Maps for Robotic Manipulation with Language Models

# π0
π0: A Vision-Language-Action Flow Model for General Robot Control

```



# 参考资料
* [Vision-language-action models: Concepts, progress, applications and challenges](https://arxiv.org/pdf/2505.04769?)
* [Vision Language Action Models in Robotic Manipulation: A Systematic Review](https://arxiv.org/pdf/2507.10672)
* [Large VLM-based Vision-Language-Action Models for Robotic Manipulation: A Survey](https://arxiv.org/pdf/2508.13073?)
* [Exploring Embodied Multimodal Large Models:Development, Datasets, and Future Directions](https://arxiv.org/pdf/2502.15336?)
* [A Survey on Vision-Language-Action Models: An Action Tokenization Perspective](https://arxiv.org/pdf/2507.01925)
* [Blog for VLN](https://kwanwaipang.github.io/VLN/)
* [论文阅读笔记之——《Vision-language-action models: Concepts, progress, applications and challenges》](https://kwanwaipang.github.io/VLA-survey-2025/)


