---
layout: post
title: "Paper Survey之——Awesome Transformer-based SLAM"
date:   2025-03-13
tags: [SLAM, Deep Learning]
comments: true
author: kwanwaipang
toc: false #true
---


* 目录
{:toc}


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
之前博客对Transformer进行了基本的学习（从NLP到CV），鉴于Transformer强大的数据（时间与空间维度）关联能力，个人感觉其在SLAM问题上应该是有不少的应用空间的，为此写下本博文，记录本人调研收集的ransformer-based SLAM，visual odometry, mapping（depth estimation）以及optical estimation

本博文仅供本人学习记录用~

* [What is Transformer? Form NLP to CV](https://kwanwaipang.github.io/Transformer/)
* [Survey for Learning-based VO/VIO](https://kwanwaipang.github.io/File/Blogs/Poster/Learning_based_VO.html)
* [Awesome-Learning-based-VO-VIO](https://github.com/KwanWaiPang/Awesome-Learning-based-VO-VIO)
* Keep update the paper list in: [Awesome-Transformer-based-SLAM](https://github.com/KwanWaiPang/Awesome-Transformer-based-SLAM)


# Paper List

## Transformer-based SLAM

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`CVPR`|[MASt3R-SLAM: Real-Time Dense SLAM with 3D Reconstruction Priors](https://arxiv.org/pdf/2412.12392)|[![Github stars](https://img.shields.io/github/stars/rmurai0610/MASt3R-SLAM.svg)](https://github.com/rmurai0610/MASt3R-SLAM)|[Website](https://edexheim.github.io/mast3r-slam/) <br> [Test](https://kwanwaipang.github.io/MASt3R-SLAM/)
|2022|`ICARM`|[Tlcd: A transformer based loop closure detection for robotic visual slam](https://howardli0816.github.io/files/TLCD_A_Transformer_based_Loop_Closure_Detection_for_Robotic_Visual_SLAM.pdf)|---|---|
|2022|`ECCV`|[Jperceiver: Joint perception network for depth, pose and layout estimation in driving scenes](https://arxiv.org/pdf/2207.07895)|[![Github stars](https://img.shields.io/github/stars/sunnyHelen/JPerceiver.svg)](https://github.com/sunnyHelen/JPerceiver)|---|


## Transformer-based Pose Tracking

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`arXiv`|[XIRVIO: Critic-guided Iterative Refinement for Visual-Inertial Odometry with Explainable Adaptive Weighting](https://arxiv.org/pdf/2503.00315)|---|---|
|2025|`IEEE Acess`|[Transformer-based model for monocular visual odometry: a video understanding approach](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10845764)|[![Github stars](https://img.shields.io/github/stars/aofrancani/TSformer-VO.svg)](https://github.com/aofrancani/TSformer-VO)|---|
|2024|`arXiv`|[MASt3R-SfM: a Fully-Integrated Solution for Unconstrained Structure-from-Motion](https://arxiv.org/pdf/2409.19152)|[![Github stars](https://img.shields.io/github/stars/naver/mast3r.svg)](https://github.com/naver/mast3r/tree/mast3r_sfm)|MASt3R sfm version|
|2024|Msc Thesis|[End-to-End Learned Visual Odometry Based on Vision Transformer](https://www.utupub.fi/bitstream/handle/10024/178848/Aman_Manishbhai_Vyas_Thesis.pdf?sequence=1)|---|---|
|2024|`arXiv`|[Causal Transformer for Fusion and Pose Estimation in Deep Visual Inertial Odometry](https://arxiv.org/pdf/2409.08769)|[![Github stars](https://img.shields.io/github/stars/ybkurt/VIFT.svg)](https://github.com/ybkurt/VIFT)|---|
|2024|`IJRA`|[DDETR-SLAM: A Transformer-Based Approach to Pose Optimization in Dynamic Environments](https://assets-eu.researchsquare.com/files/rs-2965479/v1_covered_409a1161-fe39-4b94-9411-68639c8215b1.pdf)|---|---|
|2023|`CVPR`|[Modality-invariant Visual Odometry for Embodied Vision](https://openaccess.thecvf.com/content/CVPR2023/papers/Memmel_Modality-Invariant_Visual_Odometry_for_Embodied_Vision_CVPR_2023_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/memmelma/VO-Transformer.svg)](https://github.com/memmelma/VO-Transformer)|[Website](https://memmelma.github.io/vot/)
|2023|`MAV`|[ViTVO: Vision Transformer based Visual Odometry with Attention Supervision](https://elsalab.ai/publications/2023/ViTVO_Vision_Transformer_based_Visual_Odometry_with_Attention_Supervision.pdf)|---|---|
|2023|`International Conference on Haptics and Virtual Reality`|[VIOFormer: Advancing Monocular Visual-Inertial Odometry Through Transformer-Based Fusion](https://link.springer.com/chapter/10.1007/978-3-031-56521-2_2)|---|---|
|2022|`IEEE Intelligent Vehicles Symposium`|[Attention guided unsupervised learning of monocular visual-inertial odometry](https://github.com/KwanWaiPang/Awesome-Transformer-based-SLAM/blob/pdf/file/Attention_Guided_Unsupervised_learning_of_Monocular_Visual-inertial_Odometry.pdf)|---|---|
|2022|`IEEE-SJ`|[Ema-vio: Deep visual–inertial odometry with external memory attention](https://arxiv.org/pdf/2209.08490)|---|---|
|2022|`IROS`|[AFT-VO: Asynchronous fusion transformers for multi-view visual odometry estimation](https://arxiv.org/pdf/2206.12946)|---|---|
|2022|`arXiv`|[Dense prediction transformer for scale estimation in monocular visual odometry](https://arxiv.org/pdf/2210.01723)|---|---|
|2021|`Neural Computing and Applications`|[Transformer guided geometry model for flow-based unsupervised visual odometry](https://arxiv.org/pdf/2101.02143)|---|---|

## Transformer-based Optical Flow

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2023|`arXiv`|[Win-win: Training high-resolution vision transformers from two windows](https://arxiv.org/pdf/2310.00632)|---|---|
|2023|`arXiv`|[Flowformer: A transformer architecture and its masked cost volume autoencoding for optical flow](https://arxiv.org/pdf/2306.05442)|---|---|
|2023|`CVPR`|[FlowFormer++: Masked Cost Volume Autoencoding for Pretraining Optical Flow Estimation](https://openaccess.thecvf.com/content/CVPR2023/papers/Shi_FlowFormer_Masked_Cost_Volume_Autoencoding_for_Pretraining_Optical_Flow_Estimation_CVPR_2023_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/XiaoyuShi97/FlowFormerPlusPlus.svg)](https://github.com/XiaoyuShi97/FlowFormerPlusPlus)|---|
|2023|`CVPR`|[Transflow: Transformer as flow learner](http://openaccess.thecvf.com/content/CVPR2023/papers/Lu_TransFlow_Transformer_As_Flow_Learner_CVPR_2023_paper.pdf)|---|---|
|2022|`CVPR`|[Craft: Cross-attentional flow transformer for robust optical flow](http://openaccess.thecvf.com/content/CVPR2022/papers/Sui_CRAFT_Cross-Attentional_Flow_Transformer_for_Robust_Optical_Flow_CVPR_2022_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/askerlee/craft.svg)](https://github.com/askerlee/craft)|---|
|2022|`CVPR`|[Learning optical flow with kernel patch attention](https://openaccess.thecvf.com/content/CVPR2022/papers/Luo_Learning_Optical_Flow_With_Kernel_Patch_Attention_CVPR_2022_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/megvii-research/KPAFlow.svg)](https://github.com/megvii-research/KPAFlow)|---|
|2022|`CVPR`|[Global Matching with Overlapping Attention for Optical Flow Estimation](https://openaccess.thecvf.com/content/CVPR2022/papers/Zhao_Global_Matching_With_Overlapping_Attention_for_Optical_Flow_Estimation_CVPR_2022_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/xiaofeng94/GMFlowNet.svg)](https://github.com/xiaofeng94/GMFlowNet)|---|
|2022|`CVPR`|[Flowformer: A transformer architecture for optical flow](https://arxiv.org/pdf/2203.16194)|[![Github stars](https://img.shields.io/github/stars/drinkingcoder/FlowFormer-Official.svg)](https://github.com/drinkingcoder/FlowFormer-Official)|---|



## Transformer-based Mapping

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`CVPR`|[Fast3R: Towards 3D Reconstruction of 1000+ Images in One Forward Pass](https://arxiv.org/pdf/2501.13928)|[![Github stars](https://img.shields.io/github/stars/facebookresearch/fast3r.svg)](https://github.com/facebookresearch/fast3r)| [Website](https://fast3r-3d.github.io/) <br> [Test](https://kwanwaipang.github.io/Fast3R/)
|2024|`CVPR`|[Depth anything: Unleashing the power of large-scale unlabeled data](https://openaccess.thecvf.com/content/CVPR2024/papers/Yang_Depth_Anything_Unleashing_the_Power_of_Large-Scale_Unlabeled_Data_CVPR_2024_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/LiheYoung/Depth-Anything.svg)](https://github.com/LiheYoung/Depth-Anything)|[Website](https://depth-anything.github.io/)
|2024|`CVPR`|[DeCoTR: Enhancing Depth Completion with 2D and 3D Attentions](https://openaccess.thecvf.com/content/CVPR2024/papers/Shi_DeCoTR_Enhancing_Depth_Completion_with_2D_and_3D_Attentions_CVPR_2024_paper.pdf)|---|---|
|2024|`CVPR`|[Learning to adapt clip for few-shot monocular depth estimation](https://openaccess.thecvf.com/content/WACV2024/papers/Hu_Learning_To_Adapt_CLIP_for_Few-Shot_Monocular_Depth_Estimation_WACV_2024_paper.pdf)|---|---| 
|2024|`ECCV`|[Grounding Image Matching in 3D with MASt3R](https://arxiv.org/pdf/2406.09756)|[![Github stars](https://img.shields.io/github/stars/naver/mast3r.svg)](https://github.com/naver/mast3r)| [Website](https://europe.naverlabs.com/blog/mast3r-matching-and-stereo-3d-reconstruction/) <br> [Test](https://kwanwaipang.github.io/File/Blogs/Poster/MASt3R-SLAM.html)
|2024|`CVPR`|[DUSt3R: Geometric 3D Vision Made Easy](https://openaccess.thecvf.com/content/CVPR2024/papers/Wang_DUSt3R_Geometric_3D_Vision_Made_Easy_CVPR_2024_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/naver/dust3r.svg)](https://github.com/naver/dust3r)| [Website](https://europe.naverlabs.com/research/publications/dust3r-geometric-3d-vision-made-easy/) <br> [Test](https://kwanwaipang.github.io/File/Blogs/Poster/MASt3R-SLAM.html)
|2024|`TIP`|[BinsFormer: Revisiting Adaptive Bins for Monocular Depth Estimation](https://arxiv.org/pdf/2204.00987)|[![Github stars](https://img.shields.io/github/stars/zhyever/Monocular-Depth-Estimation-Toolbox.svg)](https://github.com/zhyever/Monocular-Depth-Estimation-Toolbox)|---|
|2024|`TIP`|[GLPanoDepth: Global-to-Local Panoramic Depth Estimation](https://arxiv.org/pdf/2202.02796)|---|---|
|2023|`ICCV`|[Towards zero-shot scale-aware monocular depth estimation](https://openaccess.thecvf.com/content/ICCV2023/papers/Guizilini_Towards_Zero-Shot_Scale-Aware_Monocular_Depth_Estimation_ICCV_2023_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/tri-ml/vidar.svg)](https://github.com/tri-ml/vidar)|[website](https://sites.google.com/view/tri-zerodepth)|
|2023|`ICCV`|[Egformer: Equirectangular geometry-biased transformer for 360 depth estimation](https://openaccess.thecvf.com/content/ICCV2023/papers/Yun_EGformer_Equirectangular_Geometry-biased_Transformer_for_360_Depth_Estimation_ICCV_2023_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/noahzn/Lite-Mono.svg)](https://github.com/noahzn/Lite-Mono)|---|
|2023|`Machine Intelligence Research`|[Depthformer: Exploiting long-range correlation and local information for accurate monocular depth estimation](https://link.springer.com/content/pdf/10.1007/s11633-023-1458-0.pdf)|---|---|
|2023|`CVPR`|[Lite-mono: A lightweight cnn and transformer architecture for self-supervised monocular depth estimation](https://openaccess.thecvf.com/content/CVPR2023/papers/Zhang_Lite-Mono_A_Lightweight_CNN_and_Transformer_Architecture_for_Self-Supervised_Monocular_CVPR_2023_paper.pdf)|---|---|
|2023|`CVPR`|[CompletionFormer: Depth Completion with Convolutions and Vision Transformers](https://openaccess.thecvf.com/content/CVPR2023/papers/Zhang_CompletionFormer_Depth_Completion_With_Convolutions_and_Vision_Transformers_CVPR_2023_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/youmi-zym/CompletionFormer.svg)](https://github.com/youmi-zym/CompletionFormer)|[website](https://youmi-zym.github.io/projects/CompletionFormer/)|
|2023|`ICRA`|[Lightweight monocular depth estimation via token-sharing transformer](https://arxiv.org/pdf/2306.05682)|---|---|
|2023|`AAAI`|[ROIFormer: Semantic-Aware Region of Interest Transformer for Efficient Self-Supervised Monocular Depth Estimation](https://d1wqtxts1xzle7.cloudfront.net/104480606/25173-libre.pdf?1690190871=&response-content-disposition=inline%3B+filename%3DROIFormer_Semantic_Aware_Region_of_Inter.pdf&Expires=1741856732&Signature=KUxZHd6ZmNPg8XrNv3m~pPy~vdm9zxVdSFmbVrrYb~ZO0XTVpbbkHMgYNa05AQHpHA6NE7YckuF85Oa~rNBfT3LoMWiPm~UIxIk5zzFj6jevZsEe7WY33hUOfYeW~4JbRdYhpBN1U1zAyM4APilqFNRQMrinJ6CYmdrgoHaW6Afb5Xr2jNknzZ6zbVkB4ot26OreDLphqzyyHnmdH2YsOzbd2hTimakiibYNsY97axBqpY-u54BWhJW7-b8vtSC250M19hInvXTD79oHySYw7IUuCXwVJ4~UkJK~8ZTKVDtt3gSwMlqrKkZVv7pdzyLgbCpOHS~1VtA26sWmzyf4Hg__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA)|---|---|
|2023|`ICRA`|[TODE-Trans: Transparent Object Depth Estimation with Transformer](https://arxiv.org/pdf/2209.08455)|[![Github stars](https://img.shields.io/github/stars/yuchendoudou/TODE.svg)](https://github.com/yuchendoudou/TODE)|---|
|2023|`AAAI`|[Deep digging into the generalization of self-supervised monocular depth estimation](https://arxiv.org/pdf/2205.11083)|[![Github stars](https://img.shields.io/github/stars/sjg02122/MonoFormer.svg)](https://github.com/sjg02122/MonoFormer)|---|
|2022|`ECCV`|[PanoFormer: Panorama Transformer for Indoor 360 Depth Estimation](https://arxiv.org/pdf/2203.09283)|[![Github stars](https://img.shields.io/github/stars/zhijieshen-bjtu/PanoFormer.svg)](https://github.com/zhijieshen-bjtu/PanoFormerr)|---|
|2022|`AAAI`|[Improving 360 monocular depth estimation via non-local dense prediction transformer and joint supervised and self-supervised learning](https://arxiv.org/pdf/2109.10563)|---|---| 
|2022|`arXiv`|[MVSFormer: Multi-view stereo by learning robust image features and temperature-based depth](https://arxiv.org/pdf/2208.02541)|---|---|
|2022|`arXiv`|[Objcavit: improving monocular depth estimation using natural language models and image-object cross-attention](https://arxiv.org/pdf/2211.17232)|[![Github stars](https://img.shields.io/github/stars/DylanAuty/ObjCAViT.svg)](https://github.com/DylanAuty/ObjCAViT)|---|
|2022|`arXiv`|[Depthformer: Multiscale Vision Transformer For Monocular Depth Estimation With Local Global Information Fusion](https://arxiv.org/pdf/2207.04535)|[![Github stars](https://img.shields.io/github/stars/ashutosh1807/Depthformer.svg)](https://github.com/ashutosh1807/Depthformer)|---|
|2022|`arXiv`|[Sidert: A real-time pure transformer architecture for single image depth estimation](https://arxiv.org/pdf/2204.13892)|---|---|
|2022|`ECCV`|[Hybrid transformer based feature fusion for self-supervised monocular depth estimation](https://arxiv.org/pdf/2211.11066)|---|---|
|2022|`ECCV`|[Spike transformer: Monocular depth estimation for spiking camera](https://fq.pkwyx.com/default/https/www.ecva.net/papers/eccv_2022/papers_ECCV/papers/136670034.pdf)|[![Github stars](https://img.shields.io/github/stars/Leozhangjiyuan/MDE-SpikingCamera.svg)](https://github.com/Leozhangjiyuan/MDE-SpikingCamera)|---|
|2022|`3DV`|[MonoViT: Self-Supervised Monocular Depth Estimation with a Vision Transformer](https://arxiv.org/pdf/2208.03543)|[![Github stars](https://img.shields.io/github/stars/zxcqlf/MonoViT.svg)](https://github.com/zxcqlf/MonoViT)|---|
|2022|`arXiv`|[DEST: "Depth Estimation with Simplified Transformer](https://arxiv.org/pdf/2204.13791)|---|---|
|2022|`arXiv`|[SparseFormer: Attention-based Depth Completion Network](https://arxiv.org/pdf/2206.04557)|---|---|
|2022|`CVPR`|[GuideFormer: Transformers for Image Guided Depth Completion](https://openaccess.thecvf.com/content/CVPR2022/papers/Rho_GuideFormer_Transformers_for_Image_Guided_Depth_Completion_CVPR_2022_paper.pdf)|---|---|
|2022|`CVPR`|[Multi-frame self-supervised depth with transformers](https://openaccess.thecvf.com/content/CVPR2022/papers/Guizilini_Multi-Frame_Self-Supervised_Depth_With_Transformers_CVPR_2022_paper.pdf)|---|---|
|2022|`arXiv`|[Transformers in Self-Supervised Monocular Depth Estimation with Unknown Camera Intrinsics](https://arxiv.org/pdf/2202.03131)|---|---|
|2021|`ICCV`|[Revisiting stereo depth estimation from a sequence-to-sequence perspective with transformers](https://openaccess.thecvf.com/content/ICCV2021/papers/Li_Revisiting_Stereo_Depth_Estimation_From_a_Sequence-to-Sequence_Perspective_With_Transformers_ICCV_2021_paper.pdf)|---|---|
|2021|`BMVC`|[Transformer-based Monocular Depth Estimation with Attention Supervision](https://www.bmvc2021-virtualconference.com/assets/papers/0244.pdf)|[![Github stars](https://img.shields.io/github/stars/WJ-Chang-42/ASTransformer.svg)](https://github.com/WJ-Chang-42/ASTransformer)|---|
|2021|`ICCV`|[Transformer-Based Attention Networks for Continuous Pixel-Wise Prediction](https://openaccess.thecvf.com/content/ICCV2021/papers/Yang_Transformer-Based_Attention_Networks_for_Continuous_Pixel-Wise_Prediction_ICCV_2021_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/ygjwd12345/TransDepth.svg)](https://github.com/ygjwd12345/TransDepth)|---|
|2021|`ICCV`|[Vision transformers for dense prediction](https://openaccess.thecvf.com/content/ICCV2021/papers/Ranftl_Vision_Transformers_for_Dense_Prediction_ICCV_2021_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/isl-org/DPT.svg)](https://github.com/isl-org/DPT)|---|

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

## Other Resources
* [Awesome-Transformer-Attention](https://github.com/cmhungsteve/Awesome-Transformer-Attention)
* [Dense-Prediction-Transformer-Based-Visual-Odometry](https://github.com/sumedhreddy90/Dense-Prediction-Transformer-Based-Visual-Odometry)
* [Visual SLAM with Vision Transformers(ViT)](https://github.com/MisterEkole/slam_with_vit)
* [Awesome-Learning-based-VO-VIO](https://github.com/KwanWaiPang/Awesome-Learning-based-VO-VIO)

# Paper Reading
接下来重点阅读几篇论文

## Causal Transformer for Fusion and Pose Estimation in Deep Visual Inertial Odometry

<!-- * [paper](https://arxiv.org/pdf/2409.08769)
* [github](https://github.com/ybkurt/VIFT) -->

当前大部分的基于learning的VIO都是采用RNN来对时序进行建模。而Transformer对时序信号的强大的建模能力，可以作为RNN的替代来进一步提升VIO的精度和鲁棒性。
如下图所示,先通过两个网络将图像和IMU投影成Latent Vector，而Transformer来实现两个数据的融合以及位姿的估计。
而采用的Transformer结构就是采用ViT[《An image is worth 16x16 words: Transformers for image recognition at scale》](https://arxiv.org/pdf/2010.11929/1000)的结构（没有分类的token以及不以图像patch的形式）
至于监督，从图上来看似乎是监督rotation，然后用RPMG来进行梯度的反向传播。
所谓的`RPMG`应该就是论文中提到的`Riemannian manifold optimization`，不采用欧拉角或者四元数来监督，而是采用`Riemannian manifold optimization`来让网络更好的学习rotation
<div align="center">
  <img src="../images/微信截图_20250314125229.png" width="60%" />
<figcaption>  
</figcaption>
</div>

* 更正，后续loss function可以看到，监督是同时监督rotation和translation的，只是对于rotation用的是旋转矩阵，而不是欧拉角或者四元数

<div align="center">
  <img src="../images/微信截图_20250314135327.png" width="60%" />
<figcaption>  
</figcaption>
</div>


这篇工作采用的结构与思路其实跟ECCV2022的[Efficient deep visual and inertial odometry with adaptive visual modality selection](https://arxiv.org/pdf/2205.06187)很类似，如下图所示。该工作采用的是LSTM进行融合，此处改为Transformer，当然Visual-Selective-VIO的监督loss是考虑了translation和rotation的.
<div align="center">
  <img src="../images/微信截图_20250314130039.png" width="60%" />
<figcaption>  
</figcaption>
</div>

而本文的imu的encoder也是采用该工作网络结构与训练权重的，image则是采用Flownet及其预训练权重。这两者在训练过程都是fix住的，没有重新训练（不过github写的是`We use pretrained image and IMU encoders of Visual-Selective-VIO model`）

本文所谓的`Causal Transformer`如下图所示。跟ViT的结构差不多，最后通过两层的MLP来输出pose（6个自由度，N+1张图片对应N组姿态结果）

<div align="center">
  <img src="../images/微信截图_20250314134510.png" width="60%" />
<figcaption>  
</figcaption>
</div>

训练采用的是KITTI odometry数据集（验证也是KITTI，无泛化其他数据集的验证）。
实验对比效果如下图所示

<div align="center">
  <img src="../images/微信截图_20250314135722.png" width="60%" />
<figcaption>  
</figcaption>
</div>

