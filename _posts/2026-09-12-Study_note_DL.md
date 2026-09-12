---
layout: post
title: "Study Note for Deep Learning"
date:   2026-09-12
tags: [Deep Learning]
comments: true
author: kwanwaipang
toc: true
excerpt: "本博文记录了本人学习 Coursera Deep Learning 专项课程的笔记与实验。"
---


<!-- * 目录
{:toc} -->


# 引言
{: #引言 }

在之前博客中已经较为系统的学习了Andrew Ng的Machine Learning，并且每个章节对应的实验也都做了。
本博客对课程《deep learning coursera》中的五个模块进行学习，同样的相关的笔记以及实验代码也会记录在这里~

# Foundation on Neural Network
{: #foundation-on-neural-network }

感觉这部分跟之前博客[《My study note of ML》](/Study_note_ML/)重复较多，但是当作重新复习一次了~

## Binary Classification（二分类）与Logistic Regression（逻辑回归）
{: #binary-classification（二分类）与logistic-regression（逻辑回归） }

分类问题分为二分类和多分类，二分类问题是指输出只有两个类别的问题，多分类问题是指输出有多个类别的问题。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250118172046.png" width="80%" />
<figcaption>  

</figcaption>
</div>

逻辑回归（Logistic Regression）可以理解为在线性回归的基础上加上了一个sigmoid函数，将线性回归的输出值映射到0-1之间，从而实现二分类问题的解决。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250118173457.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步地，训练逻辑回归模型的目标是最小化损失函数，进而获取最优的权重w和b，损失函数的定义如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250118174634.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而cost function for training the parameter的定义如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250118175630.png" width="80%" />
<figcaption>  

</figcaption>
</div>

通过梯度下降法（Gradient Descent）来最小化cost function，从而得到最优的参数w和b。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250118180013.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步地，通过下图可视化梯度下降法的过程，可以看到在每一次迭代中，cost function都在减小，最终收敛到最优解。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250118180522.png" width="80%" />
<figcaption>  

</figcaption>
</div>

## Computation Graph
{: #computation-graph }

接下来看看前向传播（Forward Propagation）和反向传播（Backward Propagation）的过程，这里引入了计算图（Computation Graph）的概念。
从左到右的计算可以计算出cost function的值，从右到左的计算可以计算出梯度值（导数）。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250118182940.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250118183012.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250119140310.png" width="80%" />
<figcaption>  

</figcaption>
</div>

接下来看看逻辑回归的计算图，同样的，从左到右的计算可以计算出cost function的值，从右到左的计算可以计算出梯度值（导数）。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250119143313.png" width="80%" />
<figcaption>  

</figcaption>
</div>

## Vectorization
{: #vectorization }

通过向量化来简化代码以及提高运算速度。而所谓的向量化其实也就是把权重和输入以矩阵的形式写出，并通过矩阵运算来实现。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250119144556.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250119144931.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而之所以python对于向量化的支持较好，是因为python中的boardcasting机制，可以使得不同维度的矩阵进行运算。
但同时会引入一些难以发现的bug，比如矩阵维度不匹配却不报错。因此首先尽可能的把数据都以矩阵的形式写出，然后再进行运算。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/WX20250123-095139@2x.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步的，也可以通过assert再次检查矩阵的维度是否匹配，从而避免一些潜在的bug。

## 基于逻辑回归实现图片分类任务
{: #基于逻辑回归实现图片分类任务 }

* [代码链接](https://github.com/KwanWaiPang/draw_figure/blob/main/C1%20-%20Neural%20Networks%20and%20Deep%20Learning/Logistic%20Regression%20as%20a%20Neural%20Network.ipynb)

## 神经网络
{: #神经网络 }

直观来说，可以通过多个sigmoid函数的堆叠实现神经网络，之前也曾尝试过用逻辑回归实现神经网络的代码测试。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/WX20250123-112240@2x.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/WX20250123-114914@2x.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/WX20250123-115430@2x.png" width="80%" />
<figcaption>  

</figcaption>
</div>

## activation function
{: #activation-function }

一般用relu函数或者tanh函数作为激活函数，因为sigmoid函数在深度神经网络中会出现梯度消失的问题。因此一般在二分类的最后一层（输出层）使用sigmoid函数，其他层使用relu或其他激活函数

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/WX20250124-114735@2x.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/WX20250124-115142@2x.png" width="80%" />
<figcaption>  

</figcaption>
</div>

## 基于神经网络的梯度下降（backpropagation）
{: #基于神经网络的梯度下降（backpropagation） }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/WX20250124-122840@2x.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/WX20250124-124622@2x.png" width="80%" />
<figcaption>  

</figcaption>
</div>

## 神经网络的初始化
{: #神经网络的初始化 }

一般初始化习惯采用很小的值，这主要是对于sigmoid以及tanh函数来说，小的值的时候斜率（梯度）较大。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/WX20250124-125707@2x.png" width="80%" />
<figcaption>  

</figcaption>
</div>

## 手写实现神经网络（非调用库函数）
{: #手写实现神经网络（非调用库函数） }

* [神经网络实现平面数据分类](https://github.com/KwanWaiPang/draw_figure/blob/main/C1%20-%20Neural%20Networks%20and%20Deep%20Learning/Planar%20data%20classification%20with%20onehidden%20layer.ipynb)

# Improving Deep Neural Network
{: #improving-deep-neural-network }

# Structuring Machine Learning Projects
{: #structuring-machine-learning-projects }

# Convolutional Neural Networks
{: #convolutional-neural-networks }

# Natural Language Processing with sequence models
{: #natural-language-processing-with-sequence-models }

# 参考资料
{: #参考资料 }

* [My study note of ML](/Study_note_ML/)
* [coursera-deep-learning-specialization](https://github.com/amanchadha/coursera-deep-learning-specialization)
* [deep learning 深度学习专项 1/5 吴恩达 DeepLearning.AI](https://www.bilibili.com/video/BV1bs4y1F7Jg/?spm_id_from=333.999.0.0&vd_source=a88e426798937812a8ffc1a9be5a3cb7)
* [deep learning 深度学习专项 2/5 吴恩达 DeepLearning.AI](https://www.bilibili.com/video/BV1fF41197vz/?spm_id_from=333.999.0.0&vd_source=a88e426798937812a8ffc1a9be5a3cb7)
* [deep learning 深度学习专项 3/5 吴恩达 DeepLearning.AI](https://www.bilibili.com/video/BV1uP411e7iW/?spm_id_from=333.999.0.0&vd_source=a88e426798937812a8ffc1a9be5a3cb7)
* [deep learning 深度学习专项 4/5 吴恩达 DeepLearning.AI](https://www.bilibili.com/video/BV1qP411e7GJ/?spm_id_from=333.999.0.0&vd_source=a88e426798937812a8ffc1a9be5a3cb7)
* [deep learning 深度学习专项 5/5 吴恩达 DeepLearning.AI](https://www.bilibili.com/video/BV1Th411A738/?spm_id_from=333.999.0.0&vd_source=a88e426798937812a8ffc1a9be5a3cb7)
* [deep learning- 吴恩达（Andrew Ng）](https://www.youtube.com/playlist?list=PLM5hlczGTln79kN5Z_8J_s20k5-vRbKpE)
* [Stanford CS230: Deep Learning | Autumn 2018](https://www.youtube.com/playlist?list=PLoROMvodv4rOABXSygHTsbvUz4G_YQhOb)
