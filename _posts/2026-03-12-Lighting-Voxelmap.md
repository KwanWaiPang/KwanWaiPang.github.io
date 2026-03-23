---
layout: post
title: "实验笔记之——基于lighting-lm移植Voxelmap"
date:   2026-03-12
tags: [LiDAR]
comments: true
author: kwanwaipang
toc: true
excerpt: "" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->


# 引言
之前博客[《实验笔记之——《Lightning-Speed Lidar Localization and Mapping》》](https://kwanwaipang.github.io/lightning-lm/)介绍了如何配置lighting-lm，本博客记录将 ImMesh VoxelMap 概率体素建图融入 Lightning SLAM 的完整过程，并进一步参考 FAST-LIVO2 的纯 LIO 主线进行精度对齐和优化。

**核心改进总结**：通过引入基于雷达物理噪声建模的概率体素地图，实现了从传感器端到后端状态估计的完整不确定性传播链路，利用自适应观测权重极大地提升了系统在稀疏、动态及噪声环境下的定位鲁棒性与建图精度。



## 背景与动机

* [VoxelMap论文](https://arxiv.org/pdf/2109.07082)
* [VoxelMap代码](https://github.com/hku-mars/VoxelMap)
* [Immesh代码/VoxelMap+IMU](https://github.com/hku-mars/ImMesh)
* [FAST-LIVO2代码](https://github.com/hku-mars/FAST-LIVO2)

深入阅读VoxelMap论文，可以发现 VoxelMap 的引入绝非仅仅是换了一个"更高级"的数据结构，它的核心价值体现在以下三个层面：
1. 从"点云"到"结构化特征"的跨越
传统的 LIO（如原版 Faster-LIO 或 iVox）将地图视为一堆离散的点。而 VoxelMap 认为环境是由**平面（Planes）**组成的。
   * 带来的改进：它将原本无序的点云转化为更具物理意义的几何特征。在配准时，它不是在找"最近的几个点"，而是在找"最匹配的概率平面"。
2. 精确的概率建模与不确定性量化
论文的核心贡献之一是为雷达点（Point）和体素面（Voxel-plane）都建立了严谨的不确定性模型：
   * 传感器噪声模型：显式考虑了雷达在不同距离和入射角下的测量误差（距离方差 + 角度方差）。
   * 平面不确定性传播：通过特征分解的雅可比矩阵，将每个点的测量噪声累积为平面的 6×6 协方差。
   * 意义：这使得系统能够量化"地图里这个面到底准不准"以及"这次雷达打到的点到底靠不靠谱"。
3. 概率加权配准（MAP 估计）
这是提升性能的直观逻辑。在 IEKF 更新时，VoxelMap 放弃了"所有点权重平等"的做法：
   * 自适应权重：如果一个点打在了一个很平整、确定性很高的墙面上，它会被赋予极大的权重；如果一个点打在远处、入射角极大、或是一个非常"毛刺"的体素里，它的权重会被自动降低。
   * 结果：这种"区分对待"的策略极大地提高了系统对环境噪声（如植被、动态物体或远距离稀疏点）的免疫力。

VoxelMap 的引入让 SLAM 系统拥有了 **"分辨观测质量"** 的能力。它不再盲目地相信每一个雷达回波，而是通过一套完美的数学框架，让更可靠的几何结构在位姿计算中占主导地位，从而实现了更高精度的端到端定位。

### 当前 Lightning 的架构不足

Lightning 的 LIO 管线（`laser_mapping.cc`）存在以下局限：

1. **地图表示 — iVox3D**：扁平哈希体素，每个体素仅存储**原始点**。不维护任何几何信息。
2. **平面拟合 — 每次迭代重新计算**：在 `ObsModel()` 的 IEKF 每轮迭代中，对每个扫描点执行 KNN 搜索（5个近邻）→ PCA 拟合（`math::esti_plane()`）→ 计算残差。这意味着**平面信息不被持久化**，每轮都要从头计算。
3. **观测噪声 — 统一标量**：ESKF 的 `Update()` 函数使用 `R_ = R * I`，**所有匹配点使用同一个噪声权重**。这忽略了：
   - 不同距离/角度的点具有不同的测量精度
   - 地图中不同平面的确定性不同
   - 远距离或入射角大的点应该被降权

### ImMesh VoxelMap 的精髓 — 端到端概率建模

ImMesh 的核心不仅仅是地图数据结构的改进，而是一条**完整的不确定性传播链路**，从雷达物理噪声模型到最终的 IEKF 更新，贯穿定位与建图全流程：

<div class="mermaid" style="display: flex; justify-content: center; width: 90%; margin: 0 auto;">
graph TD
    %% 定义全局样式类
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;
    
    A["① 雷达噪声模型<br/>calcBodyVar()"] --> B["② 协方差传播到世界系<br/>融合状态不确定性"]
    B --> C["③ 平面不确定性累积<br/>init_plane() → plane_var (6×6)"]
    C --> D["④ 概率匹配检验<br/>build_single_residual()<br/>σ_l = J * plane_var * J^T"]
    D --> E["⑤ 自适应观测权重<br/>R_inv(i) = 1/(σ_l + n^T·var·n)"]
    E --> F["⑥ IEKF 更新<br/>每个点独立加权"]
    F --> G["⑦ 建图时带协方差更新<br/>map_incremental_grow()"]
    G --> C
</div>

#### 噪声传播 5 个关键环节详解

**① `calcBodyVar()`** — 雷达物理噪声模型（body 系）
```
var_body = d·d^T·σ_range² + A·direction_var·A^T
```
其中 `d` 是测量方向向量，`σ_range` = `dept_err`（距离误差），`direction_var` 基于 `beam_err`（角度误差）。远距离/大角度的点自然获得更大的协方差。

**② 协方差传播到世界系** — 融合状态不确定性
```
var_world = R·var_body·R^T + (-p×)·cov_rot·(-p×)^T + cov_t
```
不仅旋转了测量协方差，还叠加了：
- 旋转状态不确定性 `cov_rot`（通过叉积矩阵 `p×` 传播）
- 平移状态不确定性 `cov_t`

**③ `init_plane()` — 平面不确定性累积**
通过特征分解的雅可比 `J`（6×3 矩阵），将每个点的测量协方差传播并累积为平面的 6×6 不确定性矩阵 `plane_var`：
```
plane_var = Σ J_i · point_var_i · J_i^T
```
其中前 3 行对应法向量不确定性，后 3 行对应中心点不确定性。

**④ `build_single_residual()` — 概率匹配检验**
联合计算点-平面匹配的总不确定性：
```
σ_l = J_nq · plane_var · J_nq^T + n^T · point_var · n
```
其中 `J_nq = [(p_w - center)^T, -n^T]`。只有当 `dis_to_plane < σ_num · √σ_l` 时才接受匹配。

**⑤ IEKF 中的自适应 R 矩阵**
每个匹配点的观测噪声**独立计算**：
```
R_inv(i) = 1 / (σ_l + n^T · var · n)
```
**对比 Lightning 的 `R_ = R * I`（统一标量）**，这意味着：
- 高确定性平面 + 近距离点 → 大权重（高信任度）
- 低确定性平面或远距离点 → 小权重（低信任度）

> [!IMPORTANT]
> **这才是 VoxelMap 能提升定位精度的核心原因**：不是因为数据结构更好（虽然确实如此），而是因为整条噪声传播链路让 IEKF 能对每个观测**区分对待**，自动降低不可靠匹配的影响。


## 具体修改方案

### 新增 VoxelMap 核心模块

#### voxel_map.h

核心数据结构（移植自 ImMesh 的 `voxel_loc.hpp` 和 `voxel_mapping.hpp`）：

| 结构体 | 用途 | 来源 |
|--------|------|------|
| `Plane` | 存储平面参数：中心、法向、协方差、6×6 不确定性 `plane_var` | `voxel_loc.hpp` |
| `PointWithVar` | 带协方差的点：body 系坐标、世界系坐标、3×3 测量协方差 | `voxel_mapping.hpp` |
| `PtplResult` | 点-平面匹配结果：点、法向、中心、`plane_var`、匹配层级 | `voxel_mapping.hpp` |
| `VOXEL_LOC` | 体素索引键：3D 整数坐标 + hash 特化 | `voxel_loc.hpp` |
| `OctoTree` | 自适应八叉树节点：维护 `Plane`，支持多层细分和增量更新 | `voxel_loc.hpp/cpp` |
| `VoxelMap` | 顶层封装：`unordered_map<VOXEL_LOC, OctoTree*>` | 新增封装 |

主要接口：
```cpp
class VoxelMap {
public:
    // 配置参数
    struct Options {
        double voxel_size = 1.0;         // 顶层体素尺寸（米）
        int max_layer = 2;               // 八叉树最大深度
        std::vector<int> layer_init_num; // 每层初始化所需最少点数
        int max_points_size = 100;       // 每个体素最大存储点数
        double planer_threshold = 0.01;  // 平面性判定阈值（最小特征值）
        double sigma_num = 3.0;          // 匹配时的 sigma 检验倍数
        double beam_err = 0.02;          // 雷达角度误差（弧度）
        double dept_err = 0.05;          // 雷达距离误差（米）
    };

    /// 初始化时用第一帧数据建图
    void Build(const std::vector<PointWithVar>& points);
    /// IEKF 收敛后增量更新地图
    void Update(const std::vector<PointWithVar>& points);
    /// 并行计算点-平面残差列表（OMP 加速）
    void BuildResidualList(const std::vector<PointWithVar>& pv_list,
                           std::vector<PtplResult>& ptpl_list);
    /// 局部地图滑窗
    void MaybeSlideMap(const Eigen::Vector3d& position_world);
};
```

全局辅助函数：
```cpp
/// 基于雷达物理参数计算点在 body 系的测量协方差
void CalcBodyVar(Eigen::Vector3d& pb, double range_inc,
                 double degree_inc, Eigen::Matrix3d& var);
```

#### voxel_map.cc

实现代码，核心逻辑移植自 ImMesh，适配 Lightning 的命名空间和代码风格：

| 函数 | 功能 | 移植来源 |
|------|------|---------|
| `CalcBodyVar()` | 雷达噪声模型：距离误差 + 角度误差 → 3×3 协方差 | `voxel_mapping.cpp:1221` |
| `OctoTree::init_plane()` | PCA 平面拟合 + 不确定性传播 → `plane_var` | `voxel_loc.cpp:47` |
| `OctoTree::init_octo_tree()` / `cut_octo_tree()` | 八叉树初始化与空间细分 | `voxel_loc.cpp:141-217` |
| `OctoTree::UpdateOctoTree()` | 增量更新：新点加入 → 重新拟合平面或继续细分 | `voxel_loc.cpp:219-308` |
| `build_single_residual()` | 递归概率匹配：σ 检验 + 多层搜索 | `voxel_mapping.cpp:247-318` |
| `VoxelMap::Build()` | 首帧建图（`buildVoxelMap`） | `voxel_mapping.cpp:110-151` |
| `VoxelMap::Update()` | 增量更新（`updateVoxelMap`） | `voxel_mapping.cpp:320-354` |
| `VoxelMap::BuildResidualList()` | OMP 并行匹配 + 邻近体素回退（`BuildResidualListOMP`） | `voxel_mapping.cpp:153-245` |
| `VoxelMap::MaybeSlideMap()` | 局部地图滑窗：超出阈值后清除远处体素 | FAST-LIVO2 风格 |
| `GenerateRvizMarkerArray()`| 将体素平面属性转化为 RViz MarkerArray 可视化 | `voxel_mapping.cpp` |
                                                                                                    
---

### LIO pipeline集成

#### laser_mapping.h

新增成员：

```cpp
#include "core/voxel_map/voxel_map.h"

// VoxelMap 相关成员
bool use_voxel_map_ = false;                    // 是否启用 VoxelMap
std::shared_ptr<VoxelMap> voxel_map_ = nullptr;  // VoxelMap 实例
VoxelMap::Options voxel_map_options_;             // VoxelMap 配置

// 噪声建模相关缓存（每帧计算一次，IEKF 迭代中复用）
std::vector<Eigen::Matrix3d> body_cov_list_;     // body 系测量协方差列表
```

#### laser_mapping.cc

**核心修改 4 处：**

**❶ `LoadParamsFromYAML()` — 加载 VoxelMap 参数**

从 YAML 读取 VoxelMap 配置参数块：`voxel_size`, `max_layer`, `layer_init_num`, `max_points_size`, `planer_threshold`, `sigma_num`, `beam_err`, `dept_err`。同时读取 `local_map` 块用于地图滑窗配置，以及 `time_offset` 块用于传感器时间同步。

**❷ `Init()` — 条件初始化**

```cpp
if (use_voxel_map_) {
    voxel_map_ = std::make_shared<VoxelMap>(voxel_map_options_);
    // 注：VoxelMap 不需要预先分配空间，首帧时自动建图
} else {
    // 原有 iVox 初始化路径不变
    ivox_ = std::make_shared<IVoxType>(ivox_options_);
}

// ESKF 初始化：VoxelMap 模式下使用 FAST-LIVO2 风格的收敛策略
ESKF::Options eskf_options;
eskf_options.lidar_converged_times_required_ = use_voxel_map_ ? 2 : 1;
eskf_options.use_pose_converge_for_lidar_ = use_voxel_map_;
eskf_options.use_aa_ = use_aa_ && !use_voxel_map_;  // VoxelMap 模式下禁用 AA
```

**❸ `ObsModel()` — 观测模型（核心重构点）**

VoxelMap 路径的关键变化：

```cpp
if (use_voxel_map_) {
    // 1. 预计算每个点的 body 系协方差（仅首次迭代）
    // body_cov_list_ 在 Run() 的 IEKF 求解前一次性计算好

    // 2. 将点变换到世界系，传播协方差
    //    var_world = R*extR * var_body * (R*extR)^T
    //             + (-p×)*cov_rot*(-p×)^T + cov_t

    // 3. 调用 VoxelMap 的概率匹配
    voxel_map_->BuildResidualList(pv_list, ptpl_list);

    // 4. 构建 H 矩阵和残差向量
    //    关键：R_ 不再是 R*I，而是对角矩阵
    //    R_inv(i) = 1/(r_base + σ_l + n^T·var·n)
    //    其中 r_base 是 FAST-LIVO2 风格的观测噪声基线
}
```

> [!IMPORTANT]
> **这里需要修改 ESKF 的 `Update()` 函数调用方式**：当前 Lightning 的 ESKF::Update 接受一个标量 `R`（`const double& R`），但 VoxelMap 需要**逐点独立的 R**。解决方案是在 `ObsModel()` 中直接设置 `custom_obs_model_.R_` 为对角矩阵（已在 CustomObservationModel 中定义为 `Eigen::MatrixXd R_`），在 VoxelMap 模式下跳过 eskf.cc 中的 `R_ = R * I` 赋值。

**❹ `MapIncremental()` / `Run()` 中的首帧处理 — 地图更新**

```cpp
if (use_voxel_map_) {
    // 与 ImMesh 的 map_incremental_grow() 逻辑一致：
    // 1. 将降采样点变换到世界系
    // 2. 计算每个点的世界系协方差（融合状态不确定性）
    // 3. 调用 voxel_map_->Update(pv_list) 增量更新
    // 4. 调用 voxel_map_->MaybeSlideMap() 执行局部地图滑窗
}
```

---

### ESKF 适配

#### eskf.hpp

新增 FAST-LIVO2 风格的 ESKF 选项：

```cpp
struct Options {
    int lidar_converged_times_required_ = 1;    // 需要连续收敛的次数
    bool use_pose_converge_for_lidar_ = false;  // 是否使用 pose-only 收敛判据
    double lidar_rot_converge_deg_ = 0.01;      // 旋转收敛阈值 (deg)
    double lidar_pos_converge_m_ = 0.00015;     // 平移收敛阈值 (m)
};
```

#### eskf.cc

两处关键修改：

1. **收敛判据**：在 VoxelMap 模式下，使用 pose-only 收敛检查（仅检查旋转和平移增量），并要求连续收敛 2 次才停止迭代，与 FAST-LIVO2 保持一致。

2. **R 矩阵**：当 `custom_obs_model_.R_` 已被外部显式设置（VoxelMap 路径）时，跳过 `R_ = R * I` 的统一赋值。

---

### IMU 处理对齐

#### imu_processing.hpp

与 FAST-LIVO2 对齐的关键修改：

1. **IMU 协方差直接赋值**：将 `cov_acc_ = cov_acc_.cwiseProduct(cov_acc_scale_)` 改为 `cov_acc_ = cov_acc_scale_`（直接赋值），避免 Q 矩阵被错误缩放约 1000 倍。

2. **P 矩阵初始化**：采用原始 Lightning 的混合初始化值（pos/rot/vel 为 1.0，ba 为 0.001），让滤波器有足够的自由度快速适应。

3. **去畸变**：采用 FAST-LIVO2 的 end-frame 补偿公式：
```cpp
P_compensate = extR_end_inv * (R_i * (extR * P_i + extT) + T_ei) - extR_inv_extT;
```
并补充了 scan-end 位姿节点，确保尾段点的补偿精度。

4. **imu_time_offset**：支持从 YAML 读取 IMU 时间偏移量，在 `ProcessIMU()` 中对每条 IMU 消息应用时间补偿。

---

### 配置文件

#### r3live_hku_datatset.yaml

新增 `voxel`、`local_map`、`time_offset`、`trajectory` 配置块：

```yaml
time_offset:
  imu_time_offset: 0.0

voxel:
  voxel_map_en: true         # 启用 VoxelMap
  voxel_size: 0.5            # 顶层体素尺寸
  max_layer: 2               # 八叉树深度
  min_eigen_value: 0.01      # 平面性指标
  match_s: 0.9               # 匹配权重系数
  sigma_num: 3.0             # 概率匹配 sigma 倍数
  max_points_size: 50        # 体素点数上限
  layer_init_size: [5, 5, 5, 5, 5]
  beam_err: 0.05             # 雷达角度误差
  dept_err: 0.02             # 雷达距离误差
  r_base: 0.001              # FAST-LIVO2 风格观测噪声基线

local_map:
  map_sliding_en: false
  half_map_size: 100
  sliding_thresh: 8.0

trajectory:
  save_trajectory_enable: false
  trajectory_save_path: "./trajectory_tum.txt"
```

#### nclt.yaml

针对 NCLT 数据集新建配置文件，基于 `r3live_hku_datatset.yaml` 的完整结构，替换为 NCLT 的传感器参数：
- `lidar_type: 2`（Velodyne HDL-32E）
- `scan_line: 32`，`blind: 0.5`
- `extrinsic_T: [0, 0, 0.28]`（NCLT 的 IMU-LiDAR 外参）

---

### TUM 轨迹保存（用于 evo 评估）

#### slam.h / slam.cc

在 `SlamSystem` 中集成 TUM 格式轨迹保存，与 ROS topic 发布在同一位置（`pub_pose_` 之后），确保"发布什么就保存什么"：

```cpp
// slam.h 新增成员
bool save_trajectory_enable_ = false;
std::string trajectory_save_path_ = "./trajectory_tum.txt";
std::ofstream trajectory_file_;
```

实现要点：
- **Init()**：从 YAML 读取 `trajectory` 配置块，支持 `~` 路径展开和自动创建父目录
- **ProcessLidar()**：在 `pub_pose_.publish()` 后写入 TUM 格式（`timestamp tx ty tz qx qy qz qw`），使用传感器时间戳 `state.timestamp_` 而非 `ros::Time::now()`，确保与 ground truth 时间对齐
- **~SlamSystem()**：析构时 flush 并关闭文件

---

### 构建系统

#### CMakeLists.txt

新增源文件：
```cmake
core/voxel_map/voxel_map.cc
```

添加 OpenMP 依赖：
```cmake
find_package(OpenMP REQUIRED)
target_link_libraries(${PROJECT_NAME} OpenMP::OpenMP_CXX)
```

---

## 移植过程中的关键问题与解决

### 问题一：IMU 协方差设置导致发散

**现象**：移植初期，系统在运行数分钟后出现轨迹发散。

**根因**：`cov_acc_` 和 `cov_gyr_` 的赋值方式错误——原代码使用 `cwiseProduct`（逐元素乘积）而非直接赋值，导致 Q 矩阵比预期小约 1000 倍。同时，P 矩阵初始化（pos/rot/vel）过于保守（1e-7），使滤波器过于自信，无法快速修正。

**解决**：
- 将协方差赋值改为直接赋值：`cov_acc_ = cov_acc_scale_`
- 恢复 P 矩阵初始化为原始 Lightning 的混合值（1.0 for pos/rot/vel）

### 问题二：激进参数修改后性能恶化

**现象**：第一轮修改后（统一 P=1e-7、5 倍 acc_cov、3 倍 gyr_cov），系统从"10 分钟后发散"变成"一开始就飘"。

**教训**：P 矩阵过小使滤波器overconfident，过大的 process noise 导致 over-correction。修改应该逐项进行，每次只动一个变量。

**解决**：回退所有参数至原始值，仅保留 `extrinsic_est_en: false` 和 IMU 协方差的直接赋值修正。

### 问题三：`map_sliding_en` 负面效果

**现象**：在 HKU 数据集上启用地图滑窗后，端到端误差从 2.73cm 恶化到 1.4m。

**分析**：HKU campus 数据集是一个回环场景，禁用滑窗可以让历史地图帮助后续的匹配。滑窗在长距离、非回环场景中更有价值。

**解决**：默认关闭 `map_sliding_en`，与 FAST-LIVO2 的 avia.yaml 默认配置一致。

### 问题四：NCLT 的 intensity 警告

**现象**：运行 NCLT 数据集时大量黄色警告 `Failed to find match for field 'intensity'`。

**分析**：NCLT 的 Velodyne 点云只有 5 个字段（x, y, z, time, ring），没有 intensity 字段。PCL 在 `fromROSMsg` 时找不到对应字段。

**结论**：此警告不影响 LIO 精度（intensity 不参与位姿估计），可安全忽略。

---

## 与 FAST-LIVO2 LIO 主线的对齐

在完成基础 VoxelMap 移植后，进一步参考 FAST-LIVO2（纯 LIO 部分）进行对齐优化：

| 对齐项 | 当前状态 | FAST-LIVO2 参考值 | 说明 |
|--------|----------|-------------------|------|
| 收敛判据 | Pose-only + 2 次 | 一致 | 仅检查旋转/平移增量 |
| 去畸变 | End-frame 补偿 | 一致 | 含 scan-end 位姿节点 |
| R 基线 | `r_base = 0.001` | 一致 | 固定观测噪声下限 |
| IMU 初始化 | 30 帧 + bg=0 | 一致 | 零偏从零开始估计 |
| max_iteration | 5 | 一致 | — |
| acc_cov / gyr_cov | 0.5 / 0.3 | 0.5 / 0.3 | — |
| b_acc_cov / b_gyr_cov | 0.0001 | 0.0001 | 建议对齐 |
| point_filter_num | 10 | 1 | 可进一步加密 |
| filter_size_scan | 0.5 | 0.1 | 可进一步降低 |
| min_eigen_value | 0.01 | 0.0025 | 可进一步降低 |

---

## 精度评估方法

### evo 工具链集成

系统支持将位姿估计结果保存为 TUM 格式（`timestamp tx ty tz qx qy qz qw`），通过 YAML 参数 `save_trajectory_enable` 控制。使用 [evo](https://github.com/MichaelGrupp/evo) 工具进行评估：

```bash
# 绝对轨迹误差
evo_ape tum groundtruth.txt trajectory_tum.txt -va --plot

# 相对轨迹误差
evo_rpe tum groundtruth.txt trajectory_tum.txt -va --plot
```

评估脚本见 `evo_evaluation.ipynb`，支持：
- 自动加载 TUM 轨迹和 NCLT Ground Truth（CSV 格式欧拉角自动转四元数）
- ATE/MPE/MRE 指标计算
- XY 平面轨迹对比、XYZ 分量时序对比、RPY 角度时序对比

### HKU 数据集端到端误差

在 HKU Campus Seq00 数据集上（回环场景）：

| 指标 | 数值 |
|------|------|
| 端到端平移误差 | ~2.7 cm |
| 端到端旋转误差 | ~2.3 deg |

---

## 总结

本次移植的核心工作包括：

1. **VoxelMap 概率体素地图移植**：从 ImMesh 移植完整的八叉树体素地图，实现端到端不确定性传播
2. **ESKF 适配**：支持逐点独立的观测噪声矩阵和 FAST-LIVO2 风格的 pose-only 收敛判据
3. **IMU 处理对齐**：修正协方差赋值、P 矩阵初始化、end-frame 去畸变
4. **多数据集支持**：新建 NCLT 配置文件，适配 Velodyne 32 线雷达
5. **评估工具链**：TUM 轨迹保存 + evo 评估 notebook

通过一系列迭代调试和参考 FAST-LIVO2 的 LIO 实现，系统在 HKU 数据集上达到了厘米级端到端精度。
