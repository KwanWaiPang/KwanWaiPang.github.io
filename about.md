---
layout: page
title: About
permalink: /about/
---

# Hi~ 👋
This blog is my original work, archived in the `_posts` folder, and all rights are reserved. 
Please contact me for authorization before reusing or reposting.

If you find this blog is useful, a simple star (<a class="github-button" 
  href="https://github.com/KwanWaiPang/KwanWaiPang.github.io" 
  data-icon="octicon-star" 
  data-size="large"
  data-show-count="true" 
  aria-label="Star it on GitHub">Star on Github</a>) should be the best affirmation. 😊

<!-- * [My Homepage](https://kwanwaipang.github.io/)  -->

[comment]: <> (  <h2 align="center">PAPER</h2>)
  <h3 align="center">
  <a href="/about/">English Version</a> 
  | <a href="/about-cn/">中文版</a> 
  </h3>

<div id="dynamic-content-root">Loading...</div>

<script>
(function() {
  const container = document.getElementById('dynamic-content-root');
  const shadow = container.attachShadow({ mode: 'open' });

  // 这里的路径确保指向你仓库根目录的 index.html
  fetch('/index.html')
    .then(response => response.text())
    .then(html => {

      // 定义样式重置，解决行距和字体变大的问题
      // 这里使用 template 字符串，确保样式优先加载
      const resetStyle = `
        <style>
          :host {
            all: initial; /* 强行切断 Jekyll 所有的外部样式干扰 */
            display: block;
            line-height: 1.2 !important;
            font-family: 'Titillium Web', Verdana, Helvetica, sans-serif !important;
            font-size: 16px !important;
            color: #000;
          }
          /* 确保 Shadow DOM 内部的 table 能够撑开宽度 */
          table { width: 100%; border-spacing: 0; }
        </style>
      `;

      // 直接注入全部代码
      shadow.innerHTML = resetStyle+html;
      container.childNodes[0].textContent = ""; // 加载成功后移除 "Loading..." 文字

      // 动态修复 Shadow DOM 内部的相对路径 
      const elements = shadow.querySelectorAll('[href], [src]');
      elements.forEach(el => {
        ['href', 'src'].forEach(attr => {
          const val = el.getAttribute(attr);
          
          // 排除掉绝对路径、协议自适应链接、页面锚点和邮箱
          if (val && 
              !val.startsWith('http') && 
              !val.startsWith('//') && 
              !val.startsWith('mailto:') && 
              !val.startsWith('#')) {
            
            // 如果是以 "./" 开头，例如 "./home/"，将其修正为 "/home/"
            if (val.startsWith('./')) {
              el.setAttribute(attr, val.replace(/^\.\//, '/'));
            } 
            // 如果是纯相对路径，例如 "File/..."，将其修正为 "/File/..."
            else if (!val.startsWith('/')) {
              el.setAttribute(attr, '/' + val);
            }
          }
        });
      });
    })
    .catch(err => {
      console.error('Failed to load content:', err);
      container.innerHTML = "Content load failed.";
    });
})();
</script>

<style>
/* 仅保留必要的物理占位，不做任何视觉修饰 */
#dynamic-content-root {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
}
</style>
