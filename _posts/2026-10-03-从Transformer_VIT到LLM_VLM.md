---
layout: post
title: "从 Transformer、ViT 到 LLM 与 VLM"
date:   2026-10-03
tags: [Deep Learning, LLM/VLM]
comments: true
author: kwanwaipang
toc: true
excerpt: "把 Transformer 的 Attention、ViT、LLM、VLM 按一条线重新整理。Attention 和 LLM 分别在两篇公开材料上改写，ViT、VLM 用了之前笔记里的图，也对照了一篇多模态演进的推文。"
---


<!-- * 目录
{:toc} -->


# 引言

之前写过 [Transformer 和 ViT](/Transformer/)，也写过 [CLIP](/CLIP/)。后来看多模态模型，老是 ViT、LLM、VLM 混在一起。这篇就把这几块按顺序放回一条线上：先把 Attention 讲清楚，再看 ViT 怎么把图切成 token，然后看 LLM 怎么靠「预测下一个词」把这套结构用起来，最后看 VLM 怎么把图和文接到同一次 Attention 里。


# 一、Transformer：Attention 到底在取什么

今天的语言模型大多是自回归的。给定前面的 token，预测下一个。比如已经有「今天」「天气」「很」，下一个可能是「好」「冷」「热」。选中一个之后，再把它接到后面，继续预测。整句话的概率，就是这一串条件概率乘起来。

模型靠什么从上文里找信息？靠 Attention。

## 先看人怎么读一句话

理解 Attention，比较直观的办法是先看人读句子。

> 小明把书放进书包，因为他明天要考试。

读到「他」的时候，不会把前面每个词平均看一遍。这里要解决的是「他是谁」，所以会回到「小明」。再往下读到「考试」，才又去看「书」「书包」「明天」这些和场景有关的词。

也就是说，读的时候不是一视同仁，而是围着当前这个词，到前面的文本里找相关片段。

Attention 做的就是类似的事。当前位置不会把全部历史机械地读一遍，而是先判断哪些历史 token 更相关，再把相关的信息取回来。

<div align="center">
  <img src="/images/attn_sentence.png" width="92%" />
</div>

## Q、K、V

具体到模型里，每个 token 都会变出三个向量。

* **Query**：当前位置想找什么。读到「他」，想找的就是「谁」。
* **Key**：历史 token 的标签，用来判断它和这个问题相不相关。「小明」的标签更像一个人名，「书包」的标签更像一个东西。
* **Value**：历史 token 里真正被取回来的内容。Key 只负责被比较，Value 才加进当前结果。

对应到旧笔记里的说法：输入先变成 $a$，再乘三套权重，

$$
q = a W_Q, \quad k = a W_K, \quad v = a W_V
$$

$q$ 去和每一个 $k$ 做匹配，匹配越大，$v$ 的权重越大。$Q$、$K$、$V$ 都来自同一条序列，这就是自注意力。如果 $Q$ 来自一条序列，$K$ 和 $V$ 来自另一条，那是交叉注意力。VLM 里两种都有，放到最后一节再说。

<div align="center">
  <img src="/images/attn_qkv.png" width="92%" />
</div>

上图底部的权重是示意，用来看「小明」会比「书包」大很多，不是这句真算出来的数。

## 公式就四步

把一条序列的 $q,k,v$ 按行堆起来，就是

$$
\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V
$$

1. $QK^{\top}$ 打分。第 $i$ 行第 $j$ 列，是第 $i$ 个 Query 和第 $j$ 个 Key 的点积。方向越接近，分越高。
2. 除以 $\sqrt{d_k}$。$d_k$ 是每个头的宽度。
3. 按行做 softmax，得到非负、和为 1 的权重。
4. 用这个权重去加权 $V$。相关的内容多拿一点，不相关的少拿一点。

<div align="center">
  <img src="/images/attn_four_steps.png" width="92%" />
</div>

为什么要除以 $\sqrt{d_k}$。假设 $q$、$k$ 的每个分量均值是 0、方差是 1，而且互相独立，点积的方差会随 $d_k$ 变大，标准差就是 $\sqrt{d_k}$。向量一宽，原始分数就容易很大。softmax 对尺度很敏感，分数太大时，最大的那一项权重会贴到 1，其余贴到 0，梯度也几乎没了，训练开头学不动。除掉根号，是把初始时的分数尺度拉回来。这个假设只在初始化附近成立，训练久了分数还是可能慢慢变大。

