---
layout: post
title: "论文阅读笔记之——《Sensing, Social, and Motion Intelligence in Embodied Navigation: A Comprehensive Survey》"
date:   2025-09-25
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

在未知环境中，具身导航（EN）的目标是让智能体通过自我感知和交互，高效完成复杂导航任务。

具身导航的决策过程可建模为 部分可观测马尔可夫决策过程（POMDP）：
* 状态：包含机器人本体状态和环境状态，由于传感器噪声与不确定性，表示为概率分布（belief state）。
* 动作：机器人在时刻t执行的动作，使得状态发生转移。
* 状态转移模型：描述在执行动作后状态分布的变化。
* 观测模型：描述智能体在状态 $s_{t}$ 下通过传感器获得的观测。
* 奖励函数：评估当前状态与动作对任务目标的贡献。
* 最优策略：通过优化累计期望奖励，得到策略函数，生成动作序列 $[a_{0},a_{1},a_{2},...]$。
  
<div align="center">
  <img src="../images/微信截图_20250925162539.png" width="100%" />
<figcaption>  
</figcaption>
</div>


## TOFRA框架：EN问题的五个状态
本文采用：状态转移（Transition）、环境观测（Observation）、信息融合（Fusion）、奖励策略构建（Reward-policy construction）和动作执行（Action）为具身导航研究提供了统一的结构化分析框架。

* Transition（T，状态转移）
  * 通过动力学模型、运动认知（如步态识别）、端到端神经网络等方式，利用本体传感器（IMU、编码器）推算下一个状态。
* Observation（O，观测）
  * 借助外部传感器（RGB、深度、LiDAR、毫米波雷达等）感知环境；
  * 包括低层几何特征提取、高层语义认知（目标检测、语义分割、场景识别）、以及多智能体协同感知。
* Fusion（F，感知融合）
  * 将本体状态预测与外部感知进行融合，获得最优状态估计；
  * 方法包括经典 贝叶斯滤波（如卡尔曼滤波、优化法），以及 神经网络隐式融合（如Transformer、多层网络），或二者结合的混合方法。
* Reward-policy construction（R，奖励与策略构建）
  * 将任务目标转化为奖励函数，例如点目标、图像目标、物体目标、探索覆盖率；
  * 策略学习可扩展到多任务与视觉语言导航（VLN），结合大语言模型实现自然语言指令解析。
* Action execution（A，动作执行）
  * 智能体利用运动技能完成策略生成的动作序列；
  * 包括基础元技能（行走、避障）、复合技能（技能组合、运动+操作协同）、以及形态协同（轮腿混合、空地一体、空水一体）。


# 状态及动作空间

* 状态空间：由机器人本体（位置、速度、姿态）与环境特征构成，既可采用`显式表示`（如向量、李群、四元数）保持几何一致性，也可采用`隐式表示`（如深度学习特征向量、神经元格表示），兼顾可解释性与泛化性。
* 动作空间：由机器人平台的物理能力决定，典型分类包括：
  * 低层控制：轮式机器人（3DoF）、无人机/水下机器人（6DoF）、足式机器人（12–25DoF）、轮腿混合机器人（高维控制）。
  * 高层指令：抽象化的语义动作或控制接口，提升交互性。

## 状态空间
状态空间用于表示机器人本体状态与环境状态，是后续转移、观测和融合算法的核心基础。

* 显式表示：通过三维的位置、旋转、环境的特征等来描述agent的状态
  * 向量拼接（Concatenate Vector）：直接将位置、速度、姿态与环境特征拼接成一个大向量，简单易扩展，但存在坐标不一致引发的估计误差。（`estimation inconsistencies because sub-state errors are computed in non-uniform coordinate systems`）
  * 李群（Lie Group）表示：利用群仿射性质，使雅可比计算与当前状态估计无关，提高几何一致性，常用于滤波估计。
  * 四元数(Quaternion-Based Representation)：以四元数表示旋转，双四元数进一步引入平移，Trident quaternion结合位置、速度、姿态，统一误差坐标系，保证估计一致性。


* 隐式表示:通过抽象的、不可解释的特征向量来表征
  * 深度学习特征向量：通过神经网络，从观测中学习状态表示，适用于复杂、非结构化环境。
  * 生物启发的细胞表示（bio-inspired cell-based methods）：采用神经形态计算方法，利用神经元格编码状态，具有高效性，适合低功耗实现。


## 动作空间
动作空间由机器人物理平台的运动系统与自由度（DoFs）决定，决定了导航中智能体能执行的操作范围。

* 底层控制
  * 轮式机器人（Ground Wheeled）：典型 3 DoFs，易于实现，但地形适应性差。
  * 无人机/水下机器人（UAVs/AUVs）：6 DoFs，具备空间机动性，但受载荷和能量限制。
  * 足式机器人（Legged Robots）：高自由度（12+DoFs），适应复杂地形，但控制难度高。
  * 轮腿混合机器人（Wheel-Legged Robots）：结合两者优势，兼具高效与适应性，通常需 16 维动作控制（12 关节+4 轮子）。

* 高层指令(类似VLA或VLN)
  * 通过抽象化命令（如“前进/转向”或语义化指令）来简化交互，适用于上层规划与任务驱动；


# 状态转移


<div align="center">
  <img src="../images/微信截图_20250926142022.png" width="100%" />
<figcaption>  
</figcaption>
</div>



~~~
未完待续
~~~



