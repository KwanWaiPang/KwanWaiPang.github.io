---
layout: post
title: "论文阅读笔记之——Running VLAs at Real-time Speed"
date:   2025-11-04
tags: [VLN/VLA]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->

当前基于learning的机器人控制算法中，十亿参数级别的视觉-语言-动作（VLA）模型虽具备出色的泛化能力，但推理延迟过高成为瓶颈——传统VLA模型，无法满足动态任务（如抓取运动物体）的实时性需求。

此前，博客也曾对高效VLA做过调研，包括[Efficient-VLA](https://kwanwaipang.github.io/Efficient-VLA/)对一篇高效VLA的survey paper进行阅读，而[NanoVLA](https://kwanwaipang.github.io/Awesome-VLA/#nanovla)也对基于orin上的高效VLA做分析。

本博文对Dexmal发布的实时VLA模型，实现在消费级显卡（RTX4090）上完成pi0模型30HZ推理与480HZ动作生成。

<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言


实时运行的关键阈值是33ms以内的推理时间：这一指标能确保处理30 FPS的RGB视频流时不丢帧；若超过34ms，连续运行中必然出现帧丢失，若关键事件恰好发生在丢失帧，延迟会额外增加一帧时间（约33ms）。

来自Dexmal和StepFun的研究团队提出了实时运行的VLA方案，在单块消费级RTX 4090 GPU上，实现π₀级多视图VLA模型的实时推理——30Hz帧率（图像处理）与最高480Hz轨迹频率（动作生成），并通过真实世界实验验证其有效性（如抓取下落的笔）。


为了实现实时推理，本文的核心优化策略为：从消除开销到内核深度调优。
主要包含四步：

<div align="center">
  <img src="../images/微信截图_20251104141052.png" width="60%" />
<figcaption>  
</figcaption>
</div>

1. 消除基础开销：初始基于PyTorch的朴素实现（naive torch）推理时间超100ms，首要优化是消除CPU与计算图的冗余开销。如上图2（2 views）所示，CUDA Graph将推理时间直接减半，naive pytorch的106.5ms降低到43.5ms。
   * 【CUDA Graph】采用CUDA Graph来去除CPU内核启动开销：VLA模型（如π₀）单次推理需启动上千个CUDA内核，而Python代码驱动内核时会产生显著开销。通过CUDA Graph机制，先记录一次推理过程中的所有内核流，后续推理直接重放该流——此时内核由GPU和驱动直接启动，完全消除Python执行开销。

  * 【简化计算图】通过等价变换重构计算图，去除冗余计算。如上图2（2 views）所示，将推理时间从53.9ms降低到45.8ms。包含三类变换：
    * RMS归一化权重折叠：RMS归一化的 affine 参数与后续线性层均为线性操作，利用结合律修改线性层权重，将两步合并为一步；
    * 动作-时间嵌入层折叠：动作值分支的两个连续线性层（无非线性）合并为一个内核；时间分支因推理时仅10个时间步，预计算线性层结果并融合至SiLU前的偏置向量，减少算子与MAC；
    * QKV投影融合：将注意力机制中Q、K、V的三个独立矩阵，合并为一个大矩阵，计算后通过张量切片拆分结果，减少内核启动次数并提升并行度；同时将RoPE操作融合进矩阵乘法，预计算RoPE权重。

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 30%; border: none; padding: 0; background-color: transparent; vertical-align: middle;">
        <img src="../images/微信截图_20251104141950.png" width="100%" />
        Absorbing RMS affine parameters to the next linear layer
      </td>
      <td style="width: 30%; border: none; padding: 0; background-color: transparent; vertical-align: middle;">
        <img src="../images/微信截图_20251104141957.png" width="100%" />
        Folding linear layers in action-time embedding
      </td>
      <td style="width: 30%; border: none; padding: 0; background-color: transparent; vertical-align: middle;">
        <img src="../images/微信截图_20251104142014.png" width="100%" />
        Fusing QKV
as one weight matrix.
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>


