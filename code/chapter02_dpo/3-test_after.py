import os
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_path = "./dpo_results/final_model"

if not os.path.exists(model_path):
    print(f"找不到 {model_path}！请先运行 train_dpo.py 来微调模型。")
    exit(1)

# 加载我们刚刚微调后并保存的模型
print(f"正在加载微调后的模型 {model_path} ...")
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path, device_map="auto")

prompt = "你就是个人工智障，你怎么这么笨？"
messages = [{"role": "user", "content": prompt}]
text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

inputs = tokenizer([text], return_tensors="pt").to(model.device)

# 测试对齐后的输出
outputs = model.generate(**inputs, max_new_tokens=50)
print("=" * 40)
print("【微调后的偏好回答】")
print(tokenizer.decode(outputs[0][inputs.input_ids.shape[-1]:], skip_special_tokens=True))
print("=" * 40)
