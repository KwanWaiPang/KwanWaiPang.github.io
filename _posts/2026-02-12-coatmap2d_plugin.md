---
layout: post
title: "如何编写一个新的代价地图(Costmap2D)插件"
date:   2026-02-12
tags: [Robotics]
comments: true
author: kwanwaipang
toc: true
excerpt: "ROS Navigation Stack如何创建自己的代价地图层" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->


# 引言

对于ROS2的代价地图层（Costmap Layers）有如下插件：
* 体素图层 Voxel Layer：利用深度传感器的数据和激光传感器射线投影数据来擦除空间中障碍信息以维护持久体素层。
* 测距图层 Range Layer：使用概率模型将传感器的测距数据生成在costmap上
* 静态图层 Static Layer：获取静态`map`并将其中的栅格占据信息加载到costmap中
* 膨胀图层 Inflation Layer:用指数衰减算法对代价地图(costmap)中的致命障碍物进行膨胀。
* 障碍物图层 Obstacle Layer：通过从2D的雷达扫描数据在持久层2D costmap更新自由空间。
* 时空体素层 Spatio-Temporal Voxel Layer：通过传感器衰减模型维护当前的3D稀疏体素网格。
* 非持久体素层 Non-Persistent Voxel Layer：该插件通过测量数据最多的数据维护3D占据栅格地图。
* 禁区过滤器 Keepout Filter：维持运行时的导航禁区/导航安全区和首选车道
* 速度过滤器 Speed Filter：限制机器人在限速区域的最大速度

本博文基于ROS的代价地图插件，将其移植到ROS1中。

# Nav2 Costmap 插件移植到 ROS1

将三个 nav2 costmap 插件（`DenoiseLayer`、`RangeSensorLayer`、`KeepoutFilter`）移植到已有的 ROS1 `costmap_2d` 功能包，保持与 ROS1 框架完全兼容。

## 核心 API 转换原则

| nav2（ROS2） | ROS1 等价写法 |
|---|---|
| `node->declare_or_get_parameter(name, default)` | `nh.param(key, var, default)` |
| `RCLCPP_INFO(logger_, ...)` | `ROS_INFO(...)` |
| `node->create_subscription<T>(topic, cb, qos)` | `nh.subscribe(topic, queue, cb, this)` |
| `clock_->now()` | `ros::Time::now()` |
| `rclcpp::Time last_reading_time_` | `ros::Time last_reading_time_` |
| `tf2::Duration transform_tolerance_` | `ros::Duration transform_tolerance_` |
| `nav2_costmap_2d::` 命名空间 | `costmap_2d::` 命名空间 |

---

## DenoiseLayer（去噪层）

**功能**：过滤掉 Costmap 中因传感器噪声产生的孤立障碍点或小型障碍组。可有效防止膨胀层对噪声点进行不必要的膨胀。此部分与ROS版本无关，因此移植较为简单。

**算法核心**（纯 C++，与 ROS 无关）：移植 `denoise/image.hpp` 和 `denoise/image_processing.hpp` 时**几乎不需要修改**，只替换命名空间即可。

* [修改] `/navigation_custom/costmap_2d/CMakeLists.txt`
  - 添加 `denoise_layer.cpp` 到插件目标

* [修改] `navigation_custom/costmap_2d/costmap_plugins.xml`
  - 注册 `costmap_2d::DenoiseLayer`

* [新增] `include/costmap_2d/denoise/image.hpp`
  - 直接复制 nav2 版本，将 `nav2_costmap_2d` 命名空间改为 `costmap_2d`

* [新增] `include/costmap_2d/denoise/image_processing.hpp`
  - 直接复制 nav2 版本，将命名空间改为 `costmap_2d`

* [新增] `include/costmap_2d/denoise_layer.h`
  - 继承自 `costmap_2d::Layer`（ROS1 版本）
  - 替换所有 nav2 类型引用

* [新增] `plugins/denoise_layer.cpp`
  - `onInitialize()`: `nh.param()` 替换参数读取
  - `updateCosts()`: 核心算法逻辑不变

接下来测试添加`denoise_layer`的效果。在 **local_costmap** 的 plugins 列表中，在 `obstacle_layer` 和 `inflation_layer` 之间插入 `denoise_layer`：

