# 代码索引

本目录包含课程各章的配套代码。每章代码可独立运行。

## 快速开始

```bash
# 全局安装（推荐先创建虚拟环境）
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 安装某一章的依赖
pip install -r chapter01_cartpole/requirements.txt
```

## 章节代码一览

| 章节 | 目录 | 代码文件 | 说明 |
|------|------|---------|------|
| **Ch01** 传统 RL 初体验 | `chapter01_cartpole/` | `hello_rl.py` | SB3 版 CartPole 训练与演示 |
| | | `hello_rl_tensorboard.py` | 带 TensorBoard 日志的训练版本 |
| | | `pytorch_from_scratch.py` | 纯 PyTorch REINFORCE 实现（黑盒拆解） |
| | | `requirements.txt` | gymnasium, stable-baselines3, torch, tensorboard |
| **Ch02** 现代 RL 初体验 | `chapter02_dpo/` | *(待补充)* | DPO 偏好微调代码 |
| **Ch03** MDP 与价值函数 | `chapter03_mdp/` | *(待补充)* | 猜硬币 MDP 游戏 |
| **Ch04** 策略梯度 | `chapter04_policy_gradient/` | *(待补充)* | REINFORCE + Actor-Critic |
| **Ch05** PPO | `chapter05_ppo/` | *(待补充)* | PPO 完整 PyTorch 实现 |
| **Ch06** DPO 深入 | `chapter06_dpo/` | *(待补充)* | DPO 数学推导与训练 |
| **Ch07** GRPO | `chapter07_grpo/` | *(待补充)* | GRPO + GSM8K 数学推理 |
| **Ch08** 算法选型 | `chapter08_algorithm_guide/` | *(无代码)* | 纯理论章节 |
| **Ch09** DQN 与 Atari | `chapter09_dqn_atari/` | *(待补充)* | DQN 玩 Pong |
| **Ch10** 连续控制 | `chapter10_continuous_control/` | *(待补充)* | PPO/TD3 + HalfCheetah |
| **Ch11** LLM 后训练 | `chapter11_llm_rlhf/` | *(待补充)* | RLHF 三阶段流水线 |
| **Ch12** VLM 强化学习 | `chapter12_vlm_rl/` | *(待补充)* | GRPO 训练 VLM |
| **Ch13** Agentic RL | `chapter13_agentic_rl/` | *(待补充)* | 工具调用智能体 |
| **Ch14** 调试指南 | `chapter14_common_pitfalls/` | *(待补充)* | 常见故障复现脚本 |
| **Ch15** 未来趋势 | `chapter15_future_trends/` | *(无代码)* | 纯理论章节 |
