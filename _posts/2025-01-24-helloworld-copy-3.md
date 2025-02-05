---
layout: post
title: "Hello World"
date:   2025-01-24
tags: [coding]
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
    <tr>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/md_blog/yijiansanlian.gif" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/md_blog/yijiansanlian.gif" width="100%" />
      </td>
    </tr>
  </table>
  <figcaption>
  图片标题
  </figcaption>
</div>

# 插入视频
## youtube视频

<div align="center">
<iframe width="80%" height="316" src="https://www.youtube.com/embed/Nn40U4e5Si8?si=P_4XDu5l83VeVRQo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## B站视频

<div align="center">
<iframe width="80%" height="316" src="//player.bilibili.com/player.html?isOutside=true&aid=983500021&bvid=BV15t4y1t7yS&cid=777013703&p=1&autoplay=0" title="Bilibili video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
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



# 参考资料
* [lemonchann的博客](https://lemonchann.github.io/blog/create_blog_with_github_pages/)
* [为Jekyll博客添加小功能](https://blog.csdn.net/ds19991999/article/details/81293467)
* [Markdown 语法简明笔记](https://lemonchann.github.io/blog/Markdown_brief_syntactic/)