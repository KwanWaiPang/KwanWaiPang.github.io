---
layout: post
title: "论文阅读笔记之《Intent Prediction-Driven Model Predictive Control for UAV Planning and Navigation in Dynamic Environments》"
date:   2026-05-02
tags: [Robotics]
comments: true
author: kwanwaipang
toc: true
excerpt: "面向工地等动态场景的 UAV 导航：感知（含丢跟踪补偿）+ 基于 MDP 的意图与轨迹预测 + 意图驱动的 MPC 规划与评分选轨。" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->

* [PDF](https://arxiv.org/pdf/2409.15633)
* [Github](https://github.com/Zhefan-Xu/Intent-MPC)


# 论文阅读

作者提出一套面向**室内工地等动态环境**的无人机导航框架：在机载 RGB-D、算力与视场受限的前提下，同时处理静态障碍与移动行人/障碍，并在规划中显式考虑障碍**多种可能的高层行为（意图）**，而不是假设单一线性未来轨迹。

## 背景与动机

- **应用场景**：轻量 UAV 在建筑工地做巡检、建图时，需靠近移动的工人与设备，安全避障要求高。
- **难点一（感知）**：机载相机画质与视场有限，避障机动中目标容易**出画或短时丢失**，若直接丢弃跟踪，重规划可能低估碰撞风险。
- **难点二（规划）**：动态障碍运动不确定；许多方法对每个障碍只预测**单一未来模式**（常配合线性运动），一旦真实行为偏离假设，原先“最优”轨迹会很快失效。
- **思路**：将感知、**意图预测**与 **MPC** 规划紧耦合——用意图上的概率分布表达不确定性，为每种意图组合生成候选 UAV 轨迹并打分选取，从而在实时性与安全性之间折中。

## 论文主要贡献

1. **意图驱动的导航框架**：包含（i）静/动态感知与丢跟踪处理；（ii）意图与轨迹预测；（iii）基于 MPC 的规划与轨迹选择。
2. **基于 MDP 的短时意图与轨迹预测**：意图集合为 `{前进, 左转, 右转, 停止}`，用马尔可夫过程刻画意图转移；区别于偏重任务级、需长期数据的 MDP 意图工作，本文侧重**运动级、短时**预测，适配机载有限感知与实时导航。
3. **物理飞行实验验证**：仿真与实机表明，相比 EGO、ViGO、CC-MPC 等基准，碰撞次数更少（论文给出定量对比与消融）。

## 系统架构

下图概括数据流：定位与 RGB-D → 静态占据栅格 + 动态检测跟踪（含视场外补偿）→ 意图概率与多意图轨迹预测 → 多场景 MPC 生成与评分选轨 → 控制器跟踪。

*也可将下方 Mermaid 复制到 [mermaid.live](https://mermaid.live/) 中查看。*

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    %% 定义全局样式类
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    A[传感器输入 定位 RGB-D] --> B[静态感知模块]
    A --> C[动态感知模块]
    B --> D[占据栅格与动态清洗]
    C --> E[集成检测 特征跟踪 Kalman]
    D --> F[预测模块]
    E --> F
    F --> G[意图 MDP 四意图概率]
    F --> H[轨迹预测 采样与风险尺寸]
    G --> I[意图驱动规划]
    H --> I
    I --> J[MPC 轨迹生成 椭球避障约束]
    J --> K[评分选轨 一致绕路安全]
    K --> L[控制器执行]

    %% class A,B,C,D,E,F,G,H,I,J,K,L plain;
</div>


| 模块 | 作用简述 |
| --- | --- |
| **传感器输入** | 论文设定为 RGB-D 相机（感知）配合 **LIO** 等定位；为后续占据图与 3D 障碍检测提供原始数据。 |
| **静态感知** | 构建体素占据地图，并通过随时间更新做**动态清洗**，削弱移动物体在静态图中的残留噪声。 |
| **动态感知** | **DBSCAN** 点云与 **U-depth** 两种轻量检测互为校验，再结合 **YOLO** 做 2D 一致性筛选；用特征相似度关联 + **Kalman**（恒加速度）估计位置速度；并用车载相机运动导致的**丢跟踪**：对出视野目标用恒加速度外推位置、逐步放大包围尺寸形成**风险区域**，供规划避让。 |
| **意图 MDP** | 障碍在 2D 平面上运动；由短时位移得到原始意图分布，构造转移矩阵并沿历史累积，得到当前时刻对各离散意图的概率分布。 |
| **轨迹预测** | 对每个障碍、**每一种意图**都生成未来位置序列与随不确定性膨胀的**风险尺寸**（stop / forward / turn 对应不同控制采样与均值化）。 |
| **MPC 轨迹生成** | UAV 用离散线性动力学；目标为贴近参考轨迹且惩罚控制量；障碍统一为包围盒再嵌入椭球碰撞约束，联合静、动态预测障碍做滚动优化。 |
| **评分选轨** | 对多个障碍的**top-K 意图组合**（概率为各障碍意图概率之积）分别调用 MPC；最终分数 = 组合概率 × 由**一致性**（相对上一轨）、**绕路**（相对参考）、**安全**（与障碍距离）加权得到的轨迹评价，取最高分轨迹输出。 |
| **控制器** | 跟踪所选局部轨迹，完成闭环飞行（论文报告各模块耗时，整体可满足实时性）。 |

---

# 代码梳理

下文基于本地仓库 `/Users/guanweipeng/Desktop/Intent-MPC/`（与 [GitHub](https://github.com/Zhefan-Xu/Intent-MPC) 一致）梳理。**算法主链路**集中在 ROS1 Catkin 包：`autonomous_flight`（顶层调度）、`map_manager`（占据图 + 动态清洗）、`onboard_detector`（RGB-D 动态障碍）、`dynamic_predictor`（意图与轨迹预测）、`trajectory_planner`（MPC + 静障碍聚类）、`tracking_controller`（跟踪 MAVROS）。`global_planner`、`time_optimizer`、若干 `*_node.cpp` 测试与交互节点为辅助；`trajectory_planner/include/trajectory_planner/third_party/**`、`mpc_solver/qpoases`、`uav_simulator` 等体量极大，此处只说明用途，不按文件展开。

---

## 总览：节点与数据流

官方演示 `autonomous_flight/launch/intent_mpc_demo.launch` 会加载 `tracking_controller`、`mpc_navigation` 的多份 yaml，并启动 **`tracking_controller_node`** 与 **`mpc_navigation_node`**（仿真里常用 **fake detector**，真实相机则配合 `onboard_detector` 的 `detector_node` 等）。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    S[传感器 深度点云 里程计] --> DM[dynamicMap 占据射线与内部检测器]
    S --> TC[tracking_controller]
    DM --> DP[dynamic_predictor]
    DM --> MPC[mpcPlanner]
    DP --> MPC
    AF[mpcNavigation] --> DM
    AF --> DP
    AF --> MPC
    MPC --> AF
    AF --> TC
    TC --> Mav[MAVROS 飞控]
</div>

---

## 1. `autonomous_flight`（顶层导航）

**作用**：订阅里程计/目标点，初始化地图、检测器、预测器、全局/多项式轨迹与 MPC；在独立线程 `mpcCB` 里做重规划，在定时器里做碰撞检查与 **Target** 下发。

**涉及文件**：`src/mpc_navigation_node.cpp`（仅 `main`）；`include/autonomous_flight/mpcNavigation.{h,cpp}`（核心）；`flightBase.{h,cpp}`（起飞、MAVROS、`Target` 发布）；`utils.h`（几何小工具）。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    M[mpc_navigation_node main] --> N[mpcNavigation]
    N --> P[initParam 读取 yaml]
    N --> I[initModules map detector predictor rrt polyTraj mpc]
    N --> R[run takeoff registerCallback]
    R --> W[mpcWorker 线程 mpcCB 10Hz]
    R --> T1[replanCheckCB 目标与碰撞]
    R --> T2[trajExeCB 采样 MPC 状态写 Target]
    R --> T3[visCB 发布路径可视化]
    W --> C{refTrajReady?}
    C -- 否 --> G[RR 或 多点 polyTraj 生成参考路径]
    C -- 是 --> U[updateCurrStates updatePath]
    U --> PR{use_predictor?}
    PR -- 是 --> GP[getPrediction 喂 mpc]
    PR -- 否 --> DO[map 当前动态框]
    GP --> MP[makePlanWithPred 或 makePlan]
    DO --> MP
    MP --> OK{求解成功?}
    OK -- 是 --> TR[getTrajectory 执行]
</div>

要点：`use_fake_detector_` 时用 **`fakeDetector`** 且 **`dynamicMap(nh, false)`** 关闭地图内置的 `freeMap` 定时器，改由 `mpcNavigation` 里（若启用）根据仿真障碍更新空闲区域；真实流程则由 **`dynamicMap` 内建的 `dynamicDetector`** 与定时 **`freeMapCB`** 做动态体素清洗。

---

## 2. `map_manager`（静态占据 + 动态清洗）

**作用**：**`occMap`** 用深度/点云与位姿做射线投射，维护膨胀占据栅格；**`dynamicMap`** 继承 `occMap`，内部持有 **`dynamicDetector`**，定时把当前动态障碍三维框转成 **freeRegions**，从占据图中“抠除”移动物体，避免静态图被动态目标污染。

**涉及文件**：`include/map_manager/occupancyMap.{h,cpp}`，`raycast.{h,cpp}`；`dynamicMap.{h,cpp}`；节点 `src/occupancy_map_node.cpp`、`dynamic_map_node.cpp`、`esdf_map_node.cpp`、`save_map_node.cpp`（后二者为 ESDF/存图等扩展用途）。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph LR
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    D[深度或点云] --> R[raycast 更新体素]
    R --> V[占据与膨胀]
    V --> Q[isInflatedOccupied 碰撞查询]
    DM[dynamicMap freeMapCB] --> G[getDynamicObstacles 框]
    G --> F[freeRegions updateFreeRegions]
    F --> V
</div>

---

## 3. `onboard_detector`（动态障碍检测与跟踪）

**作用**：同步深度（与 pose/odom）、可选对齐深度与彩色图；**DBSCAN** 与 **U-depth（UVdetector）** 生成 3D 框，与 **YOLO 2D 检测** 做 IoU 一类筛选；**特征相似度**数据关联 + **`kalmanFilter`** 估计位置速度；支持 **视场外/丢检测** 时用运动模型外推并放大框（与论文一致）。**`fakeDetector`** 供 Gazebo 直接从仿真读真值障碍。

**涉及文件**：`src/detector_node.cpp`、`fake_detector_node.cpp`；`include/onboard_detector/dynamicDetector.{h,cpp}`（主体，体量最大）；`uvDetector.{h,cpp}`，`dbscan.{h,cpp}`，`kalmanFilter.{h,cpp}`，`utils.h`，`fakeDetector.{h,cpp}`。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    I[深度图 + 位姿] --> P[投影点云]
    P --> DB[DBSCAN 框]
    P --> UV[U-depth 框]
    DB --> E[ensemble 交集筛选]
    UV --> E
    E --> Y[YOLO 彩色校验]
    Y --> A[特征关联]
    A --> K[Kalman 状态]
    K --> O[动态框 速度 历史轨迹]
    K --> L{视野外?}
    L -- 是 --> X[外推 + 风险放大]
</div>

---

## 4. `dynamic_predictor`（意图 MDP + 轨迹预测）

**作用**：从检测器取 **多障碍历史**（`getDynamicObstaclesHist`）；**`intentProb`** 按相邻位移角速度构造转移阵并链式相乘得到四维意图概率 **FORWARD / LEFT / RIGHT / STOP**；**`predTraj`** 对每种意图采样控制 forward/turn/stop，得到预测位置序列与放大后的 **size**；**`getPrediction`** 供 `mpcNavigation` 一次性取出与 MPC 约定形状的张量。

**涉及文件**：`include/dynamic_predictor/dynamicPredictor.{h,cpp}`，`utils.h`（`intentType` 枚举与 `obstacle` 结构体）；`src/dynamic_predictor_node.cpp`（独立调试节点）；`dynamic_predictor_fake_node.cpp`。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    H[pos vel acc size 历史] --> IP[intentProb MDP 链乘]
    H --> PT[predTraj 四意图并行]
    IP --> OUT[intentProb_ 向量]
    PT --> PP[posPred_ sizePred_]
    OUT --> G[getPrediction]
    PP --> G
</div>

---

## 5. `trajectory_planner`（静障碍聚类 + OSQP MPC + 意图选轨）

**作用**：**`staticObstacleClusteringCB`** 在机体前方局部区域内采集占据体素，**`obstacleClustering`** 聚类得到静态 **oriented bbox**；**`mpcPlanner`** 将参考路径升维为状态参考 **`getXRef`**，用 **线性离散动力学** 把 MPC 化成 **QP**，**OsqpEigen** 求解；**无预测**时 **`makePlan`** 对当前动态框序列做避障；**有预测**时 **`makePlanWithPred`**：先 **`findClosestObstacle`** 选“主”障碍，再 **`getIntentComb`** 生成 **6 种**主障碍意图模式（停/左/右/前，以及左与前、右与前概率取 max 的混合），其余障碍用 **最大概率意图** 的单条预测；在 **100ms 预算**内尽可能多解 QP，**`getTrajectoryScore`** 给出一致性、绕路、安全三项，**`evaluateTraj`** 归一化后与对应意图概率相乘选最优。

**涉及文件**：**核心**：`include/trajectory_planner/mpcPlanner.{h,cpp}`，`clustering/obstacleClustering.*`（被 `mpcPlanner` 包含）；**ROS 交互/示例节点**：`src/mpc_node.cpp`、`mpc_solver_setup.cpp`、`bspline_node.cpp`、多个 `poly_RRT*_node.cpp`。多项式全局轨迹库为头文件实现：`polyTrajOccMap`、`piecewiseLinearTraj`、`bsplineTraj` 等（与 `mpcNavigation` 头文件引用一致）。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    L[局部占据体素] --> C[obstacleClustering 静态框]
    C --> S[solveTraj 椭球约束 QP]
    R[inputTraj 参考] --> X[getXRef]
    X --> S
    P[obPredPos Size IntentProb] --> IC[getIntentComb 6 模式]
    IC --> S
    S --> SC[候选 states controls]
    SC --> EV[evaluateTraj 加权得分]
    EV --> BEST[currentStatesSol_ 最优]
</div>

与论文的一点实现差异：**代码对最近障碍枚举 6 组意图组合并在时限内并行求解**，其余障碍固定为 **argmax 意图**；评分里一致性/绕路数值与论文公式写法不同，但语义仍是 **平滑、贴参考、远离障碍**。

---

## 6. `tracking_controller`（位置环 → MAVROS）

**作用**：订阅 **`tracking_controller/Target`**（位置、速度、加速度、yaw），用 **PID（可选加速度前馈）** 生成 **`mavros_msgs/PositionTarget` / 姿态** 等指令；`mpcNavigation` 的 **`trajExeCB`** 按 MPC 时间参数把轨迹点填入 `Target`。

**涉及文件**：`src/tracking_controller_node.cpp`；`include/tracking_controller/trackingController.{h,cpp}`，`utils.h`；`msg/Target.msg`。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph LR
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    T[Target 订阅] --> PID[位置速度 PID]
    O[odom IMU] --> PID
    PID --> M[mavros 指令]
</div>

---

## 7. 其余包（简要）

| 包 | 代码文件角色 |
| --- | --- |
| **`global_planner`** | `rrtOccMap` / `rrtStarOctomap` / `PRMKDTree` 等：`use_global_planner` 时在 `mpcNavigation` 里 **`makePlan` 全局路径**；`src/*_interactive_node.cpp`、`test_*.cpp` 为调试。 |
| **`time_optimizer`** | `timeOptimizer`、`bsplineTimeOptimizer`、`trajectoryDivider`：B 样条时间分配等（与本仓库 MPC demo 主链路可并行存在，按需 launch）。 |
| **`remote_control`** | RViz、遥控相关 launch。 |
| **`uav_simulator`** | Gazebo 插件、机体、世界文件；非论文算法核心。 |

---

## 模块—源文件对照（便于检索）

| 模块 | 建议优先阅读的 `.cpp` / `.h` |
| --- | --- |
| 顶层 | `autonomous_flight/include/autonomous_flight/mpcNavigation.cpp` |
| 地图 | `map_manager/include/map_manager/dynamicMap.cpp`，`occupancyMap.cpp` |
| 检测 | `onboard_detector/include/onboard_detector/dynamicDetector.cpp` |
| 预测 | `dynamic_predictor/include/dynamic_predictor/dynamicPredictor.cpp` |
| MPC | `trajectory_planner/include/trajectory_planner/mpcPlanner.cpp` |
| 控制 | `tracking_controller/include/tracking_controller/trackingController.cpp` |

以上覆盖 Intent-MPC **从感知、预测到 MPC 选轨、底层跟踪** 在仓库中的真实调用关系；若你后续只改某一环（例如意图数量或 QP 约束），可沿着对应包的上述文件单步调试即可。


