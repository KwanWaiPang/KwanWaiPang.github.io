---
layout: page
title: About
permalink: /about/
---


<style>
/* 强制消除所有滚动条 */
#iframe-host {
  overflow: hidden !important;
  width: 100%;
  display: block;
  border: none;
}

/* 穿透式样式重置 */
#iframe-host iframe {
  overflow: hidden !important;
  border: none;
  display: block;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
}
</style>

<div id="iframe-host">
  <iframe 
    src="./index.html"
    onload='
      const calcHeight = () => {
        try {
          const body = this.contentWindow.document.body,
                html = this.contentWindow.document.documentElement;
          // 取最大可能高度
          const height = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
          );
          this.style.height = (height + 20) + "px"; // 增加容错余量
        } catch(e) {}
      };
      calcHeight();
      // 动态监听内容变化
      new ResizeObserver(calcHeight).observe(this);
      this.contentWindow.addEventListener("resize", calcHeight);
    '
  ></iframe>
</div>

<script>
// 保险机制：强制隐藏滚动条
document.querySelectorAll('html, body').forEach(el => {
  el.style.overflow = 'hidden';
});
</script>


<!-- # Hi~ 👋
only for template

## 版权声明

博客文章是我原创文章，存档于_posts 文件夹下，版权归我所有，转载请与我联系获得授权许可。

This blog is my original work, archived in the _posts folder, and all rights are reserved. 
Please contact me for authorization before reusing or reposting. -->
