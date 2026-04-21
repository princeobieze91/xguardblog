# Fine-Tuning Models with Serverless GPUs

*Published: September 2026 | Category: Tutorial | Author: Prince F.O*

---

You don't need a GPU farm to fine-tune AI models. With serverless GPU infrastructure, you can train specialized models on-demand—paying only for what you use.

## The Case for Fine-Tuning

Pre-trained models are generalists. Fine-tuning makes them specialists:

| Approach | Use Case | Cost |
|----------|-----------|------|
| Prompt engineering | Quick experiments | $0 |
| Fine-tuning | Domain expertise | $50-500 |
| Training from scratch | Unique capabilities | $10,000+ |

## Serverless GPU Options

Major cloud providers now offer on-demand GPU training:

| Provider | GPU | Price/Hour |
|----------|-----|-------------|
| Cloud Run Jobs | RTX 6000 Pro | $0.90 |
| Lambda Labs | A100 | $1.29 |
| Paperspace | A6000 | $0.60 |
| Modal | H100 | $2.50 |

## Setting Up Fine-Tuning

### 1. Prepare Your Data

```python
# training_data.jsonl
{"prompt": "What is React?", "response": "React is a JavaScript library for building user interfaces."}
{"prompt": "Explain TypeScript", "response": "TypeScript is a typed superset of JavaScript."}
{"prompt": "What is Next.js?", "response": "Next.js is a React framework for production."}
```

### 2. Configure Training Job

```yaml
# gcloud run jobs deploy fine-tune-job \
  --image gcr.io/project/finetune:latest \
  --region us-central1 \
  --memory 32Gi \
  --cpu 8 \
  --gpu 1 \
  --gpu-type nvidia-tesla-rtx6000 \
  --max-retries 3 \
  --set-env-vars \
    MODEL_NAME=llama-3-8b \
    DATA_PATH=gs://bucket/training_data.jsonl \
    OUTPUT_PATH=gs://bucket/model-output
```

### 3. Run Fine-Tuning

```python
from unsloth import FastLanguageModel
import torch

# Load base model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "meta-llama/Llama-3-8b",
    max_seq_length = 2048,
    dtype = torch.float16,
    load_in_4bit = True,
)

# Add LoRA adapters
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_alpha = 16,
    lora_dropout = 0,
)

# Fine-tune
trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = dataset,
    dataset_text_field = "text",
    max_seq_length = 2048,
)

trainer.train()
```

## The LoRA Revolution

LoRA (Low-Rank Adaptation) makes fine-tuning accessible:

- **Small adapters** - Only 1-5% of model size
- **Fast training** - Hours not days
- **Cheap** - $50-200 per model
- **Portable** - Swap adapters easily

## Real-World Example

Building a coding assistant:

```python
# Dataset: 10,000 Q&A pairs about React
# Model: Llama 3 8B + LoRA
# GPU: Cloud Run RTX 6000 Pro
# Time: 3 hours
# Cost: $2.70

# Result:
# - Understands React deeply
# - Answers with accurate code
# - Costs $0 to run (use base model + adapter)
```

## Deployment Options

After fine-tuning:

```typescript
// Deploy as serverless endpoint
const endpoint = await modal.Function.create(
  "coding-assistant",
  "python",
  {
    gpu: "T4",
    timeout: 300,
    allow_concurrent_inputs: 10
  },
  {
    model: "llama-3-8b-coder",
    adapter: "coder-lora-v1"
  }
);

// Use it
const response = await endpoint.spawn({
  prompt: "How do I use useEffect in React?"
});
```

## Cost Optimization Tips

1. **Use LoRA** - 100x smaller than full fine-tuning
2. **Quantize** - 4-bit for inference
3. **Cache adapters** - Share across deployments
4. **Spot instances** - 70% cheaper for training
5. **Small datasets** - 1K examples often enough

## When to Fine-Tune

Fine-tune when you need:

- Domain-specific knowledge
- Custom output format
- Specialized behavior
- Better accuracy than prompting

Don't fine-tune when:

- General knowledge suffices
- Quick experiment
- Small dataset (<100 examples)

---

*Next in series: The Rise of Green Coding*