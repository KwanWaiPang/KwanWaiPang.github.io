---
layout: post
title: "配置专属的Vercel 实例与github-readme-stats"
date:   2026-01-03
tags: [Coding]
comments: true
author: kwanwaipang
toc: true
excerpt: "解决github-readme-stats过期或加载不出的问题" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->


# 引言

之前一直采用`github-readme-stats.vercel.app`来配置github项目的卡片，这类工具因为共用 Vercel 的免费额度或 GitHub API 的调用限制，偶尔会出现“Expired”、“504”或“Rate Limit”的情况。

因此，本博文将其部署到自己的 Vercel 账号下。这样就有专属于你自己的域名和 API 额度，再也不会遇到“过期”或“速度慢”的问题。



# 获取个人的PAT

首先进入github的个人设置` Account -> Settings -> Developer Settings -> Personal access tokens -> Tokens (classic)`


<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/WX20260103-111621.png" width="60%" />
<figcaption>  
</figcaption>
</div>

选择：
* repo
* read:user

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/WX20260103-111936.png" width="70%" />
<figcaption>  
</figcaption>
</div>

生成后务必复制并保存这个 Token，离开页面后它就看不见了。

# 配置 Vercel

接下来到[网站](https://vercel.com/)，先用邮箱进行登录注册，然后链接github：

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/WX20260103-112338.png" width="70%" />
  <img src="https://r-c-group.github.io/blog_media/images/WX20260103-113051.png" width="70%" />
<figcaption>  
</figcaption>
</div>

然后fork[仓库](https://github.com/anuraghazra/github-readme-stats)，再回到[Vercel dashboard](https://vercel.com/guanweipengs-projects),点击`Add New...`


<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/WX20260103-113325.png" width="70%" />
  <img src="https://r-c-group.github.io/blog_media/images/WX20260103-113556.png" width="70%" />
  <img src="https://r-c-group.github.io/blog_media/images/WX20260103-113634.png" width="50%" />
<figcaption>  
</figcaption>
</div>

然后再对应的位置上填上创建的token

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/WX20260103-113745.png" width="70%" />
<figcaption>  
</figcaption>
</div>

然后点击`deploy`接下来应该就可以使用自己的api了～

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/WX20260103-113951.png" width="70%" />
<figcaption>  
</figcaption>
</div>

具体效果请见[My Github](https://github.com/KwanWaiPang)