```diff
 local_costmap:
   plugins:
     - { name: static_layer, type: "costmap_2d::StaticLayer" }
     - { name: obstacle_layer,  type: "costmap_2d::ObstacleLayer" }
+    - { name: denoise_layer, type: "costmap_2d::DenoiseLayer" }
     - { name: inflation_layer, type: "costmap_2d::InflationLayer" }
```

并添加 `denoise_layer` 的参数块：

```yaml
  denoise_layer:
    enabled: true
    minimal_group_size: 2    # 小于 2 个相邻格子的障碍物组会被清除
    group_connectivity_type: 8  # 8 连通（含对角线）
```

> [!NOTE]
> 先只修改 **local_costmap**（局部代价地图），因为它更新频率更高（4Hz），障碍物变化更直观，便于观察去噪效果。验证通过后再考虑添加到 global_costmap。
> 将 `minimal_group_size` 改为 `4` 或 `6`，观察更多小型障碍物组是否被过滤。

### 去噪原理

将 costmap 视为二值图像（前景 = 障碍物/未知，背景 = 空闲空间），通过连通分量分析找出所有前景像素的连通组，**删除小于阈值的组**。

**前景判定（isBackground）**

以下值被视为**前景**（噪声候选）：

| Costmap值 | 名称 | 条件 |
|---|---|---|
| 254 | `LETHAL_OBSTACLE` | 始终视为前景 |
| 253 | `INSCRIBED_INFLATED_OBSTACLE` | 始终视为前景 |
| 255 | `NO_INFORMATION` | 仅当 `denoise_unknown: true` 时视为前景 |

其余值（0=FREE_SPACE 和 1-252 的中间值）视为背景，不参与去噪。

**两种算法：**

根据 `minimal_group_size` 自动选择：

**算法一：快速单像素过滤（minimal_group_size == 2）**

基于**形态学膨胀**，速度比算法二快约 10 倍，但只能清除完全孤立的单像素。

1. 对每个像素计算 8 邻域（不含自身）的最大值
2. 若像素本身是前景，但邻域最大值是背景 → 该像素孤立 → 清除为 `FREE_SPACE`

```
去噪前：              去噪后：
· · · · ·             · · · · ·
· · X · ·  (孤立)     · · · · ·  ← 已清除
· · · · ·             · · · · ·
· X X · ·  (成对)     · X X · ·  ← 保留
· · · · ·             · · · · ·
```

**算法二：连通分量分析（minimal_group_size >= 3）**

使用 SAUF（Scan Array Union Find）算法进行完整的连通分量标记：

1. 遍历所有像素，为每个前景连通组分配唯一标签
2. 统计每组大小（直方图）
3. 组大小 < `minimal_group_size` 的 → 清除为 `FREE_SPACE`

```
去噪前 (minimal_group_size=5)：     去噪后：
· X · · · ·                         · · · · · ·   ← 组A(1像素) 已清除
· · · X X · 　                      · · · · · ·   ← 组B(3像素) 已清除
· · · · X ·                         · · · · · ·
· X X X X X                         · X X X X X   ← 组C(8像素) 保留
· X X · X ·                         · X X · X ·
```

* 参数说明：

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `enabled` | bool | `true` | 是否启用该层 |
| `minimal_group_size` | int | `2` | 最小保留组大小。小于此值的前景连通组被清除。=2 只清除孤立单像素（快速），≥3 使用连通分量算法清除小簇 |
| `group_connectivity_type` | int | `8` | 连通类型。`4`=十字邻域（上下左右），`8`=8邻域（含对角线），注意，只有两个选择 |
| `denoise_unknown` | bool | `false` | **[改进了原版ROS2]** 是否将 `NO_INFORMATION`(255) 也视为前景参与去噪。开启后还会自动扩展处理范围到整个 costmap |

* `group_connectivity_type` 图示

```
4连通（Way4）         8连通（Way8）
    · ↑ ·                ↗ ↑ ↖
    ← ■ →                ← ■ →
    · ↓ ·                ↙ ↓ ↘
```

8连通下对角线像素也算同一组，组会更大，被清除的可能性更低。

**配置示例：**

* 全局 costmap（清除静态地图噪声 + 未知像素噪声）

