---
layout: post
title: "智驾中的“无图”"
date:   2025-03-16
tags: [Robotics]
comments: true
author: kwanwaipang
toc: true
excerpt: "本博文记录了本人调研自动驾驶中无图的相关survey" # 【核心：指定摘要分隔符】
---




<div id="target-content-placeholder">正在加载...</div>

<script>
(function() {
  // 1. 核心去重：检查全局变量，如果已存在则代表已经渲染过一次，立即销毁当前脚本
  if (window.__LIDAR_BLOG_LOADED__) return;

  // 2. 只有在详情页（即 URL 包含日期或标题）时才运行，防止首页误触发
  // 如果你的首页 URL 也是这个，可以去掉这个判断
  if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) return;

  // 3. 锁定状态
  window.__LIDAR_BLOG_LOADED__ = true;

  const baseUrl = '/File/Blogs/Poster/'; 
  const filePath = baseUrl + '智驾中的“无图”.html';

  fetch(filePath)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 移除干扰元素
      const toRemove = ['header', '.navbar', '.post-header', '#toc', '#newToc', '#toggleTocButton', '#scrollToTocButton', 'footer'];
      toRemove.forEach(s => doc.querySelectorAll(s).forEach(el => el.remove()));

      // 路径转换
      const rawBody = doc.body.innerHTML;
      const processedHtml = rawBody.replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`);

      // 样式提取
      let styleContent = '';
      doc.querySelectorAll('style, link[rel="stylesheet"]').forEach(s => {
        if (s.tagName === 'LINK') {
          let href = s.getAttribute('href');
          if (!href.startsWith('http') && !href.startsWith('/')) s.setAttribute('href', baseUrl + href);
        }
        styleContent += s.outerHTML;
      });

      // 4. 精准挂载：始终寻找页面中的第一个占位符进行渲染
      const target = document.getElementById('target-content-placeholder');
      if (target) {
        const shadow = target.attachShadow({ mode: 'open' });
        shadow.innerHTML = styleContent + processedHtml;
        target.childNodes[0].textContent = ""; 
      }
    });
})();
</script>

<style>
/* 隐藏多余的占位符（如果主题渲染了两次，第二次会被 JS 忽略并由 CSS 隐藏） */
#target-content-placeholder:not(:first-of-type) {
  display: none !important;
}
#target-content-placeholder {
  width: 100%;
  position: relative;
}
</style>

