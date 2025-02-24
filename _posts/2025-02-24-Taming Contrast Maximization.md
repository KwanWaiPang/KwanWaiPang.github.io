---
layout: post
title: "实验笔记之——Contrast Maximization for Learning Sequential Event-based Optical Flow"
date:   2025-02-24
tags: [Event-based Vision, Deep Learning]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
本博文对论文《Taming contrast maximization for learning sequential, low-latency, event-based optical flow (CVPR2023)》进行复现实验。

* [paper link](https://arxiv.org/pdf/2303.05214)
* [Github Page](https://github.com/tudelft/taming_event_flow)
* [博客](https://kwanwaipang.github.io/Awesome-Event-based-Contrast-Maximization/)对Event camera领域的Contrast-Maximization作了深入的介绍
* 此博客复现用的代码及后续注释代码：[taming_event_flow_comment](https://github.com/KwanWaiPang/taming_event_flow_comment)


# 配置

* 原版采用pyenv来管理python虚拟环境的，此处改为conda

```bash

conda create -n taming_event_flow python=3.10.11
# conda remove --name taming_event_flow --all
conda activate taming_event_flow

# 安装系列依赖
pip install -r requirements.txt

# pip install qtconsole
```

# 数据的下载

* 数据链接：[here](https://1drv.ms/u/s!Ah0kx0CRKrAZjxMxBx4z5HN1CjWv?e=UiayaL) 并且将数据下载到 `/datasets/`文件夹内（在文件夹内下载然后解压~）.
* 用OneDrive下载数据到服务器可以参考：[Link](https://kwanwaipang.github.io/File/Blogs/Poster/ubuntu%E5%91%BD%E4%BB%A4%E8%A1%8C%E4%B8%8B%E8%BD%BD%E6%95%B0%E6%8D%AE.html#onedrive)

# 预训练模型的下载
* 预训练模型：[here](https://1drv.ms/u/s!Ah0kx0CRKrAZjxSwx8-UTUAncgg3?e=yM2g0i), 并放在文件夹 `mlruns/`（下载后直接解压即可）.

# 采用MLflow来可视化

```bash
conda activate taming_event_flow
mlflow ui
```

然后本地网页打开`http://127.0.0.1:5000`即可看到界面如下

<div align="center">
  <img src="https://github.com/KwanWaiPang/taming_event_flow_comment/raw/main/results/Figs/微信截图_20250224134337.png" width="60%" />
<figcaption>  
</figcaption>
</div>

而将下载的模型解压后，则可视化如下：

<div align="center">
  <img src="https://github.com/KwanWaiPang/taming_event_flow_comment/raw/main/results/Figs/微信截图_20250224140420.png" width="60%" />
<figcaption>  
可以看到加载了mvsec以及dsec两个模型
</figcaption>
</div>


# Inference
* 注意需要修改`config/eval_flow.yml`文件中的数据路径等参数

## 运行测试MVSEC

```bash
conda activate taming_event_flow
python eval_flow.py mvsec_model --config configs/eval_mvsec.yml
```
初始运行可能存在下面的报错
```bash
model_loaded = torch.load(model_dir, map_location=device).state_dict()
  File "/home/gwp/miniconda3/envs/taming_event_flow/lib/python3.10/site-packages/torch/serialization.py", line 1470, in load
    raise pickle.UnpicklingError(_get_wo_message(str(e))) from None
_pickle.UnpicklingError: Weights only load failed. This file can still be loaded, to do so you have two options, do those steps only if you trust the source of the checkpoint. 
        (1) In PyTorch 2.6, we changed the default value of the `weights_only` argument in `torch.load` from `False` to `True`. Re-running `torch.load` with `weights_only` set to `False` will likely succeed, but it can result in arbitrary code execution. Do it only if you got the file from a trusted source.
        (2) Alternatively, to load with `weights_only=True` please check the recommended steps in the following error message.
        WeightsUnpickler error: Unsupported global: GLOBAL models.model.RecEVFlowNet was not an allowed global by default. Please use `torch.serialization.add_safe_globals([RecEVFlowNet])` or the `torch.serialization.safe_globals([RecEVFlowNet])` context manager to allowlist this global if you trust this class/function.

Check the documentation of torch.load to learn more about types accepted by default with weights_only https://pytorch.org/docs/stable/generated/torch.load.html.
```
解决方法则是修改`utils/utils.py`中的代码为下面即可
```python
# model_loaded = torch.load(model_dir, map_location=device).state_dict()
model_loaded = torch.load(model_dir, map_location=device, weights_only=False).state_dict()
```

之后又遇到报错需要用MobaXterm才可以可视化运行，但会遇到下面错误
```bash
/home/gwp/miniconda3/envs/taming_event_flow/lib/python3.10/site-packages/torch/functional.py:539: UserWarning: torch.meshgrid: in an upcoming release, it will be required to pass the indexing argument. (Triggered internally at /pytorch/aten/src/ATen/native/TensorShape.cpp:3637.)
  return _VF.meshgrid(tensors, **kwargs)  # type: ignore[attr-defined]
test.h5 |                                | 0.1%, ETA: 5556s, 0.163452HzASSERT: "false" in file qasciikey.cpp, line 501
Aborted (core dumped)
```
网上资料说的是`A workaround in MobaXterm is to uncheck "Unix-compatible keyboard" in X11 settings.`

进入软件左上角找到settings->configuration->X11，去除Unix-compatible keyboard前面的选项（不能勾选它）
<div align="center">
  <img src="https://github.com/KwanWaiPang/taming_event_flow_comment/raw/main/results/Figs/微信截图_20250224143156.png" width="60%" />
<figcaption>  
</figcaption>
</div>
即可~

视频效果如下：
* 测试mvsec outdoor driving；PS: 视频中依次为：输入的事件，GT光流（Lidar），IWE，估算的光流，AEE（暂时还未知是什么）

<div align="center">
  <img src="https://github.com/KwanWaiPang/taming_event_flow_comment/raw/main/results/Figs/微信截图_20250224144908.png" width="80%" />
<figcaption>  
</figcaption>
</div>

<div align="center">
<iframe width="80%" height="400" src="//player.bilibili.com/player.html?isOutside=true&aid=114057554168121&bvid=BV113PsejEpK&cid=28551349330&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

* 测试mvsec indoor flying 数据集

<div align="center">
  <img src="https://github.com/KwanWaiPang/taming_event_flow_comment/raw/main/results/Figs/微信截图_20250224165828.png" width="80%" />
<figcaption>  
同时运行多个数据集的话可能不保存数值结果。。。。
</figcaption>
</div>

indoor\_flying\_1:

<div align="center">
<iframe width="80%" height="400" src="//player.bilibili.com/player.html?isOutside=true&aid=114058124659217&bvid=BV1tsPWeUEtr&cid=28553514667&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

indoor\_flying\_2:

<div align="center">
<iframe width="80%" height="400" src="//player.bilibili.com/player.html?isOutside=true&aid=114058124657432&bvid=BV1bsPWeUEu7&cid=28553514272&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

indoor\_flying\_3:

<div align="center">
<iframe width="80%" height="400" src="//player.bilibili.com/player.html?isOutside=true&aid=114058124591414&bvid=BV1MsPWeUEaL&cid=28553577623&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

关于在mvsec上的测试，值得一提的是，作者在论文中提到`we decided to transfer one of our models trained on DSEC-Flow to MVSEC.`也就是说网络是在DSEC上训练的，迁移到MVSEC上测试（可见还是有不错的泛化能力的）。
论文中的结果如下图所示：

<div align="center">
  <img src="https://github.com/KwanWaiPang/taming_event_flow_comment/raw/main/results/Figs/微信截图_20250224165926.png" width="80%" />
<figcaption>  
</figcaption>
</div>

## 运行测试DSEC
```
conda activate taming_event_flow
python eval_flow.py dsec_model --config configs/eval_dsec.yml
```



