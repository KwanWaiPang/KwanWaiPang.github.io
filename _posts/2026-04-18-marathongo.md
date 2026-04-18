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
* marathontracking/README.md
* tangent_arc_navigation/src/README.MD
* vision_part/seg_fusion/README.md
* vision_part/seg_tensorrt/README.md

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



## 三、`tangent_arc_navigation`：基于代价地图的轻量巡线

**问题与定位：** 在**已具备全局参考路径**且上游可提供点云或 scan 的前提下，以**较低工程复杂度**实现沿路径运动与基础避障，便于优先验证「定位—路径—执行」闭环。

**技术主线：** 采用 ROS 生态中成熟的 **costmap** 表达局部可通行性；通过 **costmap_converter** 将栅格障碍簇转为多边形或动态障碍表示供后续消费；规划与控制集中在 **`vo_navigation`** 包（包名为历史遗留，实质为自研局部规划与控制，而非视觉里程计）。辅助包包括 **`path_tools`**（路径录制、拟合、侧向偏移等）、**`sim_interface`**（仿真与可视化）、**`speed_controller`** 等，将算法与联调工具分离。

**与 `marathontracking` 的关系：** 二者解决同类高层任务，但本路线**不采用**「点云直接进入环形体素地图并做多条候选路径并行评分」的一体化实现，更适合算力受限或需先跑通定位与路径集成的情形；参数与话题名不可默认互换。


## 四、`marathontracking`：比赛栈中的局部规划与系统集成

**问题与定位：** 面向**高速、多障碍、需显式左右边界**的赛道，将感知、决策与控制收束到以 **`local_planner_node`** 为主干的 C++ 闭环，辅以 **`path_process_node`** 与 **`python_ws`**，并经 **`ros1_sender_general`** 下行。

**阶段划分（与源码对应）：** `marathontracking/README.md` 中的三阶段与 `local_planner_node.cpp` 中 **`PlannerMode`**（`TRACKING`、`AVOIDANCE`、`RECOVERY`）及 `compute_vel`、`recover_process` 相对应：全速寻线、全速避障、低速恢复；恢复阶段在栅格上采用 **A\*** 类规划（`djikstra.hpp`）重规划后再贴回参考轨迹，具体阈值与状态迁移见解读文档第 14、20、24 章。

**包内分工（与解读文档第 3 章一致）：**

- **`local_planner/`**：点云与三路 `nav_msgs/Path` 进入同一节点，经时间对齐、路径裁剪、模板路径采样、高程与障碍栅格构建、`select_path` 四维评分与模式机、`compute_vel` 与 **`KinematicEnvelope::clip`**，发布 `geometry_msgs/Twist` 至 **`/fuzzy_cmd_vel`**（解读文档说明 C++ 内对 `linear.x` 另有尺度处理，与下游标定衔接）。
- **`path_process/`**：在不建体素地图的前提下，由全局路径与里程计计算曲率、短前视航向误差等，发布 **`/tracking_info`**（`std_msgs/Float64MultiArray`），供可选模糊控制或调试；与 `local_planner` 内体素链**并行**，对照见解读文档第 21 章。
- **`python_ws/`**：遥控与自动模式路由、可选模糊与 PPO、SBUS 等；**`joy_node`** 在自动模式下缓存 `/fuzzy_cmd_vel`，并通过定时器在**连续若干周期未收到新自动速度指令**时清零缓存，以避免上游失效后仍输出陈旧指令；发布 **`/final_stampd_cmd_vel`** 供 sender 订阅。
- **`ros1_sender_general/`**：订阅带时间戳的最终速度，封装为 UDP 或自定义帧至机器人；协议常量见 `server.cpp` 中与 `CMD_MODE_*` 相关的定义。

现场启动顺序在 `marathontracking/README.md` 与 `marago.sh` 中给出，可与解读文档第 4 章话题表一并对照。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
flowchart TB
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    PP[path_process_node]
    LP[local_planner_node]
    FC[fuzzy_control_node]
    RL[rl_control_node]
    JN[joy_node]
    SN[sender_node]

    PP -->|tracking_info| FC
    LP -->|fuzzy_cmd_vel| JN
    FC -->|fuzzy_cmd_vel| JN
    RL -.->|rl_cmd_vel| JN
    JN -->|final_stampd_cmd_vel| SN
