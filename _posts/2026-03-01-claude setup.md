---
layout: post
title: "基于MacBook配置Claude"
date:   2026-03-01
tags: [Coding]
comments: true
author: kwanwaipang
toc: true
excerpt: "" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->


<!-- # 引言 -->

> **Claude Code** 是 Anthropic 推出的一款智能代码助手，它直接运行在你的终端（Terminal）中，能够理解整个代码库，通过自然语言指令帮你完成编码、调试、重构、Git 管理等开发任务。

---

## 一、什么是 Claude Code？

Claude Code 不是普通的代码补全工具，它是一个**具备自主行动能力（Agentic）的 AI 编程伙伴**。

你可以把它理解为：一个懂你项目全貌、能直接在你机器上执行操作的 AI 程序员。

### 核心能力

- **读写文件**：直接分析和修改项目文件
- **执行命令**：运行测试、脚本、构建流程
- **管理 Git**：自动提交、变基、创建 PR，并生成有意义的 commit 信息
- **理解代码库**：快速梳理项目架构、模块依赖关系
- **自然语言交互**：用中文或英文描述需求，Claude Code 自动完成

### 典型使用场景

```
# 示例：用自然语言与 Claude Code 对话

> 帮我修复 auth 模块里的类型错误
> 用连接池重构数据库层
> 把我的改动提交，并写一个清晰的 commit 信息
> 给 /api/users 接口写单元测试
```

---

## 二、系统要求

| 项目 | 要求 |
|------|------|
| 操作系统 | macOS、Windows（需 Git for Windows 或 WSL）、Linux |
| 内存 | 至少 4GB RAM |
| 网络 | 需要联网（调用 Anthropic API） |
| 账户 | Claude Pro / Max / Teams / Enterprise / Console 账户（**免费版不支持**） |
| Shell | Bash、Zsh、PowerShell 或 CMD |

---

## 三、安装教程

### 方式一：原生安装（官方推荐，无需 Node.js）

**macOS / Linux**

```bash
curl -fsSL https://claude.ai/install.sh | bash

# 对于macbook或者其他没法设置tun模式的，可通过下面命令实现tun链接
export https_proxy=http://127.0.0.1:17890
export http_proxy=http://127.0.0.1:17890

echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/ScreenShot_2026-03-01_192955_884.png" width="80%" />
<figcaption>  
</figcaption>
</div>

安装完成后验证：

```bash
claude --version
```

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/ScreenShot_2026-03-01_193552_139.png" width="80%" />
<figcaption>  
</figcaption>
</div>

---

### 方式二：通过 npm 安装（旧方式，仍可用）

> ⚠️ npm 安装方式已被官方标记为**不推荐（deprecated）**，建议优先使用原生安装。

```bash
npm install -g @anthropic-ai/claude-code
```

macOS 注意：建议使用 `nvm` 管理 Node.js，避免权限问题。

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node.js LTS
nvm install --lts

# 再安装 Claude Code
npm install -g @anthropic-ai/claude-code
```

---

### 方式三：Homebrew（macOS）

```bash
brew install claude-code

# 后续手动更新
brew upgrade claude-code
```

---

## 四、配置与认证

### 首次登录

安装完成后，进入你的项目目录并运行：

```bash
cd your-project
claude
```

首次运行会引导你完成浏览器 OAuth 登录（使用你的 Claude 账户）。

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/ScreenShot_2026-03-01_193720_841.png" width="80%" />
<figcaption>  
</figcaption>
</div>

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/ScreenShot_2026-03-01_194003_194.png" width="80%" />
<figcaption>  
</figcaption>
</div>

有三种：
1. Claude account with subscription（Claude 订阅账户）
适用于 Pro、Max、Team 或 Enterprise 订阅用户。也就是说你在 claude.ai 上有付费套餐，直接用这个账户登录即可，费用已包含在订阅里。这是最常见的方式。
2. Anthropic Console account（Console 账户，按 API 用量计费）
适用于在 console.anthropic.com 注册的开发者账户。使用 API Key 认证，按实际消耗的 Token 数量付费，适合轻量使用或企业内部集成场景。
3. 3rd-party platform（第三方平台）
支持通过 Amazon Bedrock、Microsoft Foundry 或 Google Vertex AI 来访问 Claude Code。适合已经在这些云平台上部署了 Claude 模型的企业用户，费用走对应云平台的账单。

看来需要购买了之后才可以使用的，先放弃掉了，改为采用`opencode.ai`的免费额度试试

```bash
curl -fsSL https://opencode.ai/install | bash

source ~/.zshrc

# 开启命令
cd <project>
opencode
```


<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/ScreenShot_2026-03-01_194706_712.png" width="80%" />
  <img src="https://r-c-group.github.io/blog_media/images/ScreenShot_2026-03-01_194952_855.png" width="80%" />
<figcaption>  
</figcaption>
</div>

一些命令说明：
* `/connect`:选择任意的任意 LLM 提供商（推荐选用OpenCode Zen）
* `/models`：选择模型
* 输入`/`即有一系列命令说明


<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/ScreenShot_2026-03-01_195857_287.png" width="80%" />
<figcaption>
模型情况（PS大部分需要购买）  
</figcaption>
</div>

测试过程：

<div align="center">
  <img src="https://r-c-group.github.io/blog_media/images/ScreenShot_2026-03-01_200158_989.png" width="80%" />
<figcaption> 
</figcaption>
</div>

---


## 参考资料
* [Claude Code overview](https://code.claude.com/docs/en/overview)
* [opencode.ai](https://opencode.ai/)
* [OpenCode简介](https://opencode.ai/docs/zh-cn)