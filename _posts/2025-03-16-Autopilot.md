---
layout: post
title: "智驾中的“无图”"
date:   2025-03-16
tags: [Robotics]
comments: true
author: kwanwaipang
toc: true
excerpt: "本博文记录了本人调研自动驾驶中无图的相关survey" # 【核心：指定摘要分隔符】
---


<!-- * 目录
{:toc} -->


# 高精度地图（HD Map）
{: #高精度地图（hd-map） }

要了解智驾中“无图”的概念首先我们看看有图是怎么样的？
导航地图一般可分为标准地图（SD Map）、车道级地图（LD Map）、高精地图（HD Map）。

对于自动驾驶系统，一般所谓的有图指的是高精地图。而所谓的高精度地图（HD map）是相对于常用的普通电子导航地图而言的，具有高精度、需要实时更新等特点。
高精度地图包括大量的驾驶辅助信息，最重要的信息是道路网的精确三维表征。
不仅有高精度的坐标，同时还有准确的车道形状，并且每个车道的坡度、曲率、航向、高程、侧倾等数据也都含有。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241110212714.png" width="80%" />
<figcaption>  
如交叉路口布局和路标位置
</figcaption>
</div>

此外，高精度地图还包括许多语义信息，地图可能会包括交通灯上不同颜色的含义，也可能指示道路的速度限速，以及左转车道的位置，高精度地图做重要的特征之一是，精度，手机上的导航只能达到10米级精度，高精度地图可以达到厘米级精度，这对无人驾驶车至关重要。
一般的高精度图的制作都包括以下几个步骤

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241110212857.png" width="80%" />
<figcaption>  
通常的高精地图制作流程
</figcaption>
</div>

而这么丰富的信息及复杂的流程，就意味着需要采集的时间与更新的成本，且一般更新的频率都比较低。
此外，高精地图的覆盖也是有限的，毕竟受限于法律或者法规等因素，不是所有的道路都允许采集高精度地图数据。同时也不是谁都可以做的，需要国家相关部门审批。

因此“轻地图，重感知”的概念应运而生，开发全场景的自动驾驶系统，不再依赖高精地图是关键。但是没有了高精地图，自然而然的给自动驾驶系统带来了更大的挑战，比如自动驾驶可能不知道车辆在哪条车道上，更不知道众多信号灯中，哪一个信号灯和车道线匹配。因此需要车辆具备识别和理解车道线和道路语义信息的能力。
可以理解为有高精地图就可以开启“上帝视角”，但是很耗资源，而没有高精地图就需要车辆具备“自我感知”的能力。

# “无图”
{: #“无图” }

不同的车企对于“无图”的定义是不同的，但其共同点就是：不依赖高成本的高精度地图。

## 特斯拉的FSD Lanes Neural Network方案
{: #特斯拉的fsd-lanes-neural-network方案 }

仅使用SD地图中的道路的几何&拓扑关系，车道等级、数量、宽度、属性信息和Occupancy特征就能够构建出实时的车道级拓扑结构，从而结束了车道级拓扑结构只能从高精地图中获取的难点，在技术方案和落地实现上给出了高精地图的替代方案。

<div align="center">
  <iframe src="https://www.youtube.com/embed/ODSJsviD_SU?si=u_Vk25e32MibDMn9" width="600" height="340" frameborder="0" scrolling="no" allowfullscreen></iframe>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/tesla-ai-day-fsd-lane-model-architecture.jpg" width="80%" />
<figcaption>  

</figcaption>
</div>

在2023年特斯拉FSDv12版本已经走向了端到端的方案。原本的自动驾驶系统主要分为三大块：感知-决策（人类预定的规则）-执行。而FSDv12则是直接把像素级的图像输入到神经网络中，输出直接是车辆的控制指令（操作，即刹车、油门、方向盘等），这样的方案就是端到端的方案,也就是只接收像素，不做任何识别和决策，直接通过大模型经验进行执行。

而模型的训练数据则是经过严格筛选的，“驾驶行为规范的”的数据（据说完成这个数据有三个条件：1、几十万颗英伟达H100级芯片训练集；2、几亿英里的真实自动驾驶Bev视频数据（特斯拉在北美的保险业务衍生出驾驶员行为监测系统）；3每年超过20亿美元的训练成本）。

<div align="center">
  <iframe src="https://www.youtube.com/embed/oWvaDMzgTp0?si=oeN99fkkD2QC2my6" width="600" height="340" frameborder="0" scrolling="no" allowfullscreen></iframe>
</div>

FSD V12.5.6.3高速测试（国外高速比国内要难~）

<div align="center">
  <iframe src="https://www.youtube.com/embed/zKrZQ5lvHRQ?si=y4jj930__UVZSkWB" width="600" height="340" frameborder="0" scrolling="no" allowfullscreen></iframe>
</div>

## 小鹏的XNet
{: #小鹏的xnet }

XNet更加倚重纯视觉BEV，能够实现超强的环境感知能力，小鹏实现的“无图化”就是依靠XNet来实时构建“高精地图”达成的。
小鹏的无图NGP和有图NGP是同一套技术栈，差别仅仅是把原先高精地图的输入，换成了导航地图的输入和实时感知对导航信息的理解。
为此，XNet需要感知距离的加长，提供决策规划需要的超视距的环境信息；同时通过学习大量的道路及路口特征，增强感知复杂道路结构的能力。
“无图方案”在路段行驶时基本没有问题，面临的主要还是路口的问题，可以看到在路口区域确实存在感知盲区，所以相应的决策会显得谨慎、迟疑。

除了“无图”方案外，小鹏还具有另外一种模式“AI”代驾，只需要学习一次即可启动城市NOA。“AI”代驾更多的是一种众包图和无图之间的模式，其学习过程中只会记忆导航点和转弯信息，实际运行过程中离不开“无图”能力，学习只是为了的提升体验和安全等。
主要是学习个性化的行车策略，并不是完全为了建图。从城区遇到的问题可以预见，面对高频变化的城区freespace的通行道路，智驾系统需要具备强大的实时感知和决策能力才行。

* [真无图，还不听导航的？小鹏XNGP辅助驾驶 勇闯北京二环](https://player.bilibili.com/player.html?isOutside=true&aid=317393036&bvid=BV16P411s7Gi&cid=1237487111&p=1)

## 华为ADS
{: #华为ads }

华为是采用激光+视觉的god网络与SD map实现“无图”方案。从实现上来说，华为采用激光去实现“occupancy”网络类似的功能，并且可以实时生成道路的拓扑结构。
华为的智驾体验是胜过小鹏的，“无图”方案计划改为年底开放全国可用。华为最开始采用的众包建图，但是经过对上海的重建发现难度太大放弃了，目前从华为PR的宣传看all in了“无图”方案。

* [华为无图城区智驾，年底全国可用！什么水平？](https://player.bilibili.com/player.html?isOutside=true&aid=660969030&bvid=BV1Uh4y1Y7AJ&cid=1264974826&p=1)

## 蔚来
{: #蔚来 }

蔚来的“无图”更偏向于众包建图方案，主要还是由于感知能力还没有提升到很高的程度，从上面的视频看也在做“无图”方案的探索。

## 理想
{: #理想 }

理想的“无图”方案是来自于清华的技术，主要是构建路口的特征用于协助实时感知建图。
理想的方案概括来说：路段“无图”，路口采用众包建图。从实际驾驶看，路段确实不需要建图，难点在于路口的拓扑结构和红绿灯车道关系绑定，所以理想主要是在解决这2个问题。
目前理想内部也在大力推进NPN方案，其优点是理论上解决了地图的在线更新问题。但是实际效果暂时还不可知，而且像全国各个城市路口建图这种庞大的工程要落地，会遇到很多问题。

## 广汽：无图纯视觉
{: #广汽：无图纯视觉 }

* [广汽科技日回顾丨深度解读无图纯视觉智能驾驶技术](https://www.gac.com.cn/cn/csr/detail?baseid=18761)

# 参考资料
{: #参考资料 }

* [高精度地图HD map](https://qingsimon.github.io/post/2018-09-26-%E9%AB%98%E7%B2%BE%E5%BA%A6%E5%9C%B0%E5%9B%BEhd-map/)
* [各车企智驾“无图”方案详解](https://mp.weixin.qq.com/s/JX4AzzJYOsfWSXNSYCcLcw)
* [Analyzing Tesla AI Day 2022](https://kevinchen.co/blog/tesla-ai-day-2022/)
