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
.iframe-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 0; /* 初始高度设为0，由脚本动态设置 */
}

#iframe-content {
  width: 100% !important; /* 强制宽度充满容器 */
  height: 1000px; /* 初始高度 */
  border: none;
  position: absolute;
  left: 0;
  top: 0;
}
</style>

<div class="iframe-container">
  <iframe 
    id="iframe-content"
    src="https://kwanwaipang.github.io/index.html" 
    scrolling="no"
  ></iframe>
</div>

<script>
// 改进版自适应脚本
function resizeIframe() {
  const container = document.querySelector('.iframe-container');
  const iframe = document.getElementById('iframe-content');
  
  try {
    // 获取实际可用宽度
    const containerWidth = container.offsetWidth;
    
    // 获取被嵌入页面的实际尺寸
    const contentWidth = iframe.contentWindow.document.documentElement.scrollWidth;
    const contentHeight = iframe.contentWindow.document.documentElement.scrollHeight;

    // 计算比例因子
    const scale = containerWidth / contentWidth;
    
    // 应用缩放变换
    iframe.style.transform = `scale(${scale})`;
    iframe.style.transformOrigin = '0 0';
    
    // 计算缩放后的实际占用空间
    const scaledHeight = contentHeight * scale;
    const scaledWidth = contentWidth * scale;
    
    // 设置容器尺寸
    container.style.height = `${scaledHeight}px`;
    container.style.width = `${scaledWidth}px`;
    
    // 设置iframe原始尺寸
    iframe.style.width = `${contentWidth}px`;
    iframe.style.height = `${contentHeight}px`;

  } catch (error) {
    console.error('尺寸获取失败:', error);
    // 降级方案：每列显示100%宽度
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    container.style.height = '100vh';
  }
}

// 添加智能监听
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeIframe, 100);
});

iframe.addEventListener('load', () => {
  resizeIframe();
  // 首次加载后额外检查
  setTimeout(resizeIframe, 500);
});
</script>


<!-- # Hi~ 👋
only for template

## 版权声明

博客文章是我原创文章，存档于_posts 文件夹下，版权归我所有，转载请与我联系获得授权许可。

This blog is my original work, archived in the _posts folder, and all rights are reserved. 
Please contact me for authorization before reusing or reposting. -->
