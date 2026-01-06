---
layout: post
title: "调研笔记之——目标跟踪算法"
date:   2026-01-06
tags: [Deep Learning]
comments: true
author: kwanwaipang
toc: true
excerpt: "" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->


# 引言

很久之前做过[基于深度学习的分类网络](https://blog.csdn.net/gwplovekimi/article/details/82928072?spm=1001.2014.3001.5502)和[基于深度学习的目标检测算法](https://blog.csdn.net/gwplovekimi/article/details/82915395)
本博文对目标跟踪算法进行调研及部分工作解读。


主流的目标跟踪算法都是基于Tracking-by-Detecton策略，即基于目标检测的结果来进行目标跟踪。目标检测对应着某人/物的ID，然后再此基础上进行跟踪。

# 经典工作解读

<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]()  -->

|  年份 |  单位  | 模型  |  网站  | 说明 |
|:-----:|:-----:|:-----:|:-----:| ----------- |
|  2025 |  南京大学  | [MOTIP](https://arxiv.org/pdf/2403.16848)  |  [![Github stars](https://img.shields.io/github/stars/MCG-NJU/MOTIP.svg)](https://github.com/MCG-NJU/MOTIP)  | 基于transformer的端到端多目标跟踪 |
|  2025 |  KTH Royal Institute of Technology  | [HiM2SAM](https://arxiv.org/pdf/2507.07603)  | [![Github stars](https://img.shields.io/github/stars/LouisFinner/HiM2SAM.svg)](https://github.com/LouisFinner/HiM2SAM) | 基于sam2（视频目标分割）和CoTracker（视频点追踪），除此之外不需要任何训练。本质是基于transformer结构。1.分层运动估计：粗略运动估计（卡尔曼滤波），当粗略估计不可靠时，结合精细运动估计（点追踪）；2.长/短时记忆库：短时记忆库中存储高置信度的帧，防止一些低置信度帧的错误预测进行干扰；长时记忆库中存储与跟踪目标不同的物体。 |
|  2020 |  MMLab  | MMTracking: OpenMMLab  |  [![Github stars](https://img.shields.io/github/stars/open-mmlab/mmtracking.svg)](https://github.com/open-mmlab/mmtracking)  | 基于PyTorch的视频目标感知开源工具箱 |
|  2019 |  商汤  | [SiamRPN++](https://openaccess.thecvf.com/content_CVPR_2019/papers/Li_SiamRPN_Evolution_of_Siamese_Visual_Tracking_With_Very_Deep_Networks_CVPR_2019_paper.pdf)  |  [![Github stars](https://img.shields.io/github/stars/STVIR/pysot.svg)](https://github.com/STVIR/pysot)  | 引入更深的网络实现孪生网络目标跟踪算法 |
|  2018 |  University of Chinese Academy of Science  | [DaSiamRPN](https://openaccess.thecvf.com/content_ECCV_2018/papers/Zheng_Zhu_Distractor-aware_Siamese_Networks_ECCV_2018_paper.pdf)  |  [![Github stars](https://img.shields.io/github/stars/STVIR/pysot.svg)](https://github.com/STVIR/pysot)  | 对检测数据集进行数据增广，使得其也可以用于训练跟踪模型；构造有语意的负样本对来增强跟踪器的判别能力，让网络学习判别能力，去寻找搜索区域中和模版更相似的物体；提高重跟踪上丢失目标的能力 |
|  2018 |  商汤  | [SiamRPN](https://openaccess.thecvf.com/content_cvpr_2018/papers/Li_High_Performance_Visual_CVPR_2018_paper.pdf)  |  [![Github stars](https://img.shields.io/github/stars/STVIR/pysot.svg)](https://github.com/STVIR/pysot)  | 将检测引入跟踪；结合了跟踪中的孪生网络和检测中的区域推荐网络：孪生网络实现对跟踪目标的适应，让算法可以利用被跟踪目标的信息，完成检测器的初始化；区域推荐网络可以让算法可以对目标位置进行更精准的预测 |
|  2017 |  University of Koblenz-Landau  | [Deep SORT](https://arxiv.org/pdf/1703.07402)  |  [![Github stars](https://img.shields.io/github/stars/nwojke/deep_sort.svg)](https://github.com/nwojke/deep_sort)  | 先通过检测器得到bounding box（生成detections），然后使用卡尔曼滤波预测，再使用匈牙利算法将预测后的tracks和当前帧中的detecions进行匹配（级联匹配和IOU匹配），而匹配的结果则是可以进行卡尔曼滤波更新 |
|  2017 |  CMU  | [BACF](https://openaccess.thecvf.com/content_ICCV_2017/papers/Galoogahi_Learning_Background-Aware_Correlation_ICCV_2017_paper.pdf)  |  [website](http://www.hamedkiani.com/bacf.html)  | 解决了相关滤波类跟踪算法中的边界效应问题，提升了训练样本集的质量和数量，能够精确估计目标的位置变化，从而提高了跟踪器的性能。 |


# 机器人目标/人员跟踪算法


