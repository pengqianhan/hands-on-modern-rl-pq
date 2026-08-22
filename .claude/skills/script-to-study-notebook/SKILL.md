---
name: script-to-study-notebook
description: Turn a course script in code/ into study material — a stripped-down `*_simple.py` and/or a block-by-block `*_simple.ipynb`. Use when asked to simplify a training script, remove SwanLab/logging scaffolding for reading, or split a script into notebook cells to run and inspect step by step.
---

# Script → study material

Two deliverables, produced in order. The user may ask for only the first; ask nothing and produce both when the request names the notebook.

- `<script>_simple.py` — a **faithful subset** of the original.
- `<script>_simple.ipynb` — that subset cut into runnable blocks with Chinese markdown between them.

Both deliverables keep the original's filename and its chapter number prefix, so `2-pytorch_ppo.py` yields `2-pytorch_ppo_simple.py` and `2-pytorch_ppo_simple.ipynb`. The number orders the chapter's reading path; dropping or changing it breaks that order.

The reader's goal is seamless transfer: after reading the simple version, the original must contain **nothing new except the parts you removed**. Every deviation beyond removal breaks that.

## Step 1 — Write the faithful subset

Read the original in full first. Then copy it and delete, keeping every surviving line byte-identical wherever possible.

Remove: experiment-tracking imports and callbacks (SwanLab, wandb, tensorboard), classes that exist only to patch those callbacks, the CLI flags and end-of-run print lines that only serve them.

Keep: imports the core path uses, `sys.path` bootstrapping, `device_utils` device selection, environment-info prints, section-banner comments, argparse flags that control real behaviour (`--gui`, `--device`), function boundaries, variable names, print wording.

Rewrite only the module docstring, to say what this file is and which layer the original adds on top.

Completion criterion: `diff -u` against the original shows only removals plus the docstring — no reordered lines, no renamed variables, no added conveniences.

## Step 2 — Smoke run the subset

Run it with the repo venv, with the training length cut down so it finishes in under a minute. Copy to a sibling `_smoke.py` in the *same directory* and edit that — the `sys.path` bootstrap resolves relative to the file, so a copy in the scratchpad cannot import `device_utils`.

```bash
cd code/<chapter> && sed 's/total_timesteps=80000/total_timesteps=2048/' X_simple.py > _smoke.py \
  && /path/to/repo/.venv/bin/python _smoke.py 2>&1 | tail -25; rm -f _smoke.py
```

Completion criterion: the run reaches its final print with no traceback.

## Step 3 — Cut the notebook

Append to a notebook already covering this script when one exists, keeping the cells already there; otherwise create one with kernel `python3`.

One cell per stage of the script, each preceded by a markdown cell in Chinese explaining what that block does and what to watch in its output. Typical cut: imports + device → build env + print its info → build model → train → evaluate + save → demo episodes.

Three adaptations the notebook forces, and no others:

- `__file__` does not exist. Bootstrap `sys.path` from `Path.cwd()`, guarding for either the chapter directory or the repo root as cwd.
- argparse does not exist. Hoist each flag to a named constant at the top of its cell (`GUI = False`, `TOTAL_TIMESTEPS = 20000`), so it is edited in place. Default the GUI off: a render window blocks the kernel.
- Long training blocks the kernel. Make the timestep constant obviously tunable and say in the markdown to try a small value first.

Add one closing cell the script cannot show: a hand-unrolled loop of ~5 `env.step()` calls printing action / obs / reward / done, so the reader sees the actual numbers flowing.

Write the `.ipynb` by loading the JSON in a python heredoc, building cell dicts, and dumping with `ensure_ascii=False, indent=1`. Each `source` is a list of lines ending in `\n` except the last.

## Step 4 — Verify the notebook

`jupyter nbconvert` in this repo's anaconda is broken (missing `jupyter_contrib_nbextensions`), and the venv has no `nbformat`. Verify instead by concatenating the code cells into one script and running it with the venv python, shrinking the training constant the same way as Step 2:

```bash
python -c "import json;nb=json.load(open('X_simple.ipynb'));print('\n\n'.join(''.join(c['source']).replace('TOTAL_TIMESTEPS = 20000','TOTAL_TIMESTEPS = 2048') for c in nb['cells'] if c['cell_type']=='code'))" > cells.py
.venv/bin/python cells.py
```

Run it from the chapter directory so relative `output/` paths land where they would in the notebook. Completion criterion: the last cell's output appears with no traceback.

Leave the committed notebook with empty `outputs` and `execution_count: null` — the reader runs it themselves.

## Step 5 — Report

State what you removed, what the three notebook adaptations were, and the exact command and shrunken constant you verified with. Name the relative-path side effect (`output/` lands beside the notebook).
