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

<!-- <hr> -->

<div id="dynamic-content-root">Loading...</div>

<script>
(function() {
  const container = document.getElementById('dynamic-content-root');
  
  // 1. 创建 Shadow Root 实现样式隔离
  const shadow = container.attachShadow({ mode: 'open' });

  // 2. 使用 fetch 获取 index.html 的内容
  // 这里填写的路径是相对于当前 /about/ 页面的相对路径，或者直接写根路径 /index.html
  fetch('/index.html')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(html => {
      // 3. 将完整的 html 注入 Shadow DOM
      // Shadow DOM 会自动处理其中的 <html> <head> <body> 标签，
      // 并将样式限制在影子容器内，不会污染外面的 Jekyll 主题
      shadow.innerHTML = html;

      // 如果 index.html 里有 inline 脚本需要运行，可以在这里处理
      // 默认 innerHTML 不会执行 <script>，这是为了安全
      container.style.display = 'block';
      if(container.innerText === "加载中...") container.innerText = "";
    })
    .catch(error => {
      console.error('Error loading index.html:', error);
      container.innerHTML = `<p style="color:red;">内容加载失败，请访问 <a href="/">首页</a> 查看。</p>`;
    });
})();
</script>

<style>
#dynamic-content-root {
  min-height: 500px;
  width: 100%;
  /*  border: 1px solid #eee; /* 可选：给你的 index 区域加个边框 */
  padding: 10px;
  border-radius: 8px;
  background: #fff;
}
</style>


<!--

<style>
/* 内联样式隔离 */
#iframe-wrapper {
  width: 100%;
  overflow: hidden;
  border: none;
  display: block;
  margin: 0;
  padding: 0;
}

#iframe-content {
  width: 100%;
  border: none;
  display: block; /* 消除 iframe 默认的 inline 空隙 */
}
</style>

<div id="iframe-wrapper">
  <iframe 
    id="iframe-content"
    src="https://kwanwaipang.github.io/index.html" 
    onload="this.style.height = this.contentWindow.document.documentElement.scrollHeight + 'px'"
  ></iframe>
</div>

<script>
// 纯当前页面运行的脚本
document.getElementById('iframe-content').addEventListener('load', function() {
  try {
    const contentHeight = this.contentWindow.document.documentElement.scrollHeight;
    this.style.height = contentHeight +100+ 'px';//增加了高度
    // 添加窗口变化监听
    window.addEventListener('resize', () => {
      this.style.height = this.contentWindow.document.documentElement.scrollHeight + 'px';
    });
  } catch (error) {
    console.log('跨域保护机制触发，请确保被嵌入页面与本站同源');
  }
});
</script>

-->

<!-- # Hi~ 👋
only for template

## 版权声明

博客文章是我原创文章，存档于_posts 文件夹下，版权归我所有，转载请与我联系获得授权许可。

This blog is my original work, archived in the _posts folder, and all rights are reserved. 
Please contact me for authorization before reusing or reposting. -->
