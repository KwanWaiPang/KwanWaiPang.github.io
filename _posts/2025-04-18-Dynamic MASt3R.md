---
layout: post
title: "实验笔记之——动态场景下MASt3R及MASt3R-SLAM的测试"
date:   2025-04-18
tags: [SLAM,Deep Learning]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言

之前博客（[Easi3R](https://kwanwaipang.github.io/Easi3R/),[MonST3R](https://kwanwaipang.github.io/MonST3R/)）复现了基于Transformer（主要以DUSt3R为主）的SLAM系统在动态场景下的4D重建。

本博文实测一些动态序列对于MASt3R以及MASt3R-SLAM的性能影响。

本博文仅为本人学习记录用~


相关的资料：
* MASt3R的复现：[blog](https://kwanwaipang.github.io/File/Blogs/Poster/MASt3R-SLAM.html#mast3r%E5%AE%9E%E9%AA%8C%E6%B5%8B%E8%AF%95)
* MASt3R-SLAM的复现：[blog](https://kwanwaipang.github.io/MASt3R-SLAM/)
* Survey for Transformer-based SLAM：[Paper List](https://github.com/KwanWaiPang/Awesome-Transformer-based-SLAM) and [Blog](https://kwanwaipang.github.io/Transformer_SLAM/)
* 博客：[What is Transformer? Form NLP to CV](https://kwanwaipang.github.io/Transformer/)
* Survey for Dynamic SLAM: [blog](https://kwanwaipang.github.io/Dynamic-SLAM/)


# MASt3R in Dynamic Scene

* 使用的代码见[MASt3R_comment](https://github.com/KwanWaiPang/MASt3R_comment)的[a100分支](https://github.com/KwanWaiPang/MASt3R_comment/tree/a100)

## 安装配置

```bash
#下载代码链接，并切换分支a100
git clone --recursive git@github.com:KwanWaiPang/MASt3R_comment.git
# rm -rf .git

```

* 创建环境：

```bash
conda create -n mast3r python=3.11 cmake=3.14.0
conda activate mast3r 
# conda remove --name mast3r --all

conda install pytorch torchvision pytorch-cuda=12.1 -c pytorch -c nvidia  # use the correct version of cuda for your system A100中采用的为cuda12.2
pip install -r requirements.txt
pip install -r dust3r/requirements.txt
# Optional: you can also install additional packages to:
# - add support for HEIC images
# - add required packages for visloc.py
pip install -r dust3r/requirements_optional.txt

```

* 安装ASMK

```bash
pip install cython

git clone https://github.com/jenicek/asmk
cd asmk/cython/
cythonize *.pyx
cd ..
python3 setup.py build_ext --inplace
cd ..
```

* 安装RoPE 

```bash
# DUST3R relies on RoPE positional embeddings for which you can compile some cuda kernels for faster runtime.
cd dust3r/croco/models/curope/
python setup.py build_ext --inplace
cd ../../../../
```

* 下载模型

```bash
mkdir -p checkpoints/
wget https://download.europe.naverlabs.com/ComputerVision/MASt3R/MASt3R_ViTLarge_BaseDecoder_512_catmlpdpt_metric.pth -P checkpoints/
```

## 运行测试

```bash
conda activate mast3r 
conda install faiss-gpu
# python3 demo.py --model_name MASt3R_ViTLarge_BaseDecoder_512_catmlpdpt_metric
CUDA_VISIBLE_DEVICES=0 python3 demo.py --model_name MASt3R_ViTLarge_BaseDecoder_512_catmlpdpt_metric
# vscode终端运行上面命令后，本机网页打开（采用的是网页UI）

# Use --weights to load a checkpoint from a local file, eg --weights checkpoints/MASt3R_ViTLarge_BaseDecoder_512_catmlpdpt_metric.pth
# Use --retrieval_model and point to the retrieval checkpoint (*trainingfree.pth) to enable retrieval as a pairing strategy, asmk must be installed
# Use --local_network to make it accessible on the local network, or --server_name to specify the url manually
# Use --server_port to change the port, by default it will search for an available port starting at 7860
# Use --device to use a different device, by default it's "cuda"

demo_dust3r_ga.py is the same demo as in dust3r (+ compatibility for MASt3R models)
see https://github.com/naver/dust3r?tab=readme-ov-file#interactive-demo for details

```

* 采用lady-running数据（应该是只能上传图片而非视频）

<div align="center">
<video playsinline autoplay loop muted src="https://kwanwaipang.github.io/ubuntu_md_blog/MonST3R/lady-running.mp4" poster="https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif" alt="sym" width="80%" style="padding-top:0px;padding-bottom:0px;border-radius:15px;"></video>
</div>

其效果如下：

<!-- 定义全局样式 -->

<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

<model-viewer
  src="https://r-c-group.github.io/blog_media/MASt3R/tmp7r_c0zb0_scene.glb" 
  alt="3D Model"
  ar
  auto-rotate
  camera-controls
  style="display: block; width: 100%; height: 500px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); overflow: hidden;"
></model-viewer>

通过可视化的点云来看，个人觉得其实效果没有很差，只是没有把动态点云检测出来

* 下面通过代码[link](https://github.com/KwanWaiPang/MASt3R_comment/blob/a100/matching.ipynb)来测试匹配的效果

```bash
conda activate mast3r 
pip install ipykernel 
```

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/MASt3R_comment/raw/a100/assets/output0_1.png" width="100%" />
        frame0 与 frame1 的匹配效果
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://github.com/KwanWaiPang/MASt3R_comment/raw/a100/assets/output0_30.png" width="100%" />
        frame0 与 frame30 的匹配效果
      </td>
    </tr>
  </table>
  <figcaption>
  </figcaption>
</div>

<div align="center">
  <img src="https://github.com/KwanWaiPang/MASt3R_comment/raw/a100/assets/output28_30.png" width="80%" />
<figcaption>  
frame28 与 frame30 的匹配效果
</figcaption>
</div>
从图中的效果分析，虽然移动的物体在跨度大的时候会导致误匹配，但是对于增量式SLAM而言，相邻两帧的误匹配是较少的~

至于测试有宠物奔跑的场景发现，MASt3R倾向于将静态部分的信息保留下来~

<div align="center">
  <img src="https://github.com/KwanWaiPang/Easi3R/raw/main/assert/dog-gooses_depth_maps.gif" width="60%" />
<figcaption> 
dog-gooses
</figcaption>
</div>
        
<div align="center">
  <img src="../images/微信截图_20250418151257.png" width="80%" />
<figcaption> 
</figcaption>
</div>


# MASt3R-SLAM in Dynamic Scene

* 使用的代码请见[MASt3R-SLAM_comment](https://github.com/KwanWaiPang/MASt3R-SLAM_comment),采用[comment](https://github.com/KwanWaiPang/MASt3R-SLAM_comment/tree/main)分支
* 在MobaXterm中运行以下代码：

```bash
cd MASt3R-SLAM
conda activate mast3r-slam

pip install plyfile

# 直接采用py脚本运行不带标定参数的
CUDA_VISIBLE_DEVICES=0 python main.py --dataset /home/gwp/monst3r/demo_data/lady-running/ --config config/base.yaml

CUDA_VISIBLE_DEVICES=0 python main.py --dataset /home/gwp/monst3r/demo_data/lady-running.mp4 --config config/base.yaml
```

从下面看似乎效果没有受到明显的影响
<div align="center">
  <img src="../images/微信截图_20250418141239.png" width="80%" />
<figcaption>  
</figcaption>
</div>

<div align="center">
<video playsinline autoplay loop muted src="https://r-c-group.github.io/blog_media/MASt3R-SLAM/123456.mp4" poster="https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif" alt="sym" width="80%" style="padding-top:0px;padding-bottom:0px;border-radius:15px;"></video>
</div>

* 接下来下载TUM-RGBD带有Dynamic Objects的数据集[bash](https://github.com/KwanWaiPang/MASt3R-SLAM_comment/blob/comment/scripts/download_tum_dynamic.sh)

```bash
bash ./scripts/download_tum_dynamic.sh


cd MASt3R-SLAM
conda activate mast3r-slam
CUDA_VISIBLE_DEVICES=1 python main.py --dataset datasets/tum_Dynamic_Objects/rgbd_dataset_freiburg2_desk_with_person/ --config config/calib.yaml

CUDA_VISIBLE_DEVICES=1 python main.py --dataset datasets/tum_Dynamic_Objects/rgbd_dataset_freiburg3_sitting_static/ --config config/calib.yaml

CUDA_VISIBLE_DEVICES=1 python main.py --dataset datasets/tum_Dynamic_Objects/rgbd_dataset_freiburg3_sitting_xyz/ --config config/calib.yaml

CUDA_VISIBLE_DEVICES=1 python main.py --dataset datasets/tum_Dynamic_Objects/rgbd_dataset_freiburg3_sitting_halfsphere/ --config config/calib.yaml

CUDA_VISIBLE_DEVICES=1 python main.py --dataset datasets/tum_Dynamic_Objects/rgbd_dataset_freiburg3_sitting_rpy/ --config config/calib.yaml

CUDA_VISIBLE_DEVICES=1 python main.py --dataset datasets/tum_Dynamic_Objects/rgbd_dataset_freiburg3_walking_static/ --config config/calib.yaml

CUDA_VISIBLE_DEVICES=1 python main.py --dataset datasets/tum_Dynamic_Objects/rgbd_dataset_freiburg3_walking_xyz/ --config config/calib.yaml

CUDA_VISIBLE_DEVICES=1 python main.py --dataset datasets/tum_Dynamic_Objects/rgbd_dataset_freiburg3_walking_halfsphere/ --config config/calib.yaml


CUDA_VISIBLE_DEVICES=1 python main.py --dataset datasets/tum_Dynamic_Objects/rgbd_dataset_freiburg3_walking_rpy/ --config config/calib.yaml


#下面是验证精度的
bash ./scripts/eval_tum.sh --no-calib
```


<div align="center">
  <img src="../images/微信截图_20250418150551.png" width="80%" />
<figcaption> 
rgbd_dataset_freiburg2_desk_with_person 
</figcaption>
</div>

