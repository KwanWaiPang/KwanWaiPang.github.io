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


<div id="dynamic-content-root">Loading...</div>

<script>
(function() {
  const container = document.getElementById('dynamic-content-root');
  const shadow = container.attachShadow({ mode: 'open' });
  
  // 1. 设置基础路径（确保资源能找到）
  const baseUrl = '/File/Blogs/Poster/'; 
  const filePath = baseUrl + 'Degeneracy_for_lidar.html';

  fetch(filePath)
    .then(response => response.text())
    .then(html => {
      // 2. 将字符串解析为虚拟 DOM 对象，方便“手术式”删除元素
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 3. 【精准剔除】不需要的部分
      const selectorsToRemove = [
        'header',               // 删除导航栏 (Nav bar)
        '.post-header',         // 删除文章页头 (Title section)
        '#toc',                 // 删除静态目录
        '#newToc',              // 删除动态目录容器
        '#toggleTocButton',     // 删除目录切换按钮
        '#scrollToTocButton',   // 删除回到目录按钮
        'footer'                // 删除页脚（可选）
      ];
      
      selectorsToRemove.forEach(selector => {
        const elements = doc.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // 4. 处理路径修复（图片和链接地址修复）
      // 将所有 src/href 相对路径修复为绝对路径，防止图片 404
      const content = doc.body.innerHTML;
      let processedHtml = content.replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`);

      // 5. 注入 Shadow DOM
      // 我们同时把原 HTML 的 <head> 里的样式也拿过来，确保字体和格式不变
      const styles = doc.querySelectorAll('style, link[rel="stylesheet"]');
      let styleHtml = '';
      styles.forEach(s => {
        // 修复外链 CSS 的路径
        if (s.tagName === 'LINK') {
          let href = s.getAttribute('href');
          if (!href.startsWith('http') && !href.startsWith('/')) {
            s.setAttribute('href', baseUrl + href);
          }
        }
        styleHtml += s.outerHTML;
      });

      shadow.innerHTML = styleHtml + processedHtml;
      container.childNodes[0].textContent = ""; 
    })
    .catch(err => {
      console.error('Error:', err);
      container.innerHTML = "Content load failed.";
    });
})();
</script>

<style>
/* 容器样式：确保宽度撑满，不留边框 */
#dynamic-content-root {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  /* 解决可能出现的 Jekyll 样式冲突 */
  line-height: normal; 
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