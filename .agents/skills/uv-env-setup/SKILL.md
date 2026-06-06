---
name: uv-env-setup
description: Automatically set up the Python reinforcement learning environment for hands-on-modern-rl-pq in the repository root by default, or in a user-specified path when provided, especially optimized for macOS M1/arm64 architecture using uv.
---

# uv-env-setup

This skill automates the setup of the Python development environment for the **hands-on-modern-rl-pq** repository. By default, create the environment in the repository root. If the user explicitly provides a target path, create and manage the environment in that path instead. The workflow configures modern packages using the `uv` tool.

## Target Directory
> [!IMPORTANT]
> Default to the repository root for Python environment creation, script running, and package management.
> Only use another directory when the user explicitly specifies a target path.

If using the bundled script:
```bash
# Default: repository root
.agents/skills/uv-env-setup/setup.sh

# User-specified target path
.agents/skills/uv-env-setup/setup.sh code
```

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

### 1. Choose the Target Directory
Use the repository root unless the user specified a target path:
```bash
cd <repository-root>
```

### 2. Initialize `pyproject.toml`
Create a `pyproject.toml` in the target directory if it does not already exist:
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
Initialize the `.venv` inside the target directory:
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
> Please follow these steps to work with the code:
> 1. Change directory to the environment folder:
>    ```bash
>    cd <target-directory>
>    ```
> 2. Activate the virtual environment:
>    ```bash
>    source .venv/bin/activate
>    ```
> 3. Now you can run Python scripts or start Jupyter Notebooks natively:
>    ```bash
>    # Default repository-root setup:
>    python code/chapter01_cartpole/xxx.py
>
>    # If the user specified `code` as the target directory:
>    python chapter01_cartpole/xxx.py
>    ```
>
> [!TIP]
> **Dependency Management Recommendation (Optional)**:
> After activating the environment, you can install new packages using standard `pip install`. However, it is highly recommended to use `uv add <package>` instead (run inside the target directory).
> This automatically records the dependency in `pyproject.toml` and updates `uv.lock`, making it easier to share or reproduce the environment later.
