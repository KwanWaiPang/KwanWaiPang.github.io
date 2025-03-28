---
layout: post
title: "Paper Survey之——Awesome SLAM for Legged Robot"
date:   2025-03-25
tags: [SLAM]
comments: true
author: kwanwaipang
toc: false
---


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
本博文为本人针对基于人形机械狗等足式机器人的SLAM进行调研的记录

<!-- 本技术洞察从3DSLAM到基于足式机器人的SLAM，以求给与相关领域开发者启发,由于笔者水平有限，不足之处，敬请谅解。 -->

本博文仅供本人学习记录用~

* 目录
{:toc}

# Paper List

* 注意，此处非最新版，仅仅是写此博客的时候的记录
* Keep update the paper list in: [Awesome-Humanoid-Robot-Localization-and-Mapping](https://github.com/KwanWaiPang/Awesome-Legged-Robot-Localization-and-Mapping)

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`IEEE Signal Processing Letters`|[A 3D reconstruction and relocalization method for humanoid welding robots](https://github.com/KwanWaiPang/Awesome-Legged-Robot-Localization-and-Mapping/blob/pdf/A_3D_Reconstruction_and_Relocalization_Method_for_Humanoid_Welding_Robots.pdf)|---|---|
|2024|`arXiv`|[Navila: Legged robot vision-language-action model for navigation](https://arxiv.org/pdf/2412.04453)|[![Github stars](https://img.shields.io/github/stars/yang-zj1026/legged-loco.svg)](https://github.com/yang-zj1026/legged-loco)|[website](https://navila-bot.github.io/)|
|2024|`RAL`|[Leg-KILO: Robust Kinematic-Inertial-Lidar Odometry for Dynamic Legged Robots](https://github.com/KwanWaiPang/Awesome-Legged-Robot-Localization-and-Mapping/blob/pdf/Leg-KILO%20Robust%20Kinematic-Inertial-Lidar%20Odometry%20for%20Dynamic%20Legged%20Robots.pdf)|[![Github stars](https://img.shields.io/github/stars/ouguangjun/Leg-KILO.svg)](https://github.com/ouguangjun/Leg-KILO)|[dataset](https://github.com/ouguangjun/legkilo-dataset)|
|2024|`ICRA`|[Optistate: State estimation of legged robots using gated networks with transformer-based vision and kalman filtering](https://arxiv.org/pdf/2401.16719)|[![Github stars](https://img.shields.io/github/stars/AlexS28/OptiState.svg)](https://github.com/AlexS28/OptiState)|---|
|2023|`ICRA`|[Visual-inertial and leg odometry fusion for dynamic locomotion](https://arxiv.org/pdf/2210.02127)|---|---| 
|2023|`ICRA`|[Cerberus: Low-drift visual-inertial-leg odometry for agile locomotion](https://arxiv.org/pdf/2209.07654)|[![Github stars](https://img.shields.io/github/stars/ShuoYangRobotics/Cerberus.svg)](https://github.com/ShuoYangRobotics/Cerberus)|---|
|2023|`RAL`|[Tunable impact and vibration absorbing neck for robust visual-inertial state estimation for dynamic legged robots](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10027207)|---|---|
|2023|`International Conference on Robotics and Mechatronics`|[Comparative evaluation of rgb-d slam methods for humanoid robot localization and mapping](https://arxiv.org/pdf/2401.02816)|---|---|
|2023|`TASE`|[Humanoid loco-manipulations using combined fast dense 3D tracking and SLAM with wide-angle depth-images](https://hal.science/hal-04125159v1/file/2023_TASE_Chappellet.pdf)|---|---|
|2022|`ICRA`|[Periodic SLAM: Using cyclic constraints to improve the performance of visual-inertial SLAM on legged robots](https://par.nsf.gov/servlets/purl/10335323)|---|[video](https://www.youtube.com/watch?v=QygyDjVy5nY)|
|2022|`RAL`|[Online kinematic calibration for legged robots](https://rexlab.ri.cmu.edu/papers/onlinecalib.pdf)|---|---|
|2022|`TRO`|[Vilens: Visual, inertial, lidar, and leg odometry for all-terrain legged robots](https://arxiv.org/pdf/2107.07243)|---|---|
|2022|`TRO`|[Rloc: Terrain-aware legged locomotion using reinforcement learning and optimal control](https://arxiv.org/pdf/2012.03094)|---|---|
|2022|`RAL`|[Step: State estimator for legged robots using a preintegrated foot velocity factor](https://arxiv.org/pdf/2202.05572)|---|---|
|2022|`Conference on robot learning`|[Learning inertial odometry for dynamic legged robot state estimation](https://proceedings.mlr.press/v164/buchanan22a/buchanan22a.pdf)|---|---| 
|2022|`arXiv`|[A1 SLAM: Quadruped SLAM using the A1's Onboard Sensors](https://arxiv.org/pdf/2211.14432)|[![Github stars](https://img.shields.io/github/stars/jerredchen/A1_SLAM.svg)](https://github.com/jerredchen/A1_SLAM)|---|
|2021|`IEEE Sensors Letters`|[On state estimation for legged locomotion over soft terrain](https://arxiv.org/pdf/2101.02279)|---|---|
|2021|`ICRA`|[Contact forces preintegration for estimation in legged robotics using factor graphs](https://hal.science/hal-02991717v1/file/ICRA_2021_MFourmy.pdf)|---|---| 
|2021|`RAL`|[Legged robot state estimation with dynamic contact event information](https://ieeexplore.ieee.org/abstract/document/9468900)|---|---|
|2021|`RAL`|[Online Object Searching by a Humanoid Robot in an Unknown Environment](https://github.com/KwanWaiPang/Awesome-Legged-Robot-Localization-and-Mapping/blob/pdf/2021_RAL_Tsuru.pdf)|---|---|
|2020|`ICRA`|[Preintegrated velocity bias estimation to overcome contact nonlinearities in legged robot odometry](https://arxiv.org/pdf/1910.09875)|---|---|
|2020|`Frontiers in Robotics and AI`|[Pronto: A multi-sensor state estimator for legged robots in real-world scenarios](https://www.robots.ox.ac.uk/~mobile/drs/Papers/2020FRONTIERS_camurri.pdf)|[![Github stars](https://img.shields.io/github/stars/ori-drs/pronto.svg)](https://github.com/ori-drs/pronto)|---|
|2020|`IJRR`|[Contact-aided invariant extended Kalman filtering for robot state estimation](https://journals.sagepub.com/doi/pdf/10.1177/0278364919894385?casa_token=dzctF2F3Nb0AAAAA:c21qyyoA6KtBcnsRO6CBHSlcO0lBt6rtxFU16tLmTK3jVOjdlr4x5cMtWF1fLuaf6YSFROwK7vA_N4A)|[![Github stars](https://img.shields.io/github/stars/RossHartley/invariant-ekf.svg)](https://github.com/RossHartley/invariant-ekf)|---| 
|2019|`RAL`|[Dynamic locomotion on slippery ground](https://www.research-collection.ethz.ch/bitstream/handle/20.500.11850/355281/1/IROS19___Dynamic_Locomotion_on_Slippery_Ground.pdf)|---|---|
|2019|`IEEE-RAS 19th international conference on humanoid robots`|[Footstep planning for autonomous walking over rough terrain](https://arxiv.org/pdf/1907.08673)|---|---|
|2019|`RAL`|[Robust legged robot state estimation using factor graph optimization](https://arxiv.org/pdf/1904.03048)|---|[video](https://www.youtube.com/watch?v=p8o7mJPy4_w)|
|2019|`IROS`|[Humanoid robot next best view planning under occlusions using body movement primitives](https://github.com/KwanWaiPang/Awesome-Legged-Robot-Localization-and-Mapping/blob/pdf/Humanoid_Robot_Next_Best_View_Planning_Under_Occlusions_Using_Body_Movement_Primitives.pdf)|---|---|
|2018|`RSS`|[Contact-Aided Invariant Extended Kalman Filtering for Legged Robot State Estimation](https://arxiv.org/pdf/1805.10410)|[![Github stars](https://img.shields.io/github/stars/RossHartley/invariant-ekf.svg)](https://github.com/RossHartley/invariant-ekf)|---|
|2018|`IROS`|[Hybrid contact preintegration for visual-inertial-contact state estimation using factor graphs](https://arxiv.org/pdf/1803.07531)|---|---|
|2018|`Mechatronics`|[Novel lightweight odometric learning method for humanoid robot localization](https://github.com/KwanWaiPang/Awesome-Legged-Robot-Localization-and-Mapping/blob/pdf/1-s2.0-S0957415818301338-main.pdf)|---|---|
|2018|`IROS`|[Mit cheetah 3: Design and control of a robust, dynamic quadruped robot](https://dspace.mit.edu/bitstream/handle/1721.1/126619/iros.pdf?sequence=2)|---|---|
|2018|`ICRA`|[Legged robot state-estimation through combined forward kinematic and preintegrated contact factors](https://arxiv.org/pdf/1712.05873)|---|---|
|2017|`RSS`|[Heterogeneous sensor fusion for accurate state estimation of dynamic legged robots](https://www.pure.ed.ac.uk/ws/portalfiles/portal/36374655/NobiliCamurriRSS17_3.pdf)|[![Github stars](https://img.shields.io/github/stars/ori-drs/pronto.svg)](https://github.com/ori-drs/pronto) |---|
|2017|`Ph.D. dissertation`|[State estimation for legged robots-kinematics, inertial sensing, and computer vision](https://www.research-collection.ethz.ch/bitstream/handle/20.500.11850/129873/ETH24130.pdf)|---|---|
|2017|`IEEE-RAS 17th International Conference on Humanoid Robotics`|[Efficient coverage of 3D environments with humanoid robots using inverse reachability maps](https://www.cs.columbia.edu/~allen/S19/Student_Papers/coverage_nao_environment.pdf)|---|---|
|2017|`Intelligent Service Robotics`|[A closed-loop approach for tracking a humanoid robot using particle filtering and depth data](https://upcommons.upc.edu/bitstream/handle/2117/107765/ISR2016v2-CR-submitted.pdf?sequence=1)|---|---| 
|2017|`RAL`|[Probabilistic contact estimation and impact detection for state estimation of quadruped robots](https://robots.ox.ac.uk/~mfallon/publications/2017RAL_camurri.pdf)|---|---|
|2016|`Autonomous robots`|[Optimization-based locomotion planning, estimation, and control design for the atlas humanoid robot](https://www.researchgate.net/profile/Hongkai-Dai/publication/282477851_Optimization-based_locomotion_planning_estimation_and_control_design_for_the_atlas_humanoid_robot/links/5614501f08ae983c1b4073ac/Optimization-based-locomotion-planning-estimation-and-control-design-for-the-atlas-humanoid-robot.pdf)|---|---|
|2016|`IJRR`|[Real-time pose estimation of a dynamic quadruped in GPS-denied environments for 24-hour operation](https://journals.sagepub.com/doi/pdf/10.1177/0278364915587333?casa_token=yLMhh0p_DsoAAAAA:28GnrhizmgotGH4q0DjWKNXJnA4lb-21GdjpeXJDKsDSdDjJg_FPlt9vHaH_XOC4rYfCKER32UXaoAY)|---|---| 
|2016|`IROS`|[Probabilistic foot contact estimation by fusing information from dynamics and differential/forward kinematics](https://www.research-collection.ethz.ch/bitstream/handle/20.500.11850/119957/1/eth-49681-01.pdf)|---|---|
|2016|`IROS`|[Achievement of localization system for humanoid robots with virtual horizontal scan relative to improved odometry fusing internal sensors and visual information](https://github.com/KwanWaiPang/Awesome-Legged-Robot-Localization-and-Mapping/blob/pdf/Achievement_of_localization_system_for_humanoid_robots_with_virtual_horizontal_scan_relative_to_improved_odometry_fusing_internal_sensors_and_visual_information.pdf)|---|---|
|2016|`Autonomous Robots`|[Humanoid odometric localization integrating kinematic, inertial and visual information](https://iris.uniroma1.it/bitstream/11573/796335/6/796335.pdf)|---|---|
|2016|`IEEE/SICE International Symposium on System Integration`|[Closed-loop RGB-D SLAM multi-contact control for humanoid robots](https://hal.science/hal-01568048v1/file/iis2016.pdf)|---|---|
|2016|`ICRA`|[Learning the odometry on a small humanoid robot](https://www.researchgate.net/profile/Steve-Nguyen-2/publication/303885984_Learning_the_odometry_on_a_small_humanoid_robot/links/59e0f7af0f7e9b97fbe1382f/Learning-the-odometry-on-a-small-humanoid-robot.pdf)|[![Github stars](https://img.shields.io/github/stars/Rhoban/IKWalk.svg)](https://github.com/Rhoban/IKWalk)|---|
|2015|`IROS`|[Multimodal sensor fusion for foot state estimation in bipedal robots using the extended kalman filter](https://ieeexplore.ieee.org/abstract/document/7353746/)|---|---|
|2015|`International Journal of Humanoid Robotics`|[Estimation and stabilization of humanoid flexibility deformation using only inertial measurement units and contact information](https://hal.science/hal-01169149/document)|---|---| 
|2015|`Advanced Robotics`|[Dead reckoning for biped robots that suffers less from foot contact condition based on anchoring pivot estimation](https://www.tandfonline.com/doi/pdf/10.1080/01691864.2015.1011694)|---|---|
|2014|`IROS`|[Dynamic state estimation using quadratic programming](http://www.cs.cmu.edu/~sfeng/xx_iros14.pdf)|---|---|
|2014|`IROS`|[State estimation for a humanoid robot](https://arxiv.org/pdf/1402.5450)|---|---| 
|2014|`IEEE-RAS International Conference on Humanoid Robots`|[Drift-free humanoid state estimation fusing kinematic, inertial and lidar sensing](https://www.pure.ed.ac.uk/ws/portalfiles/portal/18903340/14_fallon_humanoids.pdf)|---|---|
|2013|`IROS`|[State estimation for legged robots on unstable and slippery terrain](https://www.research-collection.ethz.ch/bitstream/handle/20.500.11850/75852/eth-7743-01.pdf)|---|---|
|2013|`Robotics`|[State estimation for legged robots-consistent fusion of leg kinematics and IMU](https://infoscience.epfl.ch/server/api/core/bitstreams/bb6c046d-6633-4c8c-8a5f-f8729667c6b6/content)|---|---|
|2012|`IEEE-RAS International Conference on Humanoid Robots`|[Vision-based odometric localization for humanoids using a kinematic EKF](http://www.diag.uniroma1.it/~labrob/pub/papers/Humanoids2012.pdf)|---|---| 
|2010|`IEEE/RSJ International Conference on Intelligent Robots and Systems`|[Humanoid robot localization in complex indoor environments](http://www2.informatik.uni-freiburg.de/~wurm/papers/hornung10iros.pdf)|---|---|
|2009|`IEEE-RAS International Conference on Humanoid Robots`|[3D grid and particle based SLAM for a humanoid robot](https://ieeexplore.ieee.org/abstract/document/5379602)|---|---|
|2008|`IEEE-RAS International Conference on Humanoid Robots`|[Autonomous humanoid navigation using laser and odometry data](https://d1wqtxts1xzle7.cloudfront.net/84814066/navigation2008-libre.pdf?1650840576=&response-content-disposition=inline%3B+filename%3DAutonomous_humanoid_navigation_using_las.pdf&Expires=1742998314&Signature=PhG-Jac79p3DdteQuhFeKYbJZhHd01wTVhFGRVwaI3-4XHejDUzPm1bwtv6fHNIMK~ePhalBmacKGeJgh7nMPlNQ44VsY2JojP0dEdnwtdbgpL3JDl6I5gzMRpNDPmwxUQTo8gzIMYpZx5WVccgNizHM7bu0gk1oHP8Zz~Nq5JOwgKim1dI77wvu2pQeVWxv9TyFr0BjXus4p23lx3gA6PLtRqddiwJJ0Sd1plMa-EVRpc3KtvbFdIRgUBtRnm8y37TeAw6PtwWpQ~-4ODqrpEC5M-4Ys1Y9ACnaRU6YVolOkZRYdG~MguXeB8Bg1ElCJhhqxXH49ZoHwH6XOUMtvA__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA)|---|---|
|2006|`IEEE-RAS International Conference on Humanoid Robots`|[Localisation for autonomous humanoid navigation](https://ieeexplore.ieee.org/abstract/document/4115574)|---|---|
|2006|`IEEE/RSJ International Conference on Intelligent Robots and Systems`|[Real-time 3d slam for humanoid robot considering pattern generator information](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=8f13256fa676153aafccad3e32dabbfec1fce32a)|---|---|
|2005|`IEEE-RAS International Conference on Humanoid Robots`|[Humanoid robot localisation using stereo vision](https://ieeexplore.ieee.org/abstract/document/1573539/)|---|---|
|2005|`TRO`|[A leg configuration measurement system for full-body pose estimates in a hexapod robot](https://core.ac.uk/download/pdf/76389503.pdf)|---|---|





# Related Resource
* Survey for Learning-based VO,VIO,IO：[Paper List](https://github.com/KwanWaiPang/Awesome-Learning-based-VO-VIO) and [Blog](https://kwanwaipang.github.io/Learning-based-VO-VIO/)
* Survey for Transformer-based SLAM：[Paper List](https://github.com/KwanWaiPang/Awesome-Transformer-based-SLAM) and [Blog](https://kwanwaipang.github.io/Transformer_SLAM/)
* Survey for Diffusion-based SLAM：[Paper List](https://github.com/KwanWaiPang/Awesome-Diffusion-based-SLAM) and [Blog](https://kwanwaipang.github.io/Diffusion_SLAM/)
* Survey for NeRF-based SLAM：[Blog](https://kwanwaipang.github.io/Awesome-NeRF-SLAM/)
* Survey for 3DGS-based SLAM: [Blog](https://kwanwaipang.github.io/File/Blogs/Poster/survey_3DGS_SLAM.html)
* Survey for Deep IMU-Bias Inference [Blog](https://kwanwaipang.github.io/Deep-IMU-Bias/)
* [Paper Survey for Degeneracy for LiDAR-based SLAM](https://kwanwaipang.github.io/Lidar_Degeneracy/)
* [Reproduction and Learning of LOAM Series](https://blog.csdn.net/gwplovekimi/article/details/119711762?spm=1001.2014.3001.5502)
* [Awesome-LiDAR-Visual-SLAM](https://github.com/sjtuyinjie/awesome-LiDAR-Visual-SLAM)
* [Awesome-LiDAR-Camera-Calibration](https://github.com/Deephome/Awesome-LiDAR-Camera-Calibration)
* Overview of Humanoid Robots and 3D SLAM Works (in the PPT)：

<!-- |---|`arXiv`|---|---|---| -->
<!-- [![Github stars](https://img.shields.io/github/stars/***.svg)]() -->

| Year | Venue | Paper Title | Repository | Note |
|:----:|:-----:| ----------- |:----------:|:----:|
|2025|`arXiv`|[Humanoid locomotion and manipulation: Current progress and challenges in control, planning, and learning](https://arxiv.org/pdf/2501.02116)|---|---|
|2024|`IEEE/CAA Journal of Automatica Sinica`|[Advancements in humanoid robots: A comprehensive review and future prospects](https://www.ieee-jas.net/article/doi/10.1109/JAS.2023.124140)|---|---|
|2024|`arXiv`|[Exbody2: Advanced expressive humanoid whole-body control](https://arxiv.org/pdf/2412.13196?)|---|[website](https://exbody2.github.io/)| 
|2024|`CoRL`|[Visual whole-body control for legged loco-manipulation](https://arxiv.org/pdf/2403.16967)|[![Github stars](https://img.shields.io/github/stars/Ericonaldo/visual_wholebody.svg)](https://github.com/Ericonaldo/visual_wholebody)|[website](https://wholebody-b1.github.io/)|
|2022|`Field Robotics`|[Cerberus: Autonomous legged and aerial robotic exploration in the tunnel and urban circuits of the darpa subterranean challenge](https://d1wqtxts1xzle7.cloudfront.net/84655738/2201.07067-libre.pdf?1650599141=&response-content-disposition=inline%3B+filename%3DCERBERUS_Autonomous_Legged_and_Aerial_Ro.pdf&Expires=1743056230&Signature=Kau5sbITIQY8t44-b22CcAmkb0ODESA4oYnMPghfJLqMrtO-ZVxKvacw0zHU-zJ59NcQ2l8mHEbBQXp55sXoSJWg6CTO52KY2Hwd3Bo3hs1UfW8WhStxS-mQmDPF-AFqlgBjuH8iwrOtVETkUuUuOlf8iPGSlvQpNurkGUftuF70esjD~Yex-fyQlmIOX0xazfrE8IAnAlrHV7E94lpD7cvNOnDtQvL6kBq7Je8owcH2ikqcJBIDe1yUbO42S~dC5J50aR57mO0cy61PdUl2hxcNnSnF8yFcEgDrRrIDcaI5ULF4NFQR0jODcS0evpmag~dmfOmgU4dQkbDj04AQIA__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA)|---|---| 
|2024|`TPAMI`|[R3LIVE++: A Robust, Real-time, Radiance Reconstruction Package with a Tightly-coupled LiDAR-Inertial-Visual State Estimator](https://arxiv.org/pdf/2209.03666)|[![Github stars](https://img.shields.io/github/stars/hku-mars/r3live.svg)](https://github.com/hku-mars/r3live)|dataset [![Github stars](https://img.shields.io/github/stars/ziv-lin/r3live_dataset.svg)](https://github.com/ziv-lin/r3live_dataset)|
|2023|`IROS`|[Event camera-based visual odometry for dynamic motion tracking of a legged robot using adaptive time surface](https://arxiv.org/pdf/2305.08962)|---|[demo](https://www.youtube.com/watch?v=-5ieQSh0g3M&feature=youtu.be)|
|2022|`ICRA`|[R3LIVE: A Robust, Real-time, RGB-colored, LiDAR-Inertial-Visual tightly-coupled state Estimation and mapping package](https://arxiv.org/pdf/2109.07982)|[![Github stars](https://img.shields.io/github/stars/hku-mars/r3live.svg)](https://github.com/hku-mars/r3live)|---|
|2021|`RAL`|[R2LIVE: A Robust, Real-Time, LiDAR-Inertial-Visual Tightly-Coupled State Estimator and Mapping](https://arxiv.org/pdf/2102.12400)|[![Github stars](https://img.shields.io/github/stars/hku-mars/r2live.svg)](https://github.com/hku-mars/r2live)|---|
|2024|`TRO`|[FAST-LIVO2: Fast, Direct LiDAR–Inertial–Visual Odometry](https://arxiv.org/pdf/2408.14035)|[![Github stars](https://img.shields.io/github/stars/hku-mars/FAST-LIVO2.svg)](https://github.com/hku-mars/FAST-LIVO2)|---|
|2022|`IROS`|[Fast-livo: Fast and tightly-coupled sparse-direct lidar-inertial-visual odometry](https://arxiv.org/pdf/2203.00893)|[![Github stars](https://img.shields.io/github/stars/hku-mars/FAST-LIVO.svg)](https://github.com/hku-mars/FAST-LIVO)|---|
|2023|`TRO`|[Immesh: An immediate lidar localization and meshing framework](https://arxiv.org/pdf/2301.05206)|[![Github stars](https://img.shields.io/github/stars/hku-mars/ImMesh.svg)](https://github.com/hku-mars/ImMesh)|---|
|2023|`Advanced Intelligent Systems`|[Point‐LIO: Robust high‐bandwidth light detection and ranging inertial odometry](https://advanced.onlinelibrary.wiley.com/doi/pdf/10.1002/aisy.202200459)|[![Github stars](https://img.shields.io/github/stars/hku-mars/Point-LIO.svg)](https://github.com/hku-mars/Point-LIO)|---|
|2022|`TRO`|[FAST-LIO2: Fast Direct LiDAR-inertial Odometry](https://arxiv.org/pdf/2107.06829)|[![Github stars](https://img.shields.io/github/stars/hku-mars/FAST_LIO.svg)](https://github.com/hku-mars/FAST_LIO)|---| 
|2021|`RAL`|[Fast-lio: A fast, robust lidar-inertial odometry package by tightly-coupled iterated kalman filter](https://arxiv.org/pdf/2010.08196)|[![Github stars](https://img.shields.io/github/stars/hku-mars/FAST_LIO.svg)](https://github.com/hku-mars/FAST_LIO)|---|
|2019|`JFR`|[RTAB‐Map as an open‐source lidar and visual simultaneous localization and mapping library for large‐scale and long‐term online operation](https://arxiv.org/pdf/2403.06341)|[![Github stars](https://img.shields.io/github/stars/introlab/rtabmap.svg)](https://github.com/introlab/rtabmap)|---| 
|2019|`ICRA`|[Tightly coupled 3d lidar inertial odometry and mapping](https://arxiv.org/pdf/1904.06993)|[![Github stars](https://img.shields.io/github/stars/hyye/lio-mapping.svg)](https://github.com/hyye/lio-mapping)|LIO-Mapping|
|2018|`IROS`|[Scan context: Egocentric spatial descriptor for place recognition within 3d point cloud map](https://gisbi-kim.github.io/publications/gkim-2018-iros.pdf)|[![Github stars](https://img.shields.io/github/stars/gisbi-kim/SC-LIO-SAM.svg)](https://github.com/gisbi-kim/SC-LIO-SAM)|SC-LIO-SAM| 
|2021|`ICRA`|[Lvi-sam: Tightly-coupled lidar-visual-inertial odometry via smoothing and mapping](https://arxiv.org/pdf/2104.10831)|[![Github stars](https://img.shields.io/github/stars/TixiaoShan/LVI-SAM.svg)](https://github.com/TixiaoShan/LVI-SAM)|---|
|2020|`IROS`|[Lio-sam: Tightly-coupled lidar inertial odometry via smoothing and mapping](https://arxiv.org/pdf/2007.00258)|[![Github stars](https://img.shields.io/github/stars/TixiaoShan/LIO-SAM.svg)](https://github.com/TixiaoShan/LIO-SAM)|---| 
|2018|`IROS`|[Lego-loam: Lightweight and ground-optimized lidar odometry and mapping on variable terrain](https://static.ux5.de/Moving-Object-Detection-with-OpenCV/archiv/learnopencv-master/LeGO-LOAM-ROS2/Shan_Englot_IROS_2018_Preprint.pdf)|[![Github stars](https://img.shields.io/github/stars/RobustFieldAutonomyLab/LeGO-LOAM.svg)](https://github.com/RobustFieldAutonomyLab/LeGO-LOAM)|---| 
|2020|`ICRA`|[Loam livox: A fast, robust, high-precision LiDAR odometry and mapping package for LiDARs of small FoV](https://arxiv.org/pdf/1909.06700)|[![Github stars](https://img.shields.io/github/stars/hku-mars/loam_livox.svg)](https://github.com/hku-mars/loam_livox)|---|
|2022|`TRO`|[GVINS: Tightly coupled GNSS–visual–inertial fusion for smooth and consistent state estimation](https://arxiv.org/pdf/2103.07899)|[![Github stars](https://img.shields.io/github/stars/HKUST-Aerial-Robotics/GVINS.svg)](https://github.com/HKUST-Aerial-Robotics/GVINS)|---|
|2019|`arXiv`|[A General Optimization-based Framework for Global Pose Estimation with Multiple Sensors](https://arxiv.org/pdf/1901.03642)|[![Github stars](https://img.shields.io/github/stars/HKUST-Aerial-Robotics/VINS-Fusion.svg)](https://github.com/HKUST-Aerial-Robotics/VINS-Fusion)|VINS-Fusion|
|2018|`TRO`|[Vins-mono: A robust and versatile monocular visual-inertial state estimator](https://arxiv.org/pdf/1708.03852)|[![Github stars](https://img.shields.io/github/stars/HKUST-Aerial-Robotics/VINS-Mono.svg)](https://github.com/HKUST-Aerial-Robotics/VINS-Mono) |---|
|2014|`Robotics: Science and systems`|[LOAM: Lidar odometry and mapping in real-time](https://www.ri.cmu.edu/pub_files/2014/7/Ji_LidarMapping_RSS2014_v8.pdf)|---|non-official A-LOAM<br>[![Github stars](https://img.shields.io/github/stars/HKUST-Aerial-Robotics/A-LOAM.svg)](https://github.com/HKUST-Aerial-Robotics/A-LOAM)|


# PPT Demonstration

<div align="center" style="
  position: relative; 
  width: 80%; 
  height: 450px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe width="100%" height="100%"
    src="https://kwanwaipang.github.io/ubuntu_md_blog/images/Awesome%20SLAM%20for%20Legged%20Robot.pdf#toolbar=0&navpanes=0&scrollbar=0" ></iframe>
</div>


# Paper Reading

下面对细看的论文进行概述性解读

## Humanoid locomotion and manipulation: Current progress and challenges in control, planning, and learning
首先建议看一下这篇人形机器人相关的综述。对人形机器人领域进行了系统性回顾。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326163015.png" width="80%" />
<figcaption>  
</figcaption>
</div>

## Advancements in humanoid robots: A comprehensive review and future prospects
这也是一篇综述性论文，其中的`Perception & Interaction`一节对人形机器人相关的感知与交互做了介绍

## Comparative Evaluation of RGB-D SLAM Methods for Humanoid Robot Localization and Mapping
* [参考资料](https://mp.weixin.qq.com/s/-rMezi2-hMNj0jPT0Srv0Q)

本研究通过对比评估了三种RGB-D SLAM算法在SURENA-V人形机器人的定位和地图构建任务中的性能。在定位精度方面，ORB-SLAM3表现最佳，其ATE为0.1073，次之为RTAB-Map（0.1641）和OpenVSLAM（0.1847）。然而，ORB-SLAM3和OpenVSLAM在机器人遇到具有有限特征点的墙壁时存在准确里程计的挑战。OpenVSLAM表现出在机器人接近初始位置时检测循环闭合并成功重新定位的能力。地图制作方面，RTAB-Map通过提供多样化的地图输出（密集地图、OctoMap和占据格地图）领先于ORB-SLAM3和OpenVSLAM，它们仅提供稀疏地图。

这篇论文只是普通的会议论文，只是把三种开源的方法(ORB-SLAM3, RTAB-MAP, OpenVSLAM)在人形平台上测试了一下，也没用结合人形机器人的特点来进行分析，单纯就是三个算法的分析，个人感觉参考价值不大~

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326162252.png" width="60%" />
<figcaption>  
</figcaption>
</div>

## A 3D Reconstruction and Relocalization Method for Humanoid Welding Robots
本文的关键是给焊接机器人加上一个移动载体以及双臂，同时结合SLAM来进行姿态估计与三维重建。
其架构如下图所示。
通过RGB-D+IMU实现位姿的估计（应该是基于ORB-SLAM3开发的），同时结合深度相机可以获取三维环境信息。基于构建的3D地图，通过点云的匹配额外提供一个重定位的约束来进一步提升精度。
此外，对于3D地图会进行语义分割，并且结合YOLOv10来进行目标识别以此确认作业目标的位置。

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
          <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326171255.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326172033.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

## Humanoid loco-manipulations using combined fast dense 3D tracking and SLAM with wide-angle depth-images
本文提出了一个结合基于视觉的跟踪定位作为人形机器人的whole-body 优化控制，看着似乎跟视觉伺服有点类似。
而为了将操作与定位更好的结合，作者提出了一个基于广角深度相机的稠密3D跟踪算法，并且跟SLAM结合起来。进而使得人形机器人可以实现在行走的同时来操作和组装大型的物体。

本文一个基本的insight就是，机器人手持着一个物体行走，那么这个物体对于机器人的视觉系统而言就是outlier，因此要去掉这个outlier，用其他的环境信息来进行定位。此外对于嵌入在人形机器人上的视觉系统而言，将四周的背景环境跟要操控的物体分割开来是非常重要的。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326173101.png" width="60%" />
<figcaption>  
</figcaption>
</div>

系统的框架如下图所示。所采用的SLAM算法是RTAB-Map，在其基础上添加对于机器人操作物体的跟踪
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326175125.png" width="60%" />
<figcaption>  
</figcaption>
</div>


## Novel lightweight odometric learning method for humanoid robot localization
本文提出的就是基于人形机器人的惯性里程计(inertial odometry),不依赖于其他外部的感知，仅仅用IMU，并且采用ANN来进行运动学计算。
采用的网络是最基本的MLP，输入为来自人形机器人上的IMU、里程计、腿式压力等数据，输出直接为全局坐标系下的位置信息。如下图所示：

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326180209.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326180217.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

从实验的结果来看，所提提出的算法确实要比纯航位推算的精度要高（更加接近真值），但是运动的剧烈并不长，图上的单位是cm
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326180632.png" width="60%" />
<figcaption>  
</figcaption>
</div>

## Achievement of Localization System for Humanoid Robots with Virtual Horizontal Scan Relative to Improved Odometry Fusing Internal Sensors and Visual Information

将视觉里程计、步态发生器的前馈命令以及惯性传感器的方位信息来提升里程计的性能。
进一步地，将该里程计用于从连续激光扫描的累积中生成3D点云，
然后对所获得的3D点云进行适当的切片，以创建高度固定的水平虚拟激光扫描。
而这个虚拟的激光扫描又进一步放到2D SLAM方法(也就是Gmapping)中来实现更高精度的SLAM。
其架构如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326184508.png" width="60%" />
<figcaption>  
</figcaption>
</div>

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326211802.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326211755.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

## Leg-KILO: Robust Kinematic-Inertial-Lidar Odometry for Dynamic Legged Robots
本文提出基于四足机器人运动学的LIO。
足式机器人上高频的运动(如小跑步态)会引入频繁的脚部撞击，进而导致IMU的退化以及lidar的运动失真。
而直接用IMU观测的数据会容易导致明显的漂移（特别是在Z轴上）。
那么针对这些局限性，本文提出了基于图优化的腿式里程计、雷达里程计以及回环检测三者紧耦合的系统。
* leg odometry：提出了基于on-manifold error-state Kalman filter的运动惯性里程计，通过结合接触高度检测的约束来进一步减少高度方向的波动；
* lidar odometry:设计了一种自适应激光束切片和拼接的方法，以减轻高动态运动的影响；
* loop closure：提出机器人位中心的增量式建图方式来提高地图的维护效率；

系统的框架如下图所示

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326213516.png" width="60%" />
<figcaption>  
</figcaption>
</div>

作者跟A-LOAM、Fast-LIO2以及Point-LIO进行了对比，值得一提的是，本文是基于LIO-SAM开发的，而LIO-SAM之前的测试经验是远不如Fast-LIO2以及Point-LIO的，但是在作者改动的框架下却可以超越这两者，可以看出所提出算法应该是有效的~

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326215054.png" width="60%" />
<figcaption>  
</figcaption>
</div>

而在下右图的实验中也发现，在平地运动时，baseline方法均有较大的高度变化，而Leg-KILO则是在10cm以内。
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250326215324.png" width="80%" />
<figcaption>  
</figcaption>
</div>

## Online object searching by a humanoid robot in an unknown environment

本文是通过结合3D SLAM来实现人形机器人在未知环境中寻找目标物体。
传统的方法都是需要一个静态的地图，同时需要有关于对象位置、区域大小限制或每次观察的离线视点规划时间等提示信息。而本文则是单纯基于目标物体的3D模型，在未知环境中寻找这个物体。
其框架如下图所示。
SLAM用的是RTAB-Map(但是生成的是2D map)，同时结合机器人的运动规划（包括目标物体的3D点云，路径规划、避障以及自主探索）来实现整个系统。
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327094216.png" width="80%" />
<figcaption>  
</figcaption>
</div>

要完成一项任务需要四个主要部分：目标识别（object recognition）, 环境感知（environment recognition）, 运动规划 （action planning）, 以及双足行走bipedal walking。


## OptiState: State Estimation of Legged Robots using Gated Networks with Transformer-based Vision and Kalman Filtering

对于足式机器人而言，踏步容易引起相机的运动模糊，使得视觉数据不可靠。而由于机械腿与地面的不断接触和断开（还存在滑动），基于IMU等运动学信息也容易出错，特别是在有大干扰（比如障碍物）或柔性表面的情况。

此外，由于腿式机器人产生的动态运动需要高频控制，因此低计算消耗、高精度的状态估计系统的也是必须的。
因此，该工作通过融合卡尔曼滤波、优化以及深度学习方法，提出了一个融合内部与外部传感器信息的机器人躯干状态估计算法。
首先采用卡尔曼滤波来对关节编码器以及IMU测量量进行状态预测，通过复用来自凸模型预测优化方法输出的地面反作用力来进行状态的更新。
而卡尔曼滤波的输出会输入GRU网络。

此外，GRU网络还会有来自Vision Transformer处理的深度图的latent feature（隐特征），而GRU输出的姿态信息将会与动捕提供的真值数据求loss来实现网络的训练。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327103619.png" width="80%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327111230.png" width="80%" />
<figcaption>  
</figcaption>
</div>


从结果来看确实OptiState的误差要比滤波以及VIO SLAM（来自RealSense T265 camera传感器的输出）要小
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327111431.png" width="80%" />
<figcaption>  
</figcaption>
</div>


## Cerberus: Low-Drift Visual-Inertial-Leg Odometry For Agile Locomotion
该工作提出了一个视觉-惯性-腿式里程计(Visual-Inertial-Leg Odometry, VILO), 包含的传感器有：双目图像、IMU、关节编码器、腿部接触传感器。
实现了在线的运动学参数的校正以及接触传感器的异常值剔除，进而减少了定位的漂移。
通过室内与室外的实验（450米远、平均运动速度0.5m/s室内，1m/s室外）也证明了所采用的运动学参数估算可以将累积误差减少的1%以内。


<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327113336.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327113315.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>


<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327121747.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327121755.png" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>


## VILENS: Visual, Inertial, Lidar, and Leg Odometry for All-Terrain Legged Robots

足式机器人中，对于穿越崎岖地形时，会遇到可变形地形、腿部灵活性和脚部打滑等都会降低状态估计的性能，甚至在短距离内，会存在多步态轨迹无法执行，局部地形重建无法使用等情况。

基于因子图的紧耦合的视觉-IMU-lidar-腿式里程计，并通过对线速度的bias进行在线估计来减少腿式里程计的漂移；
一共2小时，1.8km的实验来验证系统的性能，并且在实验的场景中还包含了松散岩石、斜坡、泥土、滑动、地形形变等挑战；

下图比较直观的看到足式机器人在砾石上小跑时脚接触序列的例子。
第一张图是当脚接触地面后，然后就是随着控制器增加施加的力，地形和机器人的橡胶脚都会变形(图2)。
而在站立阶段，第三张图为机械脚在其半球形轮廓上滚动，导致接触点会发生变化，最后一张图则是机械脚准备立刻接触面。
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327130011.png" width="80%" />
<figcaption>  
</figcaption>
</div>

系统的框架如下图所示.
主要包括IMU及运动学的预积分、camera特征跟踪（用的时FAST corner以及KLT），lidar的特征跟踪及ICP匹配，最后就是融合前面因子的图优化框架；

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327130609.png" width="80%" />
<figcaption>  
</figcaption>
</div>


所采用的因子图结构如下图所示

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327130448.png" width="60%" />
<figcaption>  
</figcaption>
</div>

## NaVILA: Legged Robot Vision-Language-Action Model for Navigation

该工作实现了腿式机器人的视觉语音导航，即输入人类的指令，通过vision-language model(VLA)来处理RGB图像帧以及结合对应的locomotion skills，机器人即可直接执行任务指令。
将人类语言指令直接转换为底层的腿关节运动。就是让机器人跟随着人的语音指令执行任务，当然还包含了实时运行的locomotion policy，这样两个结合让机器人可以共同完成任务。

作者在人形及四足机器狗上做了大量的实验来验证
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327142612.png" width="60%" />
<figcaption>  
</figcaption>
</div>


其架构如下所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327142451.png" width="60%" />
<figcaption>  
</figcaption>
</div>

## Contact-aided invariant extended Kalman filtering for robot state estimation

该工作是针对腿式接触器辅助的基于不变扩展卡尔曼滤波的状态估计器，利用接触器与IMU来对前向的运动学进行校正，进而估算姿态与速度信息。
这篇工作的数学推导比较多，后面对leg odomerty相关深入研究的时候在深入学习与推导吧~

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327145230.png" width="60%" />
<figcaption>  
</figcaption>
</div>



## Hybrid contact preintegration for visual-inertial-contact state estimation using factor graphs

该工作提出了基于图优化框架的视觉、imu、关键编码器和腿式接触传感器融合定位系统。
IMU部分采用预计分构建的因子，视觉里程计采用的是SVO2。
至于腿式接触传感器则是开发了一种通过任意数量的接触来实现预积分接触信息的方法。这样以预积分的形式加入因子图中可以减少优化的变量。

实验效果如下图所示（从youtube视频来看感觉是做了个比较简单的实验验证，当然在18年的时候有这样的硬件搭建这样的测试平台已经很不容易了hh）
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327150817.png" width="80%" />
<figcaption>  
</figcaption>
</div>


## Online Kinematic Calibration for Legged Robots
该工作是在线校正腿式机器人的运动学参数。一般这些运动学参数都是来源于joint encoders, foot contact sensors,以及IMU，通过这些传感器来估算机器人的速度。而估算的速度进一步的跟外部传感器相结合，进而实现运动参数的更新，而更新的过程可以采用滤波或者图优化的方式（分别采用了VINS-mono和ekf-VIO）。

此外，本文还着重于步长的估计。一般步长都是预定义或者手动测量的，但是这会导致很大的误差。每个关键点的一点误差都会导致累积误差（时间与空间维度）。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250327153448.png" width="60%" />
<figcaption>  
</figcaption>
</div>





















