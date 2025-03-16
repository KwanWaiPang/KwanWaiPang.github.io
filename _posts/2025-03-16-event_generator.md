---
layout: post
title: "生成事件数据"
date:   2025-03-16
tags: [Deep Learning,Event-based Vision]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<!-- # 引言 -->

本博文记录了本人从图像数据集生成对应的事件相机数据的实验过程。
* 原博客：[Link](https://kwanwaipang.github.io/File/Blogs/Poster/esim.html)
* 代码：[ESIM_comment](https://github.com/KwanWaiPang/ESIM_comment)


<style>
/* 内联样式隔离 */
#iframe-wrapper {
  width: 100%;
  overflow: hidden;
  border: none;
  display: block;
  margin: 0;
  padding: 0;
}

#iframe-content {
  width: 100%;
  border: none;
  display: block; /* 消除 iframe 默认的 inline 空隙 */
  top: -100px; /* 上移100px */
}
</style>

<div id="iframe-wrapper">
  <iframe 
    id="iframe-content"
    src="https://kwanwaipang.github.io/File/Blogs/Poster/esim.html" 
    onload="this.style.height = this.contentWindow.document.documentElement.scrollHeight + 'px'"
  ></iframe>
</div>

<script>
// 纯当前页面运行的脚本
document.getElementById('iframe-content').addEventListener('load', function() {
  try {
    const contentHeight = this.contentWindow.document.documentElement.scrollHeight;
    this.style.height = contentHeight + 'px';//增加了高度
    // 添加窗口变化监听
    window.addEventListener('resize', () => {
      this.style.height = this.contentWindow.document.documentElement.scrollHeight + 'px';
    });
  } catch (error) {
    console.log('跨域保护机制触发，请确保被嵌入页面与本站同源');
  }
});
</script>
