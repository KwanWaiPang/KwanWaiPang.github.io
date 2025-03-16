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
/* 修改后样式 */
#iframe-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;  /* 新增定位上下文 */
  height: calc(100vh - 100px);  /* 初始可见区域高度 */
}

#iframe-content {
  width: 100%;
  border: none;
  position: absolute;  /* 改为绝对定位 */
  top: -100px;         /* 上移100px */
  left: 0;
  height: calc(100% + 100px);  /* 补偿高度 */
}
</style>

<div id="iframe-wrapper">
  <iframe 
    id="iframe-content"
    src="https://kwanwaipang.github.io/File/Blogs/Poster/esim.html" 
    onload='
      const frame = this;
      const updateSize = () => {
        try {
          // 获取实际内容高度
          const contentHeight = Math.max(
            frame.contentWindow.document.body.scrollHeight,
            frame.contentWindow.document.documentElement.scrollHeight
          );
          
          // 动态设置父容器高度（可视区域）
          frame.parentElement.style.height = contentHeight > 100 
            ? `${contentHeight - 100}px`  // 正常情况
            : "0px";  // 内容过短保护
          
          // 设置iframe总高度（包含被隐藏部分）
          frame.style.height = `${contentHeight}px`;
        } catch(e) {
          console.log("跨域限制:", e);
        }
      };
      
      updateSize();
      window.addEventListener("resize", updateSize);
      new ResizeObserver(updateSize).observe(frame);
    '
  ></iframe>
</div>