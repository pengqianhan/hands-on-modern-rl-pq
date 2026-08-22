"""
Chapter 1: Training CartPole with PPO from Stable-Baselines3 (simplified version)

This is 1-ppo_cartpole.py with all SwanLab logging removed. Everything else
(structure, flags, prints) is kept the same, so once you understand this file
you can read the full version and only the SwanLab parts will be new.

Usage:
    # Default: train (no GUI, fast)
    python 1-ppo_cartpole_simple.py

    # Show the GUI demo (pops up the cart animation window after training)
    python 1-ppo_cartpole_simple.py --gui

About the --gui flag:
    Training is always headless (no rendering), so its speed is unaffected
    by the GUI setting.
    --gui only controls whether the CartPole animation window pops up
    during the demo stage after training finishes.
"""

import argparse
import os
import sys
from pathlib import Path

_CODE_ROOT = Path(__file__).resolve().parents[1]
if str(_CODE_ROOT) not in sys.path:
    sys.path.insert(0, str(_CODE_ROOT))

import gymnasium as gym
import numpy as np
from stable_baselines3 import PPO
from stable_baselines3.common.evaluation import evaluate_policy

from device_utils import describe_device, resolve_sb3_device, print_device_report


def parse_args():
    parser = argparse.ArgumentParser(description="SB3 PPO CartPole training")
    parser.add_argument(
        "--gui", action="store_true",
        help="Pop up a GUI window to demo the agent after training finishes (off by default, only prints scores)",
    )
    parser.add_argument(
        "--device",
        choices=["auto", "cuda", "mps", "cpu"],
        default="auto",
        help="Training device: auto prefers CUDA, then Apple MPS, then CPU",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    os.makedirs("output", exist_ok=True)
    device = resolve_sb3_device(args.device)
    print_device_report(device)

    # ==========================================
    # Stage 1: Training
    # ==========================================
    env = gym.make("CartPole-v1")

    # Print environment info (observation space, action space, termination thresholds)
    print("=" * 50)
    print("CartPole-v1 environment info")
    print("=" * 50)
    print(f"  Observation space:  {env.observation_space}")
    print(f"  Action space:  {env.action_space}")
    print(f"  Observation upper bound:  {env.observation_space.high}")
    print(f"  Observation lower bound:  {env.observation_space.low}")
    print(f"  Termination condition:  position > ±{env.unwrapped.x_threshold}, "
          f"angle > ±{env.unwrapped.theta_threshold_radians:.4f} rad "
          f"(≈ ±{np.degrees(env.unwrapped.theta_threshold_radians):.0f}°)")
    print("=" * 50)

    model = PPO("MlpPolicy", env, verbose=1, device=device)
    if device == "mps":
        print(
            "Note: SB3 MlpPolicy on Apple MPS works, but CPU is often faster for "
            "small networks. Pass --device cpu to compare."
        )

    print(f"Starting training on {describe_device(device)}...")
    model.learn(total_timesteps=80000)

    # Evaluate
    mean_reward, std_reward = evaluate_policy(model, env, n_eval_episodes=10)
    print(f"Training complete! Mean reward: {mean_reward} +/- {std_reward}")

    model.save("output/ppo_cartpole")
    env.close()

    # ==========================================
    # Stage 2: Demoing what the agent learned
    # ==========================================
    print("\nDemoing what the agent learned...")
    render_mode = "human" if args.gui else None
    vis_env = gym.make("CartPole-v1", render_mode=render_mode)
    model = PPO.load("output/ppo_cartpole")

    for episode in range(5):
        obs, info = vis_env.reset()
        done, truncated, score = False, False, 0
        while not (done or truncated):
            action, _states = model.predict(obs, deterministic=True)
            obs, reward, done, truncated, info = vis_env.step(action)
            score += reward
        print(f"  Episode {episode + 1} score: {score}")

    vis_env.close()

    if args.gui:
        print("\nGUI demo finished.")
    else:
        print("\nTip: add --gui to pop up the cart animation window and watch the demo.")


if __name__ == "__main__":
    main()
