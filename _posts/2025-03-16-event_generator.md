---
layout: post
title: "实验笔记之——基于ESIM及Gazebo生成合成的事件数据"
date:   2025-03-16
tags: [Event-based Vision]
comments: true
author: kwanwaipang
toc: true
excerpt: "本博文记录了本人从图像数据集生成对应的事件相机数据的实验过程。" # 【核心：指定摘要分隔符】
---


<!-- * 目录
{:toc} -->


# 引言
{: #引言 }

本博文记录了采用[Super-SloMoe](https://github.com/avinashpaliwal/Super-SloMo)以及[ESIM](https://rpg.ifi.uzh.ch/docs/CORL18_Rebecq.pdf)来实现从已有图像数据中产生event数据。
这对于基于学习的方法在事件相机的应用具有重要意义，它可以提供大量的训练数据来训练模型。
本文是基于[rpg_vid2e](https://github.com/uzh-rpg/rpg_vid2e)项目的开发，并对代码做了一定的改进。
此外，还记录了采用Gazebo来仿真event camera的实验。

# 配置及测试
{: #配置及测试 }

首先，构建一个新的conda环境，然后安装所需的依赖项。

```bash
conda create --name vid2e python=3.9
conda activate vid2e
pip install -r requirements.txt
conda install pybind11 #此处不要安装matplotlib
#注意要指定一下pytorch的版本(按原版的实现会出错)
conda install pytorch==1.12.0 torchvision==0.13.0 torchaudio==0.12.0 cudatoolkit=11.3 -c pytorch

#删除已有环境
conda env list
conda remove --name vid2e --all

#遇到conda创建很慢
conda config --show #看看channels
conda config --show channels
conda config --remove channels conda-forge
```

然后安装ESIM_py版本

```bash
pip install esim_py/
pip install setuptools==69.5.1
pip install esim_torch/
```

测试是否安装成功

```bash
conda activate vid2e
python esim_py/tests/test.py
#如果报错GLIBCXX_3.4.30(这个应该是链接库有问题)
ln -sf /usr/lib/x86_64-linux-gnu/libstdc++.so.6 /home/gwp/miniconda3/envs/vid2e/lib/libstdc++.so.6
export LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libtiff.so.5
```

然后安装及测试esim_torch版本（注意服务器端直接用会报错，因为要可视化，因此采用ipynb）

```bash
pip install esim_torch/
python esim_torch/test/test.py

#采用ipynb,选择kernel为vide的，在服务器终端运行下面命令可以使得加载kernel会更快
pip install ipykernel
```

😀注意：关于错误“cannot import name 'mplDeprecation' from 'matplotlib._api.deprecation”。应该是在requirements就已经指定了pip install matplotlib==3.5.1，但是作者在conda install -y -c conda-forge pybind11 matplotlib又安装了一次。解决方案见下：

```bash
pip install -r requirements.txt --force-reinstall
#然后重启ipynb的kernel，在终端安装更快：pip install ipykernel
```

* 用ESIM生成event并用不同的event representation来可视化请见：[Link](https://github.com/KwanWaiPang/ESIM_comment/blob/main/esim_torch/test/evaluating_event_representation.ipynb)

进一步地，采用Adaptive Upsampling来上采样图像，然后再用图像来生成event数据。

下载图像插值upsampled的模型,在调用usampled代码的时候会自动加载这个模型来使用（详细请见代码）。PS：对于帧率较低图像数据（fps<60）都应该先采用上采样对原始的图片或视频数据进行插值。

```bash
#下载到当前目录
wget https://rpg.ifi.uzh.ch/data/VID2E/pretrained_models.zip
#解压
unzip pretrained_models.zip

device=cpu
# device=cuda:0
python upsampling/upsample.py --input_dir=example/original --output_dir=example/upsampled --device=$device
#输入的数据目录为example/original，输出数据目录为example/upsampled
```

* 用ipynb记录的upsampling+ESIM请见：[Link](https://github.com/KwanWaiPang/ESIM_comment/blob/main/upsample_esim.ipynb)

# 采用HKU数据集进行real-event data与sim-event data对比
{: #采用hku数据集进行real-event-data与sim-event-data对比 }

对于python环境中，如果没有预先安装ros，则需要先安装一下的ros的python库。

```bash
pip install --extra-index-url https://rospypi.github.io/simple/ rospy rosbag

pip install rosbag_pandas

pip install cv_bridge

pip install sensor_msgs --extra-index-url https://rospypi.github.io/simple/

pip install geometry_msgs --extra-index-url https://rospypi.github.io/simple
```

接下来通过3个ipynb文件来进行实验：

* 读入rosbag并可视化image及其对应的event：[Link](https://github.com/KwanWaiPang/ESIM_comment/blob/main/rosbag_reading/read_rosbag.ipynb)（这个主要用来熟悉如何用py及ipynb实现rosbag的读取及事件数据的可视化）
* 读入rosbag,然后将其中的10张图片生成event,同时与10张图片期间的真实的event进行可视化对比：[Link](https://github.com/KwanWaiPang/ESIM_comment/blob/main/rosbag_reading/generate_sim_event.ipynb)
* 在上面的基础上，改为先对10张图片进行上采样（learning model）然后再生成sim event：[Link](https://github.com/KwanWaiPang/ESIM_comment/blob/main/rosbag_reading/upsampled_generate_sim_event.ipynb)

总结实验效果如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/ESIM/realevent_vs_simevent.png" width="80%" />
<figcaption>  
真实的事件数据 VS 仿真的事件数据
</figcaption>
</div>

# 采用TartanAir生成event 数据集
{: #采用tartanair生成event-数据集 }

首先需要下载[TartanAir](https://theairlab.org/tartanair-dataset/)中所有的数据,采用工具链接[tartanair_tools](https://github.com/castacks/tartanair_tools)。

```bash
cd thirdparty/tartanair_tools/
pip install boto3 #需要安装依赖~
python download_training.py --output-dir ../../datasets --rgb --depth --only-left
```

然后采用下面的代码来实现把TartanAir的数据转换成event数据：

```bash
conda activate vid2e
#解压文件（此步骤可以省略，因为下面的convert_tartan.py文件已经实现了）
unzip filename.zip -d foldername
unzip datasets/abandonedfactory_Easy_image_left.zip -d datasets/TartanAir

#进行数据的转换，获取event
pip install hdf5plugin
python scripts/convert_tartan.py --dirsfile=datasets/converted.txt
```

关于convert_tartan.py的代码实现请见：[Code Link](https://github.com/KwanWaiPang/DEVO_comment/blob/main/scripts/convert_tartan.py)

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/image/000001_left.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim_event/0000000001.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-10fps/0000000001.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-25fps/0000000001.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/image/000100_left.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim_event/0000000100.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-10fps/0000000100.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-25fps/0000000100.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/image/000200_left.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim_event/0000000200.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-10fps/0000000200.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-25fps/0000000200.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/image/000300_left.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim_event/0000000300.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-10fps/0000000300.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-25fps/0000000300.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/image/000500_left.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim_event/0000000500.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-10fps/0000000500.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-25fps/0000000500.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/image/001000_left.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim_event/0000001000.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-10fps/0000001000.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-25fps/0000001000.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/image/001500_left.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim_event/0000001500.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-10fps/0000001500.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-25fps/0000001500.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/image/002000_left.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim_event/0000002000.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-10fps/0000002000.png" width="100%" />
      </td>
      <td style="width: 25%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/ESIM/sim-event-25fps/0000002000.png" width="100%" />
      </td>
    </tr>
  </table>
<figcaption>
  TartanAir中image与sim-event的可视化对比(右侧三栏为sim-event分别为upsample，或不upsample按10fps以及25fps帧率生成的)
</figcaption>
</div>

从实验效果可见，进行了上采样（约为1.2 X 10<sup>11</sup>）后并不见得得到更好的效果，因此在实际应用中需要根据具体的情况来选择是否进行上采样。
对于上采样的情况，可以理解为在原有的数据上进行了一定的插值，从而得到了更多的事件数据，进而让累计成一帧的事件量更加的丰富。
而实际上事件量（或者说一帧下的事件量）并没有如此之多。
至于采用10fps或25fps帧率产生的事件，应该仅仅受到ESIM代码中无事件响应时间的大小限制，两者的效果并没有太大的差异(分别为2.0 X 10<sup>10</sup>以及1.7 X 10<sup>10</sup>)。

### 采用多线程处理
{: #采用多线程处理 }

进一步地，通过多线程处理来加速数据的生成，具体的代码实现请见：[代码链接](https://github.com/KwanWaiPang/DEVO_comment/blob/main/scripts/process_training_data.py)。

同时，将原始的事件以`.h5`格式保存，以便后续的训练。
并将事件及图像数据以视频流的形式保存出来~

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/ESIM/multi_thread.png" width="80%" />
<figcaption>  
多线程处理实现在4个GPU上同时生成event
</figcaption>
</div>

<div class="evio-container">
<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="340" src="https://player.bilibili.com/player.html?isOutside=true&amp;aid=1105947886&amp;bvid=BV16w4m1e7u6&amp;cid=1601529818&amp;p=1" title="Bilibili video" width="600"></iframe>
<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="340" src="https://player.bilibili.com/player.html?isOutside=true&amp;aid=1855822529&amp;bvid=BV1Ss421T7Fv&amp;cid=1601529297&amp;p=1" title="Bilibili video" width="600"></iframe>
</div>

<div class="evio-container">
<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="340" src="https://player.bilibili.com/player.html?isOutside=true&amp;aid=1555929980&amp;bvid=BV191421r7zt&amp;cid=1601529992&amp;p=1" title="Bilibili video" width="600"></iframe>
<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="340" src="https://player.bilibili.com/player.html?isOutside=true&amp;aid=1355915805&amp;bvid=BV1Lz421z7zh&amp;cid=1601529319&amp;p=1" title="Bilibili video" width="600"></iframe>
</div>

# 采用Gazebo来仿真event camera
{: #采用gazebo来仿真event-camera }

<div align="center">
  <iframe src="https://player.bilibili.com/player.html?isOutside=true&aid=548105014&bvid=BV1nq4y1K7me&cid=410153146&p=1" width="600" height="340" frameborder="0" scrolling="no" allowfullscreen></iframe>
</div>

* 详细配置过程请见博客：[Link](https://blog.csdn.net/gwplovekimi/article/details/120347034)

# 参考资料
{: #参考资料 }

* 具体的实现代码请见链接[ESIM_comment](https://github.com/KwanWaiPang/ESIM_comment) and [DEVO_comment](https://github.com/KwanWaiPang/DEVO_comment).
* 采用pdb对python代码进行debug：[Link](https://blog.csdn.net/qq_43799400/article/details/122582895)