另外，代码里算 softmax 之前通常会先减去这一行的最大值。那一步是防止 $e^{z}$ 溢出，不改变结果。除以 $\sqrt{d_k}$ 会改变结果，两件事情常写在相邻两行，别混在一起。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250313123237.png" width="70%" />
</div>

旧笔记里按两个 token 把矩阵乘开过，这里不再重复。需要看逐步截图的话，回到 [那一篇](/Transformer/)。

## 多头、掩码、位置

一个头只有一套匹配。上面那句话里，「他是谁」和「考试跟什么有关」最好同时能看到。多头就是把宽度拆开，每组用自己的 $W_Q,W_K,W_V$ 做一次上面的运算，再拼起来，用一个 $W_O$ 混到一起。不同的头可以去看不同类型的信息。头一多，每一头都要存自己的 Key 和 Value，后面算缓存时会直接变大。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250313124131.png" width="70%" />
</div>

默认情况下，每个位置能看到整段输入。翻译的编码器、BERT、ViT 可以这样，因为输入在算之前就已经到齐。生成不行。模型正在写第 $t$ 个词，右边那个词就是它要预测的答案。训练时如果让它看见右边，就变成抄答案。所以在 softmax 之前把未来位置的分数设成一个很大的负数，权重就变成 0。这是因果掩码。加上之后，第 $t$ 个位置只依赖左边。

<div align="center">
  <img src="/images/attn_causal_mask.png" width="62%" />
</div>

Attention 本身不管顺序。两个 token 换位置，如果没有额外的位置信息，点积并不知道谁在前。语言里词序会改意思，图像里 patch 的行列也会改意思，所以要另加位置编码。原论文用的是正弦函数，加到 token 上。ViT 用的是一张可学习的位置表，和 token 直接相加。现在的大语言模型更常用 RoPE，把位置写成 Query 和 Key 上的旋转，点积就能感到两个位置差多远。训练长度以内这比较好用；拉到远超训练长度，外推还是会差，那是长上下文要另外处理的问题。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250312111034.png" width="55%" />
</div>

一层里通常还有几块，堆很多层才是一个模型：

* Embedding：把离散 token 变成向量。
* 位置编码：告诉模型谁在前、谁在后。
* Attention：按相关程度读取上下文。
* 前馈网络：每个位置自己再做一次非线性变换。它不看别的位置。
* 残差和归一化：把输入加回来，并把每一层的尺度按住。层数深了，要学的是在原来的表示上改一点。

序列一长，代价也很直接。每个 token 都要存一份 Key 和 Value，缓存随长度线性涨。每个 token 还要和所有历史 token 算相似度，长度是 $L$ 的时候，总计算大概是 $L^2$。这就是后面长上下文贵的原因。具体字节数放到 LLM 那一节，用我之前估显存的办法算一笔。


# 二、ViT：把图切成词，再送进同一个编码器

Attention 要的输入是一串向量。图是 `[高, 宽, 通道]`，不是序列。2020 年 ViT 的做法很直接：把图切成同样大小的小块，每块展平，过一个线性层，变成一个 token，再送进标准的 Transformer 编码器。论文标题 *An image is worth 16x16 words* 说的就是这件事。后来也有用 14×14 的，比如 InternVL 那一路。

在这之前，视觉这边主要是卷积网络。ViT 把视觉和语言模型的底层结构说成了同一种东西。不过这时的 ViT 还是单模态，它只会处理图像，还不知道语言是什么。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250312131237.png" width="88%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/b3b87535b91b51d80adc759455531f14.gif" width="88%" />
</div>

上面两张是旧笔记里的。第一张是整体结构，第二张把切块、嵌入、加 class token 这个过程摊开了。

## 以 ViT-B/16 为例

输入 $224 \times 224 \times 3$，patch 取 16。一边是 $224/16=14$ 块，一共 $14 \times 14=196$ 个 patch。每个 patch 有 $16 \times 16 \times 3=768$ 个数，所以一个 token 的长度是 768。

代码里这个线性层常常写成卷积：核 16×16，步长 16，输出通道 768。原图 `[224, 224, 3]` 变成 `[14, 14, 768]`，再把高和宽摊平，就是 `[196, 768]`。这时才是 Transformer 要的二维矩阵，196 个 token，每个 768 维。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250312133423.png" width="88%" />
</div>

进编码器之前还要加两样东西。

