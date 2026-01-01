---
layout: post
title: "Paper Survey之——LiDAR-SLAM中的退化检测"
date:   2025-03-16
tags: [SLAM, LiDAR]
comments: true
author: kwanwaipang
toc: false #true
---


<!-- * 目录
{:toc} -->


<div id="dynamic-content-root">Loading...</div>

<script>
(function() {
  const container = document.getElementById('dynamic-content-root');
  const shadow = container.attachShadow({ mode: 'open' });

  // 这里的路径确保指向你仓库根目录的 index.html
  fetch('./File/Blogs/Poster/Degeneracy_for_lidar.html')
    .then(response => response.text())
    .then(html => {
      // 直接注入全部代码，Shadow DOM 会自动处理其中的 <html> <body> 和 <style>
      shadow.innerHTML = html;
      container.childNodes[0].textContent = ""; // 加载成功后移除 "Loading..." 文字
    })
    .catch(err => {
      console.error('Failed to load content:', err);
      container.innerHTML = "Content load failed.";
    });
})();
</script>

<style>
/* 仅保留必要的物理占位，不做任何视觉修饰 */
#dynamic-content-root {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
}
</style>



<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<!-- # 引言 -->

<!-- 本博文主要介绍了一些用于检测和解决激光雷达SLAM中退化问题的算法。 -->

<!-- * 原博客：[Link](https://kwanwaipang.github.io/File/Blogs/Poster/Degeneracy_for_lidar.html) -->

<!-- {% include_relative html_file/Degeneracy_for_lidar.html %} -->

<!-- <style>
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
</div> -->