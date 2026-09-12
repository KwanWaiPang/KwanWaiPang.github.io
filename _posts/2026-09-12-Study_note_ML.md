---
layout: post
title: "Study Note for Machine Learning"
date:   2026-09-12
tags: [Deep Learning]
comments: true
author: kwanwaipang
toc: true
excerpt: "本博文记录了本人重新复习 Machine Learning 基础知识的笔记与实验。"
---


<!-- * 目录
{:toc} -->


# 前言
{: #前言 }

Geoffery Hinton 也曾经说过“AI 质疑者一错再错，未来还会继续被打脸”。而最近，我确实深深感受到了自己被打脸了🫢，因为原本也是认为AI是一个噱头而已。
在18~19年的时候，我在中科院的MML待了一年多，当时主要的topic是deep learning in super resolution。当时我接触的项目、阅读的所谓"三大"顶会的论文给我的感觉是虽然performance一直在刷，但好像并不能实用（虽然现在大部分的paper也都是如此）。而后来，我开始从事event-based vision的工作，也是大量的deep learning-based 的方法，一般我看到用learning-based的方法arvix论文都会直接跳过😂。
但随着我在robotic领域的研究，特别是event-based SLAM在传统方法上遇到了瓶颈转而用learning-based framework取得重大进展，以及特斯拉的FSD end-to-end 的vision-to-autonomous driving的突破，我开始重新思考AI的价值。
而回过头来发现之前在learning领域的积累几乎全部忘光光了，为此以本博客作为一个学习的笔记，重新复习以及学习一下AI的基础知识。

# Machine Learning
{: #machine-learning }

## Supervised Learning
{: #supervised-learning }

一些经典的Supervised Learning的例子,如下图。简单而言就是给定一些数据，然后给定一些label，然后让机器学习这个数据和label之间的关系，然后预测未知数据的label。
Supervised Learning可以分为两类：Classification和Regression。Classification是预测数据的label是离散的（分类），而Regression是预测数据的label是连续的（回归，拟合曲线，预测数值）。
回归一般是预测数字，可能有无穷多个值，而分类是预测类别，一般是有限个值。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241223164101.png" width="80%" />
<figcaption>  

</figcaption>
</div>

### Linear Regression Model (线性回归模型)
{: #linear-regression-model-线性回归模型 }

接下来通过实现一个线性回归模型来预测房价，来更好地理解Supervised Learning的基本原理。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241224162049.png" width="80%" />
<figcaption>  

</figcaption>
</div>

流程可以总结如下图

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241224163407.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而对于不同的方法其实关键就是f不一样，比如线性回归，那么可以定义为线性方程
`f(x)=wx+b`
不同的w与b有不同的表现，如下图

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241224203244.png" width="80%" />
<figcaption>  

</figcaption>
</div>

监督学习中，通过cost function不停更新迭代，优化w和b，使得f(x)/“y-hat”尽可能接近真实的y，也就是优化的目标（误差最小）。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241224203858.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### Cost Function的直观理解
{: #cost-function的直观理解 }

对于只有一个w参数的时候，cost function的图像如下，可以看到cost function是一个凸函数，只有一个最小值点。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241224204301.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而对于有两个参数的时候，cost function如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241224204400.png" width="80%" />
<figcaption>  
这是一个convex function
</figcaption>
</div>

#### gradient descent(梯度下降)
{: #gradient-descent-梯度下降 }

梯度下降是一个用来求函数最小值的算法。在机器学习中，我们使用梯度下降来最小化cost function。梯度下降的基本思想是：从一个随机的w和b开始，然后不断迭代更新w和b，使得cost function最小化。公式化表达如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241224214749.png" width="80%" />
<figcaption>  

</figcaption>
</div>

直观理解梯度下降法，如下图所示。从不同的点开始，可能进入不同的局部最小值点。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241225165743.png" width="80%" />
<figcaption>  

</figcaption>
</div>

公式表达如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241225172045.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而所谓的局部最小值，可以理解为w和b不再进一步更新了。接下来通过一维的角度来直观理解learning rate和derivative（应该是partial derivative，偏导）。
首先是偏导数，可以理解为函数在某一点的斜率，也就是函数在这一点的变化率。根据偏导数的符号决定更新的方向，如下图所示。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241225173728.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而learning rate可以理解为每次迭代的步长，也就是w和b更新的幅度。
如果学习率太小，那么收敛速度会很慢；而如果学习率太大，那么可能会错过最小值点（Overshoot or even diverge, 出现抖动但无法收敛的情况）。

对于固定的学习率，会伴随着Derivative变小，update step也变小，最终到达local minimum。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229154505.png" width="80%" />
<figcaption>  
学习率对于收敛效果的影响
</figcaption>
</div>

一般如果遇到cost 不下降或者下降方式有问题可以先通过设置较小的学习率，看loss是否下降，如果下降，那么就是学习率太大导致的，但如果还是不下降，那么可能是代码有其他bug。

#### Gradient Descent for Linear Regression
{: #gradient-descent-for-linear-regression }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241226220225.png" width="80%" />
<figcaption>  

</figcaption>
</div>

上述偏微分的详细推导如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241227161240.png" width="80%" />
<figcaption>  

</figcaption>
</div>

"Batch" gradient descent是指每次更新w和b都是基于(使用)所有的数据。

#### 多变量线性回归(Linear Regression with Multiple Variables)
{: #多变量线性回归-linear-regression-with-multiple-variables }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241227184352.png" width="80%" />
<figcaption>  

</figcaption>
</div>

对应的线性回归模型可以表达如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241227195619.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步用矩阵/向量的形式表征如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241228183954.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### Vectorization(向量化) for Coding
{: #vectorization-向量化-for-coding }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241228222200.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229105608.png" width="80%" />
<figcaption>  
梯度下降计算向量化
</figcaption>
</div>

更进一步的，把x添加一个维度，全为1，这样就可以把b也合并到w中，从而可以进一步简化代码。
向量化可以大大提高代码的运行速度，因为不需要循环，而是直接用矩阵运算（在代码的底层可以理解为并行运算）。

#### Feature Scaling（特征缩放）
{: #feature-scaling（特征缩放） }

在我们面对多维特征问题的时候，我们要保证这些特征都具有相近的尺度，这将帮助梯度下降算法更快地收敛。
解决的方法是尝试将所有特征的尺度都尽量缩放到-1到1之间。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229114449.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### Polynomial Regression（多项式回归）
{: #polynomial-regression（多项式回归） }

有时候，线性回归并不能很好地拟合数据，这时候可以考虑多项式回归。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229155828.png" width="80%" />
<figcaption>  
当然除了用平方根以外，还可以用根号
</figcaption>
</div>

注意，多项式回归的特征缩放会更加重要，因为不同的特征的尺度差异会更大。

#### 线性回归代码实现
{: #线性回归代码实现 }

详细请见:

* [手写实现线性回归的代码](https://github.com/KwanWaiPang/draw_figure/blob/main/1.%20Linear%20Regreesion/code.ipynb)

* [scikit-learn线性回归的代码](https://github.com/KwanWaiPang/draw_figure/blob/main/1.%20Linear%20Regreesion/scikit-learn.ipynb)

### Logistic Regression（逻辑回归）
{: #logistic-regression（逻辑回归） }

上一节的线性回归是用来预测连续值的（回归问题），而逻辑回归是用来预测离散值的，也就是分类问题（Classification）。
而分类问题又可以分为二分类（Binary Classification）和多分类（Multiclass Classification）。
而逻辑回归函数表达如下图所示

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229163109.png" width="80%" />
<figcaption>  
从数学上来看就是线性回归+一个sigmoid函数
</figcaption>
</div>

#### Decision Boundary（决策边界）
{: #decision-boundary（决策边界） }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229170555.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229170838.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 逻辑回归的cost function
{: #逻辑回归的cost-function }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229171713.png" width="80%" />
<figcaption>  
线性回归中的Squared error cost不适用于逻辑回归，因为代入方程会发现它是非凸函数，会有很多局部最小值。
</figcaption>
</div>

为了让cost function是凸函数，可以用如下的cost function

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229202338.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229201922.png" width="80%" />
<figcaption>  

</figcaption>
</div>

由于y只有y=1和y=0两种情况，因此简化loss function还是比较直接的（更上图下方的公式基本一样的，只是换数学符号表示而已~）：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229204136.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### Training Logistic Regression with Gradient Descent
{: #training-logistic-regression-with-gradient-descent }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229221335.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241229221610.png" width="80%" />
<figcaption>  
跟线性回归的推导是结论是一样的，只是cost function不一样而已~

但注意函数f也是不一样的！
</figcaption>
</div>

#### 逻辑回归代码实现
{: #逻辑回归代码实现 }

详细请见:

* [逻辑规划判断学生成绩是否被录用](https://github.com/KwanWaiPang/draw_figure/blob/main/2.Logistic%20Regression/code.ipynb)

* [正则化逻辑规划决定是否芯片要被接受或抛弃(同时采用scikit-learn来解题)](https://github.com/KwanWaiPang/draw_figure/blob/main/2.Logistic%20Regression/Regulation.ipynb)

### 过拟合与正则化（Overfitting and Regularization）
{: #过拟合与正则化（overfitting-and-regularization） }

欠拟合与过拟合是机器学习中常见的问题，欠拟合是模型过于简单，无法很好地拟合数据，而过拟合是模型过于复杂，过度拟合了训练数据，导致在测试数据上表现不佳。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230100027.png" width="80%" />
<figcaption>  

</figcaption>
</div>

解决过拟合的方法：

* 增加训练样本，但是获取更多的训练数据一般是很难的

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230134901.png" width="80%" />
<figcaption>  

</figcaption>
</div>

* 进一步筛选特征

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230135131.png" width="80%" />
<figcaption>  

</figcaption>
</div>

* 正则化（Regularization）：去掉某些特征可以看作是把对应的特征的权重设置为0，但是这样可能会丢失一些重要的特征，而正则化可以理解为将部分特征的权重设置为很小，但同时又不丢失

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230135426.png" width="80%" />
<figcaption>  

</figcaption>
</div>

如下图所示，通过对cost function添加正则项：也就是如果w3和w4太大，那么会导致cost function变大，从而减小w3和w4的值。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230135954.png" width="80%" />
<figcaption>  

</figcaption>
</div>

但实际上，是很难选出具体哪个特征需要正则化的，因此一般会对所有的特征都进行正则化。如下所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230140524.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而对于权重的值越小，可以理解为模型越简单，也就是减小过拟合的可能性。

而正则化参数则是平衡拟合数据（overfit）以及减少权重（underfit）的作用。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230140739.png" width="80%" />
<figcaption>  

</figcaption>
</div>

接下来看看添加正则化项后的梯度下降：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230141459.png" width="80%" />
<figcaption>  
线性回归中添加正则化项后的梯度下降
</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241230142732.png" width="80%" />
<figcaption>  
逻辑回归中添加正则化项后的梯度下降（跟线性回归几乎一样，只是function是sigmoid~）
</figcaption>
</div>

### Neural Network
{: #neural-network }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231162314.png" width="80%" />
<figcaption>  
大数据（Internet）以及GPU（硬件）的发展真正意义上推动了神经网络的发展
</figcaption>
</div>

而逻辑回归可以简单理解为一个神经网络，如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231162829.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而进一步地，如果输入的特征更多，那么可以进一步增加神经网络，如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231163218.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而实际上，每一层的所有输出都是下一层的输入，而并不是如上图般只有某几个输入对应的

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231163722.png" width="80%" />
<figcaption>  

</figcaption>
</div>

下面看看对于人脸识别任务，不同层输出的特征不一样，第一层可能是一些边缘特征（一些轮廓），而第二层可能是一些形状特征（比如眼睛、嘴巴），第三层可能是一些更加复杂的特征（更大区域的特征）。而这些特征将由网络自己去学习而不再是人工提取。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231165655.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20241231165901.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### numpy与tensorflow的数据转换
{: #numpy与tensorflow的数据转换 }

numpy中表达矩阵：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250101190657.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而需要注意的是1D vector与1 x 2和2 x 1的区别，如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102151946.png" width="80%" />
<figcaption>  

</figcaption>
</div>

numpy与tensorflow中的数据只是用不同的形式表征一个矩阵，但是实际上是一样的。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102152725.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 基于tensorflow的神经网络代码实现
{: #基于tensorflow的神经网络代码实现 }

一个简单的基于numpy实现的神经网络代码如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102153234.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而基于tensorflow的代码实现如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102154139.png" width="80%" />
<figcaption>  

</figcaption>
</div>

接下来看看一个数字分类的模型。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102154650.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 基于python实现神经网络单层前向传播
{: #基于python实现神经网络单层前向传播 }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102155817.png" width="80%" />
<figcaption>  
一步一步的操作细看应该是没有问题的，当然具体实现的时候可能会各种小bug
</figcaption>
</div>

进一步地简化代码（其实就是以function的形式，但是比起tensorflow的5行代码还是复杂不少~）如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102161632.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 向量化实现神经网络
{: #向量化实现神经网络 }

首先是向量化代替循环，如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102172803.png" width="80%" />
<figcaption>  

</figcaption>
</div>

矩阵乘法回顾：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102174307.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105160113.png" width="80%" />
<figcaption>  

</figcaption>
</div>

代码实现矩阵乘法：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105160450.png" width="80%" />
<figcaption>  

</figcaption>
</div>

神经网络的向量化实现如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105160934.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 神经网络的训练
{: #神经网络的训练 }

代码实现是非常直接的：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105161451.png" width="80%" />
<figcaption>  
第一步是构建模型，第二部是给loss，第三步是进行训练以及规定迭代次数
</figcaption>
</div>

与logistic regression的对比：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105162151.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105174257.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105174609.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 激活函数的选择
{: #激活函数的选择 }

之所以要激活函数，是因为线性函数的叠加还是线性函数，而激活函数可以使得神经网络可以拟合非线性函数。（无激活函数的神经网络本质上就相当于线性回归了）

Sigmoid VS ReLU：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105180215.png" width="80%" />
<figcaption>  

</figcaption>
</div>

对于输出层的激活函数。根据不同的任务选择不同的激活函数：二分类一般采用sigmoid，而回归问题则是线性激活函数，而如果回归问题中只有正数，那么可以用ReLU。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105181558.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而对于中间层的激活函数。ReLU是最常用的，因为它的计算速度快，而且不会出现梯度消失的问题（也就是大于0的情况下，走向不会变平，从而使得梯度下降不会变慢，函数的梯度变小了就会导致梯度下降法走得更慢）

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105182157.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105182339.png" width="80%" />
<figcaption>  
总结激活函数的选择
</figcaption>
</div>

#### 基于NN的系列实验代码
{: #基于nn的系列实验代码 }

实验测试代码请见:

* [逻辑回归实现手写数字识别](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/Logistic%20Regression%E5%AE%9E%E7%8E%B0%E6%89%8B%E5%86%99%E6%95%B0%E5%AD%97%E8%AF%86%E5%88%AB.ipynb)

* [NN给定预训练权重实现手写数字识别](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/code.ipynb)

* [用神经网络模拟线性回归与逻辑回归](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/NN%E6%A8%A1%E6%8B%9F%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92%E4%B8%8E%E9%80%BB%E8%BE%91%E5%9B%9E%E5%BD%92.ipynb)

* [基于tensorflow实现基于NN的咖啡烘焙](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/%E5%9F%BA%E4%BA%8Etensorflow%E5%AE%9E%E7%8E%B0%E5%9F%BA%E4%BA%8ENN%E7%9A%84%E5%92%96%E5%95%A1%E7%83%98%E7%84%99.ipynb)

* [基于python/numpy实现基于NN的咖啡烘焙](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/%E5%9F%BA%E4%BA%8Etensorflow%E5%AE%9E%E7%8E%B0%E5%9F%BA%E4%BA%8ENN%E7%9A%84%E5%92%96%E5%95%A1%E7%83%98%E7%84%99.ipynb)

* [基于神经网络的手写数字识别(二分类)](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/%E5%9F%BA%E4%BA%8ENN%E7%9A%84%E6%89%8B%E5%86%99%E6%95%B0%E5%AD%97%E8%AF%86%E5%88%AB(%E4%BA%8C%E5%88%86%E7%B1%BB).ipynb)

* [不同的激活函数的选择](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/%E6%BF%80%E6%B4%BB%E5%87%BD%E6%95%B0%E7%9A%84%E9%80%89%E6%8B%A9.ipynb)

### Multiclass Classification
{: #multiclass-classification }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105204816.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### Softmax Regression
{: #softmax-regression }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105213114.png" width="80%" />
<figcaption>  
Logistic Regression VS Softmax Regression
</figcaption>
</div>

Softmax Regression的cost function：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105213819.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### Neural Network with Softmax output
{: #neural-network-with-softmax-output }

将Softmax Regression作为神经网络的输出层，如下图所示。进而可以实现多分类问题。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105214547.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250105214755.png" width="80%" />
<figcaption>  
二分类 VS 多分类
</figcaption>
</div>

基于tensorflow的代码实现如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106131907.png" width="80%" />
<figcaption>  

</figcaption>
</div>

注意通过减少中间值的计算，可以进一步的提升精度：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106132538.png" width="80%" />
<figcaption>  

</figcaption>
</div>

对于逻辑回归而言，是否这样做是没有关系的，引入的误差不大，但是对于softmax regression而言，这样做会更好

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106133211.png" width="80%" />
<figcaption>  

</figcaption>
</div>

因此整体的代码实现如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106133359.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### Multi-label Classification
{: #multi-label-classification }

此类问题应该指的是一个样本可以有多个标签，而不是多分类问题。如下所示，一张图片的输入对应多个label：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106134108.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106134322.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 比梯度下降更好的优化方法（Adam Algorithm）
{: #比梯度下降更好的优化方法（adam-algorithm） }

首先再次回忆一下基本的梯度下降法，而所谓的Adam Algorithm就是对梯度下降法的改进，就是自适应的调节学习率

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106135255.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106135526.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106135624.png" width="80%" />
<figcaption>  

</figcaption>
</div>

此处略掉实际的推导过程，直接给出实现代码如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106135805.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 其他不同的网络层类型
{: #其他不同的网络层类型 }

之前介绍的一直都是dense layer：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106140044.png" width="80%" />
<figcaption>  

</figcaption>
</div>

最经典的应该是卷积层：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250106141402.png" width="80%" />
<figcaption>  

</figcaption>
</div>

在后序deep learning部分应该是会详细介绍的，这里就不展开了。

#### 基于NN实现手写数字识别（多分类问题）
{: #基于nn实现手写数字识别（多分类问题） }

* [Softmax函数及其优化版本](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/softmax%E5%87%BD%E6%95%B0.ipynb)

* [基于tensorflow的多分类问题及其参数的可视化](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/%E5%9F%BA%E4%BA%8Etensorflow%E7%9A%84%E5%A4%9A%E5%88%86%E7%B1%BB%E9%97%AE%E9%A2%98.ipynb)

* [Neural Networks for Handwritten Digit Recognition, Multiclass](https://github.com/KwanWaiPang/draw_figure/blob/main/3.Neural%20Network/%E5%9F%BA%E4%BA%8ENN%E7%9A%84%E6%89%8B%E5%86%99%E6%95%B0%E5%AD%97%E8%AF%86%E5%88%AB(%E5%A4%9A%E5%88%86%E7%B1%BB).ipynb)

### Debugging a learning algorithm
{: #debugging-a-learning-algorithm }

对于一个算法，如果发现它的表现不好，那么可以采用的debug的方法有：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107104953.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 评估模型的方法
{: #评估模型的方法 }

当模型存在过拟合的情况，如果是简单的函数，可以通过画图可视化，但是如果有多个输入的feature，很难通过图例来直观感受学习到的函数对数据的拟合情况

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107105702.png" width="80%" />
<figcaption>  

</figcaption>
</div>

那么实际上可以把数据集分为训练集和测试集（例如，7、3分），训练集用来训练模型，而测试集用来评估模型的性能。而如果模型在训练集上表现很好，但是在测试集上表现很差，那么就是过拟合的情况。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107123506.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107123954.png" width="80%" />
<figcaption>  
注意计算error的时候是不需要正则化的
</figcaption>
</div>

而对于分类问题中，评估模型的方法则是：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107124858.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107125011.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 模型的选择以及交叉验证集（cross validation）
{: #模型的选择以及交叉验证集（cross-validation） }

直接的方式就是穷举几个模型，然后选择最好的：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107141250.png" width="80%" />
<figcaption>  

</figcaption>
</div>

但是上面这种做法会导致所选择的模型在测试集上表现好，再用来验证泛化能力就没有说服力了。
那么进一步的，可以将数据集分为三个：训练集、交叉验证集、测试集。训练集用来训练模型，交叉验证集用来选择模型，而测试集用来评估模型的性能。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107141606.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而进一步的，验证模型的性能也是类似上面验证集的方式：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107142111.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107142635.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107142809.png" width="80%" />
<figcaption>  

</figcaption>
</div>

这样就通过交叉验证集来选择模型，而通过测试集来评估模型的性能，这样来评价模型的泛化能力则是公平的。

#### Bias and Variance
{: #bias-and-variance }

实际上感觉就是衡量是否过拟合和欠拟合的：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107144042.png" width="80%" />
<figcaption>  

</figcaption>
</div>

从另外一个角度来看，bias和variance的关系如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107144327.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107144547.png" width="80%" />
<figcaption>  
不同的模型对于bias和variance的影响
</figcaption>
</div>

接下来看看正则化是如何影响bias和variance的：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107145259.png" width="80%" />
<figcaption>  

</figcaption>
</div>

类似于选择模型的方式，可以通过交叉验证集来选择正则化参数，而通过测试集来评估模型的性能。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107145534.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步地，查看正则化参数对bias和variance的影响：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250107145754.png" width="80%" />
<figcaption>  

</figcaption>
</div>

不过这部分的insight其实是比较少，基本这一整章节都是，质量很低，，怪不得youtube上视频都去掉这部分hhh

#### Learning Curves（学习曲线）
{: #learning-curves（学习曲线） }

随着训练集的增加，训练集和交叉验证集的error的变化如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108122838.png" width="80%" />
<figcaption>  

</figcaption>
</div>

训练集上的error随着训练集的增加而增加，而交叉验证集上的error随着训练集的增加而减小。这是因为训练集越大，模型拟合全部数据是更难的，而又由于数据的样本量增大，模型的泛化能力也会增强，所以交叉验证集上的error会减小。
但是无论怎么用在交叉验证集上的error都比训练集上的error要大，这是因为模型是在训练集上训练的，所以训练集上的error会小于交叉验证集上的error。

注意更多的训练集只是对过拟合的模型有效的，对于欠拟合的模型是没有用的。因此虽然learning是数据驱动的，但是也是需要模型足够的强，大数据才有用！

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108123649.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而相反对于过拟合的模型，则是如下（图应该是没画好，是有机会比人类的性能要好的）：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108124310.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 基于神经网络的bias与variance分析
{: #基于神经网络的bias与variance分析 }

前面都是基于线性回归的，此处看看基于神经网络的debugging，但本质上其实是一样的~

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108125625.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108130248.png" width="80%" />
<figcaption>  

</figcaption>
</div>

此外一般通过合适的正则化参数，更大的神经网络模型一般会有更好的性能：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108130430.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108130629.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 数据增广（data augmentation）
{: #数据增广（data-augmentation） }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108151209.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108151304.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108151627.png" width="80%" />
<figcaption>  

</figcaption>
</div>

除了数据增广以外也可以通过合成/仿真的数据来训练模型。

#### 迁移学习（transfer learning）
{: #迁移学习（transfer-learning） }

所谓的迁移学习就是将一个模型的参数作为另一个模型的初始参数（或fixed大部分，仅改变某些参数），然后再进行训练。这样可以加速模型的训练，提升模型的性能。
换句话说也就是利用别的task中的数据（训练好的模型），如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108152747.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而网络的可解析性其实是可以进行迁移学习的一个关键，如下所示，网络所训练的参数实现的功能是可以用于不同的task的（但注意，输入的类型需要一样，比如cv的输入都是image，一般不可能用NLP的网络来作为预训练模型~）

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108153200.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### 提升模型性能的总结及系列实验
{: #提升模型性能的总结及系列实验 }

首先总结一下提升模型性能的方法：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108125115.png" width="80%" />
<figcaption>  

</figcaption>
</div>

* [基于线性回归的正则化及bias与covariance分析](https://github.com/KwanWaiPang/draw_figure/blob/main/4.Advice%20for%20Applying%20Machine%20Learning/code.ipynb)

* [基于神经网络的正则化](https://github.com/KwanWaiPang/draw_figure/blob/main/4.Advice%20for%20Applying%20Machine%20Learning/%E5%9F%BA%E4%BA%8ENN%E7%9A%84%E6%8F%90%E5%8D%87%E6%8A%80%E5%B7%A7%E5%AE%9E%E9%AA%8C.ipynb)

## Unsupervised Learning
{: #unsupervised-learning }

与Supervised Learning不同，Unsupervised Learning是没有label的，也就是说，目标是找到数据的结构或者模式，比如聚类（clustering），异常检测（Anomaly Detection）,降维（Dimensionality Reduction）等。

### Clustering（聚类）
{: #clustering（聚类） }

输入的数据并没有label，也没有办法告诉模型什么才是“正确”的答案。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108155023.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108155438.png" width="80%" />
<figcaption>  

</figcaption>
</div>

#### K-means
{: #k-means }

首先是随机初始化K（下图是两个）个中心点，然后不断的迭代，直到中心点不再变化为止。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108155708.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108155917.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108160218.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108160348.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108160455.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108160544.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108160628.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108160659.png" width="80%" />
<figcaption>  

</figcaption>
</div>

将上述过程总结为如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108161722.png" width="80%" />
<figcaption>  

</figcaption>
</div>

若出现某个中心点没有数据点与之对应，那么可以将其删掉变为k-1个中心点或者重新初始化

而对于数据之间界限没有明显的区分的情况，如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108161959.png" width="80%" />
<figcaption>  

</figcaption>
</div>

K-means也有它的优化目标，两个step的本质都是将cost最小化。如下所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108162608.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108162853.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108163400.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步的，初始化K-means也是非常重要的，不恰当的选择容易导致局部最优解。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108163841.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108164349.png" width="80%" />
<figcaption>  

</figcaption>
</div>

不过可以通过多次计算，然后选择cost最小的结果，来避免局部最优解的问题。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108164733.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而选择合适的K值也是非常重要的，可以通过如下的方法来选择：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108164959.png" width="80%" />
<figcaption>  
本质上两种的选法都是对的，因为这是非监督学习，没有所谓的“正确”答案，只有合适的答案
</figcaption>
</div>

基于Elbow（肘部）method的K选择方法如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108165322.png" width="80%" />
<figcaption>  
但实际不一定是一个明显的拐点，所以这个方法也不是很好，很容易选择非常大的K值
</figcaption>
</div>

进一步的，通过下游任务的效果来看，选择合适的K值也是一个方法：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108165459.png" width="80%" />
<figcaption>  

</figcaption>
</div>

### Anomaly Detection（异常检测）
{: #anomaly-detection（异常检测） }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108170202.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而实现检测最常用的方式就是density estimation（密度估计），也就是找到数据的分布。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108170534.png" width="80%" />
<figcaption>  

</figcaption>
</div>

基于Gaussian（Normal）Distribution的异常检测方法：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108174116.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108174314.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而对于多维特征，可以通过独立分布的原则来计算：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108175719.png" width="80%" />
<figcaption>  

</figcaption>
</div>

总结异常检测的流程如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108175939.png" width="80%" />
<figcaption>  

</figcaption>
</div>

接下来通过一个例子来更直观的认识异常检测：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250108180555.png" width="80%" />
<figcaption>  

</figcaption>
</div>

对于异常检测,若有真实的label数据来评估模型的性能则可以比较好的获得阈值.但是为何不直接用supervise Learning呢?分析对比如下:

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109124327.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步地,对于异常检测系统而言,选择合适的特征是非常重要的.
首先保证特征尽量服从高斯分布是非常重要的,因为异常检测的基础是基于高斯分布的:

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109125226.png" width="80%" />
<figcaption>  

</figcaption>
</div>

接下来看看缺陷检测的误差分析,通过引入新的特征来提升模型的性能:

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109130637.png" width="80%" />
<figcaption>  

</figcaption>
</div>

### K-means与异常检测的实验代码
{: #k-means与异常检测的实验代码 }

* [K-means聚类及随机初始化](https://github.com/KwanWaiPang/draw_figure/blob/main/5.%20K-means/K-means%E5%8F%8A%E9%9A%8F%E6%9C%BA%E5%88%9D%E5%A7%8B%E5%8C%96.ipynb)

* [基于K-means实现图像压缩](https://github.com/KwanWaiPang/draw_figure/blob/main/5.%20K-means/K-means%E7%94%A8%E4%BA%8E%E5%9B%BE%E5%83%8F%E5%8E%8B%E7%BC%A9.ipynb)

* [缺陷检测](https://github.com/KwanWaiPang/draw_figure/blob/main/6.Anomaly%20Detection/code.ipynb)

## Reinforcement Learning
{: #reinforcement-learning }

强化学习是要告诉模型什么是“正确”的答案，而是通过奖励来告诉模型什么是“好”的行为。也就是告诉模型what to do而不是how to do it，由模型自己来学习如何做。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109143910.png" width="80%" />
<figcaption>  

</figcaption>
</div>

RL的核心：状态（state），动作（action），奖励（reward），下一状态（next state）。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109144856.png" width="80%" />
<figcaption>  

</figcaption>
</div>

RL的Return（回报）是指从当前状态开始，未来所有奖励的总和，需要综合考虑成本和效益（下面额外加了一个discount factor）。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109145532.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109145848.png" width="80%" />
<figcaption>  
从不同的状态开始会获得不同的return，因此基于不同的状态选择不同的动作是非常重要的。
</figcaption>
</div>

RL的策略（policy）有不同，比如以最近的reward，以最大的或者最小的reward，又或者基于return来选择。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109150410.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而RL的目标其实就是找到最优的策略，使得对于每个state采取什么样的action使得return最大化。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109150649.png" width="80%" />
<figcaption>  

</figcaption>
</div>

下面总结一下上面的几个概念在不同的应用场景的表现：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109151032.png" width="80%" />
<figcaption>  

</figcaption>
</div>

而上述的也被称为MDP（Markov Decision Process），the future only depend on the current state。

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109151236.png" width="80%" />
<figcaption>  

</figcaption>
</div>

### State-action value function/Q-function
{: #state-action-value-function/q-function }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109152148.png" width="80%" />
<figcaption>  
此处的数学计算好像有点问题，但是按原始概念来看应该是ok的
</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109152512.png" width="80%" />
<figcaption>  

</figcaption>
</div>

### Bellman方程
{: #bellman方程 }

Bellman方程是用来计算Q-function的，也就是用来计算在某个state下采取某个action的return。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109153926.png" width="80%" />
<figcaption>  
有点类似于递归/动态规划的概念~
</figcaption>
</div>

接下来通过一个例子来直观理解这个方程

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109154228.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步理解Bellman方程的意义：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109154532.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步的，由于action实际上可能有误差，因此应该为系列return的期望值：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109155735.png" width="80%" />
<figcaption>  

</figcaption>
</div>

### Deep Reinforcement Learning
{: #deep-reinforcement-learning }

训练一个神经网络来学习Q-function，也就是DQN（Deep Q-Network）。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109162132.png" width="80%" />
<figcaption>  

</figcaption>
</div>

通过仿真各种state下的action的情况来获取训练数据：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109163437.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109163843.png" width="80%" />
<figcaption>  

</figcaption>
</div>

进一步地，DQN可以采用更有效的结构，如下（同时输出四个action）：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109164306.png" width="80%" />
<figcaption>  

</figcaption>
</div>

### ϵ-贪婪策略
{: #ϵ-贪婪策略 }

ϵ-贪婪策略是指在训练的过程中，以一定的概率ϵ来选择随机的action，而不是根据Q-function来选择action(这样可以避免由于初始化不够好导致陷入局部最优)。如下所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109165003.png" width="80%" />
<figcaption>  
ϵ对应的是一个随机的action，而1-ϵ对应的是根据Q-function选择的action
</figcaption>
</div>

### Mini-batch与soft updates
{: #mini-batch与soft-updates }

此处提供两个策略来提升模型的性能，一个是mini-batch，一个是soft updates。

当样本量很大时，可以通过mini-batch的方式来训练模型（将全部数据分为若干个batch），而不是一次性全部输入。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109170226.png" width="80%" />
<figcaption>  

</figcaption>
</div>

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109170329.png" width="80%" />
<figcaption>  

</figcaption>
</div>

这样做的好处是可以减少计算量，提高训练速度。（虽然每一次获得的结果可能会更noise一些，但是更高效，最终的结果应该是差不多的~）

而所谓的soft updates是指每次更新模型的时候，不是直接将新的Q-function替换掉旧的，而是通过一个参数来控制新旧Q-function的比例。如下图所示：

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250109170624.png" width="80%" />
<figcaption>  

</figcaption>
</div>

### 基于强化学习的实验代码
{: #基于强化学习的实验代码 }

* [用深度强化学习来训练飞行器着陆](https://github.com/KwanWaiPang/draw_figure/blob/main/7.Reinforcement%20Learning/code.ipynb)

# Deep Learning
{: #deep-learning }

由于篇幅有限，关于Deep Learning的内容将在[博客](/Study_note_DL/)中详细介绍。

# Artifical General Intelligence (AGI)
{: #artifical-general-intelligence-agi }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/learning_algorithm/others/微信截图_20250102171316.png" width="80%" />
<figcaption>  
ANI vs AGI
</figcaption>
</div>

# 参考资料
{: #参考资料 }

* [机器学习（Machine Learning）- 吴恩达（Andrew Ng）](https://www.youtube.com/playlist?list=PLOXON7BTL9IW7Ggbc09jLqGmzkwPI4-3V)
* [2024公认最好的  吴恩达机器学习](https://www.youtube.com/playlist?list=PLULgBZmS3YWRXpqgJTOq9m_nU4oyEVyj4)
* [B站更全的2022-Machine-Learning-Specialization](https://www.bilibili.com/video/BV19B4y1W76i)
* [Stanford CS229: Machine Learning Full Course taught by Andrew Ng | Autumn 2018](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
* [机器学习笔记目录](http://www.ai-start.com/ml2014/)
* [机器学习课程代码参考](https://github.com/fengdu78/Coursera-ML-AndrewNg-Notes/tree/master/code)
* [机器学习课程代码参考2](https://github.com/HuangCongQing/MachineLearning_Ng/tree/master/%E5%90%B4%E6%81%A9%E8%BE%BE%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E8%AF%BEpython%E4%BB%A3%E7%A0%81)
* [2022-Machine-Learning-Specialization](https://github.com/kaieye/2022-Machine-Learning-Specialization)
* [Machine-Learning-Specialization-Coursera](https://github.com/greyhatguy007/Machine-Learning-Specialization-Coursera)
* [deep learning- 吴恩达（Andrew Ng）](https://www.youtube.com/playlist?list=PLM5hlczGTln79kN5Z_8J_s20k5-vRbKpE)
* [Stanford CS230: Deep Learning  Autumn 2018](https://www.youtube.com/playlist?list=PLoROMvodv4rOABXSygHTsbvUz4G_YQhOb)
* [coursera-deep-learning-specialization](https://github.com/amanchadha/coursera-deep-learning-specialization)
* [深度学习笔记目录](http://www.ai-start.com/dl2017/)