* class token。一个可学习的向量，长度也是 768，拼到 196 个 patch 前面。`Cat([1, 768], [196, 768]) -> [197, 768]`。分类时就用这个位置的输出当整张图的汇总。
* Position Embedding。和 token 相加，所以形状也得是 `[197, 768]`。ViT 并不知道 patch 原来的顺序，位置表负责记住每个小块在原图的哪一行、哪一列。论文里试过，加了位置大概能好几个点；具体用可学习的还是固定的，差别没有那么大。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250312141011.png" width="92%" />
</div>

上图是每个位置学到的编码，和别的位置做余弦相似度。最亮的是自己，同一行、同一列也会比较亮。网格的二维关系，是靠这张表记下来的。

编码器就是把 Encoder Block 重复堆起来。一块里面大致是：

* LayerNorm，对每个 token 做。
* Multi-Head Attention，也就是上一节的结构。这里没有因果掩码，每个 patch 都能看到整张图。
* MLP，全连接 + GELU。第一层把 768 放到 3072，第二层回到 768。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250312141410.png" width="78%" />
</div>

出来的形状还是 `[197, 768]`。分类只要 class token 那 768 维，再过 MLP Head。原论文在 ImageNet-21K 上用的是 Linear + tanh + Linear；迁到 ImageNet-1K 或者自己的数据上，常常一个 Linear 就够。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250312142341.png" width="78%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250312142631.png" width="92%" />
</div>

旧笔记里把这条路径画全了，上面第二张就是 ViT-B/16 从像素到类别。

这里有个后面会用到的区别。分类可以只留 class token。VLM 如果也只把这一个向量交给语言模型，空间就没了，模型知道图里大概有什么，不知道它在左上还是右下。所以后面做多模态时，通常把整张 patch 网格都留下。patch 越小，token 越多，细节越多，$L^2$ 也越重。


# 三、LLM：用「下一个词」把这套块训起来

ViT 用的是编码器，整张图到齐了再看。大语言模型几乎只留解码器：因果掩码、从左往右预测。下面按《大模型原理与架构》的主线，把这件事记清楚。

## 目标就是一串条件概率

自回归把一句话拆开：

$$
P(x_1,\ldots,x_T)=\prod_{t=1}^{T} P(x_t \mid x_{<t})
$$

$x_{<t}$ 是位置 $t$ 左边的全部 token。训练取负对数，再按位置平均。正确的下一个词概率越接近 1，这一项越小。

<div align="center">
  <img src="/images/llm_next_token.png" width="88%" />
</div>

已经有「今天」「天气」「很」，模型给下一个词一组概率。选中「好」之后，再把它接到后面继续预测。图里的概率同样是示意。

因果掩码的好处是，这件事一次前向就能算完。位置 $t$ 的输出只看左边，所以整句送进去，每个位置各自给出「下一个 token」的分布，不会互相偷看答案。实现上标签要错开一位：位置 $t$ 去预测第 $t+1$ 个 token。一段长度为 $T$ 的文本，一次前向大概有 $T-1$ 个监督。BERT 那种遮挡模型，一次通常只在大约 15% 的位置上出题。同样一次前向，自回归拿到的标签多得多。

模型吃进去的不是汉字或英文单词，是分词器切出来的子词。后面说的长度，数的都是 token。等图像进来，一个 patch 也会占掉这个长度里的一格。

随机初始化时，模型对词表里每个词差不多一视同仁，损失大概是 $\ln(\text{词表大小})$。词表五万左右，这个数在 11 附近。训练第一步如果差得很远，先看标签有没有对齐、词表有没有配错。

## 训练看的是人写的上文，生成看的是自己刚写的

训练时，位置 $t$ 左边的字已经在语料里，不用等模型自己生成，所以整句可以并行。这就是 [Teacher Forcing](/teacher-and-student-forcing/)：用真实前缀当条件。

生成时下一个词还不存在。模型从最后一位的分布里取出一个 token，接到末尾，再算下一步。权重、掩码、计算路径还是同一套，变的是条件从哪来。训练条件于人写的前缀，推理条件于模型自己生成的前缀。自己写歪一个词，后面就走到一条训练时少见的上文上，误差会往后叠。

## 为什么猜下一个词会带出一些知识

这个损失看起来只是在拟合「什么词经常跟在什么词后面」。写成交叉熵的话，它等于数据本身的不确定度，再加上模型和真实分布的差距。要把损失做低，模型就得把语料里能帮助预测的东西压进权重：语法、搭配、事实、代码里的变量从哪来。补全「法国的首都是」，靠的是语料里反复出现的对应；补全一段缺少的控制流，靠的是代码里的规律。这些是压缩这份文本时带出来的。

