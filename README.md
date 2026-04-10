<div align="center">
  <h1>Hands-on Modern Reinforcement Learning</h1>
  <p><strong>现代强化学习：从代码实现到数学本质</strong></p>

  <p>
    <a href="https://github.com/walkinglabs/hands-on-modern-rl/stargazers"><img src="https://img.shields.io/github/stars/walkinglabs/hands-on-modern-rl?style=for-the-badge&logo=github&color=eab676" alt="Stars" /></a>
    <a href="https://github.com/walkinglabs/hands-on-modern-rl/network/members"><img src="https://img.shields.io/github/forks/walkinglabs/hands-on-modern-rl?style=for-the-badge&logo=github&color=87a96b" alt="Forks" /></a>
    <a href="https://github.com/walkinglabs/hands-on-modern-rl/issues"><img src="https://img.shields.io/github/issues/walkinglabs/hands-on-modern-rl?style=for-the-badge&logo=github&color=c780e8" alt="Issues" /></a>
    <a href="https://github.com/walkinglabs/hands-on-modern-rl/pulls"><img src="https://img.shields.io/github/issues-pr/walkinglabs/hands-on-modern-rl?style=for-the-badge&logo=github&color=7ea9e1" alt="Pull Requests" /></a>
    <a href="https://github.com/walkinglabs/hands-on-modern-rl/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-e26d5c?style=for-the-badge" alt="CC BY-NC-SA 4.0 License" /></a>
  </p>

  <p>
    <a href="#课程概述">课程概述</a> &middot;
    <a href="#课程大纲">课程大纲</a> &middot;
    <a href="#本地运行环境">本地运行环境</a> &middot;
    <a href="#参与贡献">参与贡献</a>
  </p>
</div>

---

## 课程概述

强化学习（Reinforcement Learning）是机器学习中一个核心但门槛较高的分支。传统的教学路径通常从马尔可夫决策过程（MDP）和贝尔曼方程的形式化定义出发，这对许多学习者的耐心和理解力构成了不必要的挑战。

本课程采用另一种路径：**先建立直觉，再引入形式化**。我们认为，当学习者亲手实现一个算法、观察到它的行为，再回过头理解其背后的数学结构时，学习过程会更加自然，理解也会更加持久。

具体而言，课程围绕以下四条线索展开：

1. **代码先行**——从第一章起，学习者就动手训练一个智能体。不要求事先掌握全部理论，而是通过实验建立对问题的直觉。
2. **算法拆解**——对 PPO、DPO、GRPO 等当前工业界广泛使用的算法，逐行分析其代码实现，理解每一步设计选择背后的动机。
3. **理论回溯**——在具备了实践经验之后，系统地讲解 MDP、策略梯度定理等理论基础，完成从直觉到形式化的闭环。
4. **前沿衔接**——课程涵盖强化学习在大语言模型对齐（RLHF）、视觉-语言模型（VLMs）以及自主智能体（Agent）中的应用，使学习者能够将基础知识与当前研究前沿对接。

## 课程目标

学完本课程后，学习者应能够：

- 理解强化学习的核心数学框架（MDP、价值函数、策略梯度），并能够用代码将其实现。
- 阅读并理解 PPO、DPO、GRPO 等主流算法的原始论文及其工程实现。
- 理解强化学习在大语言模型后训练（post-training）中所扮演的角色，包括 RLHF 的完整流水线。
- 针对给定的实际问题，合理选择并调试试用的强化学习算法。

## 课程大纲

### 核心章节

