---
layout: post
title: "实验笔记之——SuperOdometry: Lightweight LiDAR-inertial Odometry and Mapping"
date:   2026-02-04
tags: [LiDAR, SLAM]
comments: true
author: kwanwaipang
toc: true
excerpt: "CMU 的SRO论文,雷达进行退化检测与预测，博客包含测试与代码解读" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->


<!-- # 引言 -->

* [Github源码](https://github.com/superxslam/SuperOdom)
* 本博文复现过程采用的代码及代码注释（如有）：[My github repository](https://github.com/R-C-Group/SuperOdom)



# 安装配置

## Install Sophus
```bash
git clone http://github.com/strasdat/Sophus.git
cd Sophus && git checkout 97e7161
mkdir build && cd build
cmake .. -DBUILD_TESTS=OFF
make -j8 && sudo make install
```

## Install GTSAM
```bash
git clone https://github.com/borglab/gtsam.git
cd gtsam && git checkout 4abef92
mkdir build && cd build
cmake \
  -DGTSAM_USE_SYSTEM_EIGEN=ON \
  -DGTSAM_BUILD_WITH_MARCH_NATIVE=OFF \
  ..
make -j6 && sudo make install
```

## Install Ceres
```bash
sudo apt update 
sudo apt install libgoogle-glob-dev
git clone https://github.com/ceres-solver/ceres-solver.git
cd ceres-solver
git checkout f68321e7de8929fbcdb95dd42877531e64f72f66
mkdir build
cd build
cmake ..
make -j8  # Use number of cores you have, e.g., -j8 for 8 cores
sudo make install
```

## 代码编译

创建ROS2工作空间

```bash
mkdir -p ~/SuperOdom_ws/src/
cd ~/SuperOdom_ws/src
git clone git@github.com:R-C-Group/SuperOdom.git
```

结构应该如下图所示:

```
ros2_ws/src
├── SuperOdom
├── livox_ros_driver2
└── rviz_2d_overlay_plugins
```
另外两个包 `livox_ros_driver2` 和 `rviz_2d_overlay_plugins` 下载如下:

- [Livox-ROS-driver2](https://github.com/Livox-SDK/livox_ros_driver2)
- [ROS2-jsk-plugin](https://github.com/teamspatzenhirn/rviz_2d_overlay_plugins)

```bash
git clone git@github.com:Livox-SDK/livox_ros_driver2.git
git clone git@github.com:teamspatzenhirn/rviz_2d_overlay_plugins.git
```

编译：

```bash
# 先安装SDK
cd ~
git clone https://github.com/Livox-SDK/Livox-SDK2.git
cd ./Livox-SDK2/
mkdir build
cd build
cmake .. && make -j
sudo make install


cd ~/SuperOdom_ws/src/livox_ros_driver2
./build.sh humble 
cd ~/SuperOdom_ws
colcon build

#最后要记得source一下，最好直接写到bashrc中
# source ~/SuperOdom_ws/install/local_setup.bash
echo "source ~/SuperOdom_ws/install/local_setup.bash" >> ~/.bashrc
```


## 测试SuperOdometry

* 采用demo数据集Livox-mid360, VLP-16 and OS1-128 sensor [Download Link](https://drive.google.com/drive/folders/1oA0kRFIH0_8oyD32IW1vZitfxYunzdBr?usp=sharing) 
* 运行节点：

```bash
# 此demo采用livox数据包
ros2 launch super_odometry livox_mid360.launch.py
# ros2 launch super_odometry os1_128.launch.py
# ros2 launch super_odometry vlp_16.launch.py

# 播放ROS2
# ros2 bag play $(YOUR_ROS2_DATASET)$
ros2 bag play /home/kwanwaipang/dataset/cmu-scafie

# RVIZ可视化
cd ~/SuperOdom_ws/src/SuperOdom/super_odometry
rviz2 -d ros2.rviz
```

## debug过程
* 找不到libgtsam.so.4
```bash
sudo apt install plocate
locate libgtsam.so.4
sudo ldconfig #强制刷新链接库缓存
```

* double check topic 名字`ros2 bag info $(YOUR_ROS2_bag)$`



## 实验效果

<div align="center">
  <img src="https://github.com/R-C-Group/SuperOdom/raw/main/doc/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20260203202924.png" width="100%" />
<figcaption>  
</figcaption>
</div>



# 项目概述

SuperOdom目前开源的代码仅仅是LiDAR-only and LiDAR–inertial odometry，具有两个重要的技术特点：

1. **为ICP算法提供对齐风险预测** (Provides alignment risk prediction for ICP algorithms)
2. **鲁棒检测环境退化** (Robust detection of environmental degeneracy)

---

## 技术一：ICP对齐风险预测 (Alignment Risk Prediction)

### 1.1 技术背景

传统的ICP (Iterative Closest Point) 算法虽然能够估计位姿，但无法量化估计的可靠性。在特征稀疏或退化环境中，ICP可能给出看似收敛但实际不可靠的结果。

**对齐风险预测**通过计算位姿估计的**不确定性**和**条件数**，量化ICP对齐的风险程度，为后续的传感器融合或决策提供依据。
（注意，代码中并没有进一步使用`this->LocalizationUncertainty`大概率是因为没有根图像等其他传感器融合吧）

### 1.2 核心方法：协方差分析

SuperOdom采用**协方差分析**方法来估计ICP配准的不确定性。

#### 数学原理

1. **协方差矩阵计算**：

ICP优化问题可表示为：

$$
\mathbf{x}^* = \arg\min_{\mathbf{x}} \sum_{i=1}^{N} \rho(r_i(\mathbf{x}))
$$

其中 $\mathbf{x} \in \mathbb{R}^6$ 是位姿参数（3平移+3旋转），$r_i(\mathbf{x})$ 是第 $i$ 个特征的残差，$\rho(\cdot)$ 是鲁棒核函数。

在最优解 $\mathbf{x}^*$ 处，位姿参数的协方差矩阵可通过Hessian矩阵的逆近似：

$$
\mathbf{\Sigma} \approx \mathbf{H}^{-1} = \left( \sum_{i=1}^{N} \mathbf{J}_i^T \mathbf{W}_i \mathbf{J}_i \right)^{-1}
$$

其中：
- $\mathbf{J}_i$ 是第 $i$ 个残差对位姿参数的Jacobian矩阵
- $\mathbf{W}_i$ 是权重矩阵（包含鲁棒核的影响）
- $\mathbf{\Sigma} \in \mathbb{R}^{6 \times 6}$ 是协方差矩阵

协方差矩阵可分块为：

$$
\mathbf{\Sigma} = \begin{bmatrix}
\mathbf{\Sigma}_t & \mathbf{\Sigma}_{tr} \\
\mathbf{\Sigma}_{tr}^T & \mathbf{\Sigma}_r
\end{bmatrix}
$$

其中 $\mathbf{\Sigma}_t \in \mathbb{R}^{3 \times 3}$ 是平移部分协方差，$\mathbf{\Sigma}_r \in \mathbb{R}^{3 \times 3}$ 是旋转部分协方差。

2. **特征值分解与误差估计**：

对协方差矩阵进行特征值分解（SVD）：

$$
\mathbf{\Sigma}_t = \mathbf{V}_t \mathbf{\Lambda}_t \mathbf{V}_t^T
$$

其中：
- $\mathbf{\Lambda}_t = \text{diag}(\lambda_0, \lambda_1, \lambda_2)$ 且 $\lambda_0 \leq \lambda_1 \leq \lambda_2$ （**Eigen库默认升序排列**）
- $\mathbf{V}_t = [\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2]$ 是特征向量矩阵

**最大误差估计**：

$$
\sigma_{\text{pos,max}} = \sqrt{\lambda_2}
$$

**最大误差方向**：

$$
\mathbf{d}_{\text{pos,max}} = \mathbf{v}_2
$$

3. **逆条件数 (Inverse Condition Number)**：

**条件数**定义为最大特征值与最小特征值的比值：

$$
\kappa = \frac{\lambda_{\text{max}}}{\lambda_{\text{min}}} = \frac{\lambda_2}{\lambda_0}
$$

**逆条件数**为其倒数：

$$
\kappa^{-1} = \frac{\lambda_{\text{min}}}{\lambda_{\text{max}}} = \frac{\lambda_0}{\lambda_2} = \frac{\sqrt{\lambda_0}}{\sqrt{\lambda_2}}
$$

**物理意义**：

- $\kappa^{-1} \approx 1$：所有方向的观测性接近，问题良好条件（well-conditioned），对齐可靠
- $\kappa^{-1} \approx 0$：某些方向完全不可观测，问题病态（ill-conditioned），对齐风险高

**哪个方向不可观？**

当 $\kappa^{-1} \approx 0$ 时，说明 $\lambda_0 \ll \lambda_2$，即：
- **最不可观方向**：$\mathbf{v}_0$ （最小特征值对应的特征向量）
- **最可观方向**：$\mathbf{v}_2$ （最大特征值对应的特征向量）

特征向量$\mathbf{v}_0$指向的方向是位姿估计最不确定的方向，该方向缺乏足够的几何约束。

**示例**：
- 在走廊中，侧向（Y方向）缺乏墙面，$\mathbf{v}_0$可能指向Y轴，表示侧向平移不可观
- 在长隧道中，Yaw角不可观，$\mathbf{v}_0^r$（旋转部分）可能指向Z轴旋转方向

### 1.3 核心代码实现

核心函数：`EstimateRegistrationError`

```cpp
LidarSLAM::RegistrationError LidarSLAM::EstimateRegistrationError(
    ceres::Problem &problem, const double eigen_thresh)
```

#### 实现流程

<div class="mermaid" style="height: 400px; display: flex; justify-content: center; width: 100%; margin: 0 auto;">
graph TD
    %% 定义全局样式类
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;
    A[开始] --> B[配置协方差计算选项]
    B --> C[使用DENSE_SVD算法]
    C --> D[计算6x6协方差矩阵Σ]
    D --> E[提取Σₜ 3x3平移协方差]
    D --> F[提取Σᵣ 3x3旋转协方差]
    E --> G[SVD分解: Σₜ=VₜΛₜVₜᵀ]
    F --> H[SVD分解: Σᵣ=VᵣΛᵣVᵣᵀ]
    G --> I[σₚₒₛ = √λ₂]
    G --> J[κₚₒₛ⁻¹ = √λ₀/√λ₂]
    H --> K[σₒᵣᵢ = √λ₂]
    H --> L[κₒᵣᵢ⁻¹ = √λ₀/√λ₂]
    I --> M[返回RegistrationError]
    J --> M
    K --> M
    L --> M
</div>


#### 代码详解

**特征值排序说明**：

```cpp
// Eigen库自动将特征值升序排列
Eigen::SelfAdjointEigenSolver<Eigen::Matrix3d> eigPosition(Covariance.topLeftCorner<3, 3>());

// eigenvalues()(0) = λ₀ (最小)
// eigenvalues()(1) = λ₁ (中等)  
// eigenvalues()(2) = λ₂ (最大)

// 最大位置误差（√最大特征值）
err.PositionError = std::sqrt(eigPosition.eigenvalues()(2));

// 最大误差方向（最大特征值的特征向量）
err.PositionErrorDirection = eigPosition.eigenvectors().col(2);

// 逆条件数 = √最小特征值 / √最大特征值
err.PosInverseConditionNum = std::sqrt(eigPosition.eigenvalues()(0)) / 
                             std::sqrt(eigPosition.eigenvalues()(2));
```

### 1.4 LocalizationUncertainty的使用

`LocalizationUncertainty` 在优化收敛后计算，存储为成员变量。

**主要用途**：
1. **调试和分析**：了解每帧位姿估计的可靠性
2. **未来扩展**：可用于构建位姿图的信息矩阵（协方差的逆）
3. **质量监控**：通过逆条件数判断是否发生退化

**当前实现**：主要作为调试信息存储。实际的退化检测和权重调整主要依靠下面第二种方法。

---

## 技术二：环境退化检测 (Environmental Degeneracy Detection)

### 2.1 技术背景

**环境退化**指某些运动自由度无法被当前传感器观测到的情况，常见于：

- **走廊/隧道**：两侧墙面平行，Yaw角（偏航）不可观
- **长直道路**：缺乏横向特征，侧向平移不可观
- **空旷场景**：特征稀疏，多个自由度退化

### 2.2 核心方法：特征可观测性分析

SuperOdom采用**特征可观测性分析**方法来检测环境退化。与ICP风险预测不同，这种方法是在特征匹配期间同步计算

#### 数学原理

对于一个平面特征（法向量 $\mathbf{n}$，点位置 $\mathbf{r}$）：

**平移可观测性**：

平面特征约束法向量方向的运动。对于沿坐标轴 $\mathbf{a}_i$ 的平移，可观测性为：

$$
o_{t_i} = \text{planar}^2 \cdot |\mathbf{n} \cdot \mathbf{a}_i|
$$

其中 $\text{planar} \in [0,1]$ 是平面度（从PCA特征值计算）。

**物理意义**：
- $\mathbf{n} \parallel \mathbf{a}_i$ 时，$o_{t_i} \approx \text{planar}^2 \approx 1$：该方向平移被强约束
- $\mathbf{n} \perp \mathbf{a}_i$ 时，$o_{t_i} \approx 0$：该方向平移不可观

**旋转可观测性**：

基于刚体运动学，旋转$\boldsymbol{\omega}$在点$\mathbf{r}$产生的线速度为$\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$。

平面约束法向量方向的运动，因此约束能力为：

$$
o_{r_i} = |(\mathbf{r} \times \mathbf{n}) \cdot \mathbf{a}_i|
$$

**物理意义**：
- $\mathbf{r} \times \mathbf{n}$ 是"力矩"方向
- 力矩与旋转轴的点乘表示约束强度
- 离旋转轴越远（ $|\mathbf{r}|$ 大），约束越强

### 2.3 不确定性量化

通过直方图统计各自由度的特征分布：

$$
\mathcal{H}_{t_i} = \sum_{k} \mathbb{1}[o_{t_i}^{(k)} > \text{threshold}]
$$

**不确定性计算**（以X方向为例）：

$$
u_x = 3 \cdot \frac{\mathcal{H}_{t_x}}{\mathcal{H}_{t_x} + \mathcal{H}_{t_y} + \mathcal{H}_{t_z}}
$$

然后截断到 $[0, 1]$：

$$
u_x^{\text{final}} = \min(u_x, 1.0)
$$

**为什么乘以3？**

归一化因子3的作用：
- 当所有有效特征都约束X方向时： $$\mathcal{H}_{t_{x}} = \mathcal{H}_{\text{total}}$$
  - $u_x = 3 \cdot 1 = 3$ → 截断到1.0（完全可观的）
- 当只有1/3的特征约束X时：$\mathcal{H}_{t_{x}} = \frac{1}{3}\mathcal{H}_{\text{total}}$
  - $u_x = 3 \cdot \frac{1}{3} = 1$ → 1.0（高不确定性）
- 当没有特征约束X时： $\mathcal{H}_{t_x} = 0$
  - $u_x = 0$ → 0.0（完全不可观）

> **注意**：这里的"不确定性"定义与常规含义相反！
> - $u_x = 1.0$：X方向**可观测性好**，不确定性**低**
> - $u_x = 0.0$：X方向**不可观**，不确定性**高**

推测作者可能把这个量理解为"可观测性分数"而非"不确定性"。实际应用时需注意语义。

### 2.4 核心代码实现

#### 2.4.1 特征可观测性分析

参见详细注释：`FeatureObservabilityAnalysis`

#### 2.4.2 不确定性量化

参见详细注释：`EstimateLidarUncertainty`

### 2.5 权重调整机制

当检测到退化时，系统通过**信息矩阵**调整多传感器融合权重。

参见代码：`addAbsolutePoseConstraints`

```cpp
void LidarSLAM::addAbsolutePoseConstraints(...) {
    // 根据LiDAR不确定性调整信息矩阵（协方差的逆）
    Eigen::Matrix<double, 6, 6, Eigen::RowMajor> information;
    information.setIdentity();
    
    // uncertainty_x越大（可观性越好），信息矩阵权重越高
    information(0,0) = (1 - lidarOdomUncer.uncertainty_x) * weight * Visual_confidence_factor;
    information(1,1) = (1 - lidarOdomUncer.uncertainty_y) * weight * Visual_confidence_factor;
    information(2,2) = (1 - lidarOdomUncer.uncertainty_z) * weight * Visual_confidence_factor;
    
    // 添加到优化问题
    SE3AbsolutatePoseFactor *absolutePoseFactor = 
        new SE3AbsolutatePoseFactor(position, information);
    problem.AddResidualBlock(absolutePoseFactor, nullptr, pose_parameters);
}
```

**权重调整策略**：
- 不确定性高的方向（如走廊中的Yaw）→ 降低LiDAR权重
- 增加VIO或IMU在该方向的权重
- 实现自适应的多传感器融合

---

## 平面特征提取流程

"平面特征"是指点云中具有局部平面几何结构的点。完整流程：

<div class="mermaid" style="height: 400px; display: flex; justify-content: center; width: 100%; margin: 0 auto;">
graph TD
    %% 定义全局样式类
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;
    A[原始点云] -->|featureExtraction节点| B[均匀采样提取特征点]
    B --> C[发布到topic: planner_points]
    C -->|LidarSlam订阅| D[PlanarsPoints点云]
    D --> E[for each特征点]
    E --> F[在地图中KNN搜索]
    F --> G[找到K个邻近点]
    G --> H[computePCAForFeature]
    H --> I[计算协方差矩阵]
    I --> J[特征值分解]
    J --> K{验证平面结构}
    K -->|λ₁/λ₂>0.1| L[有效平面]
    K -->|否| M[拒绝]
    L --> N[提取法向量=v₀]
    N --> O[计算点到平面距离]
    O --> P[添加到优化约束]
</div>

详细实现参见：
1. 特征点提取：`uniformFeatureExtraction`
2. PCA平面拟合：`computePCAForFeature`
3. 可观测性分析：`FeatureObservabilityAnalysis`


### 函数一：computePCAForFeature - PCA平面拟合

**函数位置**

#### 函数签名

```cpp
bool computePCAForFeature(
    const std::vector<Point> &nearest_pts,  // 输入：K近邻点集
    Eigen::Vector3d &mean,                  // 输出：质心
    Eigen::Vector3d &eigenvalues,           // 输出：特征值
    Eigen::Matrix3d &eigenvectors,          // 输出：特征向量
    OptimizationParameter &result,          // 输出：结果状态
    FeatureType feature_type                // 输入：特征类型
)
```

#### 数学原理

**1. 协方差矩阵计算**

给定K个邻近点 $\{\mathbf{p}_i\}_{i=1}^K$，首先计算质心：

$$
\bar{\mathbf{p}} = \frac{1}{K} \sum_{i=1}^{K} \mathbf{p}_i
$$

然后构建去中心化的数据矩阵 $\mathbf{X} \in \mathbb{R}^{K \times 3}$：

$$
\mathbf{X}_i = \mathbf{p}_i - \bar{\mathbf{p}}
$$

协方差矩阵为：

$$
\mathbf{C} = \frac{1}{K} \mathbf{X}^T \mathbf{X} = \frac{1}{K} \sum_{i=1}^{K} (\mathbf{p}_i - \bar{\mathbf{p}})(\mathbf{p}_i - \bar{\mathbf{p}})^T
$$

**2. 特征值分解**

对协方差矩阵进行特征值分解：

$$
\mathbf{C} = \mathbf{V} \mathbf{\Lambda} \mathbf{V}^T
$$

其中：
- $\mathbf{\Lambda} = \text{diag}(\lambda_0, \lambda_1, \lambda_2)$，且 $\lambda_0 \leq \lambda_1 \leq \lambda_2$（Eigen库升序）
- $\mathbf{V} = [\mathbf{v}_0 | \mathbf{v}_1 | \mathbf{v}_2]$ 是特征向量矩阵

**3. 几何解释**

特征值和特征向量揭示了点集的几何形状：

| 特征值分布 | 几何形状 | 典型比例 |
|-----------|---------|---------|
| $\lambda_2 \gg \lambda_1 \approx \lambda_0$ | 线性（边缘） | $\lambda_2/\lambda_1 > 10$ |
| $\lambda_2 \approx \lambda_1 \gg \lambda_0$ | 平面 | $\lambda_1/\lambda_2 > 0.1, \lambda_0 \ll \lambda_1$ |
| $\lambda_2 \approx \lambda_1 \approx \lambda_0$ | 球形（散点） | $\lambda_0/\lambda_2 > 0.3$ |

**特征向量的几何意义**：
- $\mathbf{v}_0$：**最小方差方向** = 平面法向量（平面垂直方向）
- $\mathbf{v}_1$：**中等方差方向** = 平面次主方向
- $\mathbf{v}_2$：**最大方差方向** = 平面主方向（点分布最分散的方向）

#### 代码流程分析

**第一步：数据准备**

```cpp
Eigen::MatrixXd data(nearest_pts.size(), 3);
for (size_t k = 0; k < nearest_pts.size(); k++) {
    data.row(k) << pt.x, pt.y, pt.z;
}
```

将K个点存储为 $K \times 3$ 矩阵。

**第二步：PCA计算**

```cpp
auto eig = utils::ComputePCA(data, mean);
eigenvalues = eig.eigenvalues();    // [λ₀, λ₁, λ₂] 升序
eigenvectors = eig.eigenvectors();  // [v₀, v₁, v₂]
```

`utils::ComputePCA`内部执行：
1. 计算质心并去中心化
2. 计算协方差矩阵 $\mathbf{C}$
3. 对 $\mathbf{C}$ 进行特征值分解

**第三步：几何验证**

**平面特征验证**：

```cpp
if (eigenvalues(0) < 1e-6 || eigenvalues(1) / eigenvalues(2) < 0.1) {
    return false;  // 拒绝
}
```

验证条件：
1. $\lambda_0 \geq 10^{-6}$：确保不是退化到线（$\lambda_0 \approx 0$）或点（$\lambda_0, \lambda_1 \approx 0$）
2. $\frac{\lambda_1}{\lambda_2} \geq 0.1$：确保两个大特征值相近（平面的两个主方向都有足够分布）

**边缘特征验证**：

```cpp
if (eigenvalues(2) < K * eigenvalues(1)) {
    return false;  // 拒绝
}
```

验证条件：$\lambda_2 \geq K \cdot \lambda_1$，确保是明显的线性结构。

#### 输出结果

成功的PCA分析提供：
- **质心** $\bar{\mathbf{p}}$：局部平面的中心
- **法向量** $\mathbf{v}_0$：用于构建点到平面距离约束
- **特征值** $\lambda_0, \lambda_1, \lambda_2$：用于计算平面度等几何指标

**点到平面距离约束**：

$$
r = (\mathbf{p}_{\text{curr}} - \bar{\mathbf{p}}) \cdot \mathbf{v}_0
$$

这个残差 $r$ 被添加到Ceres优化问题中，用于估计位姿。

---

### 函数二：FeatureObservabilityAnalysis - 特征可观测性分析

#### 函数签名

```cpp
void FeatureObservabilityAnalysis(
    pcaFeature &feature,                     // 输出：特征可观测性结果
    const Eigen::Vector3d &pFinal,          // 输入：特征点世界坐标
    const Eigen::Vector3d &eigenvalues,     // 输入：PCA特征值
    const Eigen::Vector3d &normal_direction,    // 输入：平面法向量
    const Eigen::Vector3d &principal_direction  // 输入：平面主方向
)
```

#### 核心思想

该函数量化一个平面特征对6-DoF运动（3平移+3旋转）的**约束能力**，为退化检测提供基础数据。

#### 详细流程分析

**第一步：初始化与归一化** 

```cpp
feature.pt = pFinal;  // 存储点位置
feature.vectors.normalDirection = normal_direction.normalized();
feature.vectors.principalDirection = principal_direction.normalized();
```

**第二步：计算几何属性** 

调用`computeEigenProperties`计算：

$$
\text{planar} = \frac{\lambda_1 - \lambda_0}{\lambda_2}
$$

$$
\text{linear} = \frac{\lambda_2 - \lambda_1}{\lambda_2}
$$

$$
\text{spherical} = \frac{\lambda_0}{\lambda_2}
$$

$$
\text{curvature} = \frac{\lambda_0}{\lambda_0 + \lambda_1 + \lambda_2}
$$

其中 $\text{planar}$ 是最关键的指标，表示平面性强度。

**第三步：计算旋转可观测性** 

首先获取当前LiDAR坐标系的三个轴在世界坐标系中的方向：

$$
\mathbf{a}_x^w = \mathbf{R}_{wl} \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad
\mathbf{a}_y^w = \mathbf{R}_{wl} \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad
\mathbf{a}_z^w = \mathbf{R}_{wl} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}
$$

然后计算力矩向量：

$$
\mathbf{m} = \mathbf{r} \times \mathbf{n}
$$

其中 $\mathbf{r}$ 是点位置，$\mathbf{n}$ 是法向量。

对各旋转轴的约束能力：

$$
\begin{aligned}
o_{r_x} &= \mathbf{m} \cdot \mathbf{a}_x^w \\
o_{r_y} &= \mathbf{m} \cdot \mathbf{a}_y^w \\
o_{r_z} &= \mathbf{m} \cdot \mathbf{a}_z^w
\end{aligned}
$$

**物理意义**：基于刚体运动学 $\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$，平面约束法向量方向的运动，因此：

$$
|o_{r_i}| = |\mathbf{n} \cdot (\boldsymbol{\omega}_i \times \mathbf{r})| = |(\mathbf{r} \times \mathbf{n}) \cdot \boldsymbol{\omega}_i|
$$

表示该平面能多大程度约束绕第 $i$ 轴的旋转。

**第四步：计算平移可观测性** 

$$
\begin{aligned}
o_{t_x} &= \text{planar}^2 \cdot |\mathbf{n} \cdot \mathbf{a}_x^w| \\
o_{t_y} &= \text{planar}^2 \cdot |\mathbf{n} \cdot \mathbf{a}_y^w| \\
o_{t_z} &= \text{planar}^2 \cdot |\mathbf{n} \cdot \mathbf{a}_z^w|
\end{aligned}
$$

**物理意义**：
- $\mathbf{n} \cdot \mathbf{a}_i$ 是法向量在第 $i$ 轴上的投影
- 投影越大，该方向的平移运动越容易被该平面检测到
- $\text{planar}^2$ 是置信度权重，只有清晰的平面才有高约束能力

**第五步：排序与归类** 
调用`analyzeFeatureObservability`对9个可观测性值排序：

```cpp
std::vector<QualityPair> all_quality = {
    {tx_dot, Feature_observability::tx_dot},
    {ty_dot, Feature_observability::ty_dot},
    {tz_dot, Feature_observability::tz_dot},
    {rx_cross, Feature_observability::rx_cross},
    {ry_cross, Feature_observability::ry_cross},
    {rz_cross, Feature_observability::rz_cross},
    {neg_rx_cross, Feature_observability::neg_rx_cross},
    {neg_ry_cross, Feature_observability::neg_ry_cross},
    {neg_rz_cross, Feature_observability::neg_rz_cross}
};

std::sort(all_quality.begin(), all_quality.end(), 
          [](const auto& a, const auto& b) { return a.first > b.first; });
```

选择**前3个最强约束**的自由度，更新直方图：

```cpp
for (int i = 0; i < 3; i++) {
    int index = static_cast<int>(all_quality[i].second);
    PlaneFeatureHistogramObs[index]++;
}
```

#### 直方图统计

`PlaneFeatureHistogramObs`是一个长度为9的数组，累积所有特征的约束分布：

| 索引 | 含义 | 对应自由度 |
|-----|------|-----------|
| 0, 1 | 绕X轴旋转(Roll)的正负约束 | $rx, -rx$ |
| 2, 3 | 绕Y轴旋转(Pitch)的正负约束 | $ry, -ry$ |
| 4, 5 | 绕Z轴旋转(Yaw)的正负约束 | $rz, -rz$ |
| 6 | X方向平移约束 | $t_x$ |
| 7 | Y方向平移约束 | $t_y$ |
| 8 | Z方向平移约束 | $t_z$ |

#### 退化检测应用

通过分析直方图，可以识别哪些自由度缺乏约束：

**走廊场景示例**：

```
PlaneFeatureHistogramObs[0] (rx) = 120   ✓ 充足
PlaneFeatureHistogramObs[2] (ry) = 115   ✓ 充足  
PlaneFeatureHistogramObs[4] (rz) = 5     ✗ 严重不足 → Yaw退化
PlaneFeatureHistogramObs[6] (tx) = 8     ✗ 不足 → X平移退化
PlaneFeatureHistogramObs[7] (ty) = 125   ✓ 充足
PlaneFeatureHistogramObs[8] (tz) = 110   ✓ 充足
```

**结论**：走廊环境下Yaw角和前进方向X不可观，需增加其他传感器权重。

#### 可视化示例

<div class="mermaid" style="height: 400px; display: flex; justify-content: center; width: 100%; margin: 0 auto;">
graph TD
    %% 定义全局样式类
    classDef default fill:#fff,stroke:#333,stroke-width:1px,color:#000,rx:2,ry:2;
    A[平面特征<br/>法向量n<br/>位置r] --> B[计算几何属性<br/>planar, linear]
    A --> C[计算旋转约束<br/>r×n·axis]
    A --> D[计算平移约束<br/>n·axis]
    B --> E[加权]
    C --> F[9个可观测性值]
    D --> F
    E --> F
    F --> G[排序取Top3]
    G --> H[更新直方图<br/>PlaneFeatureHistogramObs]
    H --> I[统计各自由度<br/>约束特征数]
    I --> J[退化判断<br/>不确定性量化]
</div>


---

## ICP风险预测 vs 环境退化检测

两种方法的对比：

| 维度 | ICP对齐风险预测 | 环境退化检测 |
|------|----------------|-------------|
| **分析对象** | 优化后的Hessian逆矩阵 | 特征点的几何分布 |
| **数学基础** | 协方差矩阵的特征值分解 | 特征可观测性的直方图统计 |
| **计算时机** | 优化求解之后 | 特征匹配期间（实时） |
| **计算成本** | 较高（需要SVD分解） | 较低（点乘和叉乘） |
| **信息粒度** | 全局6-DoF不确定性 | 每帧、每个自由度独立 |
| **物理意义** | 基于观测方程的统计不确定性 | 基于几何约束分布的可观性 |
| **主要用途** | 调试、位姿图信息矩阵 | 实时退化判断、权重调整 |

**为什么不能用ICP中的奇异值分解来做退化检测？**

1. **时机不同**：
   - ICP的SVD在优化**之后**，此时已经完成配准
   - 退化检测需要在优化**之前**或**同时**进行，以便及时调整策略

2. **计算成本**：
   - SVD分解6×6矩阵虽然快，但每帧都计算仍有开销
   - 可观测性方法只需简单的向量点乘/叉乘，可以并行处理所有特征

3. **细粒度不同**：
   - SVD只给出全局的6个自由度不确定性
   - 可观测性方法能够分析**每个特征**对**每个自由度**的贡献，信息更丰富

4. **适用性**：
   - SVD方法假设优化问题已经收敛且Hessian可逆
   - 在严重退化时，Hessian可能奇异，SVD不稳定
   - 可观测性方法直接基于几何，不依赖优化状态

**两者互补**：
- **退化检测**（快速）：实时判断当前环境是否退化
- **ICP风险预测**（精确）：事后评估配准质量，提供精确的不确定性估计

---

## 基于可观测性的定位质量分数

可观测性直方图是很好的定位质量指标。

**改进建议**：

$$
Q_{\text{localization}} = w_t \cdot Q_t + w_r \cdot Q_r
$$

其中：

**平移质量分数**：

$$
Q_t = \min\left(1, \frac{\min(\mathcal{H}_{t_x}, \mathcal{H}_{t_y}, \mathcal{H}_{t_z})}{\mathcal{H}_{\text{threshold}}}\right)
$$

**旋转质量分数**：

$$
Q_r = \min\left(1, \frac{\min(\mathcal{H}_{r_x}, \mathcal{H}_{r_y}, \mathcal{H}_{r_z})}{\mathcal{H}_{\text{threshold}}}\right)
$$

**物理意义**：
- $Q \approx 1$：所有自由度都有充足约束，定位质量高
- $Q \approx 0$：某些自由度严重缺乏约束，定位质量低

---

## 总结

SuperOdom通过**ICP对齐风险预测**和**环境退化检测**两个技术，实现了对SLAM系统可靠性的定量评估：

1. **对齐风险预测**：基于协方差矩阵的SVD分解，提供精确的全局不确定性估计
2. **退化检测**：基于特征可观测性直方图，实时量化各自由度的退化程度  
3. **权重调整**：根据不确定性自适应调整多传感器融合权重

这些技术对于构建可靠的自主导航系统至关重要，特别是在结构化室内环境和特征稀疏场景中。

**关键数学概念回顾**：
- 特征值升序：$\lambda_0 \leq \lambda_1 \leq \lambda_2$（Eigen库默认）
- 逆条件数：$\kappa^{-1} = \frac{\sqrt{\lambda_0}}{\sqrt{\lambda_2}}$
- 不可观方向：$\mathbf{v}_0$（最小特征值的特征向量）
- 平面法向量：$\mathbf{v}_0$（协方差矩阵的最小方差方向）
