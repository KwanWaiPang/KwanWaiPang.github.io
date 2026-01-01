---
layout: post
title: "Paper Survey之——LiDAR-SLAM中的退化检测"
date:   2025-03-16
tags: [SLAM, LiDAR]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<div id="post-content-body">
  <div id="dynamic-content-root">正在加载正文内容...</div>
</div>

<script>
(function() {
  // 1. 变量保护：防止脚本在部分主题预览中被重复触发
  if (window.isPostAlreadyLoaded) return;
  
  const container = document.getElementById('dynamic-content-root');
  if (!container) return; // 如果在首页预览中找不到容器，则不执行脚本
  
  window.isPostAlreadyLoaded = true;

  // 2. 配置路径（确保末尾带斜杠）
  const baseUrl = '/File/Blogs/Poster/'; 
  const filePath = baseUrl + 'Degeneracy_for_lidar.html';

  // 3. 异步获取内容
  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error('File not found');
      return response.text();
    })
    .then(html => {
      // 4. 解析 HTML 并进行“手术式”清理
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 剔除不需要展示的冗余组件（导航栏、原有的标题、TOC按钮等）
      const toRemove = [
        'header', '.navbar', '.post-header', 
        '#toc', '#newToc', '#toggleTocButton', '#scrollToTocButton', 
        'footer', '.nofixed-bottom'
      ];
      toRemove.forEach(selector => {
        doc.querySelectorAll(selector).forEach(el => el.remove());
      });

      // 5. 路径修复：将相对路径转换为基于 baseUrl 的绝对路径（针对图片和链接）
      const rawBody = doc.body.innerHTML;
      const processedHtml = rawBody.replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`);

      // 6. 提取样式：确保原 HTML 的样式只作用于 Shadow DOM
      let styleContent = '';
      doc.querySelectorAll('style, link[rel="stylesheet"]').forEach(s => {
        if (s.tagName === 'LINK') {
          let href = s.getAttribute('href');
          if (!href.startsWith('http') && !href.startsWith('/')) {
            s.setAttribute('href', baseUrl + href);
          }
        }
        styleContent += s.outerHTML;
      });

      // 7. 注入隔离容器 (Shadow DOM)
      const shadow = container.attachShadow({ mode: 'open' });
      shadow.innerHTML = styleContent + processedHtml;
      
      // 成功加载后移除提示文字
      container.childNodes[0].textContent = "";
    })
    .catch(err => {
      console.error('Content Load Error:', err);
      container.innerHTML = `<p style="color:gray;">无法加载外部 HTML 内容，请确认路径是否正确：${filePath}</p>`;
    });
})();
</script>

<style>
/* 确保容器不会被 Jekyll 默认样式挤压 */
#dynamic-content-root {
  display: block;
  width: 100%;
  min-height: 600px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
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