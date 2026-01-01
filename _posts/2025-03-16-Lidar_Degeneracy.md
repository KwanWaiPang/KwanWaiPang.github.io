---
layout: post
title: "Paper Survey之——LiDAR-SLAM中的退化检测"
date:   2025-03-16
tags: [SLAM, LiDAR]
comments: true
author: kwanwaipang
# toc: true
# 强制定义摘要为纯文本，彻底隔绝脚本进入首页或摘要区
excerpt: "本文系统性地综述了 LiDAR-SLAM 过程中的退化检测（Degeneracy Detection）与补偿（Mitigation）方法。通过分析 Hessian 矩阵的特征值分布及能观性指标。"
---


<!-- * 目录
{:toc} -->

<div id="unique-post-container" style="display:none;">
  <div id="dynamic-content-root">加载中...</div>
</div>

<script>
(function() {
  // 【核心逻辑】检查当前容器是否在“摘要”或“预览”类名下
  // 很多主题会给摘要套上 .excerpt 或 .post-preview 类
  const container = document.getElementById('unique-post-container');
  if (!container) return;

  // 1. 唯一性锁：防止脚本多次运行
  if (window.HAS_LOADED_CONTENT) {
    container.remove(); // 如果已经加载过，直接把这个多余的容器删掉
    return;
  }

  // 2. 环境检查：判断是否在首页或者详情页的摘要区
  // 如果容器的父级包含 'excerpt' 相关的类名，通常就是多余的预览
  const parentClasses = container.parentElement.className.toLowerCase();
  if (parentClasses.includes('excerpt') || parentClasses.includes('summary')) {
    container.remove();
    return;
  }

  // 确定这是正式的展示区域
  window.HAS_LOADED_CONTENT = true;
  container.style.display = 'block';

  const shadow = document.getElementById('dynamic-content-root').attachShadow({ mode: 'open' });
  const baseUrl = '/File/Blogs/Poster/'; 
  const filePath = baseUrl + 'Degeneracy_for_lidar.html';

  fetch(filePath)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 清理
      const toRemove = ['header', '.navbar', '.post-header', '#toc', '#newToc', '#toggleTocButton', '#scrollToTocButton', 'footer'];
      toRemove.forEach(s => doc.querySelectorAll(s).forEach(el => el.remove()));

      // 路径修复
      const rawBody = doc.body.innerHTML;
      const processedHtml = rawBody.replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`);

      // 样式修复
      let styleContent = '';
      doc.querySelectorAll('style, link[rel="stylesheet"]').forEach(s => {
        if (s.tagName === 'LINK') {
          let href = s.getAttribute('href');
          if (!href.startsWith('http') && !href.startsWith('/')) s.setAttribute('href', baseUrl + href);
        }
        styleContent += s.outerHTML;
      });

      shadow.innerHTML = styleContent + processedHtml;
      document.getElementById('dynamic-content-root').childNodes[0].textContent = "";
    });
})();
</script>

<style>
#dynamic-content-root { width: 100%; display: block; }
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