压缩的是哪批文本，能预测的就是哪批文本里的规律。语料里没有的，这个目标变不出来，也不保证说出来的就是事实。还有一个很具体的限制：训练只要求「看到左边，预测右边」。句子「A 是 B」见过很多次，反过来问「B 是 A」，并不自动就会。这个现象有人叫逆转诅咒，原因就是目标本身是单向的。

## 为什么后来几乎都是只有解码器

BERT 把一些 token 遮住，让每个位置看到左右两边，再把被遮住的词还原。这适合理解一段已经写完的话，不适合自由往下写。ViT 也是编码器，分类时图已经在手里。

只有解码器的模型成为主流，书里把原因收成几条，我按自己的话记在这里：

* 监督更密。一次前向，几乎每个位置都有下一个词可以学。
* 训练和推理是同一条路。因果掩码使 KV cache 成立，训完就能一个 token 一个 token 地往下写。
* 任务可以写成续写。给一段前缀，把后面接上，不必像 BERT 那样为每个任务再接一个分类头。

单向的代价还在。判断一句话后半段是不是转折，常常要看到右边。模型变大之后可以用更长的上文补一部分，从左到右这个限制没有消失。

## 预训练之后还要两步，才比较像在回答问题

只做下一个词，模型会把网页往下续。要它按问题作答，通常还有两步，改的是数据，不是 Attention 的公式。

指令微调还是预测下一个词，数据换成问题和回答。问题那一段不计损失，只让回答产生损失。实现里常把不算的位置标成一个忽略值，交叉熵直接跳过。

偏好对齐是在两条回答里偏向更好的那条。RLHF 用奖励模型加强化学习。DPO 把同一件事收成一个直接的损失，不用再单独跑一套强化学习。两套做法都是在改「同样的问题，哪一种续写更常出现」。

## 推理时真正跟着长度涨的是缓存

提示词可以整段并行算完，把每一层的 Key、Value 留下，这一段叫 prefill。之后每生成一个 token，只算新 token 的 Query，去和缓存里的 Key 比，这一段叫 decode。decode 常常不是算力先用完，而是要把缓存从显存里读出来。

按之前 [估显存](/大模型参数量与显存估算/) 的办法粗算一下。一个 7B 量级、多头不共享 K/V 的模型：隐藏维 4096，32 层，32 头，每头 128 维，FP16。每个 token 每一层的 Key 加 Value 是 $2 \times 32 \times 128 = 8192$ 个数。32 层、每个数 2 字节，一个 token 大约 512 KB。上下文 8192 时，光这份缓存就在 4 GB 上下。权重本身 FP16 大约 14 GB。上下文再长，缓存会追上来。

若干头共用一套 K/V，缓存能小一截。长上下文后来的改法，比如先把每个 token 的 K/V 压短、再少看一些历史，都是在这笔账上做文章。那篇讲 DeepSeek V4 的文章后半段就是这个，这里先不展开。


# 四、VLM：图文怎么进同一次 Attention

ViT 让 Transformer 能看图，但图和语言还是分开的。后面这条线，我按那篇多模态推文的顺序记，结构上和论文对过的地方会单独写。

## CLIP：先让图和句子能比较

2021 年 CLIP 的办法很直觉。同时训一个图像编码器（可以是 ResNet，也可以是 ViT）和一个文本编码器，在大约 4 亿图文对上做对比学习。配对的图和句子，在向量空间里靠近；不配对的，离远。

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250909160736.png" width="92%" />
</div>

一个 batch 有 $N$ 对。图像和文本各自编码，再投影到同一维度，两两做相似度，得到 $N \times N$ 的矩阵。对角线是原来的图文对，相似度要拉高；其余格子是别的样本配到一起的，相似度要压低。模型不用把整句原文预测出来，只要认出哪一句配哪张图。

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250909163528.png" width="62%" />
</div>

训完之后可以做零样本分类。把类名写成「一张……的照片」，送进文本编码器；图像向量和这些文本向量比相似度，最大的那个就是类别。文本向量这时就像分类器的权重。

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 40%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250914085204.png" width="100%" />
      </td>
      <td style="width: 60%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://r-c-group.github.io/blog_media/images/微信截图_20250914085219.png" width="100%" />
      </td>
    </tr>
  </table>
</div>

