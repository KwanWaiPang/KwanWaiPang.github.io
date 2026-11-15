---
layout: post
title: "WSL2 中让 OpenGL 使用 NVIDIA 独立显卡：从 llvmpipe 到 D3D12 硬件加速"
date:   2026-11-15
tags: [Coding]
comments: true
author: kwanwaipang
toc: true
excerpt: "记录 Ubuntu 20.04 + ROS Noetic + WSLg 环境下，OpenGL 默认使用 llvmpipe、无法调用 NVIDIA RTX 5060 的排查过程，以及通过升级 Mesa 到 25.0.7 启用 D3D12 硬件加速的方法。"
---

<!-- * 目录
{:toc} -->

> **NOTE：**
> 
> Designed and Created by GPT-6 Chat model High
> 
> 验证机器为联想Y9000P

# 引言

之前博客[解决 WSL2 中 RViz 使用 CPU 渲染的问题](https://kwanwaipang.github.io/WSL2-rviz/)通过配置`rviz-gpu`实现了使用gpu来加速rviz，但还是治标不治本，opengl还是没有真正实现用GPU加速，而且每次的适配都会比较麻烦，本博文通过更新安装`sudo apt install libgl1-mesa-dri libglx-mesa0 libegl-mesa0 libgbm1 mesa-vulkan-drivers`最终实现opengl的GPU加速

最终效果如下所示，运行`glxinfo -B | grep -E 'Device:|Accelerated:|OpenGL renderer'`：

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/ScreenShot_2026-11-15_192742_322.png" width="90%" />
<figcaption>  
</figcaption>
</div>


在 Windows 上使用 WSL2 进行 ROS 开发时，RViz 等图形程序可以通过 WSLg 显示在 Windows 桌面上。不过，**图形界面能够正常显示，并不代表 OpenGL 已经使用 GPU 硬件加速**。

本文记录一次实际排障过程：在 Ubuntu 20.04 + ROS Noetic + WSLg 环境中，`nvidia-smi` 能够识别 NVIDIA RTX 5060，但 OpenGL 渲染器却是 `llvmpipe`，意味着图形渲染实际上由 CPU 软件完成。最终通过将 Mesa 从 21.2.6 升级到 25.0.7，成功让 OpenGL 使用 NVIDIA RTX 5060 Laptop GPU 的 D3D12 后端。

本文重点记录可复现的检查步骤、排查中遇到的误区，以及最终有效的解决方法。

# 1. 环境与问题现象

## 1.1 测试环境

本次排障使用的环境如下：

| 项目 | 版本或型号 |
|---|---|
| 操作系统 | Windows 11，版本 24H2（OS Build 26100.3323） |
| WSL | 3.0.5.0 |
| WSL Kernel | 6.18.58.1-1 |
| WSLg | 1.0.79 |
| Direct3D | 1.611.1-81528511 |
| DXCore | 10.0.26100.1 |
| Linux 发行版 | Ubuntu 20.04 LTS |
| ROS | ROS Noetic |
| NVIDIA GPU | GeForce RTX 5060 Laptop GPU |
| 原始 Mesa | 21.2.6 |

查看 WSL 及 WSLg 版本：

```powershell
wsl --version
```

查看 WSL 中的 NVIDIA GPU：

```bash
nvidia-smi
```

`nvidia-smi` 能够识别 RTX 5060，说明 WSL 的 NVIDIA 计算接口已经可用。但这并不能证明 OpenGL 图形渲染也已经使用 NVIDIA GPU，二者需要分别验证。

## 1.2 检查 OpenGL 渲染器

安装 `glxinfo` 等诊断工具：

```bash
sudo apt update
sudo apt install mesa-utils
```

这里需要特别说明：`mesa-utils` 是诊断工具包，提供 `glxinfo`、`glxgears` 等工具；它本身不是 Mesa 图形驱动，也不会因为安装它就自动启用 GPU 硬件加速。

查看 OpenGL 信息：

```bash
glxinfo -B
```

最初得到的关键信息如下：

```text
OpenGL renderer string: llvmpipe (LLVM 12.0.0, 256 bits)
Accelerated: no
Version: 21.2.6
```

其中：

- `llvmpipe` 是 Mesa 的软件光栅化渲染器，主要使用 CPU 完成图形渲染。
- `Accelerated: no` 表示当前没有启用硬件加速。
- 因此，即使 RViz 窗口能够显示，也不能认为它正在使用 RTX 5060 渲染。

# 2. 理解 WSLg 的 OpenGL 硬件加速机制

WSL2 并不是在 Linux 环境中直接加载 Windows NVIDIA 显卡的原生 Linux 内核驱动。WSLg 的图形加速链路与原生 Ubuntu 略有不同。

在本次环境中，Mesa 通过 D3D12 Gallium 驱动，将 Linux 程序的 OpenGL 调用转换为 D3D12 调用，再由 Windows 侧图形驱动执行。

因此，需要区分以下几个层次：

1. **CUDA / NVIDIA 计算接口**：用于 CUDA 等计算任务，`nvidia-smi` 正常不代表 OpenGL 一定正常。
2. **WSLg 图形接口**：提供 Linux 图形程序与 Windows 图形系统之间的连接。
3. **Mesa D3D12 驱动**：负责把 OpenGL 调用转换为 D3D12。
4. **Windows NVIDIA 图形驱动**：最终使用 NVIDIA GPU 执行图形任务。

本次问题发生在 OpenGL / Mesa D3D12 渲染链路，而不是 CUDA 是否识别显卡的问题。

# 3. 排查过程

## 3.1 确认 WSL 能识别 GPU

首先检查：

```bash
nvidia-smi
```

同时检查 WSL GPU 设备接口：

```bash
ls -l /dev/dxg
```

本次环境中，`nvidia-smi` 能够正常识别 GeForce RTX 5060，`/dev/dxg` 也存在。

这说明 WSL 已经建立了 GPU 访问接口，但仍需继续检查 OpenGL 渲染路径。

## 3.2 确认 WSLg 图形环境

检查图形环境变量：

```bash
echo $DISPLAY
echo $WAYLAND_DISPLAY
```

本次环境中分别为：

```text
:0
wayland-0
```

说明 WSLg 图形会话已经启动。

## 3.3 检查 Mesa D3D12 驱动文件

检查 D3D12 Gallium 驱动文件：

```bash
ls -lh /usr/lib/x86_64-linux-gnu/dri/d3d12_dri.so
```

文件确实存在。

这说明当前 Mesa 安装中包含 D3D12 驱动文件，但**文件存在不代表驱动一定能够成功初始化**。

## 3.4 尝试直接指定 D3D12 和 NVIDIA

Mesa 提供了环境变量，用于选择 Gallium 驱动和 D3D12 适配器：

```bash
GALLIUM_DRIVER=d3d12 \
MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA \
glxinfo -B
```

但在 Mesa 21.2.6 下，结果仍然是：

```text
libGL error: failed to create dri screen
libGL error: failed to load driver: swrast
```

或者回退到：

```text
OpenGL renderer string: llvmpipe (LLVM 12.0.0, 256 bits)
Accelerated: no
```

这说明仅指定 NVIDIA 适配器并不能解决问题。

## 3.5 对照测试：Intel 核显可以正常加速

这台笔记本同时具有 Intel 核显和 NVIDIA 独立显卡，因此可以通过 Intel 核显进行对照测试：

```bash
GALLIUM_DRIVER=d3d12 \
MESA_D3D12_DEFAULT_ADAPTER_NAME=Intel \
glxinfo -B
```

在原始 Mesa 21.2.6 环境下，测试成功：

```text
Vendor: Microsoft Corporation
Device: D3D12 (Intel(R) Graphics)
Accelerated: yes

OpenGL renderer string:
D3D12 (Intel(R) Graphics)
```

这个对照结果非常关键：

- WSLg 的图形显示链路能够正常工作。
- Mesa 21.2.6 的 D3D12 驱动至少能够正常驱动 Intel 核显。
- NVIDIA 适配器却无法初始化，OpenGL 回退到 llvmpipe。

因此，问题并不是整个 WSLg 图形环境都无法进行硬件加速，而是当前 Mesa 版本下 NVIDIA D3D12 渲染路径存在兼容性问题。

## 3.6 检查 Mesa 软件包版本

查看 Mesa 相关软件包版本：

```bash
apt-cache policy \
  libgl1-mesa-dri \
  libglx-mesa0 \
  libglapi-mesa \
  mesa-utils
```

原始环境中，主要 Mesa 组件均为：

```text
21.2.6-0ubuntu0.1~20.04.2
```

版本一致，没有发现 Mesa 核心组件之间的版本混装。

此外，检查 WSL 版本：

```powershell
wsl --version
```

本次环境中的 WSL 3.0.5.0、Kernel 6.18.58.1-1 和 WSLg 1.0.79 均不是明显过旧的版本。

综合这些检查，决定优先尝试升级 Mesa，而不是更换 Ubuntu、升级 GLIBC 或安装 Linux 原生 NVIDIA 驱动。

# 4. 解决方案：升级 Mesa

## 4.1 添加 Kisak Turtle 软件源

本次使用 Kisak Turtle PPA，为 Ubuntu 20.04 提供较新的 Mesa 软件包。

```bash
sudo add-apt-repository ppa:kisak/turtle
sudo apt update
```

刷新软件源后，检查候选版本：

```bash
apt-cache policy \
  libgl1-mesa-dri \
  libglx-mesa0 \
  libglapi-mesa
```

本次检查到的候选版本为：

```text
libgl1-mesa-dri:
  Installed: 21.2.6-0ubuntu0.1~20.04.2
  Candidate: 25.0.7~kisak4~f

libglx-mesa0:
  Installed: 21.2.6-0ubuntu0.1~20.04.2
  Candidate: 25.0.7~kisak4~f

libglapi-mesa:
  Installed: 21.2.6-0ubuntu0.1~20.04.2
  Candidate: 21.2.6-0ubuntu0.1~20.04.2
```

注意：不同 Mesa 组件的软件包拆分和版本号不一定完全相同，不能仅凭某个组件版本号不同就判断依赖冲突。应以 APT 的依赖解析结果为准。

## 4.2 升级前模拟安装

为了避免升级图形栈时意外删除 ROS、CUDA 或其他开发依赖，建议先进行模拟安装。

执行：

```bash
sudo apt-get -s install \
  libgl1-mesa-dri \
  libglx-mesa0 \
  libegl-mesa0 \
  libgbm1 \
  mesa-vulkan-drivers
```

参数 `-s` 表示 Simulation，只模拟安装，不会实际修改系统。

本次模拟结果：

```text
The following NEW packages will be installed:
  libllvm15 mesa-libgallium

The following packages will be upgraded:
  libdrm-amdgpu1
  libdrm-common
  libdrm-intel1
  libdrm2
  libegl-mesa0
  libgbm1
  libgl1-mesa-dri
  libglx-mesa0
  libwayland-client0
  mesa-vulkan-drivers

10 upgraded, 2 newly installed, 0 to remove
```

结果没有计划删除任何软件包，因此可以继续。

如果模拟结果显示将删除 ROS、CUDA 或其他重要软件包，应先停止安装并检查依赖关系，不要直接确认。

## 4.3 正式升级 Mesa

确认模拟结果合理后，执行：

```bash
sudo apt install \
  libgl1-mesa-dri \
  libglx-mesa0 \
  libegl-mesa0 \
  libgbm1 \
  mesa-vulkan-drivers
```

本次升级的主要内容：

| 组件 | 升级前 | 升级后 |
|---|---|---|
| Mesa | 21.2.6 | 25.0.7 |
| libdrm | 2.4.107 | 2.4.122 |
| LLVM 运行库 | LLVM 12 相关组件 | 新增 libllvm15 |
| Wayland Client | 1.18 | 1.20 |

实际安装时以 APT 给出的软件包变更清单为准。

**不要因为 APT 提示 `libglapi-mesa` 不再需要，就立即执行 `sudo apt autoremove`。** 本次排障只需要完成指定图形组件升级，暂时保留其他自动安装的软件包更稳妥。

## 4.4 重启 WSL

升级完成后，在 Windows PowerShell 中执行：

```powershell
wsl --shutdown
```

然后重新打开 Ubuntu。

这一步用于关闭并重新启动 WSL 实例，使新的图形库在后续进程中生效。

# 5. 验证 NVIDIA OpenGL 硬件加速

重新进入 Ubuntu 后，执行：

```bash
GALLIUM_DRIVER=d3d12 \
MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA \
glxinfo -B
```

升级 Mesa 之前，这条命令会失败或回退到 llvmpipe；升级之后，本次测试成功。

关键输出如下：

```text
Vendor: Microsoft Corporation
Device: D3D12 (NVIDIA GeForce RTX 5060 Laptop GPU)
Version: 25.0.7
Accelerated: yes

OpenGL renderer string:
D3D12 (NVIDIA GeForce RTX 5060 Laptop GPU)

OpenGL core profile version string:
4.6 (Core Profile) Mesa 25.0.7
```

其中最重要的是：

```text
Accelerated: yes
```

以及：

```text
OpenGL renderer string:
D3D12 (NVIDIA GeForce RTX 5060 Laptop GPU)
```

这说明 OpenGL 已经通过 Mesa D3D12 后端使用 NVIDIA RTX 5060 Laptop GPU，而不再使用 CPU 的 llvmpipe 软件渲染。

本次输出还显示：

```text
Dedicated video memory: 7810 MB
Currently available dedicated video memory: 7028 MB
```

这些是驱动通过 OpenGL 扩展报告的显存信息，具体可用量会随运行状态变化。

# 6. 在 RViz 中使用 NVIDIA GPU

确认 `glxinfo -B` 已经显示 NVIDIA D3D12 硬件加速后，可以进一步启动 RViz。

例如：

```bash
GALLIUM_DRIVER=d3d12 \
MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA \
rviz
```

如果通过 ROS launch 文件启动，也可以在命令前设置相同的环境变量：

```bash
GALLIUM_DRIVER=d3d12 \
MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA \
roslaunch <your_package> <your_launch_file>
```

其中 `<your_package>` 和 `<your_launch_file>` 替换为实际的 ROS 包名和 launch 文件名。

建议加载实际使用的 LiDAR 点云、地图或 rosbag，观察 RViz 的交互与渲染情况，并结合 Windows 任务管理器中的 GPU 使用情况进行验证。

需要注意：本次已经通过 `glxinfo` 验证 NVIDIA OpenGL 硬件加速成功；RViz 的实际渲染性能仍应在具体项目场景中单独测试。

# 7. 将 NVIDIA 加速配置永久化（可选）

如果希望当前 Linux 用户后续启动的 Mesa 图形程序默认使用 NVIDIA GPU，可以将环境变量写入 `~/.bashrc`：

```bash
# WSLg NVIDIA GPU acceleration
export GALLIUM_DRIVER=d3d12
export MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA
```

编辑文件：

```bash
nano ~/.bashrc
```

保存后执行：

```bash
source ~/.bashrc
```

之后可以直接运行：

```bash
glxinfo -B
```

检查是否仍然显示：

```text
OpenGL renderer string:
D3D12 (NVIDIA GeForce RTX 5060 Laptop GPU)
```

**注意：** 这会影响当前用户通过该 Shell 启动的其他 Mesa 图形程序。如果某个程序希望使用 Intel 核显，可以在启动时单独覆盖适配器变量：

```bash
GALLIUM_DRIVER=d3d12 \
MESA_D3D12_DEFAULT_ADAPTER_NAME=Intel \
<your_command>
```

如果不希望所有图形程序默认使用 NVIDIA，也可以不修改 `~/.bashrc`，仅在启动 RViz 或其他指定程序时设置环境变量。

# 8. 排障经验与注意事项

结合这次排查，有几个经验值得记录。

## 8.1 `nvidia-smi` 正常不代表 OpenGL 已经使用 GPU

CUDA 和 OpenGL 是不同的使用路径。需要分别验证：

```bash
nvidia-smi
```

以及：

```bash
glxinfo -B
```

判断 OpenGL 是否硬件加速，重点看 `OpenGL renderer string` 和 `Accelerated`。

## 8.2 `mesa-utils` 不是图形驱动

```bash
sudo apt install mesa-utils
```

只是安装 OpenGL 诊断工具。真正的 Mesa 图形驱动由 `libgl1-mesa-dri`、Mesa Gallium 等组件提供。

## 8.3 不要在 WSL 中安装 Linux 原生 NVIDIA 内核驱动

WSL 的 GPU-PV 图形和计算链路由 Windows 侧 NVIDIA 驱动提供支持。不要照搬原生 Ubuntu 物理机的 NVIDIA Linux 驱动安装方式，以免破坏 WSL 的驱动环境。

## 8.4 不要轻易替换 Ubuntu 的系统 GLIBC

排查过程中曾出现过 `pthread_create` 符号解析错误，但后续检查没有证明这是最终故障根因。最终有效的解决办法是升级 Mesa 到 25.0.7，而不是替换系统 GLIBC。

对于 ROS Noetic 这样的既有开发环境，不建议为了排查图形问题直接升级系统 GLIBC。

## 8.5 Intel 能加速，不代表 NVIDIA 一定能加速

本次最有价值的对照实验是：

```bash
GALLIUM_DRIVER=d3d12 \
MESA_D3D12_DEFAULT_ADAPTER_NAME=Intel \
glxinfo -B
```

在 Mesa 21.2.6 下，Intel D3D12 加速正常，但 NVIDIA D3D12 初始化失败。

这说明不能只凭 Intel 核显工作正常，就认定 NVIDIA 图形链路也正常。双显卡笔记本尤其需要分别指定适配器测试。

# 9. 总结

本次问题的最终解决方案可以归纳为：

1. 使用 `glxinfo -B` 确认 OpenGL 是否正在使用 `llvmpipe`。
2. 确认 WSL、WSLg、`/dev/dxg` 和 Mesa D3D12 驱动文件正常存在。
3. 使用 Intel 核显进行对照，确认 WSLg 的 D3D12 硬件加速路径能够工作。
4. 发现原始 Mesa 21.2.6 下 Intel 可以加速，但 NVIDIA 无法正常初始化。
5. 添加 Kisak Turtle PPA，将 Mesa 相关图形组件升级到 25.0.7。
6. 使用 `wsl --shutdown` 重启 WSL。
7. 通过 `GALLIUM_DRIVER=d3d12` 和 `MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA` 指定 NVIDIA GPU。
8. 最终通过 `glxinfo -B` 确认 `Accelerated: yes`，且 OpenGL Renderer 为 `D3D12 (NVIDIA GeForce RTX 5060 Laptop GPU)`。

对于在 WSL2 中使用 ROS、RViz、Gazebo 和其他 OpenGL 应用的开发者，**不要只看图形界面能否打开，也不要只看 `nvidia-smi` 是否正常；应当通过 OpenGL Renderer 确认图形程序实际使用的渲染后端和 GPU。**

本次实测表明，在 Ubuntu 20.04 + ROS Noetic 环境中，通过升级 Mesa 相关组件，可以在不更换 Ubuntu 发行版、不安装 Linux 原生 NVIDIA 驱动的情况下，让 WSLg OpenGL 成功使用 NVIDIA RTX 5060 进行 D3D12 硬件加速。
