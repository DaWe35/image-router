# Unified API Quick Start

Get started with the unified API in 5 minutes.

## Single Endpoint for Everything

```
POST /v1/responses
```

One endpoint handles:
- ✅ Text-to-Image
- ✅ Text-to-Video  
- ✅ Image-to-Image
- ✅ Image-to-Video
- ✅ Audio generation (coming soon)

## Request Format

```json
{
  "model": "MODEL_ID",
  "messages": [
    {
      "role": "user",
      "content": "YOUR_PROMPT"
    }
  ]
}
```

## Examples

### Generate an Image

```bash
curl -X POST http://localhost:3000/v1/responses \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/dall-e-3",
    "messages": [{"role": "user", "content": "A sunset over mountains"}],
    "size": "1024x1024"
  }'
```

### Generate a Video

```bash
curl -X POST http://localhost:3000/v1/responses \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/veo-2",
    "messages": [{"role": "user", "content": "A cat playing"}],
    "seconds": 5
  }'
```

### Edit an Image

```bash
curl -X POST http://localhost:3000/v1/responses \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "black-forest-labs/FLUX-2-dev",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "Make it cyberpunk"},
        {"type": "image_url", "image_url": {"url": "IMAGE_URL"}}
      ]
    }]
  }'
```

## Response Format

```json
{
  "id": "resp_123",
  "object": "response",
  "created": 1234567890,
  "model": "openai/dall-e-3",
  "items": [
    {
      "id": "item_123_0",
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "image_url",
          "image_url": {"url": "https://..."}
        }
      ]
    }
  ],
  "usage": {
    "total_cost": 0.04,
    "latency_ms": 3245
  }
}
```

## Common Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `model` | string | Model ID | `openai/dall-e-3` |
| `messages` | array | Conversation messages | `[{role: "user", content: "..."}]` |
| `size` | string | Output dimensions | `1024x1024`, `1280x720` |
| `quality` | string | Quality level | `standard`, `hd` |
| `seconds` | number | Video duration | `5` |
| `max_items` | number | Number of outputs | `1`, `2`, `4` |

## Find Available Models

```bash
# List all models
curl http://localhost:3000/v1/models

# Filter by type
curl "http://localhost:3000/v1/models?type=image"
curl "http://localhost:3000/v1/models?type=video"

# Get model details
curl http://localhost:3000/v1/models/openai/dall-e-3
```

## JavaScript Example

```javascript
const response = await fetch('http://localhost:3000/v1/responses', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/dall-e-3',
    messages: [{
      role: 'user',
      content: 'A sunset over mountains'
    }],
    size: '1024x1024'
  })
})

const result = await response.json()
const imageUrl = result.items[0].content[0].image_url.url
```

## Python Example

```python
import requests

response = requests.post(
    'http://localhost:3000/v1/responses',
    headers={'Authorization': 'Bearer YOUR_KEY'},
    json={
        'model': 'openai/dall-e-3',
        'messages': [{
            'role': 'user',
            'content': 'A sunset over mountains'
        }],
        'size': '1024x1024'
    }
)

result = response.json()
image_url = result['items'][0]['content'][0]['image_url']['url']
```

## Migration from Legacy API

### Before (Legacy)

```bash
POST /v1/openai/images/generations
{
  "model": "dall-e-3",
  "prompt": "A sunset",
  "size": "1024x1024"
}
```

### After (Unified)

```bash
POST /v1/responses
{
  "model": "openai/dall-e-3",
  "messages": [{"role": "user", "content": "A sunset"}],
  "size": "1024x1024"
}
```

Legacy endpoints still work for backward compatibility.

## Next Steps

- 📖 [Full Documentation](./UNIFIED_API.md)
- 💻 [Code Examples](./examples/unified-api-example.js)
- 🌐 [Open Responses Spec](https://www.openresponses.org/)
