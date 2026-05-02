---
layout: post
title: "论文阅读笔记之《Intent Prediction-Driven Model Predictive Control for UAV Planning and Navigation in Dynamic Environments》"
date:   2026-05-02
tags: [Robotics]
comments: true
author: kwanwaipang
toc: true
excerpt: "意图预测驱动的导航框架" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->

* [PDF](https://arxiv.org/pdf/2409.15633)
* [Github](https://github.com/Zhefan-Xu/Intent-MPC)


# 论文阅读

作者提出一套无人机导航框架：在机载 RGB-D、算力与视场受限的前提下，同时处理静态障碍与移动行人/障碍，并在规划中显式考虑障碍**多种可能的高层行为（意图）**，而不是假设单一线性未来轨迹。

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

# 代码梳理（读代码笔记）

读 Intent-MPC 时，我把整条链路想成：**地图线程在一直融传感器、抠动态；检测定时器在产框；预测定时器在读历史；导航线程在抢 MPC 解并把轨迹交给底层跟踪**。下面按模块记我顺着调用栈啃下来的印象；图尽量和源码一致，和我最初想当然不一致的地方也写出来。

---

## 先从 launch 建立直觉

`intent_mpc_demo.launch` 只起了两个核心进程：**跟踪节点**和 **`mpc_navigation_node`**。地图、检测器、预测器并不是六个独立 ROS node——它们在 `mpcNavigation` 里 `reset` 成共享指针，跑在同一进程。弄清这一点，总览就不会画成「一堆节点手拉手」。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    subgraph proc [mpc_navigation 进程内]
        DM[dynamicMap 继承 occMap]
        DET[dynamicDetector 由 dynamicMap 构造]
        PR[predictor 可选]
        MPC[mpcPlanner]
        NAV[mpcNavigation]
        DM --- DET
        NAV --> DM
        NAV --> PR
        NAV --> MPC
        DET -. map getDetector 交给 PR .-> PR
        PR --> MPC
        MPC --> NAV
    end

    S[深度点云与里程计话题] --> DM
    FB[flightBase 订 odom] --> NAV
    NAV -->|Target| TC[tracking_controller 另一进程]
    TC --> MX[MAVROS]
</div>

---

## `autonomous_flight`：线程怎么分工

`flightBase` 管 MAVROS 解锁起飞、`Target` 发布线程、RViz 点目标这类共性逻辑；和论文对应的是 **`mpcNavigation`**。

我读 `mpcNavigation.cpp` 的主线：**独立线程里 `mpcCB`** 用的是 `ros::Rate(10)`，也就是 10 Hz；**`replanCheckCB`**、**`trajExeCB`** 都是 10 ms。碰撞检查 `mpcHasCollision` / `hasDynamicCollision` 在检查定时器里做，用的是占据图和当前 MPC 轨迹采样点——和求解线程不同步，调试时要心里有数，但代码意图就是：**规划线程求轨，定时器决定要不要停、要不要把 `mpcReplan_` 拉起来**。

参考轨迹第一次就绪的路径：`refTrajReady_` 为假时走文件 `use_predefined_goal`、或 `use_global_planner` 时 RRT 再 `polyTrajOccMap` 离散采样 `updatePath`，或起点终点直连多项式；这一趟只做 **`mpc_->updatePath`**，还不会进入后面密集的带障碍求解。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    subgraph timers [单线程定时器]
        RC[replanCheckCB]
        TE[trajExeCB getPos Vel Acc 写 Target]
        VI[visCB]
    end

    subgraph worker [线程 mpcCB]
        E{mpcReplan_}
        E -->|否| SL[sleep]
        E -->|是| R1{refTrajReady_}
        R1 -->|否| REF[生成参考 updatePath]
        R1 -->|是| UC[updateCurrStates]
        UC --> PRED{use_predictor}
        PRED -->|是| GP[getPrediction]
        PRED -->|否| GD[getDynamicObstacles]
        GP --> SOL[makePlanWithPred 或 makePlan]
        GD --> SOL
        SOL --> GH[getTrajectory]
    end

    RC -. 触发 mpcReplan_ .-> worker
</div>

`dynamicMap(nh, false)` 会关掉 **`dynamicMap` 内部自带的 `freeMapCB` 定时器**。仿真若走 fake detector，`mpcNavigation` 里虽然实现了 **`freeMapCB`**（用 fake 框去 `updateFreeRegions`），但默认 **`registerCallback` 并没有 `createTimer` 挂上它**——我读到底时确认 `freeMapTimer_` 只在头文件声明，cpp 里未订阅；所以 fake 模式下占据图是否会被周期性抠动态，要对照你实际 launch 有没有别处接这条逻辑，不能想当然。

---

## `map_manager`：占据与 dynamic clean

**`occMap`**：传感器投影 + 射线更新体素 + 膨胀，对外 **`isInflatedOccupied`**。**`dynamicMap::initMap`** 里无条件 **`reset` 了一个 `dynamicDetector`**——所以导航进程里始终有一个完整检测器对象；仿真若再挂 `fakeDetector`，属于另一条取数链路，读到这里就不会误以为「fake 模式地图里就没有 detector」。

**`freeMapCB`**：`getDynamicObstacles` 拉框 → 生成 `freeRegions` → `freeRegions()` / `updateFreeRegions()`。预测里 **`modelForward` / `modelTurning`** 逐步 `map_->isInflatedOccupied(p)`，占据图既是 MPC 碰撞查询来源，也是采样可否落地的判据。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph LR
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    subgraph occ [occMap]
        ray[同步深度或点云与位姿]
        ray --> voxel[射线更新体素]
        voxel --> inf[膨胀]
        inf --> Q[isInflatedOccupied]
    end

    subgraph dm [dynamicMap 定时器]
        det[getDynamicObstacles]
        det --> fr[freeRegions]
        fr --> upd[updateFreeRegions]
        upd --> voxel
    end
</div>

---

## `onboard_detector`：定时器链条（顺序以源码为准）

**`detectionCB` 里的调用顺序是：`dbscanDetect()` → `uvDetect()` → `yoloDetectionTo3D()` → `filterBBoxes()`**，不是先 UV 再 DBSCAN——我对着行号核对过，避免和论文叙述打架。

检测、跟踪、分类三个定时器都用同一个 **`dt_`**：**`trackingCB`** 做 `boxAssociation` + `kalmanFilterAndUpdateHist`；**`classificationCB`** 从历史 `pcHist_` / `boxHist_` 里投票得到 **`dynamicBBoxes_`**。外推、`is_estimated`、`boxOOR` 等分支都在关联和 Kalman 里展开，比一张图细，但数据流就是：**同步回调只缓存深度与位姿 → 检测定时器产框 → 跟踪定时器滤波 → 分类定时器输出动态集合**。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    DP[depthPoseCB 或 depthOdomCB]
    AD[alignedDepth color yolo 异步缓存]

    subgraph detT [detectionCB]
        D1[dbscanDetect]
        D2[uvDetect]
        D3[yoloDetectionTo3D]
        D4[filterBBoxes]
        D1 --> D2 --> D3 --> D4
    end

    subgraph trkT [trackingCB]
        BA[boxAssociation]
        KF[kalmanFilterAndUpdateHist]
        BA --> KF
    end

    subgraph clsT [classificationCB]
        ID[见下文逐分支流程图]
    end

    DP --> detT
    AD --> D3
    detT --> trkT
    trkT --> clsT
</div>

### `filterBBoxes`：几何融合与 YOLO 打标

读这一段是为了接上后面的 **`is_human`**。流程是：对每个 UV 框找 DBSCAN 框的 **IoU 最佳互匹配**（双边都要互为最佳匹配且 IoU 大于 **`boxIOUThresh_`**），用 ** xmax/xmin 取并的外包** 做保守融合，点云簇沿用 DB 一侧。注释写得很直白：**YOLO 不参与几何 ensemble**，只负责动态语义——把融合框投到彩色相机平面得到 2D 矩形，再与当前 **`yoloDetectionResults_`** 逐框算 IoU，**大于 0.5** 就把对应融合框打上 **`is_dynamic` + `is_human`**（仿真若不跑 YOLO，CASE I 永远不会触发）。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph LR
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    UV[uvBBoxes_] --> M{双边最佳 IoU}
    DB[dbBBoxes_ 与 pcClusters_] --> M
    M --> FU[保守融合 filteredBBoxes]
    FU --> P2[投影到彩色图像平面]
    YO[yoloDetectionResults_] --> IO{IoU 大于 0.5}
    P2 --> IO
    IO --> H[匹配框设 is_human]
</div>

### `trackingCB`：关联、重捕获与外推帧 `is_estimated`

只在 **`newDetectFlag_`** 为真时跑 **`boxAssociationHelper`**（检测定时器在 **`filterBBoxes`** 末尾把它置位）。关联先生成 **`linearProp`**：把每条历史轨道头部的框按 **`Vx,Vy`** 线性往前推一步作为候选；再 **`genFeat`**（10 维权向量：位置、尺寸、点云数量与标准差等）算余弦相似度，配合 **`calBoxIOU`** 与阈值 **`simThresh_`** 得到 **`bestMatch`**。

**`getBoxOutofRange`** 标记 **`boxOOR`**：本轮没被任何当前检测匹配到的历史轨迹（且注释逻辑里非动态轨道会把 OOR 清零）。若有 OOR，再跑 **`findBestMatchEstimate`**：只允许 **`propedBoxes[j].is_estimated && boxOOR[j]`** 的轨迹参与二次匹配，阈值用的是更松的 **`simThreshRetrack_`**——也就是 **丢检但处于外推状态的框**，仍有机会被当前帧「捞回来」。

**`kalmanFilterAndUpdateHist`** 里：正常匹配上用 **加速度观测模型** 更新 Kalman，新状态 **`is_estimated=false`**。对 **`boxOOR[i]`** 且外推帧数未饱和的轨迹，不用当前 RGB-D 观测，而用速度模型一步预测 + **`getKalmanObservationVel`** 做估计，推入历史的前端 **`is_estimated=true`**——这就是论文里「视场外恒速/恒加速度外推、框变大」在代码里的落地：**分类阶段 CASE 0 只吃这种帧**。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    ND{newDetectFlag_}
    ND -->|true| LP[linearProp 历史头部位移]
    LP --> FM[findBestMatch 特征余弦加 IoU]
    FM --> OOR[getBoxOutofRange]
    OOR --> RET{存在 OOR}
    RET -->|是| FE[findBestMatchEstimate 仅 is_estimated 且 OOR]
    RET -->|否| KF[kalmanFilterAndUpdateHist]
    FE --> KF
    KF --> M1[匹配成功 Acc KF is_estimated false]
    KF --> M2[boxOOR Vel KF 外推 is_estimated true]
</div>

### `classificationCB`：CASE 0 / YOLO / 强制动态 / 点云投票

外层是对 **`pcHist_` 每条轨迹**迭代（注释提醒 YOLO 对应的点云可以是空的 dummy）。我按 **`dynamicDetector.cpp` 里出现的分支顺序**画图，和源码一致：

- **CASE 0**：队首 **`is_estimated`** → **`getEstimateBox`**：从队首沿历史找到 **第一段非外推帧** `lastDetect`，用当前外推中心与 `lastDetect` 的几何关系 **放大宽高**（含上限 **1.5 倍** 当前宽），得到 **`estimatedBBox`**。若打开 **`constrainSize_`**，还要和 **`targetObjectSize_`** 列表比三维差是否落在 **0.8 / 0.8 / 1.0** 以内才输出。
- **CASE I**：队首 **`is_human`**（来自上一节的 YOLO 匹配）→ 直接当作动态。
- **帧间距**：**`curFrameGap = min(skipFrame_, pcHist_.size()-1)`**，后面点云速度都用 **`dt_ * curFrameGap`** 归一。
- **强制动态**：若历史足够长，统计最近 **`forceDynaCheckRange_`** 帧里 **`is_dynamic`** 计数 ≥ **`forceDynaFrames_`**，直接把当前帧标动态并输出（跳过投票）。
- **默认路径**：当前帧与 **`curFrameGap`** 前点云配对，点须在 **`curFrameGap`** 时刻相机 **FOV** 内；最近邻位移得 **`Vcur`**，与框中心差分速度 **`Vbox`** 做夹角余弦，**余弦为负**的点视为无效并计入 **`numSkip`**；有效点里速率超 **`dynaVelThresh_`** 的进入 **`votes`**。最后 **`voteRatio`**、**`Vkf`** 范数、**`numSkip/numPoints`** 与 **`maxSkipRatio_`** 三重门槛都过，才把队首标 **`is_dynamic_candidate`**；若连续 **`dynamicConsistThresh_`** 帧都是 candidate，才 **`is_dynamic=true`** 并 **`push_back`**。

循环结束后若 **`constrainSize_`**：对 **非外推** 动态框再做一轮尺寸白名单过滤；**外推框**（`is_estimated`）整段保留。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    C0{boxHist 队首 is_estimated}
    C0 -->|是| GE[getEstimateBox 相对最近真实帧扩框]
    GE --> CS{constrainSize_}
    CS -->|是| SZ[与 targetObjectSize_ 容差匹配]
    CS -->|否| OUT0[push estimatedBBox]
    SZ -->|通过| OUT0
    SZ -->|否| ENDI
    C0 -->|否| CH{is_human}
    CH -->|是| OUT1[push 当前框]
    CH -->|否| GAP[curFrameGap]
    GAP --> FD{最近 forceDynaCheckRange_ 帧内 is_dynamic 计数}
    FD -->|大于等于 forceDynaFrames_| OUT2[置 is_dynamic 并 push]
    FD -->|否| PV[点对最近邻 Vcur 与 Vbox 对齐投票]
    PV --> VT{voteRatio dynaVoteThresh 且 Vkf 范数 且 skip 比例}
    VT -->|否| ENDI[i 循环下一轨迹]
    VT -->|是| CD[is_dynamic_candidate]
    CD --> CC{连续 dynamicConsistThresh_ 帧 candidate}
    CC -->|是| OUT3[is_dynamic 并 push]
    CC -->|否| ENDI
    OUT0 --> ENDI
    OUT1 --> ENDI
    OUT2 --> ENDI
    OUT3 --> ENDI
</div>

---

## `dynamic_predictor`：意图链乘与轨迹采样

`predict()`：fake 走 `detectorGT_->getDynamicObstaclesHist`，否则走 `detector_->...`。有历史才 **`intentProb`** + **`predTraj`**。

**`intentProb`**：每个障碍把 **P 初始化均匀**，沿历史从旧到新循环；用相邻三点算转角 **`theta`**，**`genTransitionMatrix`** 逐列调用 **`genTransitionVector`**（FORWARD 高斯项、LEFT/RIGHT 用 sin、STOP 用 tanh）；填第 i 列时 **`scale(i)=pscale_`**、其余分量为 1，相当于给该列对应的转移加权，再 **`transMat * P`** 更新。**`utils.h` 枚举顺序是 FORWARD, LEFT, RIGHT, STOP**，和 MPC 里取下标一致。

**`predTraj`**：对每个障碍、每个 intent 调 **`genPoints`**——平面速率低于 **`stopVel_`** 则只做 **`modelStop`**；否则 FORWARD→**`modelForward`**，LEFT/RIGHT→**`modelTurning`**，STOP→**`modelStop`**。前两者在参数网格上枚举，二维离散模型前滚，每步 **`map_->isInflatedOccupied`** 不通过就扔样本。**`genTraj`** 对样本按时刻求均值方差，方差经 **`zScore_`** 放大尺寸，再 **`positionCorrection`**：均值轨迹若撞上静态占据，就换成离均值最近的整条采样轨迹。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    H[getDynamicObstaclesHist]
    H --> IP[intentProb 链式 transMat 乘 P]
    H --> PT[predTraj]

    subgraph perOb [每个障碍每种意图]
        GP[genPoints]
        GP --> MF[modelForward Turning Stop]
        MF --> GT[genTraj 均值方差]
        GT --> PC[positionCorrection]
    end

    PT --> GP
</div>

---

## `trajectory_planner`：聚类、QP、`makePlanWithPred` 的真实分支

**`staticObstacleClusteringCB`**（定时器约 20 Hz）按速度朝向前方切长方体，扫 **`isInflatedOccupied`** 体素进 **`obstacleClustering`**，得到静态框喂给 **`solveTraj`**。它和 MPC **不同定时器**，读代码时别假设「solve 前一瞬间聚类才刷新」。

**`solveTraj`**：`setDynamicsMatrices`（8 状态 5 控制）、`castMPCToQP*`、`OsqpEigen`；非首帧 **`setTimeLimit(timeLimit)`** 吃上层传的毫秒上限。

**`makePlanWithPred` 的关键分支**：只有 **`obPredPos_.size()` 且 `not firstTime_`** 才进 **`getIntentComb`** 的多解循环——也就是说 **第一次真正把 MPC 跑起来时故意不走六种意图枚举**，先用测量分支（且 `firstTime_` 时静态动态障碍列表在函数开头被 **`clear`**）求一轮把 **`firstTime_`** 置假；之后才在 **wall clock 0.1 s 内**按排序尝试组合：循环里 `time < 0.1` 时对 OSQP 设 **`max(0.03 - time, 0.02)`** 这类时限，超时 `break`。**`findClosestObstacle`** 首帧比距离，非首帧沿当前解前几步加权方向和距离。**`getIntentComb`**：最近障碍六种主轴模式（STOP / LEFT / RIGHT / FORWARD / max(L,F) / max(R,F)），按意图概率排序；**其余障碍一律 argmax 意图的一条预测**拼进同一列表。每条成功解 **`getTrajectoryScore`**（一致对上一解、绕路对 xref、安全对动静障碍加权距离），**`evaluateTraj`** 三项与批次均值比值后再乘 **`weight(intentType[i])`** 取最大。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    subgraph cluster [聚类定时器]
        LC[前方局部 occupied 体素]
        LC --> OC[obstacleClustering]
    end

    subgraph mpc [makePlanWithPred]
        XR[getXRef]
        BR{obPred 非空且非 firstTime}
        BR -->|否| ST[solveTraj 一轮]
        BR -->|是| FO[findClosestObstacle]
        FO --> IC[getIntentComb 主障碍 6 模式 其余 argmax]
        IC --> LP[wall time 小于 0.1s 循环]
        LP --> SQ[solveTraj OSQP 限时]
        SQ --> SC[getTrajectoryScore]
        SC --> EV[evaluateTraj]
        ST --> DONE[currentStatesSol_]
        EV --> DONE
    end

    OC --> mpc
</div>

---

## `tracking_controller`

订阅 `Target`、里程计和 IMU，定时做串级 PID；参数默认 **`acceleration_control`** 常为 true，走加速度相关分支再下到 MAVROS。导航侧 **`trajExeCB`** 按 MPC 的 `ts` 与 horizon 插值 pos/vel/acc 填入 `Target` 即可对接。

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph LR
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;

    TG[Target] --> PID[PID 与加速度分支]
    OD[odom IMU] --> PID
    PID --> MV[mavros_msgs]
</div>


