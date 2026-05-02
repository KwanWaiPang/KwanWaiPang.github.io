---
layout: post
title: "代码阅读笔记之——Marathongo"
date:   2026-04-18
tags: [Robotics]
comments: true
author: kwanwaipang
toc: true
excerpt: "Marathongo 是一个面向人形机器人马拉松比赛场景的导航全栈开源方案，聚焦于人形机器人在大尺度室外环境中的高速、稳定、自主运行能力"
---


# 引言

Marathongo 是朗毅机器人开源的一个面向人形机器人马拉松等**大尺度室外**导航架构。主要有以下几个特征：
* 大规模室外场景下的鲁棒定位与导航能力。
* 从极简方案到复杂方案的多技术路线并行实现。
* 视觉感知、激光雷达、定位与控制链路的多模块协同。

* [原github](https://github.com/landitbot/marathongo)
* [My github repository](https://github.com/R-C-Group/marathongo)

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/R-C-Group/marathongo/raw/main/gif/gif3.gif" width="100%" alt="Marathongo 运行片段" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/R-C-Group/marathongo/raw/main/gif/gif4.gif" width="100%" alt="Marathongo 运行片段" />
      </td>
    </tr>
  </table>
  <figcaption>运行演示</figcaption>
</div>

  

# 一、总体架构

Marathongo导航架构将「环境感知到运动执行」的长链路拆为**可替换子模块**。
工程上可抽象为：状态估计（我在哪）→ 环境与赛道表征（前面有什么、跑道在哪）→ 局部运动决策（怎么走）→ 约束下的控制量（能走多快、转多急）→ 执行与安全仲裁（人能否接管）。本仓库把这条链拆成多个可替换子仓库，而不是单一单体程序：


<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
flowchart TB
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    subgraph EST["状态估计"]
        A[glio_mapping<br/>LIO 类融合与地图维护]
    end
    subgraph SEM["赛道与障碍语义"]
        B[全局或半全局 Path<br/>central left right]
        C[可选 vision_part<br/>分割至边界或障碍]
    end
    subgraph NAV["局部运动决策与控制"]
        D[tangent_arc_navigation<br/>栅格与规划控制]
        E[marathontracking<br/>体素采样评分与包络速度]
    end
    subgraph EXE["人机与执行"]
        F[python_ws 与 sender]
    end
    A --> B
    A --> D
    A --> E
    B --> D
    B --> E
    C -.-> B
    D --> F
    E --> F
</div>

* `glio_mapping` 是面向大规模室外场景的鲁棒定位与建图模块，多传感器融合定位与（可选）建图，为所有导航算法提供`/odometry`、`TF`或等价状态。重点解决的是：长距离运行中的全局一致性与定位稳定性；GNSS、IMU、LiDAR 等多源信息的融合利用；面对户外动态环境、坡道、遮挡和局部退化时的鲁棒性；
* 中游为 `tangent_arc_navigation`（用于巡线与基础避障，用于较低复杂度验证整机导航能力）与 `marathontracking`（包含更完整的局部规划、控制与系统集成逻辑）两类实现，二者在路径、点云、速度等话题形态上相近，**算法栈不同**；
  * 
* 下游：遥控/自动仲裁、UDP 或自定义协议下发，对接真实机器人控制器；
* 横向：可选 `vision_part`为可选感知增强，通过标定与融合进入障碍或边界表达（包括障碍物识别相关的数据、训练与部署代码）。



子系统组成及分层示意图：
* [glio_mapping/README.md](https://github.com/R-C-Group/marathongo/tree/main/glio_mapping)
* [marathontracking/README.md](https://github.com/R-C-Group/marathongo/tree/main/marathontracking)
* [tangent_arc_navigation/src/README.MD](https://github.com/R-C-Group/marathongo/tree/main/tangent_arc_navigation/src)
* [vision_part](https://github.com/R-C-Group/marathongo/tree/main/vision_part)

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
flowchart TB
  classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

  subgraph 感知与定位
    L1A[glio_mapping<br/>LiDAR+GNSS+IMU 等融合定位/建图]
    L1B[vision_part<br/>分割训练 / ONNX / TensorRT / DeepStream]
  end
  subgraph 局部导航与规划
    L2A[tangent_arc_navigation<br/>costmap + vo_navigation]
    L2B[marathontracking<br/>local_planner + path_process + python_ws]
  end
  subgraph 人机与执行
    L3[joy_node / sender<br/>UDP 或桥接到底盘]
  end
  subgraph 机器人平台
    L4[底盘 / 执行器]
  end
  L1A --> L2A
  L1A --> L2B
  L1B -.可选.-> L2B
  L2A --> L3
  L2B --> L3
  L3 --> L4
</div>


仓库顶层目录职责

| 目录 | 职责摘要 |
|------|-----------|
| `glio_mapping` | 室外长距离 LIO 类建图与定位，多 launch 适配不同雷达 |
| `tangent_arc_navigation` | 基于 costmap 的轻量巡线与自写规划控制（包名仍含 vo） |
| `marathontracking` | 点云障碍、环形体素地图、多路径评分、PID/包络速度、可选 Python 模糊/RL |
| `vision_part` | `dataset`、`seg_fusion`、`seg_lightning`、`seg_tensorrt` |
| `gif/` 等 | 根 `README.md` 展示用动图 |


<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
mindmap
  root((Marathongo))
    glio_mapping
      多传感器融合
      长距离一致性
    tangent_arc_navigation
      sim_interface
      vo_navigation
      path_tools
    marathontracking
      local_planner
      path_process
      python_ws
      ros1_sender_general
    vision_part
      训练 seg_fusion
      实验 seg_lightning
      部署 seg_tensorrt
</div>



# `glio_mapping`：多传感器融合建图定位

GLIO-Mapping 是一个专为长距离动态环境设计的高鲁棒性多传感器融合建图定位系统，已成功应用于2026年人形机器人马拉松竞赛，实现21公里全程自主导航。系统通过GNSS、IMU和雷达点云的紧耦合融合，在复杂户外环境中保持厘米级定位精度。LIO部分是参考的[FAST-LIO](https://github.com/hku-mars/FAST_LIO)，图优化部分参考的为[FAST_LIO_SAM](https://github.com/kahowang/FAST_LIO_SAM) 和 [LIO_SAM](https://github.com/TixiaoShan/LIO-SAM)，而主要的idea则是参考[FAST-LIO-Multi-Sensor-Fusion](https://github.com/zhh2005757/FAST-LIO-Multi-Sensor-Fusion)

**定位问题**：室外马拉松尺度大、时间长，纯轮速或短时视觉容易漂；坡道、遮挡、动态人群会造成 Lidar 退化。**`glio_mapping` 的定位思路**是典型 **LIO（LiDAR-Inertial Odometry）** 家族：高频 IMU 预测、LiDAR 扫描匹配校正，并可融合 GNSS 等全局观测量以抑制长期漂移；地图侧常用 **ikd-Tree** 等结构维护大规模点云，兼顾增量更新与查询效率。

**与导航的接口**：输出 **`/odometry`、TF 或等价全局位姿**，成为 `tangent_arc_navigation` 与 `marathontracking` 的**共同前提**。不同雷达型号通过 **launch 参数与标定文件**切换，体现「同一算法核、多平台配置」的工程组织方式。














# `tangent_arc_navigation`：极简巡线算法

该仓库是在已有全局路径下，使用激光雷达进行路径追踪和避障（作者自写避障算法）。

**要解决的子问题**：在**已有全局路径**和**局部点云/scan** 的前提下，用**较低工程复杂度**完成「沿路径走 + 基础避障」，便于快速跑通整机。

**典型技术栈** ：

1. **代价地图（costmap）**：将障碍、膨胀、层叠规则编码为栅格代价，是 ROS 生态里最成熟的「局部可通行性」表达之一。  
2. **costmap_converter**：将代价地图中的障碍簇转为动态障碍或多边形等，供后续模块消费。  
3. **`vo_navigation`（命名历史遗留）**：自写规划与控制逻辑，与 MPC/本仓库模糊方案不同，强调**可裁剪、可调试**。  
4. **辅助包**：`path_tools`（路径录制/拟合/偏移）、`sim_interface`（仿真与可视化）、`speed_controller` 等，把「算法」与「联调工具」拆开。

**与 `marathontracking` 的分工**：本路线**不强调** `local_planner` 那种「点云直进环形体素 + 多路径并行评分」；更适合**算力有限或希望先验证定位+路径闭环**的团队。

与 `marathontracking` 相比：**更依赖 costmap 标准组件**；**不自带** `local_planner` 这种「点云直进环形栅格+多路径评分」的一体化实现。






# `marathontracking`：完整巡线算法

追踪分为三个阶段：全速寻线，全速避障，低速恢复
* 全速寻线：当无障碍物时，机器人会使用类似Bang-Bang控制的方式进行寻线
* 全速避障：当障碍物距机器人>1.5米时候，机器人会进行高速避障，安全范围较大
* 低速恢复：当障碍物距机器人<1.5米时候，机器人会紧急停下，然后使用A*规划出一条轨迹，绕开复杂障碍物，回到原始轨迹上。当机器人稳定后再继续进入全速寻线。

面向**高速、多障碍、需显式处理左右边界**的赛道，将**感知—决策—控制**收束到 **`local_planner_node`** 为主干，辅以 **`path_process`** 与 **`python_ws`**：

| 阶段 | 核心思想 | 
|------|-----------|
| **局部地图** | 固定窗口体素随机器人平移；点云填高程，相对高度 + 左右路径生成障碍层 | 
| **参考与候选** | 三路 `Path` 裁剪；预置模板经刚体变换得到多条候选轨迹 | 
| **决策** | 安全、跟踪、形状、能量四维评分；`TRACKING` / `AVOIDANCE` / `RECOVERY` 模式机 | 
| **规划补救** | 恢复模式下 **A\*** 在栅格上重规划，再低速贴回 | 
| **控制** | 分段 `yaw_error`→`velz`，`min(最大线速度, 前视限速)`；二维 **运动学包络**裁剪 | 
| **可选外层** | `FuzzyTracking`（skfuzzy）或 PPO 残差；经 `joy_node` 与底盘对接 | 

**`path_process`**：在**不建体素**的前提下，从全局路径与里程计计算曲率、短前视航向误差等，发布 **`/tracking_info`**，可与模糊或调试工具链对接。


`marathontracking`的目录与职责：可拆为「几何与全局路径处理」「局部规划」「人机路由」「下行发送」四块：

```
marathontracking/src/
├── local_planner/          # C++：点云→栅格→采样路径→评分→/fuzzy_cmd_vel(Twist)
├── path_process/           # C++：全局路径与机体关系→/tracking_info(Float64MultiArray)
├── python_ws/              # Python：joy 路由、fuzzy_control、rl_control、SBUS
├── ros1_sender_general/    # C++：订阅 /final_stampd_cmd_vel → UDP/自定义帧 → 机器人
├── robot_interface/、sim_interface/、path_process/ …   # 与其它栈对接时可选用
```

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
flowchart TB
  classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;
  subgraph 几何与前处理
    PP[path_process_node<br/>Path 与机器人投影]
  end
  subgraph 局部闭环
    LP[local_planner_node<br/>点云+三路路径+里程计]
  end
  subgraph 可选外层控制
    FC[fuzzy_control_node]
    RL[rl_control_node]
  end
  subgraph 路由与下行
    JN[joy_node.py]
    SN[sender_node server.cpp]
  end
  PP -->|/tracking_info| FC
  LP -->|/fuzzy_cmd_vel Twist| JN
  FC -->|/fuzzy_cmd_vel Twist| JN
  RL -.->|/rl_cmd_vel 默认未进 joy| JN
  JN -->|/final_stampd_cmd_vel| SN
</div>


## `python_ws`
作用：这是一个由Python实现的一系列工具
其中包含：
- 遥控器控制(支持ROS Joy和SBUS协议遥控器)
- 模糊控制器（使用PID代替）

其中的`joy_node`是设置不同的模式，如下所示。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
stateDiagram-v2
  [*] --> manual
  manual --> auto : 遥控「自动」档\n且当前非 auto
  auto --> manual : 「手动」档\n平滑减速 + rc1
  manual --> third : 「第三」档\n调用 rc0
  third --> manual : 用户切回手动逻辑\n(依实现)
  auto --> third : 依遥控组合
</div>

- **`manual`**：`pub_cmd_vel` 直接使用 `JoyState` 中归一化后的 `vel_forward` / `vel_rotation`。  
- **`auto`**：使用缓存的 `fuzzy_cmd_vel`（已被 `clamp`：线速度 \([-0.5,1.0]\)，角速度 \([-3,3]\)）。若无缓存则发零。  
- **`third`**：调用 `call_rc0_mode()`，具体行走机构状态由 `/cmd_server/rc0_mode` 服务定义。  
- 切入 **`manual`** 时会 `smooth_stop()`（高速时用 tanh 形缓降）、`call_rc1_mode()`。





## `ros1_sender_general`
作用：就是一个普通的sender ,发送控制量给机器人  




## `local_planner`
作用：继承了路径规划，避障，控制一体。 
输出：最终控制量  

下面从**传感器与全局路径进入 `local_planner` 的一帧**出发，概括数据如何变为速度指令（与第 17 节逐步对应）。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
 
flowchart LR
  classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;
  subgraph 输入话题
    ODOM[/odometry/]
    PC2[/current_scan_body/]
    PF[/central|left|right smoothed_path/]
  end
  subgraph local_planner 同线程一帧
    SYNC[时间对齐 odom\nRobotShakeFilter]
    CROP[crop_path_boost\n裁剪三路路径]
    SAMP[PathSampler::sample\n模板路径→世界系]
    PCL[体素前处理\nx>1m 柱内点]
    MAP[高程图 elevation_map\n障碍图 obstacle_map]
    SEL[select_path\n四维评分+模式机]
    VEL[compute_vel +\nKinematicEnvelope::clip]
  end
  subgraph 输出
    CMD[/fuzzy_cmd_vel Twist/]
    DBG[/debug/* /]
  end
  ODOM --> SYNC
  PC2 --> PCL
  PF --> CROP
  SYNC --> CROP
  SYNC --> SAMP
  CROP --> SAMP
  SAMP --> SEL
  PCL --> MAP
  MAP --> SEL
  SEL --> VEL --> CMD
  MAP --> DBG
  SEL --> DBG
</div>

**与 `path_process` 的并行支路**：另一节点可订阅全局路径 + 里程计，独立发布 `/tracking_info`（Float64 数组），供外层模糊或调试；**不经过** `local_planner` 内的体素地图。


`select_path`，对 `sampled_pathes` 中**每条**候选路径计算四个标量，再进入模式分支与排序逻辑。


| 函数 | 返回值倾向 | 含义概要 |
|------|------------|----------|
| `compute_score_unparallelism` | **越小越好** | 用 `sync_path_points` 将候选路径与若干条平行采样线求交点，与「裁剪后的中心参考路径」`synced_cropped_path` 上对应点的距离，相对首条采样线的偏差做绝对差分并求和；惩罚「整体形状相对走廊扭动」的候选。 |
| `compute_score_safety` | **越大越好** | 在路径索引 `[beg_idx, end_idx)` 上，对每个路径点将 `collision_range_` 中偏移格子映射到 `obstacle_map`，取路径点到最近障碍的欧氏距离的最小值；即**路径段上的净空**。 |
| `compute_score_tracking` | **越小越好** | 取候选路径上前视点索引 `dyn_ahead_idx` 处坐标，到 `cropped_path_` 上所有点的最小距离（先平方再开方）；即**前视跟踪误差**。 |
| `compute_score_energy` | 有符号、用于加权 | 对候选路径设 `setControlParam` 后取 `compute_yaw_error()`，再除以 `π` 归一化；避障分支中与 `ctx_last_energy` 组合成代价，倾向选**转向变化平缓**的路径。 |

`beg_idx` / `end_idx` 由内段长度 `kSamplePathInnerLength` 与 `compute_valid_path_range` 得到的 `valid_path_range` 决定，避免对整条路径做无效碰撞查询。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">

flowchart TD
  classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;
  A[对每条候选算四维分数] --> B[RECOVERY?]
  B -->|是| R[recover_process 后 return]
  B -->|否| C[按 scores_tracking 升序排序得 topK=4]
  C --> D{topK 中 safety≥阈值的占比}
  D -->|≥80%| T[TRACKING：在安全集合上选 tracking 最小且 unparallelism 较小]
  D -->|<80%| V[AVOIDANCE：若 max safety 过低则 crash；否则在非 topK 且足够安全候选上按 energy 代价选线]
</div>

- **避障代价**（`solution1`）：`cost = |energy| + kWeightEnergyConsistency * |energy - ctx_last_energy|`，兼顾当前转向与上一周期一致性。  
- **TRACKING 候选集**：先筛 `scores_safety[i] > kMinScoreSafety`，再在其中分别最小化 `scores_tracking` 与 `scores_unparallelism`（代码中两轮 min，用于折中跟踪与形状）。  


# `vision_part`：视觉感知算法

**问题**：赛道上除跑道外还存在**人、车、其它机器人**等实例；仅用几何高度或 costmap 难以稳定区分语义类别。**`vision_part` 提供「训练—导出—部署」全链路**：

- **`dataset`**: 数据集文件，包含部分增强数据，要下载的话需要发送申请给作者。
- **`seg_fusion`**：**部分标注**场景（仅 robot 标注、同图存在 person/car）下，用**分阶段训练 + 双 head + 权重融合**避免「未标类别被当背景」带来的负迁移。  
- **`seg_lightning`**：面向**小目标/难例**的实验分支（readme 中标注成熟度相对低）。  
- **`seg_tensorrt`**：**ONNX → TensorRT / DeepStream**，把模型推到板端实时推理。

**与导航的关系**：视觉输出必须经过**标定、同步、坐标变换**才能进入 `obstacle_map`、costmap 或左右 `Path` 话题；仓库开放的是**模型与推理工程**，**在线融合策略属于集成层**。



<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart LR
  classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;
  subgraph 离线
    D[dataset]
    T1[seg_fusion train/export]
    T2[seg_lightning train]
  end
  subgraph 在线
    O[ONNX 脚本]
    R[TensorRT / DeepStream]
  end
  D --> T1
  T1 --> O
  T1 --> R
  T2 -.-> R
</div>

## `seg_fusion` or `split_yolo_seg`

* [说明文档](https://github.com/R-C-Group/marathongo/tree/main/vision_part/seg_fusion)
  
`split_yolo_seg` 是一个面向 robot、person、car 混合场景的实例分割实验方案整理目录。

## `seg_lightning`

* [说明文档](https://github.com/R-C-Group/marathongo/tree/main/vision_part/seg_lightning)

基于 PyTorch Lightning 和 ultralytics 实现的 YOLO11s-seg 实例分割模型，支持多数据集混合训练，并实现了数据集感知的 loss 屏蔽策略。项目架构如下所示

```bash
yolo_lightning/
├── configs/
│   └── yolo11s_seg.yaml          # 网络结构配置（类似 ultralytics 格式）
├── model/
│   ├── __init__.py
│   └── yolo_seg.py                # 模型构建（从 YAML 动态解析网络）
├── data/
│   ├── __init__.py
│   ├── dataset.py                 # YOLO 格式数据集（支持 source 标记）
│   └── datamodule.py              # Lightning DataModule（多数据集混合）
├── loss/
│   ├── __init__.py
│   └── seg_loss.py                # 数据集感知的分割 Loss
├── trainer/
│   ├── __init__.py
│   └── yolo_lightning.py          # Lightning 训练模块
└── train.py                       # 训练入口脚本
```

## `seg_tensorrt`

* [说明文档](https://github.com/R-C-Group/marathongo/tree/main/vision_part/seg_tensorrt)



# 总结
感知基于fast-LIO（融合了GNSS）。全局路径规划为巡线模式。局部为：离线候选轨迹库（10条，按一定角度采样、长度与速度相关）与实时感知的局部障碍图（体素），通过多指标评分选取合适的轨迹，基于RPP跟踪拟合机器人的速度和角速度。若10条离线轨迹均不满足避障等需求，局部用A*恢复（栅格）。运控的速度通过MPC控制机器人腿部关节角速度。
  * 优点：采用类似智驾/无人机规划方式，比起基于栅格地图的优化更快（只需要选），通过高频replan躲避障碍物
  * 缺点：离散采样方式容易进入replan模式，A*无平滑导致只能低速跟踪，仿真无交互性决策时，容易发生与动态障碍物的碰撞。
