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
          *, *::before, *::after { box-sizing: border-box; }
          /* fixed 才能真正吃到 td 的 30%/70%，避免头像按图片固有宽度把简介挤窄 */
          table {
            width: 100%;
            border-spacing: 0;
            table-layout: fixed;
          }
          /* 与学术主页 index.html 的 900px 版心对齐 */
          table[width="900"] {
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
          }
          td { vertical-align: top; }
          img, video { max-width: 100%; height: auto; }
          table.intro-profile > tbody > tr > td:first-child,
          table.intro-profile > tr > td:first-child { width: 30%; }
          table.intro-profile > tbody > tr > td:last-child,
          table.intro-profile > tr > td:last-child { width: 70%; }
          table.intro-profile img {
            width: 100%;
            height: auto;
            display: block;
          }
        </style>
      `;

      // 直接注入全部代码
      shadow.innerHTML = resetStyle+html;
      container.childNodes[0].textContent = ""; // 加载成功后移除 "Loading..." 文字

      // 锁定「头像 | 简介」那一张表的 30/70，与图2（学术主页）一致
      const introTable = Array.from(shadow.querySelectorAll('table')).find((table) => {
        const row = table.querySelector('tr');
        if (!row) return false;
        const cells = row.querySelectorAll(':scope > td');
        return cells.length === 2 && cells[0].querySelector('img[src*="Guan_Weipeng"]');
      });
      if (introTable) introTable.classList.add('intro-profile');

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

/* About 正文略加宽，让嵌入的学术主页能接近原 900px 版心（侧栏桌面布局） */
@media screen and (min-width: 1201px) {
  .wrapper-content > .container {
    max-width: min(920px, calc(100% - 16px));
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
