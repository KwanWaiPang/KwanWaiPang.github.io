---
layout: post
title: "Paper Survey之——基于真实机器人的VLN"
date:   2025-09-30
tags: [VLN/VLA]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->

之前博客对VLN进行调研。但VLN领域工作实在太多了，NLP、CV、Robotics领域的学者们纷纷加入，只能介绍小量代表性工作。
本博文针对VLN领域带有机器人实操的几篇工作进行调研，跟之前博客为了了解整个领域不同的是：本博文希望调研业内（学术界）VLN落地的方案及做法。

* [Paper List for VLN](https://github.com/KwanWaiPang/Awesome-VLN)
* [Blog for VLN](https://kwanwaipang.github.io/VLN/)
* [论文阅读笔记之——《Vision-and-language navigation today and tomorrow: A survey in the era of foundation models》](https://kwanwaipang.github.io/VLNsurvery2024/)
* [Paper Survey——CLIP on VLN](https://kwanwaipang.github.io/CLIP-on-VLN/)

# Zero-shot Object-Centric Instruction Following: Integrating Foundation Models with Traditional Navigation
本文是波士顿动力24年arvix的工作，关注Instruction Following，通过LLM大模型与传统的SLAM导航相结合的方式让具身导航智能体学会指令跟随。

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250927080811.png" width="80%" />
<figcaption>  
</figcaption>
</div>

* 详细请见[博客](https://kwanwaipang.github.io/nl-slam/)
* 演示[网页](https://sonia-raychaudhuri.github.io/nlslam/)


# SLAM-Free Visual Navigation with Hierarchical Vision-Language Perception and Coarse-to-Fine Semantic Topological Planning

上一篇是VLN跟SLAM结合的，这篇则是要去除SLAM，两篇的观点正好相关hh

## 理论部分

本文提出了一个纯视觉，切不依赖于SLAM的导航框架。通过轻量的拓扑地图（topological representations）来代替稠密几何的语义推理。
通过分层视觉语言感知模块将场景级上下文（scene-level context）与对象级线索（object-level cues）融合在一起，以实现鲁棒的语义推理。
这部分是通过VLM来实现场景以及物体级别的语义推理的，进而构建`semantic-probabilistic topological map`。
接下来，基于大语言模型（LLM）的全局推理实现子目标的选择，而基于视觉的局部规划实现障碍物躲避。
最后再通过强化学习来实现腿式机器人的运动控制。

之所以要强调`SLAM-free`是因为机器人不仅需要定位自身，还需要理解环境哪里是值得下一步去探索的、哪个目标是跟任务相关的，还有就是在不确定的情况下，如何去规划。用传统的架构难以handle，其实这也是用VLN代替传统定位导航pipeline主要的motivation。

下面是framework的架构：
场景的推理采用了Qwen，物体的检测采用Grounding DINO；两者的结果进行融合以及构建`semantic-probabilistic topological map`；
而推理获得的这些信息只是给一个粗略的环境理解，生成导航的目标决策，而具体执行还需局部的障碍物规划。


<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250930104411.png" width="100%" />
<figcaption>  
</figcaption>
</div>

对于规划的过程又分为两个互补的level：
* coarse global reasoning layer：从语言拓扑图中选择最佳的探索子目标；这分布采用GPT-4来做规划
* fine local planning layer：动态生成可以安全到达子目标的轨迹；这部分作者采用了Viplanner（一个端到端的视觉局部规划器，通过深度相机的输入以及子目标的2D投影，输出线速度与角速度的指令）

最后再基于速度指令到机器人规划和控制策略，这部分采用的就是RL运动控制了。

## 实验部分

* 仿真是采用一张NVIDIA RTX4090 GPU来做的。
* 真机实验中，工作站负责Grounding DINO以及其他大模型的API回调；Jetson AGX Orin实现规划与控制。两个系统通过无线网络及ROS来交换信息；

实机环境中采用Unitree Go1+RealSense D435i，验证了五个场景


<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250930110900.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250930110900 - 副本.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>
从下表可以看到，在20此实验中，成功率基本都是50%以下。

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250930112340.png" width="80%" />
<figcaption>  
</figcaption>
</div>








# 总结

开源的项目：




~~~
PS个人观点：对于VLN任务而言。language输入重要性略低，只是为了交互。更重要或者说更难的是“轻地图，重感知”的实现。
此外，得益于DeepSeek，ChatGPT等基础通用大模型的强大，LLM或者VLM具备一定的common sense，往往只需要fine-tune，甚至zero-shot也可以。所以这也“language”这个词的主要作用。但本质整个感知的pipeline，似乎“language”的位置越高的工作往往只能仿真，而“视觉感知”、“控制policy”等比重越大的工作往往可部署于实际机器人中
~~~