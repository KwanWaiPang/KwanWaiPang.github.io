---
layout: post
title: "实验笔记之——《Lightning-Speed Lidar Localization and Mapping》"
date:   2025-12-15
tags: [LiDAR，SLAM]
comments: true
author: kwanwaipang
# toc: true
---


<!-- * 目录
{:toc} -->

本博文对高翔开源的Lightning-LM（即Lightning-Speed Lidar Localization and Mapping）
进行测试与复现。

本博文仅供本人学习记录用~

* [Github源码](https://github.com/gaoxiang12/lightning-lm)
* 本博文复现过程采用的代码及代码注释（如有）：[My github repository](https://github.com/R-C-Group/Lightning-LM)

# 安装配置

* 采用ubuntu22.01(ROS2 humble)
* 首先创建一个工作空间

```bash
mkdir -p colcon_ws/src
cd ~/colcon_ws/src

git clone https://github.com/gaoxiang12/lightning-lm.git
# 或者采用我的代码
git clone git@github.com:R-C-Group/Lightning-LM.git
```


