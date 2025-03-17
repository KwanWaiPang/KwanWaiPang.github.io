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
/* 新增外层容器样式 */
.iframe-container {
  width: 100%;
  max-width: 100vw;   /* 最大宽度限制为视口宽度 */
  overflow: hidden;     /* 隐藏溢出内容 */
  position: relative;   /* 相对定位 */
  left: 50%;            /* 左偏移 */
  right: 50%;           /* 右偏移 */
  margin-left: -50vw;   /* 向左补偿偏移 */
  margin-right: -50vw;  /* 向右补偿偏移 */
}

#iframe-content {
  width: 100vw;         /* 宽度等于视口宽度 */
  height: 100vh;        /* 初始高度设为视口高度 */
  border: none;
  transform-origin: 0 0; /* 缩放基点 */
  transform: scale(1);   /* 默认不缩放 */
}

@media screen and (max-width: 768px) {
  #iframe-content {
    transform: scale(0.8); /* 小屏幕时适当缩放 */
  }
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
// 改进后的自适应脚本
function resizeIframe() {
  const iframe = document.getElementById('iframe-content');
  try {
    const containerWidth = iframe.offsetWidth;
    const contentWidth = iframe.contentWindow.document.documentElement.scrollWidth;
    const contentHeight = iframe.contentWindow.document.documentElement.scrollHeight;

    // 自动缩放逻辑
    const scale = Math.min(1, containerWidth / contentWidth);
    iframe.style.transform = `scale(${scale})`;
    iframe.style.width = `${contentWidth}px`;
    iframe.style.height = `${contentHeight}px`;
    
    // 补偿缩放后的高度
    const scaledHeight = contentHeight * scale;
    iframe.parentElement.style.height = `${scaledHeight}px`;
    
  } catch (error) {
    console.log('跨域保护机制触发，请确保被嵌入页面与本站同源');
  }
}

// 初始化监听
window.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('iframe-content');
  iframe.addEventListener('load', () => {
    resizeIframe();
    window.addEventListener('resize', () => resizeIframe());
  });
});
</script>


<!-- # Hi~ 👋
only for template

## 版权声明

博客文章是我原创文章，存档于_posts 文件夹下，版权归我所有，转载请与我联系获得授权许可。

This blog is my original work, archived in the _posts folder, and all rights are reserved. 
Please contact me for authorization before reusing or reposting. -->
