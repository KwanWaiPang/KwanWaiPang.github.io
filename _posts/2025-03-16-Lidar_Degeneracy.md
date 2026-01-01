---
layout: post
title: "Paper Survey之——LiDAR-SLAM中的退化检测"
date:   2025-03-16
tags: [SLAM, LiDAR]
comments: true
author: kwanwaipang
# toc: true
# 强制定义摘要为纯文本，彻底隔绝脚本进入首页或摘要区
excerpt: "本文系统性地综述了 LiDAR-SLAM 过程中的退化检测（Degeneracy Detection）与补偿（Mitigation）方法。"
---


<div id="target-content-placeholder">正在加载...</div>

<script>
(function() {
  // 1. 核心去重：检查全局变量，如果已存在则代表已经渲染过一次，立即销毁当前脚本
  if (window.__LIDAR_BLOG_LOADED__) return;

  // 2. 只有在详情页（即 URL 包含日期或标题）时才运行，防止首页误触发
  if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) return;

  // 3. 锁定状态
  window.__LIDAR_BLOG_LOADED__ = true;

  const baseUrl = '/File/Blogs/Poster/'; 
  const filePath = baseUrl + 'Degeneracy_for_lidar.html';

  fetch(filePath)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 移除干扰元素
      const toRemove = ['header', '.navbar', '.post-header', '#toc', '#newToc', '#toggleTocButton', '#scrollToTocButton', 'footer'];
      toRemove.forEach(s => doc.querySelectorAll(s).forEach(el => el.remove()));

      // 路径转换
      let rawBody = doc.body.innerHTML;
      
      // 处理图片和链接路径
      rawBody = rawBody.replace(/(src|href)="(?!(http|https|\/|#))/g, `$1="${baseUrl}`);
      
      // 样式提取
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

      // 4. 精准挂载：始终寻找页面中的第一个占位符进行渲染
      const target = document.getElementById('target-content-placeholder');
      if (target) {
        // 创建shadow DOM来隔离样式
        const shadow = target.attachShadow({ mode: 'open' });
        
        // 构建完整的shadow DOM内容，确保宽度为100%
        shadow.innerHTML = `
          <style>
            ${styleContent}
            :host {
              display: block;
              width: 100%;
              max-width: 100%;
            }
            body, html {
              width: 100%;
              margin: 0;
              padding: 0;
            }
            #content {
              width: 100%;
              max-width: 100%;
              margin: 0;
              padding: 0;
            }
          </style>
          <div id="content">${rawBody}</div>
        `;
      }
    })
    .catch(error => {
      console.error('加载内容时出错:', error);
      const target = document.getElementById('target-content-placeholder');
      if (target) {
        target.innerHTML = '<div style="color: red; padding: 20px;">内容加载失败: ' + error.message + '</div>';
      }
    });
})();
</script>

<style>
/* 隐藏多余的占位符 */
#target-content-placeholder:not(:first-of-type) {
  display: none !important;
}

#target-content-placeholder {
  width: 100%;
  max-width: 100%;
  display: block;
  margin: 0;
  padding: 0;
}

/* 确保容器宽度为100% */
.container {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 重置可能影响宽度的常见样式 */
#target-content-placeholder * {
  box-sizing: border-box;
}

/* 确保主要内容区域宽度 */
#target-content-placeholder div,
#target-content-placeholder article,
#target-content-placeholder section {
  width: 100% !important;
  max-width: 100% !important;
}
</style>

