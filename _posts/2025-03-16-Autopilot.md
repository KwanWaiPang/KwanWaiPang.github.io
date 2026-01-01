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
  if (window.__LIDAR_BLOG_LOADED__) return;
  if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) return;

  window.__LIDAR_BLOG_LOADED__ = true;

  const baseUrl = '/File/Blogs/Poster/'; 
  const filePath = baseUrl + '智驾中的“无图”.html';

  fetch(filePath)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 1. 提取并清理内容
      const toRemove = ['header', '.navbar', '.post-header', '#toc', '#newToc', '#toggleTocButton', '#scrollToTocButton', 'footer'];
      toRemove.forEach(s => doc.querySelectorAll(s).forEach(el => el.remove()));

      // 2. 预处理标题：为所有标题添加 ID，以便点击目录时可以跳转
      const headings = doc.querySelectorAll('h1, h2, h3, h4');
      headings.forEach((h, index) => {
        h.setAttribute('id', 'content-heading-' + index);
      });

      const rawBody = doc.body.innerHTML;
      const processedHtml = rawBody.replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`);

      let styleContent = '';
      doc.querySelectorAll('style, link[rel="stylesheet"]').forEach(s => {
        if (s.tagName === 'LINK') {
          let href = s.getAttribute('href');
          if (!href.startsWith('http') && !href.startsWith('/')) s.setAttribute('href', baseUrl + href);
        }
        styleContent += s.outerHTML;
      });

      // 3. 渲染到 Shadow DOM
      const target = document.getElementById('target-content-placeholder');
      if (target) {
        const shadow = target.attachShadow({ mode: 'open' });
        shadow.innerHTML = styleContent + processedHtml;
        target.childNodes[0].textContent = ""; 

        // 4. 动态生成 TOC 列表
        renderDynamicTOC(headings, shadow);
      }
    });

  // 辅助函数：构建目录并挂载到 Jekyll 的 TOC 区域
  function renderDynamicTOC(headings, shadow) {
    // 寻找 Jekyll 默认生成的 TOC 容器（通常是 .toc 或 #markdown-toc）
    // 如果 Jekyll 只生成了“目录”两个字，通常下面会有一个空容器
    const tocContainer = document.querySelector('.toc, #markdown-toc, .post__toc'); 
    if (!tocContainer) return;

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.paddingLeft = '15px';

    headings.forEach(h => {
      const level = parseInt(h.tagName.substring(1));
      const li = document.createElement('li');
      li.style.marginLeft = (level - 1) * 15 + 'px';
      li.style.fontSize = (16 - level) + 'px';
      li.style.marginVertical = '5px';

      const a = document.createElement('a');
      a.textContent = h.textContent.trim();
      a.href = "#";
      a.style.textDecoration = 'none';
      a.style.color = 'inherit';

      // 核心点击事件：跨越 Shadow DOM 进行滚动
      a.onclick = (e) => {
        e.preventDefault();
        const targetId = h.getAttribute('id');
        const targetEl = shadow.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      li.appendChild(a);
      ul.appendChild(li);
    });

    // 清空原有的“只有目录两个字”的状态，并填入新列表
    // 假设你的主题结构里目录文字在某个 div 里，这里直接 append
    tocContainer.appendChild(ul);
  }
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

