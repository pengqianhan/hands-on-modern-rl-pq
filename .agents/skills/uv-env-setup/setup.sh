#!/bin/bash
set -e

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../../.." && pwd )"

echo "============================================="
echo "Starting RL Environment Setup using uv-env-setup"
echo "Repository Root: $REPO_ROOT"
echo "============================================="

# 1. Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "uv could not be found. Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    # Source uv environment
    if [ -f "$HOME/.local/bin/env" ]; then
        source "$HOME/.local/bin/env"
    elif [ -d "$HOME/.local/bin" ]; then
        export PATH="$HOME/.local/bin:$PATH"
    fi
else
    echo "uv is already installed: $(uv --version)"
fi

# Double check if uv is in PATH now
if ! command -v uv &> /dev/null; then
    echo "Error: uv installation succeeded but 'uv' command is still not in PATH."
    exit 1
fi

# 2. Change directory to code/
cd "$REPO_ROOT/code"
echo "Changed directory to: $(pwd)"

# 3. Create pyproject.toml if not exists
if [ ! -f "pyproject.toml" ]; then
    echo "Creating pyproject.toml..."
    cat <<EOF > pyproject.toml
[project]
name = "hands-on-modern-rl-pq"
version = "0.1.0"
description = "Environment for hands-on reinforcement learning course"
requires-python = ">=3.10"
dependencies = []
EOF
else
    echo "pyproject.toml already exists."
fi

# 4. Pin Python version to 3.10
echo "Pinning Python to 3.10..."
uv python pin 3.10

# 5. Initialize environment
echo "Syncing virtual environment..."
uv sync

# 6. Add dependencies
echo "Adding PyTorch (arm64 native/MPS support)..."
uv add torch torchvision

echo "Adding core RL packages..."
uv add gymnasium "stable-baselines3[extra]"

echo "Adding scientific computing and visualization packages..."
uv add numpy scipy matplotlib seaborn pandas tqdm tensorboard wandb

# 7. Verification
echo "============================================="
echo "Verifying environment..."
echo "============================================="
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

echo ""
echo "============================================="
echo "👉 ATTENTION READERS / DEVELOPERS 👈"
echo "All RL code and scripts MUST be run under the 'code/' directory."
echo "Always use 'uv run <command>' inside the 'code/' directory."
echo "Example:"
echo "  cd code"
echo "  uv run python chapter01_cartpole/xxx.py"
echo "============================================="