</div>

**`local_planner` 单帧数据流（鸟瞰）：** 解读文档第 1.4 节与第 17 章给出自 `/odometry`、`/current_scan_body`、三路 `smoothed_path` 进入同线程回调直至发布 `/fuzzy_cmd_vel` 的顺序说明；下图与其一致，便于与源码断点顺序对照。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
flowchart LR
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    subgraph IN["输入"]
        ODOM[/odometry/]
        PC2[/current_scan_body/]
        PF["三路 smoothed_path"]
    end
    subgraph CORE["local_planner 单帧"]
        SYNC[时间对齐与姿态滤波]
        CROP[crop_path_boost]
        SAMP[PathSampler::sample]
        PCL[点云前处理]
        MAP[高程图与障碍图]
        SEL[select_path]
        VEL[compute_vel 与包络裁剪]
    end
    subgraph OUT["输出"]
        CMD[/fuzzy_cmd_vel/]
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
</div>

**选线与控制（指向解读文档）：** `select_path` 中安全、跟踪、形状一致性、能量等评分项及 `TRACKING` / `AVOIDANCE` 分支逻辑见解读文档第 14 章；`KinematicEnvelope` 与 `compute_vel` 中模式相关约束见第 15、27～28 章；`RingVoxelMap` 与障碍列扫描见第 18 章。此处从略。


## 五、`vision_part`：分割训练与部署

**问题与定位：** 赛道上除几何可通行性外，还存在人、车、其它机器人等**语义类别**；仅靠高度或 costmap 难以稳定区分。该子目录提供**训练—导出—部署**全链路。

**子目录职责（与解读文档第 2.4 节及 `readme.txt` 一致）：**

- **`seg_fusion`**：针对**部分标注**场景，采用分阶段训练、双分支与权重融合等策略，减轻未标注类别被当作背景带来的负迁移；细节见该目录 `README.md`。
- **`seg_lightning`**：面向小目标或难例的实验分支，文档中注明成熟度相对有限。
- **`seg_tensorrt`**：将 ONNX 转换为 **TensorRT** 或 **DeepStream**  pipeline，用于板端实时推理。

视觉结果进入在线导航前，须完成**相机—机体—雷达外参、时间同步与坐标变换**；仓库开放模型与推理工程，**在线融合策略属整机集成层**，根目录 README 已作说明。


## 六、话题与节点衔接（摘要）

下列为阅读时与解读文档第 4、5、12 章对照后的**摘要**，完整消息类型、发布订阅关系及 `/tracking_info` 各索引含义仍以解读文档为准。

- **`/central/smoothed_path`**、**`/left/smoothed_path`**、**`/right/smoothed_path`**：`nav_msgs/Path`，由外部模块产生，`local_planner_node` 订阅。
- **`/current_scan_body`**：机体坐标系点云，`local_planner_node` 订阅。
- **`/odometry`**：通常来自 `glio_mapping` 等，`local_planner_node` 订阅。
- **`/fuzzy_cmd_vel`**：`geometry_msgs/Twist`；`local_planner_node` 与可选 **`fuzzy_control_node`** 均可发布**同名话题**，部署时应通过 remap 或进程编排保证**单一有效发布源**，避免多源交替覆盖。
- **`/final_stampd_cmd_vel`**：`TwistStamped`，由 **`joy_node`** 发布，**`ros1_sender_general`** 订阅。
- **`/tracking_info`**：由 **`path_process_node`** 发布；**`/local_planner/control_info`** 在解读文档所依据的源码快照中未见 C++ 侧 advertise，Python 模糊与 RL 节点若订阅 `control_info`，常需在 launch 中 **remap** 至 `/tracking_info` 或由 C++ 侧按约定维数另行发布。
- **强化学习：** `rl_control_node` 默认发布 **`/rl_cmd_vel`**，而 **`joy_node`** 默认合并 **`/fuzzy_cmd_vel`**；若要将 PPO 输出并入整机闭环，须在仲裁或 remap 上显式处理（解读文档第 8 章）。

此外，解读文档第 12 章列出若干源码级注意事项（例如 `path_process` 中与路径前向距离相关的实现路径、订阅者重复赋值等），集成时应与当前分支源码一并核对。

