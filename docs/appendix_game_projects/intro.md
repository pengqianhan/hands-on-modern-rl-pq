# 附录 E. 强化学习游戏项目

以下是 30 个强化学习玩游戏的里程碑论文/项目，按时间排序：

---

## 经典/棋盘游戏

| #   | 名称         | 游戏                    | 年份 | 关键信息                                                                 |
| --- | ------------ | ----------------------- | ---- | ------------------------------------------------------------------------ |
| 1   | TD-Gammon    | 西洋双陆棋 (Backgammon) | 1992 | Gerald Tesauro，通过自我对弈强化学习达到人类专家水平                     |
| 2   | Deep Blue    | 国际象棋 (Chess)        | 1997 | IBM，击败世界冠军卡斯帕罗夫（搜索为主，非纯RL）                          |
| 3   | AlphaGo      | 围棋 (Go)               | 2016 | DeepMind，D. Silver 等人，Nature 2016。RL + MCTS 击败李世石              |
| 4   | AlphaGo Zero | 围棋 (Go)               | 2017 | DeepMind，Nature 2017。不使用人类知识，纯自我对弈 RL，100:0 击败 AlphaGo |
| 5   | AlphaZero    | 围棋/国际象棋/将棋      | 2017 | DeepMind，通用 RL 算法，同时精通三种棋类                                 |
| 6   | MuZero       | 围棋/象棋/Atari         | 2020 | DeepMind，Schrittwieser 等人。不依赖游戏规则，同时学习模型和策略         |

---

## Atari 系列

| #   | 名称                             | 游戏              | 年份 | 关键信息                                                                 |
| --- | -------------------------------- | ----------------- | ---- | ------------------------------------------------------------------------ |
| 7   | DQN (Playing Atari with Deep RL) | Atari 2600 (7款)  | 2013 | DeepMind，V. Mnih 等人。开创性工作，首次用深度 RL 从像素直接学习游戏策略 |
| 8   | Human-level Control through DRL  | Atari 2600 (49款) | 2015 | DeepMind，Nature 2015。DQN 改进版，在 29 款 Atari 游戏上达到人类水平     |
| 9   | Prioritized Experience Replay    | Atari             | 2015 | T. Schaul 等人，改进经验回放，提升 DQN 在 Atari 上的表现                 |
| 10  | Rainbow DQN                      | Atari             | 2017 | M. Hessel 等人，整合六种 DQN 改进，全面超越原版 DQN                      |
| 11  | IQN (Implicit Quantile Networks) | Atari             | 2018 | W. Dabney 等人，分布强化学习，大幅提升 Atari 得分                        |

---

## 即时战略 (RTS) / MOBA

| #   | 名称                                      | 游戏      | 年份 | 关键信息                                                      |
| --- | ----------------------------------------- | --------- | ---- | ------------------------------------------------------------- |
| 12  | SC2LE (StarCraft II Learning Environment) | 星际争霸2 | 2017 | DeepMind，Vinyals 等人。提供 SC2 的 RL 研究环境和基准         |
| 13  | AlphaStar                                 | 星际争霸2 | 2019 | DeepMind，Nature 2019。多智能体 RL 达到 Grandmaster 级别      |
| 14  | TStarBot                                  | 星际争霸2 | 2019 | 腾讯，通过 RL 掌握 SC2 全局长宏观操作                         |
| 15  | OpenAI Five                               | Dota 2    | 2019 | OpenAI，Berner 等人。5v5 击败世界冠军 OG，大规模分布式 RL     |
| 16  | Honor of Kings 1v1                        | 王者荣耀  | 2020 | 腾讯 AI Lab，Ye 等人，AAAI 2020。双裁剪 PPO，掌握复杂操作控制 |
| 17  | Honor of Kings 5v5 (Full MOBA)            | 王者荣耀  | 2020 | 腾讯，NeurIPS 2020。40 英雄池，首个 MOBA 全游戏 AI 系统       |
| 18  | Honor of Kings Arena                      | 王者荣耀  | 2022 | 腾讯/上海交大，NeurIPS 2022。开放 RL 环境，泛化性挑战         |
| 19  | Mini Honor of Kings                       | 王者荣耀  | 2024 | 轻量级 MARL 环境，可在个人电脑上运行                          |

---

## FPS / 3D 游戏

| #   | 名称                                                                                                                   | 游戏                 | 年份                                            | 关键信息 |
| --- | ---------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------- | -------- |
| 20  | Playing FPS Games with Deep RL                                                                                         | FPS (ViZDoom) │ 2016 | arXiv 1609.05521，首次将深度 RL 应用于 FPS 游戏 |
| 21  | Quake III Arena: Capture the Flag │ 雷神之锤3 (CTF) │ 2019 │ DeepMind，Jaderberg 等人。多智能体 RL，自主涌现合作行为   |
| 22  | Obstacle Tower │ Obstacle Tower │ 2019 │ Unity，3D 挑战环境，测试 RL 智能体的泛化能力                                  |
| 23  | Sample Efficient RL in Minecraft (MineRL) │ 我的世界 │ 2021 │ Guss 等人，NeurIPS 竞赛，利用人类先验知识进行样本高效 RL |

---

## 体育/竞速/其他

| #   | 名称                                                                             | 游戏                                                      | 年份 | 关键信息 |
| --- | -------------------------------------------------------------------------------- | --------------------------------------------------------- | ---- | -------- |
| 24  | Google Research Football │ 足球 (11v11) │ 2020                                   | Google，Kurach 等人。开源足球模拟器，支持多智能体 RL 研究 |
| 25  | RL in Rocket League │ 火箭联盟 │ 2022 │ Walo 等人。在赛车+足球混合游戏中应用 RL  |
| 26  | Deep RL for Flappy Bird │ Flappy Bird │ 2015 │ K. Chen，早期深度 RL 游戏实践项目 |

---

## 多智能体/综合

| #   | 名称                                                                                                                                                  | 游戏 | 年份 | 关键信息 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | -------- |
| 27  | Deep RL for General Game Playing │ 通用棋类 │ 2020 │ AAAI 2020。将 AlphaZero 方法推广到通用博弈                                                       |
| 28  | OpenSpiel │ 多种棋类/卡牌 │ 2019 │ DeepMind，Lanctot 等人。RL 博弈框架，包含 20+ 种游戏                                                               |
| 29  | Hide-and-Seek (Multi-Agent Emergence) │ 捉迷藏 │ 2019 │ OpenAI，Baker 等人。多智能体涌现复杂策略（工具使用）                                          |
| 30  | Multi-Agent RL in Video Games │ 综述 │ 2025 │ Li 等人，IEEE ToG 2025。全面综述 MARL 在 Rocket League、Doom、Minecraft、SC2、Dota2、HoK 等游戏中的应用 |
