---
layout: post
title: "Paper Survey之——LiDAR-SLAM中的退化检测"
date:   2025-03-16
tags: [SLAM, LiDAR]
comments: true
author: kwanwaipang
# toc: true
excerpt_separator: ""
---


<!-- * 目录
{:toc} -->

本文系统性地综述了 LiDAR-SLAM 过程中的退化检测（Degeneracy Detection）与补偿（Mitigation）方法。通过分析 Hessian 矩阵的特征值分布及能观性指标，探讨了在隧道、长走廊等极端环境下的鲁棒定位方案。

<div id="dynamic-content-root" class="custom-content-container">正在加载正文内容...</div>

<script>
(function() {
  const container = document.getElementById('dynamic-content-root');
  
  // 1. 双重保护：如果已经加载过或者没有容器，直接退出
  if (!container || container.dataset.loaded === 'true') return;
  
  // 标记为已加载，防止脚本重复执行
  container.dataset.loaded = 'true';

  const baseUrl = '/File/Blogs/Poster/'; 
  const filePath = baseUrl + 'Degeneracy_for_lidar.html';

  fetch(filePath)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 清理不需要的元素
      const toRemove = ['header', '.navbar', '.post-header', '#toc', '#newToc', '#toggleTocButton', '#scrollToTocButton', 'footer'];
      toRemove.forEach(s => doc.querySelectorAll(s).forEach(el => el.remove()));

      // 路径修复
      const rawBody = doc.body.innerHTML;
      const processedHtml = rawBody.replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`);

      // 提取并处理样式
      let styleContent = '';
      doc.querySelectorAll('style, link[rel="stylesheet"]').forEach(s => {
        if (s.tagName === 'LINK') {
          let href = s.getAttribute('href');
          if (!href.startsWith('http') && !href.startsWith('/')) s.setAttribute('href', baseUrl + href);
        }
        styleContent += s.outerHTML;
      });

      // 注入 Shadow DOM
      const shadow = container.attachShadow({ mode: 'open' });
      shadow.innerHTML = styleContent + processedHtml;
      container.childNodes[0].textContent = ""; 
    })
    .catch(err => {
      container.innerHTML = "内容加载失败";
    });
})();
</script>

<style>
/* 强制容器宽度与博客正文一致 */
#dynamic-content-root {
  display: block;
  width: 100% !important;
  margin: 0 auto;
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