```yaml
global_costmap:
  plugins:
    - { name: static_layer, type: "costmap_2d::StaticLayer" }
    - { name: obstacle_layer, type: "costmap_2d::ObstacleLayer" }
    - { name: denoise_layer, type: "costmap_2d::DenoiseLayer" }  # 在 inflation 前
    - { name: inflation_layer, type: "costmap_2d::InflationLayer" }

  denoise_layer:
    enabled: true
    minimal_group_size: 5       # 清除 <5 像素的小簇
    group_connectivity_type: 8
    denoise_unknown: true       # 也清除孤立未知像素
```

* 局部 costmap（仅清除传感器噪声）

```yaml
local_costmap:
  denoise_layer:
    enabled: true
    minimal_group_size: 2       # 仅清除单像素噪声（最快）
    group_connectivity_type: 8
    # denoise_unknown 默认 false，局部 costmap 通常不需要
```

* 相对 Nav2 原版的改进：

| 功能 | Nav2 原版 | ROS1 增强版 |
|---|---|---|
| 去噪 LETHAL/INSCRIBED 像素 | ✅ | ✅ |
| 去噪 NO_INFORMATION 像素 | ❌ 不支持 | ✅ `denoise_unknown` 参数 |
| 处理范围 | 依赖前层 bounds | `denoise_unknown` 开启时自动扩展到全图 |
| NO_INFORMATION 膨胀修复 | ❌ 255 为最大字节值导致膨胀失效 | ✅ 替换为 254 参与运算 |

## RangeSensorLayer（距离传感器层）

**功能**：支持超声波、TOF等 `sensor_msgs/Range` 距离传感器，使用贝叶斯概率模型进行栅格占用估计。

* [修改] `navigation_custom/costmap_2d/CMakeLists.txt`
  - 添加 `range_sensor_layer.cpp`，依赖 `angles` 和 `sensor_msgs`

* [新增] `include/costmap_2d/range_sensor_layer.h`
  - 继承自 `costmap_2d::CostmapLayer`
  - `rclcpp::Time` → `ros::Time`
  - `std::vector<nav2::Subscription<...>>` → `std::vector<ros::Subscriber>`
  - `tf2::Duration` → `ros::Duration`

* [新增] `plugins/range_sensor_layer.cpp`
  - `onInitialize()`: 使用 `ros::NodeHandle` 订阅各 Range topic
  - `updateBounds()` / `updateCosts()`: 传感器概率模型逻辑不变
  - `clock_->now()` → `ros::Time::now()`


## KeepoutFilter（禁区过滤器，简化版）

**功能**：接收一张 `nav_msgs/OccupancyGrid` 地图作为禁区掩膜（Mask），将掩膜中的高值区域标记为 Costmap 中的致命障碍（LETHAL_OBSTACLE）。

**简化方案**：不依赖 nav2 的 `CostmapFilterInfo` 双阶段订阅机制，直接订阅一个 OccupancyGrid topic。

### [新增] `include/costmap_2d/keepout_filter.h`
- 继承自 `costmap_2d::CostmapLayer`
- 成员变量包括：mask topic 名称、mask 数据指针、lethal 阈值

### [新增] `plugins/keepout_filter.cpp`
- `onInitialize()`: 用 `nh.param()` 读取 mask_topic，并订阅之
- `maskCallback()`: 接收并存储最新掩膜
- `updateBounds()`: 有掩膜更新时标记更新区域
- `updateCosts()`: 将掩膜中值 ≥ `lethal_threshold` 的 Cell 设置为 LETHAL_OBSTACLE

接下来通过节点发布禁行区域（注意，当前模拟原点周围一个2*2方形区域为禁行区域）：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
keepout_mask_publisher.py

发布一张 nav_msgs/OccupancyGrid 作为 KeepoutFilter 的禁区掩膜。
在地图原点附近放置一个 2m x 2m 的矩形禁区（值=100）。

用法:
  rosrun simulated_navigation keepout_mask_publisher.py

参数 (可通过 rosparam 设置):
  ~zone_x       禁区中心 X (m), 默认 0.0
  ~zone_y       禁区中心 Y (m), 默认 0.0
  ~zone_width   禁区宽度 (m),   默认 2.0
  ~zone_height  禁区高度 (m),   默认 2.0
  ~resolution   栅格分辨率 (m),  默认 0.05 (与主地图一致)
  ~frame_id     坐标系,         默认 "map"
