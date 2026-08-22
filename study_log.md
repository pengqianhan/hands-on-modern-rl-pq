# Study 分支学习日志

本分支基于上游教材仓库 `main` 分支，用于个人学习。相对 `main` 的改动**全部是新增文件**，
未修改教材原有的任何代码或文档（合并 `main` 时零冲突）。

最近一次同步 `main`：合并提交 `aea4442`（`main` 侧为 `85c8ae9`，2026-08-20）。

按时间正序记录，最早的在最上面，最新的追加在末尾。

---

## 2026-05-23 — 自建前三个 agent skill

| 文件 | 说明 |
| --- | --- |
| `git-pr-workflow/SKILL.md` | 交互式 git PR 工作流 |
| `uv-env/SKILL.md` | 用 uv 管理 Python 项目环境 |
| `uv-env-setup/SKILL.md`、`setup.sh` | Python RL 环境搭建流程与脚本 |

> 目录说明：技能同时存在于 `.agents/skills/` 和 `.claude/skills/`，后者是 Claude Code 实际加载的路径。

---

## 2026-06-07 — uv 环境配置

- `pyproject.toml` — 项目依赖与开发依赖定义
- `uv.lock` — 锁定文件（4266 行，占新增体积的绝大部分）
- `.python-version` — 指定 Python 版本
- `.vscode/settings.json` — 编辑器配置

---

## 2026-08-20 — 同步上游，建立学习日志

- 合并 `main`（`aea4442`），把上游教材的更新拉进 study 分支。
- 新建本文件 `study_log.md`（提交 `3e322b5`），开始记录 study 分支相对 `main` 的改动。

---

## 2026-08-22 — 第 1 章 CartPole：简化脚本 + 逐块运行 notebook

### 做了什么

把第 1 章的两份教材脚本各自转成了「简化版 `.py` + 逐块运行 `.ipynb`」，用于先读简化版再回看原版。

命名规则：简化版和 notebook 都沿用原脚本文件名加 `_simple`，并保留章节序号前缀，
这样 `.py` 与 `.ipynb` 一眼配对，序号也维持本章的阅读顺序。

| 文件 | 说明 |
| --- | --- |
| `code/chapter01_cartpole/1-ppo_cartpole_simple.py` | `1-ppo_cartpole.py` 去掉 SwanLab 的**忠实子集** |
| `code/chapter01_cartpole/1-ppo_cartpole_simple.ipynb` | 上面这份脚本的逐块运行版（原名 `learn_chapter01.ipynb`） |
| `code/chapter01_cartpole/2-pytorch_ppo_simple.py` | `2-pytorch_ppo.py` 去掉 SwanLab 的忠实子集（CSV 指标保留，`plot_curves.py` 要用） |
| `code/chapter01_cartpole/2-pytorch_ppo_simple.ipynb` | 手写 PPO 的逐块运行版，11 节，含正交初始化专题 |

**「忠实子集」的含义**：只做删除，存活的行逐字不变。目标是读完简化版后，
原版里**除了被删掉的那一层之外没有任何新东西**——`diff -u` 应该只显示删除行加 docstring。

`2-pytorch_ppo_simple.ipynb` 的结构：导入/设备/种子 → ActorCritic →
**正交初始化专题（2.1 / 2.2）** → collect_rollout → compute_gae → ppo_update →
建环境 → 训练循环 → 存 CSV 和模型 → 评估 → 演示 → 拆开看一次 rollout 存了什么。
四个命令行参数在 notebook 里提成了顶部常量：`SEED / ITERATIONS / STEPS_PER_ROLLOUT / GUI`。

### 学到的：正交初始化

- `nn.init.orthogonal_(W, gain=g)` 生成的 W 满足 $W^\top W = g^2 I$，即**所有奇异值都等于 g**。
  实现是对高斯随机矩阵做 QR 分解取正交因子，再乘 gain。
- 奇异值全相等 = 各方向等比缩放。前向输入范数乘 g，反向梯度乘 $W^\top$（奇异值同样是 g），
  信号与梯度在层间既不爆炸也不消失。对照组：`std=0.1` 的高斯初始化，最大/最小奇异值差 84 倍。
- `gain=√2` 是补偿激活吃掉的方差（He 初始化的由来）。这里激活其实是 Tanh
  （PyTorch 推荐 5/3），写 √2 是照抄 SB3 / OpenAI Baselines 的经验惯例，为了和 SB3 版可比。
- **关键在被覆盖的输出层**：两个循环先把所有层设成 √2，随后四行单独把
  `actor[-1]` 改成 `gain=0.01`、`critic[-1]` 改成 `gain=1.0`，这是故意写两遍。
  - Actor 输出层 `0.01` → logits 压到 ~0.005 → softmax 后两个动作各约 50%，
    **初始策略最大熵**。作用一是保证探索；作用二是避免第一次更新时
    PPO 的 ratio $\exp(\log\pi_{new}-\log\pi_{old})$ 冲出裁剪区间导致梯度被裁没或 KL 炸掉。
    训练循环打印的 `KL` 和 `clip%` 就是在盯这件事。
  - Critic 输出层 `1.0` → 回归的是真实回报值（几十到几百），保持单位缩放即可。
  - 实测权重绝对值均值：隐藏层 0.1411，Actor 输出层 0.0010，Critic 输出层 0.0999。

### 新增 skill

| 文件 | 说明 |
| --- | --- |
| `writing-for-agents/SKILL.md`、`SKILL-MECHANICS.md` | 写给 agent 读的文档（skill / CLAUDE.md）的方法论参考 |
| `script-to-study-notebook/SKILL.md` | 把教材脚本转成学习材料的五步流程 |

`script-to-study-notebook` 的五步：

1. **写忠实子集** — 只删不改，判据是 `diff -u` 只有删除行。
2. **烟雾运行** — 用仓库 `.venv`、缩短训练步数跑通。副本必须放在同目录，
   因为 `sys.path` bootstrap 依赖文件位置，放别处 import 不到 `device_utils`。
3. **切 notebook** — 只允许三处必要改动：`Path.cwd()` 代替 `__file__`、
   argparse 提成 cell 顶部常量、训练步数做成可调；外加一个脚本给不了的「手动展开」收尾 cell。
4. **验证 notebook** — 本仓库 anaconda 的 `nbconvert` 是坏的（缺 `jupyter_contrib_nbextensions`），
   venv 里也没有 `nbformat`；改用「拼接 code cell 成脚本再用 venv python 跑」。
5. **汇报** — 说清删了什么、三处适配、验证命令。

### 踩到的坑

- **IDE 会覆盖 notebook 修改**：在编辑器里打开着 `.ipynb` 时，外部对文件的修改会被
  编辑器内存里的旧副本自动保存覆盖。改完 notebook 要在 IDE 里重新加载（关标签页再打开）。
  幂等的插入脚本能救回来。
- **烟雾运行会往 `output/` 写产物**（CSV、`.pth`），验证完要删掉，
  否则会和 `plot_curves.py` 用的正式 `training_metrics_seed42.csv` 混淆。

---

## 附：同步 main 的方法

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

---

## 写新条目的约定

- 每次学习结束追加一个 `## YYYY-MM-DD — 一句话主题`，加在「附：同步 main 的方法」之前的末尾。
- 条目内按需分：**做了什么**（产出的文件）、**学到的**（概念、公式、实测数字）、**踩到的坑**。
- 日期用绝对日期，不写「今天」「上次」。
