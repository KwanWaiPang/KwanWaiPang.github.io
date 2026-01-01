---
layout: post
title: "利用 GitHub Actions 为 Markdown 项目自动添加目录"
date:   2025-02-06
tags: [Coding]
comments: true
author: kwanwaipang
toc: true
excerpt: "" # 【指定摘要内容】
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言
对于习惯用markdown写文档的朋友，整理文档是非常繁琐的。当然类似也可以搭建Jekyll静态博客，这样可以很简单的自动生成博客目录。但是对于仅仅管理markdown文档却要重新搭建Jekyll，未免过于繁琐，为此写下本博客，利用GitHub Actions来自动生成目录。
效果如下下图所示
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-181950@2x.png" width="80%" />
<figcaption>
</figcaption>
</div>
本博客以[我的一个github仓库](https://github.com/KwanWaiPang/Blog_basedon_markdown)为例子。（注意不仅仅适用于公开仓库，私密仓库也是适合的）

# 代码配置
1. 首先在需要生成目录的地方添加以下内容(以```readme.md```为例)：
   
```markdown
## 自动生成md.文件的目录
### list
<!-- AUTO_GENERATED_TOC_START -->

<!-- AUTO_GENERATED_TOC_END -->
```

2. 然后在相同目录下创建```generate_toc.py```文件：

```python 
import os
import re
import urllib.parse

markdown_dir = '_posts'  # 你的markdown文件夹名
target_file = 'readme.md'  # 目标文件（当前目录的.md文件）

# 获取所有.md文件，并按文件名排序
try:
    files = sorted([f for f in os.listdir(markdown_dir) if f.endswith('.md')])
except Exception as e:
    print(f"Error reading markdown directory: {e}")
    raise

# 打印文件列表，用于调试
print("Markdown files found:", files)

# 生成目录内容
toc_lines = []
for file in files:
    try:
        name = os.path.splitext(file)[0]
        # 使用 urllib.parse.quote 来处理文件名中的空格
        link = f"- [{name}](./{markdown_dir}/{urllib.parse.quote(file)})"
        toc_lines.append(link)
    except Exception as e:
        print(f"Error processing file {file}: {e}")
        continue

toc_content = "<!-- AUTO_GENERATED_TOC_START -->\n" + "\n".join(toc_lines) + "\n<!-- AUTO_GENERATED_TOC_END -->"

# 读取目标文件内容
try:
    with open(target_file, 'r') as f:
        content = f.read()
except Exception as e:
    print(f"Error reading {target_file}: {e}")
    raise

# 使用正则表达式替换占位符中的内容
try:
    new_content = re.sub(
        r'<!-- AUTO_GENERATED_TOC_START -->.*?<!-- AUTO_GENERATED_TOC_END -->',
        toc_content,
        content,
        flags=re.DOTALL
    )
except Exception as e:
    print(f"Error replacing TOC content: {e}")
    raise

# 将更新后的内容写回目标文件
try:
    with open(target_file, 'w') as f:
        f.write(new_content)
    print("TOC updated successfully!")
except Exception as e:
    print(f"Error writing {target_file}: {e}")
    raise

```

3. 创建```.github/workflows/update_toc.yml```文件如下

```yml
name: Update TOC

on:
  push:
    paths:
      - '_posts/**/*.md'  # 包括所有子文件夹中的.md文件
    branches:
      - main  # 或者你用的其他分支

jobs:
  generate-toc:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4  # 检出代码

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'  # 明确指定 Python 版本

      - name: Install dependencies
        run: |
          pip install requests  # 安装必要的依赖
          python --version  # 打印 Python 版本，以确保 Python 环境已正确设置

      - name: Check current directory
        run: |
          pwd  # 显示当前工作目录
          ls -l  # 列出当前工作目录中的文件

      - name: Generate TOC
        run: |
          python generate_toc.py  # 运行 TOC 生成脚本
          echo "Finished running generate_toc.py"  # 打印确认信息

      - name: Show git status
        run: git status  # 显示 Git 状态，检查是否有文件变动

      - name: Commit changes
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          git add README.md  # 添加修改的 README.md
          if git diff-index --quiet HEAD --; then
            echo "No changes to commit"
          else
            git commit -m "Auto-update TOC"
            git push https://x-access-token:${{ secrets.GH_TOKEN }}@github.com/${{ github.repository }}  # 使用 PAT 推送
          fi
```

至此，文件及代码的配置就结束了。接下来针对私密的仓库，需要有token才可以完成推送～

# 生成一个 Personal Access Token (PAT)
* 进入 GitHub 设置页面：
  * 访问你的 GitHub 帐号首页，点击右上角的 Profile Picture → Settings。
  * 生成 Personal Access Token：
  * 在左侧菜单中选择 Developer settings → Personal access tokens → Tokens (classic)。
  * 点击 Generate new token。
  * 选择以下权限：
    * repo（包括访问私有仓库和修改代码的权限）。
    * 其他你认为需要的权限。
  * 生成并保存这个 token（只会显示一次，之后无法查看）。

<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-175838@2x.png" width="80%" />
<figcaption>
</figcaption>
</div>

# 将 Personal Access Token 添加到 GitHub Secrets
变量名可以更改（保持一致性就可以了），至于value部分则是把token粘贴过来
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-180109@2x.png" width="80%" />
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-180450@2x.png" width="80%" />
<figcaption>
</figcaption>
</div>
接下来需要把action的Workflow permissions设置为可读可写
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-180711@2x.png" width="80%" />
<figcaption>
</figcaption>
</div>

然后测试效果如下（有这个提交的标志就证明push修改成功了）：
<div align="center">
  <img src="https://kwanwaipang.github.io/ubuntu_md_blog/images/WX20250206-181843@2x.png" width="80%" />
<figcaption>
</figcaption>
</div>
