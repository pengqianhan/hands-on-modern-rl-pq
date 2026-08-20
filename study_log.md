# Study 分支记录

本分支基于上游教材仓库 `main` 分支，用于个人学习。相对 `main` 的改动**全部是新增文件**，
未修改教材原有的任何代码或文档（合并 `main` 时零冲突）。

最近一次同步 `main`：合并提交 `aea4442`（`main` 侧为 `85c8ae9`）。

## 一、自建 agent skills（`.agents/skills/`）

| 文件 | 说明 |
| --- | --- |
| `git-pr-workflow/SKILL.md` | 交互式 git PR 工作流 |
| `uv-env-setup/SKILL.md`、`setup.sh` | Python RL 环境搭建流程与脚本 |
| `uv-env/SKILL.md` | 用 uv 管理 Python 项目环境 |

## 二、uv 环境配置

- `pyproject.toml` — 项目依赖与开发依赖定义
- `uv.lock` — 锁定文件（4266 行，占新增体积的绝大部分）
- `.python-version` — 指定 Python 版本
- `.vscode/settings.json` — 编辑器配置

## 三、学习笔记

- `code/chapter01_cartpole/learn01.ipynb` — 第 1 章 CartPole 练习 notebook

## 同步 main 的方法

```bash
git fetch origin
git checkout main && git merge --ff-only origin/main
git checkout study && git merge main
git push origin study
```

若要先同步上游教材仓库（`upstream` = walkinglabs/hands-on-modern-rl）：

```bash
git fetch upstream
git checkout main && git merge upstream/main && git push origin main
```
