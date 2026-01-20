# Unified API Documentation

The Unified API provides a single, consistent interface for generating images, videos, and audio using the Open Responses specification. This allows you to use any model (image, video, audio, or text) through a single endpoint with the same request/response format.

## Base URL

```
http://localhost:3000/v1/responses
```

## Authentication

All requests require an API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

## Request Format

The unified API follows the [Open Responses](https://www.openresponses.org/) specification:

```json
{
  "model": "string",
  "messages": [
    {
      "role": "user",
      "content": "string or array"
    }
  ],
  "max_items": 1,
  ...modelSpecificParams
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g., `openai/dall-e-3`, `google/veo-2`) |
| `messages` | array | Yes | Array of message objects with `role` and `content` |
| `max_items` | number | No | Number of outputs to generate (default: 1) |
| `size` | string | No | Output dimensions (e.g., `1024x1024`, `1280x720`) |
| `quality` | string | No | Quality level (model-specific) |
| `seconds` | number | No | Duration for video generation |
| `response_format` | string | No | `url`, `b64_json`, or `b64_ephemeral` |

### Message Content

Content can be a simple string or an array of typed items for multimodal inputs:

**Text-only:**
```json
{
  "role": "user",
  "content": "A serene mountain landscape"
}
```

**Multimodal (text + image):**
```json
{
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": "Transform this to cyberpunk style"
    },
    {
      "type": "image_url",
      "image_url": {
        "url": "https://example.com/image.jpg"
      }
    }
  ]
}
```

## Response Format

The API returns a response following the Open Responses specification:

```json
{
  "id": "resp_1234567890",
  "object": "response",
  "created": 1234567890,
  "model": "openai/dall-e-3",
  "items": [
    {
      "id": "item_1234567890_0",
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "https://..."
          }
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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique response identifier |
| `object` | string | Always `"response"` |
| `created` | number | Unix timestamp |
| `model` | string | Model used for generation |
| `items` | array | Generated content items |
| `usage` | object | Cost and performance metrics |

### Content Types

Items in the response can contain different content types:

- **Image:** `image_url` with `url` field
- **Video:** `video_url` with `url` field
- **Audio:** `audio_url` with `url` field
- **Text:** `text` with `text` field

## Examples

### Text-to-Image

```bash
curl -X POST http://localhost:3000/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/dall-e-3",
    "messages": [
      {
        "role": "user",
        "content": "A serene mountain landscape at sunset"
      }
    ],
    "size": "1024x1024",
    "quality": "hd"
  }'
```

### Text-to-Video

```bash
curl -X POST http://localhost:3000/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/veo-2",
    "messages": [
      {
        "role": "user",
        "content": "A cat playing with yarn in slow motion"
      }
    ],
    "size": "1280x720",
    "seconds": 5
  }'
```

### Image-to-Image

```bash
curl -X POST http://localhost:3000/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "black-forest-labs/FLUX-2-dev",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Add cyberpunk aesthetic"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/png;base64,iVBORw0KG..."
            }
          }
        ]
      }
    ]
  }'
```

### Image-to-Video

```bash
curl -X POST http://localhost:3000/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/veo-3.1",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Animate with gentle camera movement"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/image.jpg"
            }
          }
        ]
      }
    ],
    "seconds": 5
  }'
```

### Multipart File Upload

For uploading files directly:

```bash
curl -X POST http://localhost:3000/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F 'model=qwen/qwen-image-edit' \
  -F 'messages=[{"role":"user","content":"Remove background"}]' \
  -F 'image=@input.jpg'
```

## Model Discovery

### List All Models

```bash
curl http://localhost:3000/v1/models
```

### Filter Models by Type

```bash
# Images only
curl "http://localhost:3000/v1/models?type=image"

# Videos only
curl "http://localhost:3000/v1/models?type=video"
```

### Get Model Details

```bash
curl http://localhost:3000/v1/models/openai/dall-e-3
```

## Error Handling

Errors follow the standard format:

```json
{
  "error": {
    "message": "Error description",
    "type": "error_type"
  }
}
```

Common error types:
- `invalid_request_error` - Invalid parameters
- `authentication_error` - Invalid API key
- `rate_limit_error` - Too many requests
- `internal_error` - Server error

## Backward Compatibility

The legacy OpenAI-compatible endpoints remain available:

- `POST /v1/openai/images/generations` - Image generation
- `POST /v1/openai/images/edits` - Image editing
- `POST /v1/openai/videos/generations` - Video generation

These endpoints use the original OpenAI format and will continue to work alongside the new unified API.

## Differences from OpenAI API

While the unified API is compatible with OpenAI's structure, it extends it to support:

1. **Multi-modality**: Single endpoint for images, videos, and audio
2. **Open Responses**: Standard format that works across providers
3. **Model agnostic**: Use any provider's model with the same interface
4. **Rich metadata**: Detailed usage and cost information

## SDK Examples

### JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:3000/v1/responses', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/dall-e-3',
    messages: [
      { role: 'user', content: 'A serene mountain landscape' }
    ],
    size: '1024x1024'
  })
})

const result = await response.json()
console.log(result.items[0].content[0].image_url.url)
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:3000/v1/responses',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={
        'model': 'google/veo-2',
        'messages': [
            {'role': 'user', 'content': 'A cat playing with yarn'}
        ],
        'seconds': 5
    }
)

result = response.json()
print(result['items'][0]['content'][0]['video_url']['url'])
```

## Best Practices

1. **Use the appropriate model**: Check model capabilities via `/v1/models`
2. **Handle costs**: Monitor the `usage.total_cost` field
3. **Implement retries**: Some models may timeout on high load
4. **Validate inputs**: Check model constraints (size, duration, etc.)
5. **Store results**: URLs may expire depending on `response_format`

## Support

For issues or questions:
- Documentation: https://docs.imagerouter.io
- GitHub: https://github.com/DaWe35/image-router
