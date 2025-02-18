---
layout: post
title: "Awesome Event-based Contrast Maximization"
date:   2025-02-18
tags: [Event-based Vision]
comments: true
author: kwanwaipang
toc: false # true
---


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言

在Event Camera领域基于Contrast Maximization(CMax,或CM)框架衍生了大量的工作，包括光流估计、深度估计、运动估计（2D、3D甚至6D）等等。
其实本质上，CM这个框架是通过对事件进行运动补偿，而在做运动补偿的过程中估算出事件的位移，而这个位移也就是所谓的event point trajectories，而基于像素的位移就可以推广到系列视觉的任务。

```aligns point trajectories on the image plane with event data by maximizing the contrast of an image of warped events (IWE)```

本博文对Event-based Contrast Maximization进行较为全面的survey，并且将对应的经典论文都做简单的介绍



* 目录
{:toc}



# Paper List

## A Unifying Contrast Maximization Framework for Event Cameras, with Applications to Motion, Depth and Optical Flow Estimation (CVPR2018)
* [paper](https://openaccess.thecvf.com/content_cvpr_2018/papers/Gallego_A_Unifying_Contrast_CVPR_2018_paper.pdf)

## Accurate angular velocity estimation with an event camera (RAL2017)
* [paper](https://www.zora.uzh.ch/id/eprint/138896/1/RAL16_Gallego.pdf)

## Focus is all you need: Loss functions for event-based vision (CVPR2019)
* [paper](https://openaccess.thecvf.com/content_CVPR_2019/papers/Gallego_Focus_Is_All_You_Need_Loss_Functions_for_Event-Based_Vision_CVPR_2019_paper.pdf)

## Event Cameras, Contrast Maximization and Reward Functions: An Analysis (CVPR2019)
* [paper](https://openaccess.thecvf.com/content_CVPR_2019/papers/Stoffregen_Event_Cameras_Contrast_Maximization_and_Reward_Functions_An_Analysis_CVPR_2019_paper.pdf)
* [Github](https://github.com/TimoStoff/events_contrast_maximization): A python library for contrast maximization and voxel creation using events.

## Globally optimal contrast maximisation for event-based motion estimation (CVPR2020)
* [paper](https://openaccess.thecvf.com/content_CVPR_2020/papers/Liu_Globally_Optimal_Contrast_Maximisation_for_Event-Based_Motion_Estimation_CVPR_2020_paper.pdf)

## Real-Time Rotational Motion Estimation With Contrast Maximization Over Globally Aligned Events (RAL2021)
* [paper](https://ieeexplore.ieee.org/abstract/document/9454404)

## Globally-optimal event camera motion estimation (ECCV2020)
* [paper](https://arxiv.org/pdf/2203.03914)

## Globally-optimal contrast maximisation for event cameras (TPAMI2021)
* [paper](https://arxiv.org/pdf/2206.05127)
* 此篇是上一篇的期刊版本

## Event Collapse in Contrast Maximization Frameworks (Sensor 2022)
* [paper](https://web.archive.org/web/20220813065935id_/https://depositonce.tu-berlin.de/bitstream/11303/17328/1/sensors-22-05190-v3.pdf)

## Visual Odometry with an Event Camera Using Continuous Ray Warping and Volumetric Contrast Maximization (Sensor2022)
* [paper](https://arxiv.org/pdf/2107.03011)

## Contrast maximization-based feature tracking for visual odometry with an event camera (Processes2022)

## Recursive Contrast Maximization for Event-Based High-Frequency Motion Estimation (IEEE Access2022)

## A Fast Geometric Regularizer to Mitigate Event Collapse in the Contrast Maximization Framework (AIS2023)
* [paper](https://advanced.onlinelibrary.wiley.com/doi/pdfdirect/10.1002/aisy.202200251)

## Taming contrast maximization for learning sequential, low-latency, event-based optical flow (CVPR2023)
* [paper](https://openaccess.thecvf.com/content/ICCV2023/papers/Paredes-Valles_Taming_Contrast_Maximization_for_Learning_Sequential_Low-latency_Event-based_Optical_Flow_ICCV_2023_paper.pdf)
* [Supplementary Material](https://openaccess.thecvf.com/content/ICCV2023/supplemental/Paredes-Valles_Taming_Contrast_Maximization_ICCV_2023_supplemental.pdf)

## Density Invariant Contrast Maximization for Neuromorphic Earth Observations (CVPR2023)
* [paper](https://openaccess.thecvf.com/content/CVPR2023W/EventVision/papers/Arja_Density_Invariant_Contrast_Maximization_for_Neuromorphic_Earth_Observations_CVPRW_2023_paper.pdf)

## CMax-SLAM: Event-based Rotational-Motion Bundle Adjustment and SLAM System using Contrast Maximization (TRO2024)
* [paper](https://arxiv.org/pdf/2403.08119)

## Secrets of Event-based Optical Flow (ECCV2022)
* [paper](https://arxiv.org/pdf/2207.10022)

## Secrets of Event-based Optical Flow, Depth and Ego-motion Estimation by Contrast Maximization (TPAMI2024)
* [paper](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10517639)
* [github](https://github.com/tub-rip/event_based_optical_flow)
* 这篇是上一篇的期刊版本

## Motion-prior Contrast Maximization for Dense Continuous-Time Motion Estimation (ECCV2024)
* [paper](https://arxiv.org/pdf/2407.10802)
* [github](https://github.com/tub-rip/MotionPriorCMax)

## Secrets of Edge-Informed Contrast Maximization for Event-Based Vision
* [paper](https://arxiv.org/pdf/2409.14611)

# 参考资料