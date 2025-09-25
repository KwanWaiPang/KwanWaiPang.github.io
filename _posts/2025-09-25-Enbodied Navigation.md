---
layout: post
title: "论文阅读笔记之——《Sensing, Social, and Motion Intelligence in Embodied Navigation: A Comprehensive Survey》"
date:   yyyy-mm-dd
tags: [Robotics]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


本博文对综述论文《Sensing, Social, and Motion Intelligence in Embodied Navigation: A Comprehensive Survey》阅读记录。
该论文对具身导航（Embodied Navigation (EN)）中的感知智能、社会智能和运动智能全面综述。
将具身导航过程分解为五个关键阶段——状态转移（Transition）、环境观测（Observation）、信息融合（Fusion）、奖励策略构建（Reward-policy construction）和动作执行（Action），为具身导航研究提供了统一的结构化分析框架。

* [PDF](https://arxiv.org/pdf/2508.15354)
* [Github](https://github.com/Franky-X/Awesome-Embodied-Navigation)

<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言

在机器人导航中，具身性体现在以自我为中心的感知方式（egocentric perception）和分布式计算能力，区别于传统基于全局地图或外部定位的方式。传统导航研究聚焦于状态估计、点到点路径规划与最优控制，而人工智能的进步推动导航从“路径驱动”向“智能驱动”转变，形成了 具身导航（Embodied Navigation, EN） 的新范式。

相比起依赖预定义地图和GNSS/SLAM 的经典导航，具身导航具备三类智能：
1. 感知智能
   * 通过多模态自我中心感知（proprioceptive + exteroceptive）获取空间认知；
   * 不再完全依赖预构建的全局地图，而是利用主动感知完成环境理解。也就是轻地图、重感知、重理解的思维模式。
   * Robotics领域（或自动驾驶）主要做的，聚焦感知智能，如主动exploration、point-goal navigation、active SLAM等等，但在高级语义理解和复杂任务执行上有所欠缺。
2. 社会智能：
   * 能够理解人类的高层语义指令（如自然语言任务描述、语义环境的理解）；
   * 支持超越预设路径点的复杂任务执行。
   * CV跟NLP领域主要做的，比如VLN等等。往往假设状态信息完备，忽视真实感知和运动的不确定性。
3. 运动智能
   * 具备高度自由度的运动技能，能够在复杂环境中进行灵活、适应性的物理交互；
   * 不局限于固定路径，而是动态适应不同任务与环境。
   * 主要是神经形态/生物启发(bio-inspired mechanisms)做的。尝试模仿生物导航机制，但同样存在社会智能和运动智能的覆盖不足。

<div align="center">
  <img src="../images/微信截图_20250925101302.png" width="100%" />
<figcaption>  
</figcaption>
</div>


# 具身导航问题定义