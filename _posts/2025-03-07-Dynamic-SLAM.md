---
layout: post
title: "Paper Survey之——Awesome Dynamic SLAM"
date:   2025-03-07
tags: [SLAM]
comments: true
author: kwanwaipang
toc: false #true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
之前博客以图片的形式将Dynamic-SLAM相关的调研工作共享出来，但实际阅读是非常困难的，加上容易混乱，因此本博文将完整版ppt给出，并且后续新增的调研也可实时更新，这样避免了每次截图的繁琐操作。

<!-- {% raw %}
<div align="center" style="
  position: relative; 
  width: 100%; 
  height: 500px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe src="https://onedrive.live.com/embed?resid=893B607C76D94A76!120&authkey=!AI5r_iQJbZJQqhw&em=2&wdAr=1.777&wdHideHeaders=true&wdEmbedCode=0" width="100%" height="100%" frameborder="0"></iframe>
</div>
{% endraw %} -->

<div align="center" style="
  position: relative; 
  width: 100%; 
  height: 500px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe width="100%" height="100%"
    src="https://kwanwaipang.github.io/awesome_NeRF_SLAM/学习笔记之——NeRF SLAM（基于神经辐射场的SLAM）-CSDN博客_files/Survey for Dynamic SLAM.pdf#toolbar=0&navpanes=0&scrollbar=0" ></iframe>
</div>

<br>