| 章节           | 课题                                                                              | 核心内容                                                                                                                                                               |
| :------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Chapter 01** | [经典强化学习引论：求解 CartPole](docs/chapter01_cartpole/index.md)               | 运行第一个 CartPole 训练脚本，观察 reward 曲线从低到高的变化过程；在实验中理解状态、动作、奖励、策略等基本要素的含义。                                                 |
| **Chapter 02** | [现代强化学习引论：大语言模型与 DPO 对齐](docs/chapter02_dpo/index.md)            | 用 DPO 算法对 Qwen2.5-0.5B 进行偏好微调，直观体验后训练（post-training）的完整流程；理解预训练、SFT、RL 三阶段各自的定位与局限。                                       |
| **Chapter 03** | [理论基石：马尔可夫决策过程与价值函数](docs/chapter03_mdp/index.md)               | 通过简化的猜硬币游戏引入 MDP 五元组的形式化定义；推导贝尔曼方程，理解状态价值函数 V(s) 与动作价值函数 Q(s, a) 的递归关系。                                             |
| **Chapter 04** | [策略梯度：从 REINFORCE 到 Actor-Critic](docs/chapter04_policy_gradient/index.md) | 从摇骰子实验出发推导策略梯度定理；实现 REINFORCE 算法并观察其高方差问题；引入基线与优势函数，构建 Actor-Critic 架构。                                                  |
| **Chapter 05** | [近端策略优化 (PPO)](docs/chapter05_ppo/index.md)                                 | 用 PPO 训练 LunarLander，分析策略崩溃、clip fraction 异常等训练现象；推导重要性采样、裁剪目标函数与 GAE（广义优势估计）的数学形式；建立 PPO 与 LLM 对齐的对应关系。    |
| **Chapter 06** | [直接偏好优化 (DPO)](docs/chapter06_dpo/index.md)                                 | 分析 RLHF 中奖励模型的工程痛点（训练成本、奖励黑客）；推导 Bradley-Terry 偏好模型到 DPO 损失函数的等价变换；对比 DPO 与 PPO 的适用场景。                               |
| **Chapter 07** | [群体相对策略优化 (GRPO)](docs/chapter07_grpo/index.md)                           | 在 GSM8K 数学推理任务上运行 GRPO 训练；理解其核心思路——用组内相对比较替代 Critic 网络的绝对价值估计，从而大幅降低显存开销；分析 DeepSeek-R1 中 GRPO 的多阶段训练流程。 |
| **Chapter 08** | [算法选型指南](docs/chapter08_algorithm_guide/index.md)                           | 针对游戏控制、小模型对齐、推理增强、复杂偏好对齐等典型场景，给出算法选择的决策依据与理由。                                                                             |
| **Chapter 09** | [基于价值的方法：DQN 与 Atari 环境](docs/chapter09_dqn_atari/index.md)            | 从 Q-Learning 的维度灾难出发，引入深度 Q 网络；解析经验回放与目标网络两大支柱机制；延伸至 Double DQN、Dueling DQN、Rainbow 等改进谱系。                                |
| **Chapter 10** | [连续控制空间](docs/chapter10_continuous_control/index.md)                        | 在 HalfCheetah 等环境中对比高斯策略与确定性策略；实现 DDPG 与 TD3，分析目标平滑正则化的作用；介绍向量化环境与并行采样加速策略。                                        |
| **Chapter 11** | [LLM 后训练工程实践](docs/chapter11_llm_rlhf/index.md)                            | 从头跑通 SFT → 奖励模型训练 → PPO 优化的 RLHF 三阶段流水线；讨论奖励函数设计（规则奖励 vs 模型奖励）、奖励黑客的识别与防范、KL 散度惩罚等工程实践。                    |
| **Chapter 12** | [视觉-语言模型中的强化学习](docs/chapter12_vlm_rl/index.md)                       | 用 GRPO 训练 VLM 回答视觉问题，观察推理步骤从随机到有序的变化；讨论视觉 token 与文本 token 的奖励分配问题；介绍 VisPlay、VISTA-Gym 等代表性框架。                      |
| **Chapter 13** | [智能体强化学习](docs/chapter13_agentic_rl/index.md)                              | 训练一个学会调用计算器工具的智能体；理解动作空间扩展（文本生成 + 工具调用）与多轮交互的 MDP 建模方式；分析工具调用率与准确率的同步演化。                               |
| **Chapter 14** | [调试实践指南](docs/chapter14_common_pitfalls/index.md)                           | 逐一复现策略崩溃、奖励黑客、显存溢出、训练不收敛四类常见故障；给出每种故障的现象描述、理论解释与修复验证方法。                                                         |
| **Chapter 15** | [未来趋势](docs/chapter15_future_trends/index.md)                                 | 讨论测试时计算扩展（inference-time search）、多模态与具身智能中的 RL 融合、以及开源社区的学习路径。                                                                    |

