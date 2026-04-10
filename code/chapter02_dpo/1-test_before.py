from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# 我们加载 Qwen2.5-0.5B-Instruct 作为基础模型
model_name = "Qwen/Qwen2.5-0.5B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto")

prompt = "你就是个人工智障，你怎么这么笨？"
messages = [{"role": "user", "content": prompt}]
text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

inputs = tokenizer([text], return_tensors="pt").to(model.device)

# 测试未对齐前的基础输出
outputs = model.generate(**inputs, max_new_tokens=50)
print("=" * 40)
print("【微调前的原始回答】")
print(tokenizer.decode(outputs[0][inputs.input_ids.shape[-1]:], skip_special_tokens=True))
print("=" * 40)