"""

import rospy
from nav_msgs.msg import OccupancyGrid
from geometry_msgs.msg import Pose


def main():
    rospy.init_node('keepout_mask_publisher', anonymous=False)

    # 读取参数
    zone_x      = rospy.get_param('~zone_x', 0.0)
    zone_y      = rospy.get_param('~zone_y', 0.0)
    zone_width  = rospy.get_param('~zone_width', 2.0)
    zone_height = rospy.get_param('~zone_height', 2.0)
    resolution  = rospy.get_param('~resolution', 0.05)
    frame_id    = rospy.get_param('~frame_id', 'map')

    # 计算掩膜地图的大小和原点
    # 掩膜只需覆盖禁区区域即可（加一点余量）
    margin = 1.0  # 周围 1m 余量
    origin_x = zone_x - zone_width / 2.0 - margin
    origin_y = zone_y - zone_height / 2.0 - margin
    map_width_m  = zone_width + 2.0 * margin
    map_height_m = zone_height + 2.0 * margin

    width_cells  = int(map_width_m / resolution)
    height_cells = int(map_height_m / resolution)

    # 构建 OccupancyGrid 消息
    grid = OccupancyGrid()
    grid.header.frame_id = frame_id
    grid.info.resolution = resolution
    grid.info.width  = width_cells
    grid.info.height = height_cells
    grid.info.origin = Pose()
    grid.info.origin.position.x = origin_x
    grid.info.origin.position.y = origin_y
    grid.info.origin.position.z = 0.0
    grid.info.origin.orientation.w = 1.0

    # 初始化为全 0 (自由空间)
    data = [0] * (width_cells * height_cells)

    # 在禁区区域填入 100 (占用)
    zone_min_x = zone_x - zone_width / 2.0
    zone_max_x = zone_x + zone_width / 2.0
    zone_min_y = zone_y - zone_height / 2.0
    zone_max_y = zone_y + zone_height / 2.0

    for row in range(height_cells):
        for col in range(width_cells):
            world_x = origin_x + (col + 0.5) * resolution
            world_y = origin_y + (row + 0.5) * resolution

            if zone_min_x <= world_x <= zone_max_x and zone_min_y <= world_y <= zone_max_y:
                data[row * width_cells + col] = 100

    grid.data = data

    # latched publisher: 发布后即使没有新消息，新订阅者也能收到最后一帧
    pub = rospy.Publisher('/keepout_mask', OccupancyGrid, queue_size=1, latch=True)

    rospy.sleep(0.5)  # 等待 publisher 注册完成
    grid.header.stamp = rospy.Time.now()
    pub.publish(grid)

    rospy.loginfo(
        "KeepoutMaskPublisher: published keepout zone at (%.1f, %.1f), "
        "size %.1fm x %.1fm, map %dx%d cells, topic=/keepout_mask",
        zone_x, zone_y, zone_width, zone_height, width_cells, height_cells
    )

    # 保持节点运行 (latched message 需要节点存活)
    rospy.spin()


if __name__ == '__main__':
    main()
```

---

<!-- 

## speed_filter（限速层）
SpeedFilter 是 Nav2 中的限速区域过滤层：它订阅一张 OccupancyGrid 掩膜地图（speed mask），在每个 costmap 更新周期查询机器人当前位置对应的 mask 格子值，然后计算速度限制 `speed_limit = data × multiplier + base`，通过 topic 发布供控制器使用。

本次移植的目标是将该层从 ROS2 Nav2 架构适配到现有 ROS1 costmap_2d 插件框架，**与之前移植 KeepoutFilter 的方式保持一致**。
 -->


# 参考资料
* [Nav2 Costmap_2d](https://github.com/ros-navigation/navigation2/blob/main/nav2_costmap_2d/README.md)
* [Writing a New Costmap2D Plugin](https://docs.nav2.org/plugin_tutorials/docs/writing_new_costmap2d_plugin.html)
<!-- 中文版：http://dev.nav2.fishros.com/doc/plugin_tutorials/docs/writing_new_costmap2d_plugin.html -->