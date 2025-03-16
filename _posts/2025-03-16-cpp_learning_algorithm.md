---
layout: post
title: "基于CPP的算法学习笔记"
date:   2025-03-16
tags: [Coding]
comments: true
author: kwanwaipang
toc: fasle #true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<!-- # 引言 -->

本博文汇总了本人学习算法以及刷Leetcode、牛客网等题目的过程中的一些笔记，主要是基于C++的实现。 具体代码运行及测试请见[My Leetcode](https://leetcode.cn/u/kwan-wai-pang/)
* 原博客：[Link](https://kwanwaipang.github.io/File/Blogs/Poster/cpp%E7%AE%97%E6%B3%95%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.html)

<style>
/* 通过ID限定作用域 */
#iframe-wrapper-{{ page.url | slugify }} { /* 自动生成唯一ID */
  --cut-top: 400px;    /* 当前页面专用变量 */
  --cut-bottom: 400px;   /* 默认值 */

  width: 100%;
  overflow: hidden;
  position: relative;
  border: none;
  height: calc(100vh - var(--cut-top));
}

#iframe-content-{{ page.url | slugify }} {
  width: 100%;
  overflow: hidden;
  border: none;
  position: absolute;
  top: calc(-1 * var(--cut-top));
  left: 0;
  height: calc(100% + var(--cut-top) + var(--cut-bottom));
  display: block; /* 消除 iframe 默认的 inline 空隙 */
}
</style>

<div id="iframe-wrapper-{{ page.url | slugify }}">
  <iframe 
    id="iframe-content-{{ page.url | slugify }}"
    src="https://kwanwaipang.github.io/File/Blogs/Poster/cpp%E7%AE%97%E6%B3%95%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.html"
    onload='
      const frame = this;
      const wrapper = frame.parentElement;
      
      const getCutValue = (name) => 
        parseInt(getComputedStyle(wrapper)
          .getPropertyValue(name).replace("px",""));

      const update = () => {
        try {
          const doc = frame.contentWindow.document;
          const fullHeight = Math.max(
            doc.body.scrollHeight,
            doc.documentElement.scrollHeight
          );
          
          // 动态设置高度
          wrapper.style.height = 
            `${Math.max(fullHeight - getCutValue("--cut-top") - getCutValue("--cut-bottom"), 0)}px`;
            
          frame.style.height = `${fullHeight}px`;
        } catch(e) {}
      };
      
      update();
      new ResizeObserver(update).observe(frame);
      window.addEventListener("resize", update);
    '
  ></iframe>
</div>