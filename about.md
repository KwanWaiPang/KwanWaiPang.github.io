---
layout: page
title: About
permalink: /about/
---

# Hi~ 👋
This blog is my original work, archived in the `_posts` folder, and all rights are reserved. 
Please contact me for authorization before reusing or reposting.
* [My Homepage](https://kwanwaipang.github.io/) 

<style>
.iframe-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
}

#iframe-content {
  width: 100%;
  height: 500px; /* 初始高度 */
  border: none; /* 调试边框 */
}
</style>

<div class="iframe-wrapper">
  <iframe 
    id="iframe-content"
    src="https://kwanwaipang.github.io/index.html" 
    scrolling="no"
  ></iframe>
</div>

<script>
// 第一阶段：基础功能验证
function debugLayout() {
  const wrapper = document.querySelector('.iframe-wrapper');
  const iframe = document.getElementById('iframe-content');
  
  // 输出基础尺寸信息
  console.log('Wrapper尺寸:', {
    width: wrapper.offsetWidth,
    height: wrapper.offsetHeight
  });
  
  console.log('Iframe尺寸:', {
    width: iframe.offsetWidth,
    height: iframe.offsetHeight
  });

  // 强制设置初始尺寸
  iframe.style.width = wrapper.offsetWidth + 'px';
  iframe.style.height = '800px'; // 临时固定高度
}

// 第二阶段：渐进增强
function safeResize() {
  const iframe = document.getElementById('iframe-content');
  
  try {
    // 尝试获取文档尺寸
    const doc = iframe.contentWindow.document;
    const contentWidth = doc.documentElement.scrollWidth;
    const contentHeight = doc.documentElement.scrollHeight;
    
    console.log('内容实际尺寸:', { contentWidth, contentHeight });
    
    // 设置自适应尺寸
    iframe.style.width = '100%';
    iframe.style.height = contentHeight + 'px';
    
    // 更新容器高度
    document.querySelector('.iframe-wrapper').style.height = contentHeight + 'px';
    
  } catch (error) {
    console.warn('安全模式启用（跨域限制）');
    // 降级方案：响应式比例容器
    const aspectRatio = 16 / 9;
    const containerWidth = iframe.offsetWidth;
    iframe.style.height = (containerWidth / aspectRatio) + 'px';
  }
}

// 执行调试流程
window.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('iframe-content');
  
  // 第一步：验证基础布局
  debugLayout();
  
  // 第二步：渐进加载
  iframe.addEventListener('load', () => {
    setTimeout(() => {
      safeResize();
      window.addEventListener('resize', () => {
        setTimeout(safeResize, 100);
      });
    }, 500);
  });
});
</script>


<!-- # Hi~ 👋
only for template

## 版权声明

博客文章是我原创文章，存档于_posts 文件夹下，版权归我所有，转载请与我联系获得授权许可。

This blog is my original work, archived in the _posts folder, and all rights are reserved. 
Please contact me for authorization before reusing or reposting. -->
