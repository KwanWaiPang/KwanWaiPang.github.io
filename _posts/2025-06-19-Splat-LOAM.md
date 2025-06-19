---
layout: post
title: "论文阅读笔记之——《Splat-LOAM: Gaussian Splatting LiDAR Odometry and Mapping》"
date:   2025-06-19
tags: [SLAM]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言





# 实验测试

## 安装配置

* 可以采用作者提供的Docker或者Pixi，不过此处采用conda配置：

```sh
git clone --recursive https://github.com/R-C-Group/Splat-LOAM.git

# rm -rf .git

conda env create -f environment.yaml # for A100 with CUDA12.2/12.1
# # conda remove --name Splat-LOAM --all
conda activate Splat-LOAM
# bash post_install.sh

# 安装第一个模块
pip install ./submodules/diff-surfel-spherical-rasterization/

# 安装第二个模块
pip install ./submodules/gsaligner/

# 安装第三个模块
pip install ./submodules/simple-knn/
```

## 实验测试

* `configs`文件中含有运行所需要的配置
* 运行代码（注意要修改数据的路径,同时下载[kitti](https://www.cvlibs.net/datasets/kitti/eval_odometry.php)数据）

```sh
python3 run.py slam <path/to/config.yaml>

conda activate Splat-LOAM
python3 run.py slam configs/kitti/kitti-00-odom.yaml
```

* 注意，上述需要在`sequences/00`内还要有times.txt文件，故此需要下载图像帧
* 下面是成功运行的截图：

<div align="center">
  <img src="https://github.com/R-C-Group/Splat-LOAM/raw/main/Fig/微信截图_20250618211049.png" width="80%" />
<figcaption>  
</figcaption>
</div>

>[!TIP]
>If you want to solve `Mapping-only`, provide a trajectory in `data.trajectory_reader.filename`, set tracking to use it with `tracking.method=gt` and enable skipping of clouds that have no associated pose with `data.skip_clouds_wno_sync=true`

* 运行后提醒打开浏览器`http://127.0.0.1:9876/`,但是加载好久都加载不出来（改为MobaXterm即可）

<div align="center">
  <img src="https://github.com/R-C-Group/Splat-LOAM/raw/main/Fig/微信截图_20250618214610.png" width="80%" />
<figcaption>  
</figcaption>
</div>

* 若`output.folder`没有设置，实验结果会保存在 `results/<date_of_the_experiment>/`文件中(但实际运行中会遇到没有results导致跑了几个小时后没法保存模型...)

<div align="center">
  <img src="https://github.com/R-C-Group/Splat-LOAM/raw/main/Fig/微信截图_20250619161850.png" width="80%" />
<figcaption>  
</figcaption>
</div>

* 运行完SLAM后(运行的时间应该要好几个小时)，接下来可以基于SLAM的结果来生成mesh：

```sh
python3 run.py mesh <path/to/result/folder>
# conda activate Splat-LOAM
# python3 run.py mesh /home/gwp/Splat-LOAM/results/2025-06-19_09-40-53
```

<div align="center">
  <img src="https://github.com/R-C-Group/Splat-LOAM/raw/main/Fig/微信截图_20250619162246.png" width="80%" />
<figcaption>  
</figcaption>
</div>

<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

<model-viewer
  src="https://r-c-group.github.io/blog_media/Splat-LOAM/2025-06-19_16-22-19.ply" 
  alt="3D Model"
  ar
  auto-rotate
  camera-controls
  style="display: block; width: 100%; height: 500px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); overflow: hidden;"
></model-viewer>

* 为了验证所计算的mesh以及odometry，运行下面命令:

```sh
python3 run.py eval_recon <reference_pointcloud_file> <estimate_mesh> 

python3 run.py eval_odom <path/to/odom/estimate> \
                          --reference-filename <path/to/reference/trajectory> \
                          --reference-format <tum|kitti|vilens> \
                          --estimate-format <tum|kitti|vilens> \
```