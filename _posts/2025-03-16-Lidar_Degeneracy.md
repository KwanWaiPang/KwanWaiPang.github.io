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
  
  // 【关键 1】定义该 HTML 文件所在的绝对根目录路径，用于修复图片和链接
  const baseUrl = '/File/Blogs/Poster/'; 
  const filePath = baseUrl + 'Degeneracy_for_lidar.html';

  fetch(filePath)
    .then(response => response.text())
    .then(html => {
      // 【关键 2】路径预处理：修复图片、CSS 和 锚点链接
      // 将相对路径的 src/href 替换为绝对路径，防止 404
      let processedHtml = html
        .replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`) // 修复资源路径
        .replace(/href="[^"]*?#([^"]+)"/g, 'href="#$1"'); // 修复 TOC 锚点路径

      shadow.innerHTML = processedHtml;
      container.childNodes[0].textContent = "";

      // 【关键 3】处理 Shadow DOM 内部跳转
      shadow.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.hash) {
          const targetId = link.hash.substring(1);
          const targetElement = shadow.getElementById(targetId);
          if (targetElement) {
            e.preventDefault(); // 阻止浏览器默认的 404 跳转
            targetElement.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动
          }
        }
      });
    })
    .catch(err => {
      console.error('Failed to load content:', err);
      container.innerHTML = "Content load failed.";
    });
})();
</script>

<style>
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