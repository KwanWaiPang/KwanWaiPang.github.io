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
/* 保留原有结构并添加缩放支持 */
#iframe-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
}

#iframe-content {
  width: 100%;
  transform-origin: 0 0;  /* 缩放基点 */
  border: none;
  display: block;
}
</style>

<div id="iframe-wrapper">
  <iframe 
    id="iframe-content"
    src="https://kwanwaipang.github.io/index.html"
  ></iframe>
</div>

<script>
document.getElementById('iframe-content').addEventListener('load', function() {
  try {
    // 获取必要元素
    const iframe = this;
    const wrapper = document.getElementById('iframe-wrapper');
    
    // 计算缩放比例
    const getScale = () => {
      const contentWidth = iframe.contentWindow.document.documentElement.scrollWidth;
      const containerWidth = wrapper.offsetWidth;
      return Math.min(1, containerWidth / contentWidth);
    };

    // 更新尺寸函数
    const updateSize = () => {
      const scale = getScale();
      const contentHeight = iframe.contentWindow.document.documentElement.scrollHeight;
      
      // 应用缩放变换
      iframe.style.transform = `scale(${scale})`;
      wrapper.style.height = (contentHeight * scale) + 'px';
    };

    // 初始化设置
    updateSize();
    
    // 响应窗口变化（添加防抖）
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSize, 100);
    });

  } catch (error) {
    console.log('跨域保护触发，启用基础模式');
    // 降级处理：保持原有高度自适应
    this.style.height = this.contentWindow.document.documentElement.scrollHeight + 'px';
    window.addEventListener('resize', () => {
      this.style.height = this.contentWindow.document.documentElement.scrollHeight + 'px';
    });
  }
});
</script>


<!-- # Hi~ 👋
only for template

## 版权声明

博客文章是我原创文章，存档于_posts 文件夹下，版权归我所有，转载请与我联系获得授权许可。

This blog is my original work, archived in the _posts folder, and all rights are reserved. 
Please contact me for authorization before reusing or reposting. -->
