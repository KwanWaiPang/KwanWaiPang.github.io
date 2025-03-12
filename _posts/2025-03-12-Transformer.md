---
layout: post
title: "What is Transformer?"
date:   2025-03-12
tags: [Deep Learning]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
之前在复现DUSt3R,MASt3R和Fast3R的时候都被其惊艳的效果所吸引，而其中最关键的是Transformer这个结构。
为此写下本博文对其进行学习，本博文仅供本人学习记录用~

Transformer最早是由2017年Google的《Attention is All You Need》这篇论文提到的，当时主要是针对自然语言处理领域提出的。
之前的RNN模型记忆长度有限（后续虽然由LSTM），但无法并行化，只有计算完$t_i$时刻后的数据才能计算$t_{i+1}$时刻的数据，但Transformer都可以做到（理论上其记忆长度是无限长的，并且其可以并行优化）


# MIT深度学习课程: 循环神经网络、Transformer 和注意力机制
首先，可以先通过《MIT Introduction to Deep Learning》这个课程，其中第二节对循环神经网络、Transformer 和注意力机制进行了介绍，来了解从RNN到Transformer的一些基本知识。

该课程对应的PPT如下

<div align="center" style="
  position: relative; 
  width: 80%; 
  height: 400px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe width="100%" height="100%"
    src="https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L2.pdf#toolbar=0&navpanes=0&scrollbar=0" ></iframe>
</div>


# Attention is All You Need


Transformer的基本解析其实可以用下图来描述

<div align="center">
  <img src="../images/微信截图_20250312111034.png" width="80%" />
<figcaption>  
</figcaption>
</div>

## Self-Attention
所谓的`Self-Attention`就是论文中的一个公式,也就是通过输入序列$a_1$和$a_2$，得到对应的映射$b_1$和$b_2$

<div align="center">
  <img src="../images/微信截图_20250312112645.png" width="60%" />
<figcaption>  
</figcaption>
</div>


## Multi-Head Attention



# Transformers: from NLP to CV



# 参考资料
* [Course lectures for MIT Introduction to Deep Learning](https://www.youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI)
* [Website of MIT Introduction to Deep Learning](https://introtodeeplearning.com/)
* [Code for MIT Introduction to Deep Learning](https://github.com/MITDeepLearning/introtodeeplearning)
* [B站的MIT深度学习: 循环神经网络、Transformer 和注意力机制](https://www.bilibili.com/list/watchlater?oid=114141507425125&bvid=BV1zkREYbE4E&spm_id_from=333.1387.top_right_bar_window_view_later.content.click)
* [Attention is All You Need精读](https://blog.csdn.net/weixin_73654895/article/details/142419678?spm=1001.2014.3001.5501)
* [Transformers: from NLP to CV](https://ibrahimsobh.github.io/Transformers/)
* [详解Transformer中Self-Attention以及Multi-Head Attention](https://blog.csdn.net/qq_37541097/article/details/117691873)


