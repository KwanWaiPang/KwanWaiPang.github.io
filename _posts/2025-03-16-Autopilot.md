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

<div id="target-content-placeholder">正在加载内容...</div>

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

      // 1. 彻底清理无关区域，只保留正文内容块
      // 我们移除所有已知的导航、页眉、页脚和原有的目录组件
      const selectorsToRemove = [
        'header', 'nav', '.navbar', '.post-header', 
        '#toc', '#newToc', '#toggleTocButton', '#scrollToTocButton', 
        'footer', '.footer'
      ];
      selectorsToRemove.forEach(s => {
        doc.querySelectorAll(s).forEach(el => el.remove());
      });

      // 2. 全文抓取标题 (H1-H4)
      // 此时 doc.body 剩下的基本就是正文了
      const headings = Array.from(doc.body.querySelectorAll('h1, h2, h3, h4'));
      
      // 为每个标题分配唯一 ID 供跳转使用
      headings.forEach((h, index) => {
        h.setAttribute('id', 'gh-heading-' + index);
      });

      // 3. 资源路径修复
      const rawBody = doc.body.innerHTML;
      const processedHtml = rawBody.replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`);

      // 4. 样式提取
      let styleContent = '';
      doc.querySelectorAll('style, link[rel="stylesheet"]').forEach(s => {
        if (s.tagName === 'LINK') {
          let href = s.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('/')) s.setAttribute('href', baseUrl + href);
        }
        styleContent += s.outerHTML;
      });

      // 5. 挂载到 Shadow DOM
      const target = document.getElementById('target-content-placeholder');
      if (target) {
        const shadow = target.attachShadow({ mode: 'open' });
        shadow.innerHTML = styleContent + processedHtml;
        target.textContent = ""; 

        // 6. 执行目录填充
        renderDynamicTOC(headings, shadow);
      }
    });

  function renderDynamicTOC(headings, shadow) {
    // 尝试寻找 Jekyll 渲染出来的各种可能的 TOC 容器
    const tocContainer = document.querySelector('#markdown-toc, .toc ul, .post__toc ul, #toc ul'); 
    
    if (!tocContainer) {
      console.warn("未找到目录挂载点，请检查 Jekyll 布局中是否存在 #markdown-toc");
      return;
    }

    // 清空现有内容（通常只有“目录”两个字或一个空列表）
    tocContainer.innerHTML = '';

    headings.forEach((h, index) => {
      const text = h.textContent.trim();
      if (!text) return;

      const level = parseInt(h.tagName.substring(1));
      const li = document.createElement('li');
      
      // 样式微调：根据标题等级缩进
      li.style.marginLeft = (level - 1) * 16 + 'px';
      li.style.listStyle = 'none';
      li.style.lineHeight = '1.6';

      const a = document.createElement('a');
      a.textContent = text;
      a.href = "javascript:void(0);";
      a.style.textDecoration = 'none';
      a.style.color = 'var(--link-color, #007bff)'; // 适配主题颜色或默认蓝

      // 跨越 Shadow DOM 的平滑滚动
      a.onclick = (e) => {
        e.preventDefault();
        const targetEl = shadow.getElementById(h.getAttribute('id'));
        if (targetEl) {
          const navHeight = 80; // 这里的数值应根据你博客顶栏的高度调整
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = targetEl.getBoundingClientRect().top;
          const shadowHostRect = shadow.host.getBoundingClientRect().top;
          
          const totalOffset = elementRect + shadowHostRect - bodyRect - navHeight;

          window.scrollTo({
            top: totalOffset,
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
/* 确保容器有足够高度防止抖动 */
#target-content-placeholder {
  min-height: 600px;
}

/* 强制让 Jekyll 的 TOC 容器可见 */
#markdown-toc, .toc ul {
  display: block !important;
  visibility: visible !important;
  padding-left: 0;
}
</style>
