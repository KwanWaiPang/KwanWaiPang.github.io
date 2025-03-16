---
layout: post
title: "Paper Survey之——LiDAR-SLAM中的退化检测"
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

本博文主要介绍了一些用于检测和解决激光雷达SLAM中退化问题的算法。

* 原博客：[Link](https://kwanwaipang.github.io/File/Blogs/Poster/Degeneracy_for_lidar.html)

<style>
/* 通过ID限定作用域 */
#iframe-wrapper-{{ page.url | slugify }} { /* 自动生成唯一ID */
  --cut-top: 200px;    /* 当前页面专用变量 */
  --cut-bottom: 200px;   /* 默认值 */

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
    src="https://kwanwaipang.github.io/File/Blogs/Poster/Degeneracy_for_lidar.html"
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