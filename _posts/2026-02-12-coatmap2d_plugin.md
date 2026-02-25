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

## 阶段一：DenoiseLayer（去噪层）

**功能**：过滤掉 Costmap 中因传感器噪声产生的孤立障碍点或小型障碍组。可有效防止膨胀层对噪声点进行不必要的膨胀。

**算法核心**（纯 C++，与 ROS 无关）：移植 `denoise/image.hpp` 和 `denoise/image_processing.hpp` 时**几乎不需要修改**，只替换命名空间即可。

### [修改] `/navigation_custom/costmap_2d/CMakeLists.txt`
- 添加 `denoise_layer.cpp` 到插件目标

### [修改] `navigation_custom/costmap_2d/costmap_plugins.xml`
- 注册 `costmap_2d::DenoiseLayer`

### [新增] `include/costmap_2d/denoise/image.hpp`
- 直接复制 nav2 版本，将 `nav2_costmap_2d` 命名空间改为 `costmap_2d`

### [新增] `include/costmap_2d/denoise/image_processing.hpp`
- 直接复制 nav2 版本，将命名空间改为 `costmap_2d`

### [新增] `include/costmap_2d/denoise_layer.h`
- 继承自 `costmap_2d::Layer`（ROS1 版本）
- 替换所有 nav2 类型引用

### [新增] `plugins/denoise_layer.cpp`
- `onInitialize()`: `nh.param()` 替换参数读取
- `updateCosts()`: 核心算法逻辑不变

------

## 阶段二：RangeSensorLayer（距离传感器层）

**功能**：支持超声波、TOF 等 `sensor_msgs/Range` 距离传感器，使用贝叶斯概率模型进行占用估计。

### [修改] `navigation_custom/costmap_2d/CMakeLists.txt`
- 添加 `range_sensor_layer.cpp`，依赖 `angles` 和 `sensor_msgs`

### [新增] `include/costmap_2d/range_sensor_layer.h`
- 继承自 `costmap_2d::CostmapLayer`
- `rclcpp::Time` → `ros::Time`
- `std::vector<nav2::Subscription<...>>` → `std::vector<ros::Subscriber>`
- `tf2::Duration` → `ros::Duration`

### [新增] `plugins/range_sensor_layer.cpp`
- `onInitialize()`: 使用 `ros::NodeHandle` 订阅各 Range topic
- `updateBounds()` / `updateCosts()`: 传感器概率模型逻辑不变
- `clock_->now()` → `ros::Time::now()`

---

## 阶段三：KeepoutFilter（禁区过滤器，简化版）

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

---



<!--
我并不是用catkin_make编译的，用的是catkin build，以及你的“src\navigation_custom\costmap_2d\package.xml”漏了“<depend>angles</depend>”我添加后，编译是通过的。
另外我填了了部分的中文注释，接下来有新需求如下： 
1. 怎么验证加入的三层传感器呢？比如我要验证KeepoutFilter，在当前的工作空间下，如何添加带有禁行区的地图呢？
 -->


# 参考资料
* [Nav2 Costmap_2d](https://github.com/ros-navigation/navigation2/blob/main/nav2_costmap_2d/README.md)
* [Writing a New Costmap2D Plugin](https://docs.nav2.org/plugin_tutorials/docs/writing_new_costmap2d_plugin.html)
<!-- 中文版：http://dev.nav2.fishros.com/doc/plugin_tutorials/docs/writing_new_costmap2d_plugin.html -->