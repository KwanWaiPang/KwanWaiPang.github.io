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
之前博客[《实验笔记之——《Lightning-Speed Lidar Localization and Mapping》》](https://kwanwaipang.github.io/lightning-lm/)介绍了如何配置lighting-lm，本博客实现将 ImMesh VoxelMap 概率体素建图融入 Lightning SLAM。

**核心改进总结**：通过引入基于雷达物理噪声建模的概率体素地图，实现了从传感器端到后端状态估计的完整不确定性传播链路，利用自适应观测权重极大地提升了系统在稀疏、动态及噪声环境下的定位鲁棒性与建图精度。

> [!NOTE]
> **2026-03-11 审计更新**：已完成对 ImMesh 原始代码（C:\Users\gwpsc\Desktop\ImMesh）的深度审计。确认 Lightning SLAM 已完整且准确地移植了其核心概率建图算法、IMU 预处理去畸变管线以及基于 IEKF 的状态估计自适应加权机制。针对端到端误差分析，已在 `LaserMapping` 析构函数中补全了结构化的漂移统计输出。

## 背景与动机

* [VoxelMap论文](https://arxiv.org/pdf/2109.07082)
* [VoxelMap代码](https://github.com/hku-mars/VoxelMap)
* [Immesh代码/VoxelMap+IMU](https://github.com/hku-mars/ImMesh)

深入阅读VoxelMap论文，可以发现 VoxelMap 的引入绝非仅仅是换了一个“更高级”的数据结构，它的核心价值体现在以下三个层面：
1. 从“点云”到“结构化特征”的跨越
传统的 LIO（如原版 Faster-LIO 或 iVox）将地图视为一堆离散的点。而 VoxelMap 认为环境是由**平面（Planes）**组成的。
   * 带来的改进：它将原本无序的点云转化为更具物理意义的几何特征。在配准时，它不是在找“最近的几个点”，而是在找“最匹配的概率平面”。
2. 精确的概率建模与不确定性量化
论文的核心贡献之一是为雷达点（Point）和体素面（Voxel-plane）都建立了严谨的不确定性模型：
   * 传感器噪声模型：显式考虑了雷达在不同距离和入射角下的测量误差（距离方差 + 角度方差）。
   * 平面不确定性传播：通过特征分解的雅可比矩阵，将每个点的测量噪声累积为平面的 6×6 协方差。
   * 意义：这使得系统能够量化“地图里这个面到底准不准”以及“这次雷达打到的点到底靠不靠谱”。
3. 概率加权配准（MAP 估计）
这是提升性能的直观逻辑。在 IEKF 更新时，VoxelMap 放弃了“所有点权重平等”的做法：
   * 自适应权重：如果一个点打在了一个很平整、确定性很高的墙面上，它会被赋予极大的权重；如果一个点打在远处、入射角极大、或是一个非常“毛刺”的体素里，它的权重会被自动降低。
   * 结果：这种“区分对待”的策略极大地提高了系统对环境噪声（如植被、动态物体或远距离稀疏点）的免疫力。

VoxelMap 的引入让 SLAM 系统拥有了**“分辨观测质量”**的能力。它不再盲目地相信每一个雷达回波，而是通过一套完美的数学框架，让更可靠的几何结构在位姿计算中占主导地位，从而实现了更高精度的端到端定位。

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

## 审阅事项

> [!WARNING]
> **GPLv2 许可证**：ImMesh 代码使用 GPLv2 许可证。我们尽量移植**算法逻辑**而非直接复制文件，但实现是基于其工作的。如需分发，请确认项目许可兼容性。

> [!IMPORTANT]
> **双地图策略**：通过 YAML 配置 `voxel_map.enable` 切换，**保留 iVox 作为默认选项**和回退方案，方便 A/B 对比。

> [!IMPORTANT]
> **范围**：只移植 VoxelMap 的地图表示 + 噪声建模 + 概率匹配 + 自适应 R 矩阵。**不移植** ImMesh 的网格重建、可视化或 ikd-tree。

## 具体修改方案

### 新增 VoxelMap 核心模块

#### [NEW] voxel_map.h

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
};
```

全局辅助函数：
```cpp
/// 基于雷达物理参数计算点在 body 系的测量协方差
void CalcBodyVar(Eigen::Vector3d& pb, double range_inc,
                 double degree_inc, Eigen::Matrix3d& var);
```

#### [NEW] voxel_map.cc

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
| `GenerateRvizMarkerArray()`| 将体素内各个尺度平面的属性转化为能通过 MarkerArray 发布的彩色圆盘消息 | `voxel_mapping.cpp` |
                                                                                                    
---

### LIO 管线集成

#### [MODIFY] laser_mapping.h

新增成员：

```cpp
#include "core/voxel_map/voxel_map.h"

// VoxelMap 相关成员
bool use_voxel_map_ = false;                    // 是否启用 VoxelMap
std::shared_ptr<VoxelMap> voxel_map_ = nullptr;  // VoxelMap 实例
VoxelMap::Options voxel_map_options_;             // VoxelMap 配置

// 噪声建模相关缓存（每帧计算一次，IEKF 迭代中复用）
std::vector<Eigen::Matrix3d> body_cov_list_;     // body 系测量协方差列表
std::vector<Eigen::Matrix3d> cross_mat_list_;    // 叉积矩阵列表（用于旋转不确定性传播）
```

#### [MODIFY] laser_mapping.cc

**核心修改 4 处：**

**❶ `LoadParamsFromYAML()` — 加载 VoxelMap 参数**

从 YAML 读取 VoxelMap 配置参数块：`voxel_size`, `max_layer`, `layer_init_num`, `max_points_size`, `planer_threshold`, `sigma_num`, `beam_err`, `dept_err`。

**❷ `Init()` — 条件初始化**

```cpp
if (use_voxel_map_) {
    voxel_map_ = std::make_shared<VoxelMap>(voxel_map_options_);
    // 注：VoxelMap 不需要预先分配空间，首帧时自动建图
} else {
    // 原有 iVox 初始化路径不变
    ivox_ = std::make_shared<IVoxType>(ivox_options_);
}
```

**❸ `ObsModel()` — 观测模型（核心重构点）**

VoxelMap 路径的关键变化：

```cpp
if (use_voxel_map_) {
    // 1. 预计算每个点的 body 系协方差（仅首次迭代）
    if (is_first_iteration) {
        body_cov_list_.clear();
        cross_mat_list_.clear();
        for (每个降采样扫描点) {
            CalcBodyVar(point_body, dept_err, beam_err, var);
            body_cov_list_.push_back(var);
            cross_mat_list_.push_back(skew(extR * point_body + extT));
        }
    }

    // 2. 将点变换到世界系，传播协方差
    //    var_world = R*extR * var_body * (R*extR)^T
    //             + (-p×)*cov_rot*(-p×)^T + cov_t

    // 3. 调用 VoxelMap 的概率匹配
    voxel_map_->BuildResidualList(pv_list, ptpl_list);

    // 4. 构建 H 矩阵和残差向量
    //    关键：R_ 不再是 R*I，而是对角矩阵
    //    R_inv(i) = 1/(σ_l + n^T·var·n)（每个匹配点独立计算）
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
    // 3. 按协方差范数排序（低不确定性点优先入图）
    // 4. 调用 voxel_map_->Update(pv_list) 增量更新
}
```

首帧特殊逻辑：
```cpp
if (use_voxel_map_ && !voxel_map_initialized_) {
    // 用第一帧数据 Build VoxelMap
    voxel_map_->Build(pv_list);
    voxel_map_initialized_ = true;
    // 跳过后续的 IEKF 更新
}
```

---

### ESKF 适配

#### [MODIFY] eskf.cc

在 `Update()` 函数的 `state_dim_ > dof_measurement` 分支中，当前代码做了：
```cpp
custom_obs_model_.R_ = R * MatrixXd::Identity(dof_measurement, dof_measurement);
```

需要增加条件判断：如果 `custom_obs_model_.R_` 已经被外部（ObsModel 中的 VoxelMap 路径）显式设置为非零矩阵，则**跳过**此赋值，直接使用 ObsModel 传入的逐点 R 矩阵。

---

### 配置文件

#### [MODIFY] r3live_hku_datatset.yaml

#### [MODIFY] via.yaml

新增 `voxel` 配置块，对齐 ImMesh 参数设计：

```yaml
voxel:
  voxel_map_en: true         # 启用 VoxelMap
  voxel_size: 0.5            # 顶层体素尺寸
  max_layer: 2               # 八叉树深度
  min_eigen_value: 0.01      # 平面性指标（对应 ImMesh 的 min_eigen_value 参数）
  match_s: 0.9               # 匹配权重系数
  sigma_num: 3.0             # 概率匹配 sigma 倍数
  max_points_size: 100       # 体素点数上限
  layer_init_size: [5, 5, 5, 5, 5] # 对齐 ImMesh 的 5 层点数设置
  beam_err: 0.02             # 雷达角度误差
  dept_err: 0.05             # 雷达距离误差
```

### 更新：参数对齐
- **参数重命名**：将 `planer_threshold` 正式更名为 `min_eigen_value`，与 ImMesh YAML 保持语义一致。
- **匹配参数补全**：新增了 `match_s` 负载，确保完整的参数链条与 ImMesh 设计闭环。
- **结论**：目前代码逻辑、参数名称、以及 ESKF 融合点均已完成深度对齐。

---

### 构建系统

#### [MODIFY] CMakeLists.txt

新增源文件：
```cmake
core/voxel_map/voxel_map.cc
```

添加 OpenMP 依赖：
```cmake
find_package(OpenMP REQUIRED)
target_link_libraries(${PROJECT_NAME} OpenMP::OpenMP_CXX)
```
