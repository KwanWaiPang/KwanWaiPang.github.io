---
layout: post
title: "智驾中的“无图”"
date:   2025-03-16
tags: [SLAM]
comments: true
author: kwanwaipang
toc: false #true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<!-- # 引言 -->

本博文记录了本人调研自动驾驶中无图的相关survey

* 原博客：[Link](https://kwanwaipang.github.io/File/Blogs/Poster/%E6%99%BA%E9%A9%BE%E4%B8%AD%E7%9A%84%E2%80%9C%E6%97%A0%E5%9B%BE%E2%80%9D.html)

<style>
/* 通过ID限定作用域 */
#iframe-wrapper-{{ page.url | slugify }} { /* 自动生成唯一ID */
  --cut-top: 150px;    /* 当前页面专用变量 */
  --cut-bottom: 280px;   /* 默认值 */

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
    src="https://kwanwaipang.github.io/File/Blogs/Poster/%E6%99%BA%E9%A9%BE%E4%B8%AD%E7%9A%84%E2%80%9C%E6%97%A0%E5%9B%BE%E2%80%9D.html"
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