更细的对比学习我写在 [CLIP 那篇](/CLIP/) 里。这里只记它的位置：CLIP 给图像和语言准备了一个可以比较的空间，训出来的视觉编码器后来成了很多 VLM 的前端。它擅长检索和分类，不会像对话模型那样把答案写成一段话，也数不清图里有几个物体。后来不少模型把损失换成 SigLIP 那种逐对的 sigmoid，训练更稳，角色还是同一类视觉编码器。

## LLaVA 到 Qwen-VL：把视觉 token 交给已经会写字的模型

2023 年 LLaVA 给了一个很短的接法：

> 已经训好的 CLIP ViT 负责看图，一个 MLP 负责把向量对到语言模型的维度，已经训好的 LLM 负责把回答写出来。

具体就是：

* CLIP ViT 把图像编成一串特征。这里用的是 patch 网格，不是只留 class token，不然位置没了。
* MLP（最早也可以是一层线性）把这些向量变到 LLM 的词向量空间。
* 把它们当成一段视觉 token，插进文本里。损失还是下一个词，通常只算在回答上。

<div align="center">
  <img src="/images/vlm_llava.png" width="92%" />
</div>

拼进同一条序列之后，第一节的 Attention 就够用了。问题里每个字的 Query 可以去和图像 patch 的 Key 比，相关的 Value 加进这些字的表示。图被读到，是因为历史里多了一种 token。

也有不拼接、用交叉注意力的做法，Flamingo 就是 Query 来自文本、Key 和 Value 来自图像。LLaVA 之后开源模型更常见的是直接拼接，实现上就是往语言模型的输入里插一段向量。

这条路能铺开，是因为对话和从文本里学来的东西已经在 LLM 的权重里，不必和视觉一起从零训。Qwen-VL、InternVL 以及后来的 Qwen2.5-VL，骨架还是视觉编码器 + 连接层 + 语言模型。后面加的是用的时候才碰到的问题：可变分辨率、不要把图强行缩成正方形、把相邻视觉 token 合并以少占长度、位置编码在大图上还能用。OCR、定位变好，常常是 token 更密，数据里也有了文字和框。

推文里把这套范式的限制收成三条，我同意这个判断：

| 限制 | 表现 |
| --- | --- |
| ViT 这边偏语义 | 小字、边缘、细位置容易丢，OCR 和定位会先吃亏 |
| 视觉空间是被投进文本空间的 | 投影通常很浅，两种空间是不是真的对齐了，细任务上会露出来 |
| 图像只作为输入 | 模型能写文字，不能画一张新图，也不能改图里的物体 |

## 理解和生成要的 token 不是同一种

要让一个模型既看懂图、又画出图，先看两种图像 token 差在哪。推文里这张对照是这段的核心，我按它的意思重列了一下：

| | 用来理解 | 用来生成 |
| --- | --- | --- |
| 常见前端 | ViT（CLIP / SigLIP） | VQ-VAE，或连续的 VAE |
| 损失 | 图文是否配对 | 把像素或潜变量重构回来 |
| 表示 | 连续向量，偏语义 | 离散码，或偏低层的潜变量 |
| 结构 | 只要编码器 | 还要一条能解码回图像的路 |

<div align="center">
  <img src="/images/vlm_two_tokenizers.png" width="92%" />
</div>

理解要的是「这是不是一只猫」。生成要的是毛边、光、背景像素。一个把细节收成语义，一个把细节留住才能画回来。一个是连续向量，一个常常是码本里的整数。推文认为这是统一理解和生成时的根本矛盾，我觉得这个说法是对的。

围绕这个矛盾，后面大概有三条路。

**同一套 tokenizer。** Meta 的 Chameleon 用同一个 VQ-VAE 把图像编成离散 token，和文字 token 放进同一条自回归序列，底座是 LLaMA-2 那一类。生成还能做，因为这套码就是为重构训的。理解会差，因为这套码学的是像素能不能还原，不是这句话和图是不是在说同一件事。后来 VILA-U、UniTok 试图在同一个 tokenizer 里同时优化重构和对比学习，低层细节和高层语义还是容易打架。

**两个编码器，一个语言模型。** DeepSeek 的 Janus、Janus-Pro 把编码拆开，语言模型还是一个。理解用 SigLIP 抽语义特征，展平之后用一个两层 MLP 对到语言模型；生成用 VQ tokenizer 得到离散 id，再用另一个适配层对进去。文本用原来的预测头，图像另用一个预测头。这样避开了「一个码本两头扛」。不足也很清楚：两套特征在进语言模型之前仍然是分开的。

