---
name: uv-env-setup
description: Automatically set up the Python reinforcement learning environment for hands-on-modern-rl-pq under the `code/` directory, especially optimized for macOS M1/arm64 architecture using uv.
---

# uv-env-setup

This skill automates the setup of the Python development environment for the **hands-on-modern-rl-pq** repository. It ensures the environment is created under the `code/` subdirectory (rather than the repository root) to avoid conflict with node-based doc site configs, and configures modern packages using the `uv` tool.

## Target Audience & Directory Warning
> [!IMPORTANT]
> **Warning**: All Python code execution, script running, and package management MUST be performed inside the `code/` directory.
> Do NOT create or run Python environments at the repository root level.

## Prerequisites
Before starting, ensure `uv` is installed.
Check version:
```bash
uv --version
```
If not installed, install via:
- **macOS/Linux**: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Windows**: `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`

---

## Automation Workflow

### 1. Change directory to `code/`
All operations must start from `code/`:
```bash
cd code
```

### 2. Initialize `pyproject.toml`
Create a `pyproject.toml` in the `code/` directory if it does not already exist:
```toml
[project]
name = "hands-on-modern-rl-pq"
version = "0.1.0"
description = "Environment for hands-on reinforcement learning course"
requires-python = ">=3.10"
dependencies = []
```

### 3. Pin Python Version (3.10 recommended)
To ensure compatibility with RL packages (e.g. `gymnasium`, `stable-baselines3`):
```bash
uv python pin 3.10
```

### 4. Create the Virtual Environment
Initialize the `.venv` inside `code/`:
```bash
uv sync
```

### 5. Install Dependencies (Optimized for Apple Silicon / M1 Chip)

Install PyTorch (arm64 native with MPS acceleration support):
```bash
uv add torch torchvision
```

Install core Reinforcement Learning packages:
```bash
uv add gymnasium "stable-baselines3[extra]"
```

Install scientific computing, visualization, and logging tools:
```bash
uv add numpy scipy matplotlib seaborn pandas tqdm tensorboard wandb
```

### 6. Verify Installation
Ensure that the environment works and PyTorch can access Apple Silicon GPU (MPS):
```bash
uv run python -c "
import torch
import platform
import gymnasium as gym

print('=' * 50)
print('Environment Verification Success!')
print(f'OS/Arch:      {platform.system()} / {platform.processor()}')
print(f'Python:       {platform.python_version()}')
print(f'PyTorch:      {torch.__version__}')
print(f'MPS (Metal):  {torch.backends.mps.is_available()}')
print(f'Gymnasium:    {gym.__version__}')
print('=' * 50)
"
```

---

## Reminding Readers
Once configuration completes, always display a notification or print a reminder to the user:
> [!TIP]
> Environment setup is complete!
> Remember to run all your code, Jupyter Notebooks, or commands inside the `code/` directory (e.g., prefixing them with `uv run` inside the `code/` folder).
