---
layout: post
title: "Paper Survey之——Awesome Learning-based VO and VIO"
date:   2025-03-14
tags: [SLAM,Deep Learning]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言



<!-- 使用 iframe 嵌入html -->
{% raw %}
<div class="iframe-container" 
  style="
    position: relative;
    width: 100%;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe 
    id="dynamic-iframe"
    src="/File/Blogs/Poster/Learning_based_VO.html" 
    width="100%" 
    frameborder="0"
    onload="adjustIframeHeight(this)"
    style="opacity: 0; transition: opacity 0.3s ease-in-out;"
  ></iframe>
</div>

<script>
function adjustIframeHeight(iframe) {
  try {
    // 获取 iframe 内部文档的高度
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const height = Math.max(
      doc.body.scrollHeight,
      doc.documentElement.scrollHeight,
      doc.body.offsetHeight,
      doc.documentElement.offsetHeight,
      doc.documentElement.clientHeight
    );

    // 设置 iframe 高度并显示内容
    iframe.style.height = `${height}px`;
    iframe.style.opacity = '1';
    
    // 移除加载背景（可选）
    iframe.parentNode.style.background = 'none';
  } catch (e) {
    console.error('无法调整 iframe 高度:', e);
  }
}

// 监听窗口变化或内容动态加载（如异步内容）
window.addEventListener('resize', () => {
  const iframe = document.getElementById('dynamic-iframe');
  adjustIframeHeight(iframe);
});

// 监听内部页面动态内容变化（如 AJAX 加载）
const observer = new MutationObserver(() => {
  const iframe = document.getElementById('dynamic-iframe');
  adjustIframeHeight(iframe);
});

// 开始观察 iframe 内容变化
const iframe = document.getElementById('dynamic-iframe');
iframe.addEventListener('load', () => {
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  observer.observe(doc.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
});
</script>
{% endraw %}



