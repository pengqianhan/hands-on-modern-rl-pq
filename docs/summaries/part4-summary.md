# Part 4: 前沿与进阶专题 — 知识总结

## 这一 Part 我们学了什么？

最后三章覆盖了现代 RL 的前沿方向，每一章都代表了 RL 从实验室走向真实世界的关键一步。学完后，你应该掌握以下核心知识点：

- **VLM RL**：差异化学习率（视觉编码器 lr 更小），奖励归因难题（视觉 token vs 文本 token 谁的错），视觉幻觉惩罚。
- **连续控制与具身智能**：DDPG 用确定性策略处理连续动作，TD3 用截断双 Q + 延迟更新 + 目标平滑解决高估问题，SAC 用最大熵目标同时保证探索和利用，扩散策略用生成模型支持多模态动作分布，Sim-to-Real 与域随机化。
- **未来趋势**：测试时计算（Tree of Thought / MCTS），自博弈（Generator-Judge 对抗），离线 RL（CQL/IQL/DT 从固定数据集学习），多智能体 RL。

下面让我们逐章复习这些内容。

## 第 10 章：VLM 强化学习——让视觉模型学会推理

### 从离散到连续：DQN 的局限

DQN 能玩转 CartPole 和 Atari，因为动作是有限的：左/右，或者手柄的几个方向。但机械臂的每个关节能施加 $[-10, 10]$ N·m 之间任意力矩，6 个关节联合起来有无限种组合。对每种组合都算一个 Q 值是不可能的。

DDPG（Deep Deterministic Policy Gradient）给出了第一条出路。它借鉴了 DQN 的经验回放和目标网络，但策略从"选最优动作"变成了"直接输出动作值"。具体来说，Actor 网络 $\mu_\theta(s)$ 直接输出连续动作，Critic 网络 $Q_\phi(s, a)$ 告诉它这个动作有多好，梯度从 Critic 反传到 Actor：

$$\nabla_\theta J \approx \mathbb{E}\left[\nabla_a Q_\phi(s, a)\big|_{a=\mu_\theta(s)} \cdot \nabla_\theta \mu_\theta(s)\right]$$

直觉上：Critic 画出一张"地形图"（Q 值关于动作的梯度），Actor 顺着上坡方向走。因为是确定性策略（每次对同一个状态输出同一个动作），需要外加噪声来探索。

### TD3：三个技巧让 DDPG 更稳定

DDPG 在实践中容易高估 Q 值，导致策略崩溃。TD3 用了三个精巧的改进。

**截断双 Q 学习**训练两个 Critic，取它们的较小值作为 TD Target，从根源上抑制高估。就像买东西时货比两家，取便宜的报价——虽然可能低估，但至少不会花冤枉钱：

```python
# TD3 的 TD Target 计算
with torch.no_grad():
    noise = torch.clamp(torch.randn_like(action) * 0.2, -0.5, 0.5)
    smoothed_action = torch.clamp(target_actor(next_state) + noise, -1, 1)
    target_q1 = target_critic1(next_state, smoothed_action)
    target_q2 = target_critic2(next_state, smoothed_action)
    td_target = reward + gamma * torch.min(target_q1, target_q2) * (1 - done)
```

**延迟策略更新**让 Actor 每 $d$ 步才更新一次（通常 $d=2$），先让 Critic 学准确了再更新策略。**目标策略平滑**在目标动作上加一点噪声，防止 Critic 对窄尖峰过拟合。

### SAC：用熵鼓励探索

SAC（Soft Actor-Critic）在 TD3 的基础上做了一个优雅的改变：把策略熵直接加入目标函数。

$$J_{\text{max-ent}} = \mathbb{E}\left[\sum_{t=0}^{\infty} \gamma^t \left(r_t + \alpha \mathcal{H}(\pi(\cdot|s_t))\right)\right]$$

这里的 $\mathcal{H}(\pi) = -\mathbb{E}_{a \sim \pi}[\log \pi(a|s)]$ 是策略的熵，$\alpha$ 控制熵的重要性。熵越大，策略越"随机"，探索越充分。SAC 会自动调节 $\alpha$：如果策略太确定了，就增大 $\alpha$ 鼓励探索；如果太随机了，就减小 $\alpha$ 让策略更聚焦。

SAC 使用**重参数化技巧** $a = \mu_\theta(s) + \sigma_\theta(s) \cdot \epsilon$（$\epsilon \sim \mathcal{N}(0, I)$）来让采样过程可微，从而能端到端地优化策略参数。这比 DDPG 的确定性策略多了"随机性"，反而让训练更稳定。

### 扩散策略：用生成模型做控制

DDPG、TD3、SAC 的策略都输出一个动作（或一个高斯分布），本质上是单峰的。但有些任务需要"在多种截然不同的动作之间切换"——比如机器人抓取，从上方抓和从侧面抓可能同样好。扩散策略用扩散模型来生成动作序列，天然支持多模态分布，适合这种需要多样化行为的场景。

### 具身智能：从仿真到现实

连续控制算法的终极目标是走向物理世界。Sim-to-Real 的核心挑战在于仿真与现实的差距（物理、感知、动力学）。域随机化通过大量随机化环境参数来训练鲁棒策略，世界模型则用生成模型预测环境动态来生成虚拟训练经验。

## 第 12 章：未来趋势——从 CartPole 到自进化系统

### 测试时计算：让模型"想一会儿再回答"

传统的 RL 训练提升的是模型的"能力"，但模型的"推理时间"是固定的。测试时计算（Test-Time Compute）的核心思想是：给模型更多推理时间，它就能给出更好的回答。

Tree of Thought 让模型同时探索多条推理路径，保留最有希望的分支。MCTS（蒙特卡洛树搜索）把棋类 AI 的搜索策略搬到语言空间中。OpenAI o1/o3 和 DeepSeek-R1 则展示了另一种可能：通过 RL 训练，模型学会了在内部隐式地搜索和验证，不需要显式的搜索树——它学会了"在脑子里想"。

### 自博弈与自进化

DeepSeek-R1-Zero 的实验揭示了一个惊人的现象：一个基础模型，不加任何 SFT，只用 RLVR 训练，就能涌现出 chain-of-thought 推理能力。这指向了一个更宏大的方向——**自博弈**（Self-Play）。Generator-Judge 对抗训练：两者相互竞争，共同提升。

### 离线 RL 与多智能体

**离线强化学习**（Offline RL）从固定的历史数据集中学习策略，不能主动尝试新动作。CQL、IQL、Decision Transformer 是三种代表方法。多智能体 RL（MARL）研究多个智能体在共享环境中同时学习和交互，引入非平稳性、信用分配等全新挑战。

## 小结

全书从 CartPole 出发，经过 MDP、DQN、策略梯度、PPO、DPO/GRPO、RLHF、Agentic RL、VLM RL、连续控制与具身智能，最终到达前沿趋势。这条路径上的每一个概念都环环相扣：贝尔曼方程的递归思想贯穿 Q-Learning 和 DQN；策略梯度定理是 REINFORCE、Actor-Critic 和 PPO 的共同基础；PPO 的裁剪机制被 GRPO 继承；DPO 的隐式奖励启发了 RLVR 的规则验证；连续控制算法让 RL 走进了物理世界。强化学习不是一个孤立的学科，而是一套解决"从经验中学习决策"的统一方法论。

> 回到 [前言](/preface/intro) 或前往 [附录](/appendix_common_pitfalls/intro) 继续深入学习。
