---
name: image-router
description: "Generate, edit, and transform images via the ImageRouter API using any supported AI model. Supports text-to-image, image-to-image, inpainting with masks, and multi-image composition. Use when the user asks to create images, generate AI art, convert or stylize photos, produce illustrations, or work with ImageRouter models. Requires IMAGEROUTER_API_KEY."
homepage: https://imagerouter.io
metadata:
  version: "1.0.0"
  openclaw_emoji: "🎨"
  openclaw_requires_bins: "curl"
  openclaw_primary_env: "IMAGEROUTER_API_KEY"
triggers:
  - generate image
  - create image
  - AI art
  - text-to-image
  - image-to-image
  - ImageRouter
  - produce illustration
  - stylize photo
  - inpainting
  - image generation
user-invocable: true
---

# ImageRouter AI Image Generation

Generate, edit, and transform images with any AI model available on [ImageRouter](https://imagerouter.io). Supports text-to-image creation, image-to-image transformation, inpainting with masks, and multi-image composition (up to 16 inputs).

## Setup

1. Set the `IMAGEROUTER_API_KEY` environment variable. **Do not paste API keys into chat.**
2. For OpenClaw Gateway users, configure and restart:
```bash
openclaw config set skills.entries.imagerouter.apiKey "your_api_key_here"
openclaw gateway restart
```
3. Get an API key at https://imagerouter.io/api-keys

## Discover Models

Find a model before generating. The `test/test` model is a free dummy for testing only — use a real model for actual generation.

```bash
# Top 10 most popular models
curl -X POST 'https://backend.imagerouter.io/operations/get-popular-models'

# Search models by name
curl "https://api.imagerouter.io/v1/models?type=image&sort=date&name=gemini"
```

## Text-to-Image (Quick Start)

```bash
curl 'https://api.imagerouter.io/v1/openai/images/generations' \
  -H "Authorization: Bearer $IMAGEROUTER_API_KEY" \
  --json '{
    "prompt": "a serene mountain landscape at sunset",
    "model": "test/test",
    "quality": "auto",
    "size": "auto",
    "response_format": "url",
    "output_format": "webp"
  }'
```

**Verify success:** Check that the response contains `"data"` with a `"url"` field. A missing or empty `"data"` array indicates an error.

## Image-to-Image (Unified Endpoint)

The `/v1/openai/images/edits` endpoint handles both text-to-image and image-to-image via `multipart/form-data`. Use it when file uploads are needed.

### Transform an existing image:
```bash
curl 'https://api.imagerouter.io/v1/openai/images/edits' \
  -H "Authorization: Bearer $IMAGEROUTER_API_KEY" \
  -F 'prompt=transform this into a watercolor painting' \
  -F 'model=test/test' \
  -F 'quality=auto' \
  -F 'size=auto' \
  -F 'response_format=url' \
  -F 'output_format=webp' \
  -F 'image[]=@/path/to/your/image.webp'
```

### Compose multiple images (up to 16):
```bash
curl 'https://api.imagerouter.io/v1/openai/images/edits' \
  -H "Authorization: Bearer $IMAGEROUTER_API_KEY" \
  -F 'prompt=combine these images' \
  -F 'model=test/test' \
  -F 'image[]=@image1.webp' \
  -F 'image[]=@image2.webp' \
  -F 'image[]=@image3.webp'
```

### Inpainting with mask:
```bash
curl 'https://api.imagerouter.io/v1/openai/images/edits' \
  -H "Authorization: Bearer $IMAGEROUTER_API_KEY" \
  -F 'prompt=fill the masked area with flowers' \
  -F 'model=test/test' \
  -F 'image[]=@original.webp' \
  -F 'mask[]=@mask.webp'
```

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `model` | Yes | — | Model ID (browse at https://imagerouter.io/models) |
| `prompt` | No | — | Text description; most models require it |
| `quality` | No | `auto` | `low`, `medium`, `high`, or `auto` |
| `size` | No | `auto` | `auto` or `WIDTHxHEIGHT` (e.g., `1024x1024`) |
| `response_format` | No | `url` | `url`, `b64_json`, or `b64_ephemeral` |
| `output_format` | No | `webp` | `webp`, `jpeg`, or `png` |
| `image[]` | No | — | Input file(s) for image-to-image (multipart only) |
| `mask[]` | No | — | Mask file for inpainting (multipart only) |

## Response Format

```json
{
  "created": 1769286389027,
  "data": [
    {
      "url": "https://storage.imagerouter.io/fffb4426-efbd-4bcc-87d5-47e6936bf0bb.webp"
    }
  ],
  "latency": 6942,
  "cost": 0.004
}
```

## Error Handling

| HTTP Status | Cause | Fix |
|-------------|-------|-----|
| 401 | Invalid or missing API key | Verify `IMAGEROUTER_API_KEY` is set correctly |
| 400 | Bad request (missing model, invalid params) | Check required `model` field and parameter values |
| 429 | Rate limit exceeded | Wait and retry with exponential backoff |
| 5xx | Server error | Retry after a short delay; check https://status.imagerouter.io if persistent |

## Endpoint Comparison

| Feature | `/edits` (unified) | `/generations` (JSON) |
|---------|--------------------|-----------------------|
| Text-to-Image | Yes | Yes |
| Image-to-Image | Yes | No |
| Encoding | multipart/form-data | application/json |

Use `/generations` for simple text-to-image without file uploads. Use `/edits` when image inputs or masks are needed.

## Download Generated Image

```bash
curl 'https://api.imagerouter.io/v1/openai/images/generations' \
  -H "Authorization: Bearer $IMAGEROUTER_API_KEY" \
  --json '{"prompt":"abstract art","model":"test/test"}' \
  | jq -r '.data[0].url' \
  | xargs curl -o output.webp
```