### 附录材料

| 附录           | 课题                                                       | 说明                                                                                                                               |
| :------------- | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Appendix A** | [数学预备知识](docs/appendix_math/index.md)                | 概率论、优化方法与信息论中的相关概念。                                                                                             |
| **Appendix B** | [环境配置指南](docs/appendix_env_install/index.md)         | 依赖安装与环境搭建。                                                                                                               |
| **Appendix C** | [论文阅读清单](docs/appendix_papers/index.md)              | 本课程涉及的经典论文与前沿文献。                                                                                                   |
| **Appendix D** | [术语对照表](docs/appendix_terminology/index.md)           | 常见概念的中英文术语对照与简要释义。                                                                                               |
| **Appendix E** | [强化学习游戏里程碑](docs/appendix_game_projects/index.md) | 30 个 RL 玩游戏的里程碑项目，涵盖棋盘博弈（AlphaGo）、Atari、MOBA（Dota 2, 王者荣耀）、FPS、多智能体等方向，附论文出处与关键贡献。 |

## 本地运行环境

本课程的文档站点基于 [VitePress](https://vitepress.dev/) 构建。在本地预览或贡献内容，需要以下步骤：

### 前置要求

- Node.js >= 18.0.0

### 安装与启动

```bash
git clone https://github.com/walkinglabs/hands-on-modern-rl.git
cd hands-on-modern-rl
npm install
npm run dev
```

启动后访问 `http://localhost:5173` 即可浏览课程内容。

### 常用命令

```bash
npm run build    # 构建静态站点
npm run preview  # 本地预览构建产物
npm run verify   # 构建检查（提交 PR 前请务必执行）
npm run format   # 代码格式化
npm run lint     # 代码规范检查
```

## 仓库结构

```text
hands-on-modern-rl/
├── docs/                      # 课程文档（VitePress）
│   ├── .vitepress/            # 站点配置与自定义组件
│   ├── public/                # 静态资源
│   ├── chapter*/              # 各章节 Markdown 文件
│   └── appendix*/             # 附录与补充材料
├── scripts/                   # 自动化脚本（站点地图生成等）
├── .github/workflows/         # CI/CD 配置
├── package.json               # 项目配置
└── AGENTS.md                  # 仓库维护规则
```

## 参与贡献

欢迎通过 Pull Request 或 Issue 参与本课程的改进。为保证协作效率，请注意以下几点：

1. **保持单一职责**：每个 PR 聚焦于一个明确的改动，避免混合不相关的修改。
2. **遵循目录命名规范**：在 `docs/` 下新增内容时，使用连字符命名法（如 `chapter16-new-topic`），并以 `index.md` 作为入口文件。
3. **提交前验证**：若修改涉及 `.vitepress/config.mjs` 或构建脚本，请运行 `npm run verify` 确认无破坏性变更。
4. **Commit 规范**：遵循 [Conventional Commits](https://www.conventionalcommits.org/)（如 `feat:`, `fix:`, `docs:`, `chore:`）。

详细的维护与协作规则参见 [AGENTS.md](./AGENTS.md)。

## 许可协议

本课程内容基于 [CC BY-NC-SA 4.0（署名-非商业性使用-相同方式共享 4.0 国际）](./LICENSE) 协议发布。

---

<div align="center">
  <sub>Maintained by WalkingLabs and the open-source community.</sub>
</div>