**注意力共享，别的参数按任务分开。** 推文把字节的 BAGEL 写成「不要 ViT、不要扩散」的纯解码器。我核对了 [BAGEL 论文](https://arxiv.org/abs/2505.14683)，这里和推文不一样，以论文为准：理解侧仍然是 SigLIP2 的 ViT，经两层 MLP 进语言模型；生成侧用 FLUX 的 VAE 把图像压到潜空间，再切成 token。真正共用的是自注意力。理解专家处理文本和 ViT token，生成专家处理 VAE token。token 能在注意力里互相看见，前馈则分开。公开权重是大约 14B 总参数、7B 激活，语言模型来自 Qwen2.5。所以它统一的是 Transformer 里面的那次混合，视觉前端还是两套。

<div align="center">
  <img src="/images/vlm_three_routes.png" width="92%" />
</div>

如果看到「图像 patch 直接进出一个解码器、外面不再挂 ViT」这种说法，那是另一类更激进的结构，不要和 BAGEL 画成同一个东西。看模型时分开看三件事就行：前端有几套，注意力共不共享，生成预测的是离散码还是连续潜变量。

## 再往后就是把声音、视频也变成 token

推文后半段走到全模态。GPT-4o 把文本、图像、音频放进同一次交互，这个用法被记住了。Qwen2.5-Omni 用了 Thinker-Talker：Thinker 读各种模态并写出文本，Talker 把文本转成语音。两边并行，前一段还没处理完，后一段就可以开始出声。Qwen 这边的图像生成，推文写的是仍由 Qwen-Image 单独做，没有塞进 Omni 主模型。

从 Attention 的角度看，声音和视频并没有换一套运算。它们也要先变成 token，再去占同一条序列的长度。帧率、分辨率、采样率不一样，token 密度差很多，训练时各占多少比例，会决定某一路会不会被别的模态盖住。序列一长，上一节那笔 KV cache 又会变成主要的账。

推文把 2020 年以来收成五个阶段，我按它的线索列在这里，方便以后回看：

| 阶段 | 在解决什么 | 代表 |
| --- | --- | --- |
| 2020，视觉也用 Transformer | 图变成 token | ViT |
| 2021，图文对齐 | 两个空间可以比较 | CLIP、SigLIP |
| 2023–2024，多模态理解 | LLM 能看图并写回答 | LLaVA、Qwen-VL、InternVL |
| 2024–2025，理解和生成 | 同一个模型既看懂也生成 | Chameleon、Janus-Pro、BAGEL |
| 再往后，更多模态 | 声音、视频也进序列 | GPT-4o、Qwen-Omni 这一类 |


# 参考材料

* Vaswani et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
* Dosovitskiy et al., [An Image is Worth 16x16 Words](https://arxiv.org/abs/2010.11929)
* Radford et al., [CLIP](https://arxiv.org/abs/2103.00020)
* Zhai et al., [SigLIP](https://arxiv.org/abs/2303.15343)
* Liu et al., [LLaVA](https://arxiv.org/abs/2304.08485)
* Alayrac et al., [Flamingo](https://arxiv.org/abs/2204.14198)
* Chameleon Team, [Chameleon](https://arxiv.org/abs/2405.09818)
* Chen et al., [Janus-Pro](https://arxiv.org/abs/2501.17811)
* Deng et al., [BAGEL](https://arxiv.org/abs/2505.14683)
* Berglund et al., [The Reversal Curse](https://arxiv.org/abs/2309.12288)
* 杨保华，[大模型原理与架构](https://github.com/yeasy/llm_internals)，在线阅读见 [GitBook](https://yeasy.gitbook.io/llm_internals/)
* 胡一征，[DeepSeek V4：长上下文时代的大模型技术革新](https://mp.weixin.qq.com/s/HTudCZAFM0fsNwSe9WN5Eg)
* 云原生 Dream，[从 ViT 到多模态 Qwen](https://mp.weixin.qq.com/s/CSYMymCscW-KsRJdvggkDw)

旧笔记里的截图仍用原来的地址。这篇新画的 8 张示意图放在仓库的 `images/` 下，文中写成 `/images/文件名.png`。之后如果迁到 `https://kwanwaipang.github.io/ubuntu_md_blog/images/`，文件名可以保持不变，只改链接前缀。

配图里旧的部分来自 [Transformer / ViT 笔记](/Transformer/) 和 [CLIP 笔记](/CLIP/)。
