---
layout: post
title: "Hello World"
date:   2025-01-24
tags: [Coding]
comments: true
author: kwanwaipang
toc: true
---


* 目录
{:toc}


# 引言
本博客作为基于markdown的静态博客的第一篇博客，用于记录各类型指令以及进行测试~

对于基于markdown静态博客的配置过程可以参考[链接](https://lemonchann.github.io/blog/create_blog_with_github_pages/)，或者直接fork我的[github repositories](https://github.com/KwanWaiPang/Blog_basedon_markdown)进行配置也可~


# 使用此博客模板

博客初始化的时候参考的是[lemonchann的博客](https://lemonchann.github.io/blog/create_blog_with_github_pages/)。
而基于初始的模板，本博客做了系列的改进。
* 可以fork此[github 仓库](https://github.com/KwanWaiPang/Blog_basedon_markdown)然后重命名为自己想要的仓库名
* PS: 无需跟github账户同名，只需用链接:```https://YOUR_username.github.io/YOUR_repository_name/```即可接入对应的博客。比如此博客的接入链接为```https://kwanwaipang.github.io/Blog_basedon_markdown/```
* 需确保对应的```YOUR_repository_name```仓库中 Github Pages配置如下：

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250202171747.png" width="60%" />
<figcaption>  
</figcaption>
</div>

* 所有博客的文章用markdown语法，写好统一放在_post文件夹下上传，git page会自动从你的git仓库拉去解析成网页，立刻就能在你的博客网页浏览。
* 关于文章的命名格式：博客文章必须按照统一的命名格式 yyyy-mm-dd-blogName.md


# 插入图片与动图

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/md_blog/yijiansanlian.gif" width="60%" />
<figcaption>  
图片标题
</figcaption>
</div>

插入并列的两张图片：
<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/md_blog/yijiansanlian.gif" width="100%" />
        子标题1
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/md_blog/yijiansanlian.gif" width="100%" />
        子标题2
      </td>
    </tr>
  </table>
  <figcaption>
  图片标题
  </figcaption>
</div>

插入github项目及star统计，同时点击实现跳转

[![Github stars](https://img.shields.io/github/stars/KwanWaiPang/KwanWaiPang.github.io.svg)](https://github.com/KwanWaiPang/KwanWaiPang.github.io)

# 插入视频
## youtube视频

<!-- <div align="center">
<iframe width="80%" height="400" src="https://www.youtube.com/embed/Nn40U4e5Si8?si=P_4XDu5l83VeVRQo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div> -->
<div align="center" style="
  position: relative; 
  width: 80%; 
  height: 400px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe width="100%" height="100%"
    src="https://www.youtube.com/embed/Nn40U4e5Si8?si=P_4XDu5l83VeVRQo" 
    title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen  style="opacity: 0; transition: opacity 0.5s; border-radius: 15px;" onload="this.style.opacity='1'"
  ></iframe>
</div>

## B站视频

不带loading-icon.gif:

<div align="center">
<iframe width="80%" height="400" src="//player.bilibili.com/player.html?isOutside=true&aid=983500021&bvid=BV15t4y1t7yS&cid=777013703&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

带loading-icon.gif:

```html
<div align="center" style="
  position: relative; 
  width: 80%; 
  height: 400px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe width="100%" height="100%"
    src="填入B站链接&autoplay=0" 
    title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen  style="opacity: 0; transition: opacity 0.5s; border-radius: 15px;" onload="this.style.opacity='1'"
  ></iframe>
</div>
```

<div align="center" style="
  position: relative; 
  width: 80%; 
  height: 400px;
  margin: 0 auto;
  border-radius: 15px;
  background: url('https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif') center/contain no-repeat;
  ">
  <iframe width="100%" height="100%"
    src="//player.bilibili.com/player.html?isOutside=true&aid=983500021&bvid=BV15t4y1t7yS&cid=777013703&p=1&autoplay=0" 
    title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen  style="opacity: 0; transition: opacity 0.5s; border-radius: 15px;" onload="this.style.opacity='1'"
  ></iframe>
</div>

## 自己的视频链接
<div align="center">
<video playsinline autoplay loop muted src="https://kwanwaipang.github.io/SLAM_DEMO/PL-EVIO.mp4" poster="https://kwanwaipang.github.io/File/Representative_works/loading-icon.gif" alt="sym" width="80%" style="padding-top:0px;padding-bottom:0px;border-radius:15px;"></video>
</div>

# 插入代码块
~~~
hello world
~~~

<p><br></p>

{% highlight html %}
 This is some text in a paragraph.
{% endhighlight %}

## 插入c++代码
```cpp
int main() {
  int x = 6 + 6;
  cout << "Hello World! " << x << std::endl();
}
```

```c++
int main() {
  int x = 6 + 6;
  cout << "Hello World! " << x << std::endl();
}
```

## 插入python代码
```python 
print("Hello, World")
```

## 插入bash代码

```bash
# 注意：注释及部分字母是有区别的(注意要用bash而不是Bash)
rm -rf .git
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin YOUR_github_repository_name
git push -u origin main
```

若单纯使用代码块：
~~~
# 注意：注释是有区别的
rm -rf .git
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin YOUR_github_repository_name
git push -u origin main
~~~

# markdown中的数学公式
* a<sup>B</sup>  或  $a^B$
* a<sub>B</sub>  或  $a_B$
* $\vec{a}$  向量
* $\overline{a}$ 平均值
* $\widehat{a}$ (线性回归，直线方程) y尖
* $\widetilde{a}$ 颚化符号  等价无穷小
* $\dot{a}$   一阶导数
* $\ddot{a}$  二阶导数
* $\xi \in so(3)$

更多markdown符号[Link](https://blog.csdn.net/konglongdanfo1/article/details/85204312)

# 可视化三维模型.glb

* 对于下面的path_to_your.glb需要确保是可以在线下载的路径，输入浏览器检查一下即可

```html
<!-- 定义全局样式 -->

<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

<model-viewer
  src="path_to_your.glb" 
  alt="3D Model"
  ar
  auto-rotate
  camera-controls
  style="display: block; width: 100%; height: 500px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); overflow: hidden;"
></model-viewer>

```

效果如下所示：
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

<model-viewer
  src="https://kwanwaipang.github.io/ubuntu_md_blog/VGGT/mydesk.glb" 
  alt="3D Model"
  ar
  auto-rotate
  camera-controls
  style="display: block; width: 100%; height: 500px; border-radius: 15px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); overflow: hidden;"
></model-viewer>


# google搜索引擎中登记网站
* 首先在google的搜索栏中输入下面的语句：
~~~
site:https://kwanwaipang.github.io/
~~~

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250207-211228@2x.png" width="60%" />
<figcaption> 
可以搜到就证明网站已经被google收录了 
</figcaption>
</div>

* Google网站站长[Google Search Console](https://search.google.com/search-console?hl=zh-CN)然后添加资源，并按要求验证即可。下载对应的html文件，然后放在主目录下

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250207-211559@2x.png" width="60%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250207-211442@2x.png" width="60%" />
<figcaption> 
</figcaption>
</div>

* 接下来应该是通过添加站点，那么应该就让博客也可以被google搜到了

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250319174824.png" width="60%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/微信截图_20250319175610.png" width="60%" />
<figcaption> 
</figcaption>
</div>

所谓的站点地图是一个 XML 文件，列出了你网站上的所有页面，帮助 Google 爬虫更快地发现和索引你的内容。应该为`https://kwanwaipang.github.io/sitemap.xml`
但似乎还是无法抓取~~~

对应的`https://kwanwaipang.github.io/robots.txt`应该也是正常的



* 此外也可以通过注册一个[Google Analytics](https://analytics.google.com/analytics/web/?hl=zh-cn#),可以统计你博客网站的访问人数，访问来源等非常丰富的网站数据。对应修改```_config.yml```文件中的`google_analytics`即可
* 此博客采用了Google Analytics 4（GA4）而非旧版Universal Analytics（UA），详细请见代码`_includes\analytics.html`


# 参考资料
* [lemonchann的博客](https://lemonchann.github.io/blog/create_blog_with_github_pages/)
* [为Jekyll博客添加小功能](https://blog.csdn.net/ds19991999/article/details/81293467)
* [Markdown 语法简明笔记](https://lemonchann.github.io/blog/Markdown_brief_syntactic/)