* 😁原创不易，如果使用请给出引用以及给个star <a class="github-button"   href="https://github.com/KwanWaiPang/KwanWaiPang.github.io"   data-icon="octicon-star"   data-size="large"  data-show-count="true"  aria-label="Star 你的用户名/你的仓库名 on GitHub">Star</a>谢谢😊
* Previous Survey for Dynamic-SLAM: [Blog](https://kwanwaipang.github.io/File/Blogs/Poster/survey_dynamic_SLAM.html)
* 基于3DGS以及Transformer的也有大量跟Dynamic-SLAM相关的工作，具体请见：
  * Awesome-Transformer-based-SLAM: [Paper List](https://github.com/KwanWaiPang/Awesome-Transformer-based-SLAM) 
  * Awesome-3DGS-SLAM: [Paper List](https://github.com/KwanWaiPang/Awesome-3DGS-SLAM)

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->
* Keep update the paper list:

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`arXiv`|[VGGT4D: Mining Motion Cues in Visual Geometry Transformers for 4D Scene Reconstruction](https://arxiv.org/pdf/2511.19971)|[![Github stars](https://img.shields.io/github/stars/3DAgentWorld/VGGT4D.svg)](https://github.com/3DAgentWorld/VGGT4D)|[website](https://3dagentworld.github.io/vggt4d/)|
|2025|`arXiv`|[Human3R: Everyone Everywhere All at Once](https://arxiv.org/pdf/2510.06219?)|[![Github stars](https://img.shields.io/github/stars/fanegg/Human3R.svg)](https://github.com/fanegg/Human3R)|[website](https://fanegg.github.io/Human3R/)|
|2025|`TRO`|[PG-SLAM: Photo-realistic and Geometry-aware RGB-D SLAM in Dynamic Environments](https://arxiv.org/pdf/2411.15800)|---|---|
|2025|`ICCV`|[DyGS-SLAM: Real-Time Accurate Localization and Gaussian Reconstruction for Dynamic Scenes](https://openaccess.thecvf.com/content/ICCV2025/papers/Hu_DyGS-SLAM_Real-Time_Accurate_Localization_and_Gaussian_Reconstruction_for_Dynamic_Scenes_ICCV_2025_paper.pdf)|---|---|
|2025|`Proceedings of the 33rd ACM International Conference on Multimedia`|[SLAM-X: Generalizable Dynamic Removal for NeRF and Gaussian Splatting SLAM](https://dl.acm.org/doi/abs/10.1145/3746027.3754971)|---|---|
|2025|`arXiv`|[VAR-SLAM: Visual Adaptive and Robust SLAM for Dynamic Environments](https://arxiv.org/pdf/2510.16205)|[![Github stars](https://img.shields.io/github/stars/iit-DLSLab/VAR-SLAM.svg)](https://github.com/iit-DLSLab/VAR-SLAM)|---|
|2025|`TIM`|[SSE-SLAM: Semantic Visual SLAM Based on RGB-D Camera for High-Accuracy Pose Measurement in Dynamic Environments](https://ieeexplore.ieee.org/abstract/document/11218804/)|---|---|
|2025|`IEEE IoT`|[DFusion-SLAM: A Lightweight Semantic Fusion Framework for Robust Visual SLAM in Dynamic Environments](https://ieeexplore.ieee.org/abstract/document/11218208/)|---|---|
|2025|`International Conference on Machine Learning and Intelligent Computing`|[A Visual SLAM Algorithm for Indoor Dynamic Scenes Based on Semantic Feature Screening](https://raw.githubusercontent.com/mlresearch/v278/main/assets/wang25b/wang25b.pdf)|---|---|
|2025|`Journal of Visual Communication and Image Representation`|[SegGeo-SLAM: A real-time Visual SLAM system for dynamic environments](https://www.sciencedirect.com/science/article/abs/pii/S104732032500241X)|---|
|2025|`arXiv`|[DyPho-SLAM: Real-time Photorealistic SLAM in Dynamic Environments](https://arxiv.org/pdf/2509.00741)|---|---| 
|2025|`Complex & Intelligent Systems`|[MAGSLAM: multi-modal adaptive generator-based semantic SLAM for enhanced robustness in dynamic environments](https://link.springer.com/content/pdf/10.1007/s40747-025-02058-6.pdf)|---|---|
|2025|`ICCV`|[POMATO: Marrying Pointmap Matching with Temporal Motions for Dynamic 3D Reconstruction](https://arxiv.org/pdf/2504.05692)|[![Github stars](https://img.shields.io/github/stars/wyddmw/POMATO.svg)](https://github.com/wyddmw/POMATO)|---| 
|2025|`arXiv`|[StreamVGGT: Streaming 4D Visual Geometry Transformer](https://arxiv.org/pdf/2507.11539)|[![Github stars](https://img.shields.io/github/stars/wzzheng/StreamVGGT.svg)](https://github.com/wzzheng/StreamVGGT)|[website](https://wzzheng.net/StreamVGGT/)|
|2025|`TIM`|[R4-SLAM: Toward Real-time, Robust, and Resource-Restricted Visual SLAM in Dynamic Environments](https://ieeexplore.ieee.org/abstract/document/11087758)|---|---|
|2025|`arXiv`|[Dy3DGS-SLAM: Monocular 3D Gaussian Splatting SLAM for Dynamic Environments](https://arxiv.org/pdf/2506.05965)|---|---|
|2025|`arXiv`|[GeneA-SLAM2: Dynamic SLAM with AutoEncoder-Preprocessed Genetic Keypoints Resampling and Depth Variance-Guided Dynamic Region Removal](https://arxiv.org/pdf/2506.02736)|[![Github stars](https://img.shields.io/github/stars/qingshufan/GeneA-SLAM2.svg)](https://github.com/qingshufan/GeneA-SLAM2)|---|
|2025|`TASE`|[SDS-SLAM: VSLAM Fusing Static and Dynamic Semantic Information for Driving Scenarios](https://ieeexplore.ieee.org/abstract/document/11015815)|---|---|
|2025|`TIM`|[DOG-SLAM: Enhancing Dynamic Visual SLAM Precision Through GMM-Based Dynamic Object Removal and ORB-Boost](https://ieeexplore.ieee.org/abstract/document/10908975/)|---|---|
|2025|`arXiv`|[DynaGSLAM: Real-Time Gaussian-Splatting SLAM for Online Rendering, Tracking, Motion Predictions of Moving Objects in Dynamic Scenes](https://arxiv.org/pdf/2503.11979)|[![Github stars](https://img.shields.io/github/stars/BlarkLee/DynaGSLAM_official.svg)](https://github.com/BlarkLee/DynaGSLAM_official)|[website](https://blarklee.github.io/dynagslam/)| 
|2025|`arXiv`|[DynoSAM: Open-Source Smoothing and Mapping Framework for Dynamic SLAM](https://arxiv.org/pdf/2501.11893)|[![Github stars](https://img.shields.io/github/stars/ACFR-RPG/DynOSAM.svg)](https://github.com/ACFR-RPG/DynOSAM)|---|
|2025|`CVPR`|[Dynamic Camera Poses and Where to Find Them](https://arxiv.org/pdf/2504.17788)|---|[website](https://research.nvidia.com/labs/dir/dynpose-100k/)<br>[dataset](https://huggingface.co/datasets/nvidia/dynpose-100k)|
|2025|`arXiv`|[Back on Track: Bundle Adjustment for Dynamic Scene Reconstruction](https://arxiv.org/pdf/2504.14516)|---|[website](https://wrchen530.github.io/projects/batrack/)|
|2024|`arXiv`|[2FAST-2LAMAA: A Lidar-Inertial Localisation and Mapping Framework for Non-Static Environments](https://arxiv.org/pdf/2410.05433)|[![Github stars](https://img.shields.io/github/stars/UTS-RI/2fast2lamaa.svg)](https://github.com/UTS-RI/2fast2lamaa)|---|
|2024|`IJRR`|[Multimotion visual odometry](https://journals.sagepub.com/doi/pdf/10.1177/02783649241229095)|---|---|
|2024|`IROS`|[Visual Perception System for Autonomous Driving](https://arxiv.org/pdf/2303.02257)|---|---|
|2024|`IROS`|[SDPL-SLAM: Introducing Lines in Dynamic Visual SLAM and Multi-Object Tracking](https://robotics.ntua.gr/wp-content/uploads/sites/2/2024_Manetas_IntroduceLinesInVisualSLAM-MultiObjectTrack_IROS.pdf)|---|---|
|2024|`RAL`|[DynaMeshSLAM: A Mesh-based Dynamic Visual SLAMMOT Method](https://ieeexplore.ieee.org/abstract/document/10517385/)|---|---|
|2024|`TIV`|[STS-SLAM: Joint Visual SLAM and Multi-Object Tracking Based on Spatio-Temporal Similarity](https://ieeexplore.ieee.org/abstract/document/10559403/)|---|---|
|2024|`Expert Systems with Applications`|[A method of dense point cloud SLAM based on improved YOLOV8 and fused with ORB-SLAM3 to cope with dynamic environments](https://papers.ssrn.com/sol3/Delivery.cfm?abstractid=4848367)|---|---|
|2023|`TITS`|[Fast, Robust, Accurate, Multi-Body Motion Aware SLAM](https://pure.ulster.ac.uk/files/147101806/Fast_Robust_Accurate_Multi_Body_Motion_Aware_SLAM.pdf)|---|---|
|2023|`TRO`|[Dynam-SLAM: An accurate, robust stereo visual-inertial SLAM method in dynamic environments](https://ieeexplore.ieee.org/abstract/document/9866888/)|---|---|
|2023|`TIM`|[VIMOT: A tightly coupled estimator for stereo visual-inertial navigation and multiobject tracking](https://www.researchgate.net/profile/Feng-Shaoquan/publication/372044394_VIMOT_A_Tightly-Coupled_Estimator_for_Stereo_Visual-Inertial_Navigation_and_Multi-Object_Tracking/links/6684fb720a25e27fbc1fde01/VIMOT-A-Tightly-Coupled-Estimator-for-Stereo-Visual-Inertial-Navigation-and-Multiobject-Tracking.pdf)|---|---|
|2022|`TIM`|[SG-SLAM: A real-time RGB-D visual SLAM toward dynamic scenes with semantic and geometric information](https://ieeexplore.ieee.org/abstract/document/9978699/)|---|---|
|2022|`RAL`|[DynaVINS: A Visual-Inertial SLAM for Dynamic Environments](https://arxiv.org/pdf/2208.11500)|[![Github stars](https://img.shields.io/github/stars/url-kaist/dynaVINS.svg)](https://github.com/url-kaist/dynaVINS)|---|
|2022|`RAL`|[Twistslam: Constrained slam in dynamic environment](https://arxiv.org/pdf/2202.12384)|---|---|
|2021|`RAL`|[DynaSLAM II: Tightly-coupled multi-object tracking and SLAM](https://arxiv.org/pdf/2010.07820)|---|---|
|2021|`Sensor`|[DOE-SLAM: dynamic object enhanced visual SLAM](https://www.mdpi.com/1424-8220/21/9/3091)|---|---|
|2021|`ICRA`|[DOT: Dynamic object tracking for visual SLAM](https://elib.dlr.de/146127/1/ICRA21_DOT.pdf)|---|---|
|2020|`arXiv`|[VDO-SLAM: A visual dynamic object-aware SLAM system](https://arxiv.org/pdf/2005.11052)|---|---| 
|2020|`CVPR`|[ClusterVO: Clustering moving instances and estimating visual odometry for self and surroundings](http://openaccess.thecvf.com/content_CVPR_2020/papers/Huang_ClusterVO_Clustering_Moving_Instances_and_Estimating_Visual_Odometry_for_Self_CVPR_2020_paper.pdf)|---|---| 
|2020|`IROS`|[Dynamic object tracking and masking for visual SLAM](https://arxiv.org/pdf/2008.00072)|---|---|
|2020|`ICRA`|[Flowfusion: Dynamic dense rgb-d slam based on optical flow](https://arxiv.org/pdf/2003.05102)|---|---|
|2020|`TPAMI`|[Rgb-d slam in dynamic environments using point correlations](https://arxiv.org/pdf/1811.03217)|---|[video](https://www.youtube.com/watch?v=WCOoaaVaHTw)|
|2019|`ICCV`|[Clusterslam: A slam backend for simultaneous rigid body clustering and motion estimation](http://openaccess.thecvf.com/content_ICCV_2019/papers/Huang_ClusterSLAM_A_SLAM_Backend_for_Simultaneous_Rigid_Body_Clustering_and_ICCV_2019_paper.pdf)|---|---|
|2019|`TRO`|[Cubeslam: Monocular 3-d object slam](https://arxiv.org/pdf/1806.00557)|---|---|
|2019|`TRO`|[Tracking 3-D motion of dynamic objects using monocular visual-inertial sensing](https://ieeexplore.ieee.org/abstract/document/8705685/)|---|---|
|2018|`RAL`|[DynaSLAM: Tracking, mapping, and inpainting in dynamic scenes](https://arxiv.org/pdf/1806.05620)|---|---|
|2018|`IROS`|[Estimating metric poses of dynamic objects using monocular visual-inertial fusion](https://arxiv.org/pdf/1808.06753)|---|---|
|2018|`ECCV`|[Stereo vision-based semantic 3d object and ego-motion tracking for autonomous driving](http://openaccess.thecvf.com/content_ECCV_2018/papers/Peiliang_LI_Stereo_Vision-based_Semantic_ECCV_2018_paper.pdf)|---|---|
|2018|`ICRA`|[Staticfusion: Background reconstruction for dense rgb-d slam in dynamic environments](https://scholar.archive.org/work/ouzjgiwo5jekffbx6kqiwnhpeq/access/wayback/https://ora.ox.ac.uk/objects/uuid:b06224b2-62dd-459f-bbf7-1352dbbb5dc8/download_file?safe_filename=2018ICRA_scona2.pdf&file_format=application%2Fpdf&type_of_work=Conference+item)|---|---|
|2018|`IROS`|[DS-SLAM: A semantic visual SLAM towards dynamic environments](https://arxiv.org/pdf/1809.08379)|---|---|

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

* Dynamic 3D reconstruction but not the SLAM：

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`CVPR`|[FreeTimeGS: Free Gaussian Primitives at Anytime and Anywhere for Dynamic Scene Reconstruction](https://arxiv.org/pdf/2506.05348)|---|[website](https://zju3dv.github.io/freetimegs/)|
|2025|`arXiv`|[RobustSplat: Decoupling Densification and Dynamics for Transient-Free 3DGS](https://arxiv.org/pdf/2506.02751)|[![Github stars](https://img.shields.io/github/stars/fcyycf/RobustSplat.svg)](https://github.com/fcyycf/RobustSplat)|[website](https://fcyycf.github.io/RobustSplat/)|
|2025|`arXiv`|[MGStream: Motion-aware 3D Gaussian for Streamable Dynamic Scene Reconstruction](https://arxiv.org/pdf/2505.13839)| [![Github stars](https://img.shields.io/github/stars/pcl3dv/MGStream.svg)](https://github.com/pcl3dv/MGStream)|[website](https://zhenybao.github.io/MGStream/)| 
|2025|`CVPR`|[Time of the Flight of the Gaussians: Optimizing Depth Indirectly in Dynamic Radiance Fields](https://arxiv.org/pdf/2505.05356)|[![Github stars](https://img.shields.io/github/stars/brownvc/gftorf.svg)](https://github.com/brownvc/gftorf)|[website](https://visual.cs.brown.edu/projects/gftorf-webpage/)| 
|2025|`arXiv`|[Hybrid 3D-4D Gaussian Splatting for Fast Dynamic Scene Representation](https://arxiv.org/pdf/2505.13215)|[![Github stars](https://img.shields.io/github/stars/ohsngjun/3D-4DGS.svg)](https://github.com/ohsngjun/3D-4DGS)|[website](https://ohsngjun.github.io/3D-4DGS/)| 
|2025|`SIGGRAPH`|[Compensating Spatiotemporally Inconsistent Observations for Online Dynamic 3D Gaussian Splatting](https://arxiv.org/pdf/2505.01235)|---|[website](https://bbangsik13.github.io/OR2/)|
|2025|`ICLR`|[MoDGS: Dynamic Gaussian Splatting from Casually-captured Monocular Videos with Depth Priors](https://openreview.net/pdf?id=2prShxdLkX)|[![Github stars](https://img.shields.io/github/stars/MobiusLqm/MoDGS.svg)](https://github.com/MobiusLqm/MoDGS)|[website](https://modgs.github.io/)| 
|2024|`arXiv`|[Dynomo: Online point tracking by dynamic online monocular gaussian reconstruction](https://arxiv.org/pdf/2409.02104)|[![Github stars](https://img.shields.io/github/stars/dvl-tum/DynOMo.svg)](https://github.com/dvl-tum/DynOMo)|[website](https://jennyseidenschwarz.github.io/DynOMo.github.io/)|
|2024|`ICLR`|[Real-time photorealistic dynamic scene representation and rendering with 4d gaussian splatting](https://arxiv.org/pdf/2310.10642)|[![Github stars](https://img.shields.io/github/stars/fudan-zvg/4d-gaussian-splatting.svg)](https://github.com/fudan-zvg/4d-gaussian-splatting)|4DGS|
|2024|`CVPR`|[4d gaussian splatting for real-time dynamic scene rendering](https://openaccess.thecvf.com/content/CVPR2024/papers/Wu_4D_Gaussian_Splatting_for_Real-Time_Dynamic_Scene_Rendering_CVPR_2024_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/hustvl/4DGaussians.svg)](https://github.com/hustvl/4DGaussians)|[website](https://guanjunwu.github.io/4dgs/)<br>4DGS|
|2024|`CVPR`|[Spacetime Gaussian Feature Splatting for Real-Time Dynamic View Synthesis](https://openaccess.thecvf.com/content/CVPR2024/papers/Li_Spacetime_Gaussian_Feature_Splatting_for_Real-Time_Dynamic_View_Synthesis_CVPR_2024_paper.pdf)|[![Github stars](https://img.shields.io/github/stars/oppo-us-research/SpacetimeGaussians.svg)](https://github.com/oppo-us-research/SpacetimeGaussians)|[website](https://oppo-us-research.github.io/SpacetimeGaussians-website/)|
|2015|`arXiv`|[Dynamicfusion: Reconstruction and tracking of non-rigid scenes in real-time](https://www.cv-foundation.org/openaccess/content_cvpr_2015/papers/Newcombe_DynamicFusion_Reconstruction_and_2015_CVPR_paper.pdf)|---|---|


<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

