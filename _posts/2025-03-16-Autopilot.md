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

* 原[博客](https://kwanwaipang.github.io/File/Blogs/Poster/%E6%99%BA%E9%A9%BE%E4%B8%AD%E7%9A%84%E2%80%9C%E6%97%A0%E5%9B%BE%E2%80%9D.html)

<div id="target-content-placeholder">正在加载内容，请稍候...</div>

<script>
(function() {
  // 1. 防止重复加载
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

      // 2. 精准提取：只抓取 <article> 标签内的标题，避免抓到网页顶部的重复标题
      const articleContent = doc.querySelector('article');
      if (!articleContent) {
          console.error("未找到 <article> 标签，请检查源 HTML 结构");
          return;
      }
      
      const headings = articleContent.querySelectorAll('h1, h2, h3, h4');
      
      // 3. 为标题添加 ID，用于后续跳转
      headings.forEach((h, index) => {
        h.setAttribute('id', 'dynamic-heading-' + index);
      });

      // 4. 清理干扰元素：移除源文件中的导航栏、页脚以及它自带的旧目录
      const toRemove = ['header', '.navbar', '.post-header', '#toc', '#newToc', '#toggleTocButton', '#scrollToTocButton', 'footer'];
      toRemove.forEach(s => doc.querySelectorAll(s).forEach(el => el.remove()));

      // 5. 处理样式和路径
      let styleContent = '';
      doc.querySelectorAll('style, link[rel="stylesheet"]').forEach(s => {
        if (s.tagName === 'LINK') {
          let href = s.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('/')) s.setAttribute('href', baseUrl + href);
        }
        styleContent += s.outerHTML;
      });

      const processedHtml = doc.body.innerHTML.replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`);

      // 6. 渲染到 Shadow DOM
      const target = document.getElementById('target-content-placeholder');
      if (target) {
        const shadow = target.attachShadow({ mode: 'open' });
        shadow.innerHTML = styleContent + processedHtml;
        target.textContent = ""; // 清除“正在加载”文字

        // 7. 渲染目录
        renderDynamicTOC(headings, shadow);
      }
    })
    .catch(err => {
      console.error("加载博客内容失败:", err);
      document.getElementById('target-content-placeholder').textContent = "内容加载失败，请刷新重试。";
    });

  // 构建目录函数
  function renderDynamicTOC(headings, shadow) {
    // 自动适配多种可能的 Jekyll TOC 容器选择器
    const tocContainer = document.querySelector('.toc ul, #markdown-toc, .post__toc ul'); 
    if (!tocContainer) {
        console.warn("未找到 Jekyll 生成的 TOC 容器 (ul)");
        return;
    }

    // 清空 Jekyll 自动生成的空目录（如果有）
    tocContainer.innerHTML = '';

    headings.forEach(h => {
      const level = parseInt(h.tagName.substring(1));
      const li = document.createElement('li');
      
      // 样式控制：根据 H1, H2, H3 层次缩进
      li.style.marginLeft = (level - 1) * 18 + 'px';
      li.style.listStyle = 'none';
      li.style.marginBottom = '5px';

      const a = document.createElement('a');
      a.textContent = h.textContent.trim();
      a.href = "javascript:void(0);";
      a.style.textDecoration = 'none';
      a.style.color = '#007bff'; // 设置为典型的链接蓝色

      // 跨越 Shadow DOM 的点击跳转逻辑
      a.onclick = (e) => {
        e.preventDefault();
        const targetId = h.getAttribute('id');
        const targetEl = shadow.getElementById(targetId);
        if (targetEl) {
          // 关键：由于有 fixed navbar，需要计算偏移量
          const headerOffset = 85; 
          const elementPosition = targetEl.getBoundingClientRect().top;
          const shadowHostPosition = shadow.host.getBoundingClientRect().top;
          const offsetPosition = elementPosition + shadowHostPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      };

      li.appendChild(a);
      tocContainer.appendChild(li);
    });
  }
})();
</script>

<style>
/* 隐藏多余的占位符（如果主题渲染了两次，第二次会被 JS 忽略并由 CSS 隐藏） */
#target-content-placeholder:not(:first-of-type) {
  width: 100%;
  display: none !important;
}
#target-content-placeholder {
  width: 100%;
  position: relative;
}
</style>

