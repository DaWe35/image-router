# Migration Guide: Legacy API → Unified API

This guide helps you migrate from the legacy OpenAI-compatible endpoints to the new unified API.

## Why Migrate?

- ✅ Single endpoint for all model types
- ✅ Consistent format across image, video, and audio
- ✅ Industry-standard Open Responses specification
- ✅ Better multimodal support
- ✅ Future-proof for new features

## Key Differences

| Aspect | Legacy API | Unified API |
|--------|-----------|-------------|
| **Endpoint** | Multiple (`/images/generations`, `/videos/generations`) | Single (`/v1/responses`) |
| **Format** | OpenAI-specific | Open Responses standard |
| **Input** | `prompt` field | `messages` array |
| **Output** | `data` array | `items` array with typed content |
| **Multimodal** | Limited | Full support |

## Migration Examples

### 1. Text-to-Image

**Before (Legacy):**
```javascript
POST /v1/openai/images/generations
{
  "model": "dall-e-3",
  "prompt": "A sunset over mountains",
  "size": "1024x1024",
  "quality": "hd"
}

// Response
{
  "created": 1234567890,
  "data": [
    {
      "url": "https://...",
      "revised_prompt": null
    }
  ]
}
```

**After (Unified):**
```javascript
POST /v1/responses
{
  "model": "openai/dall-e-3",
  "messages": [
    {
      "role": "user",
      "content": "A sunset over mountains"
    }
  ],
  "size": "1024x1024",
  "quality": "hd"
}

// Response
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
          "image_url": {
            "url": "https://..."
          }
        }
      ]
    }
  ],
  "usage": {
    "total_cost": 0.04
  }
}
```

### 2. Text-to-Video

**Before (Legacy):**
```javascript
POST /v1/openai/videos/generations
{
  "model": "veo-2",
  "prompt": "A cat playing",
  "seconds": 5
}
```

**After (Unified):**
```javascript
POST /v1/responses
{
  "model": "google/veo-2",
  "messages": [
    {
      "role": "user",
      "content": "A cat playing"
    }
  ],
  "seconds": 5
}
```

### 3. Image Editing

**Before (Legacy):**
```javascript
POST /v1/openai/images/edits
Content-Type: multipart/form-data

model=dall-e-2
prompt=Add sunglasses
image=[binary]
```

**After (Unified):**
```javascript
POST /v1/responses
{
  "model": "openai/dall-e-2",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Add sunglasses"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/png;base64,..."
          }
        }
      ]
    }
  ]
}
```

## Step-by-Step Migration

### Step 1: Update Model IDs

Legacy API used short model names. Unified API uses fully qualified IDs.

```javascript
// Old
model: "dall-e-3"
model: "veo-2"

// New
model: "openai/dall-e-3"
model: "google/veo-2"
```

Find your model's full ID:
```bash
curl http://localhost:3000/v1/models | jq 'keys'
```

### Step 2: Convert Prompts to Messages

Wrap your prompt in a messages array:

```javascript
// Old
{
  "prompt": "A beautiful sunset"
}

// New
{
  "messages": [
    {
      "role": "user",
      "content": "A beautiful sunset"
    }
  ]
}
```

### Step 3: Update Response Parsing

Navigate the new response structure:

```javascript
// Old
const imageUrl = response.data[0].url

// New
const imageUrl = response.items[0].content[0].image_url.url
```

### Step 4: Handle Multimodal Inputs

If you're passing images, use the content array:

```javascript
// Old (multipart form)
const formData = new FormData()
formData.append('prompt', 'Edit this')
formData.append('image', imageFile)

// New (JSON with base64 or URL)
{
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Edit this" },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/png;base64,..."
          }
        }
      ]
    }
  ]
}
```

### Step 5: Update Error Handling

Error format remains the same:

```javascript
if (response.error) {
  console.error(response.error.message)
}
```

## Helper Functions

### Wrapper for Easy Migration

```javascript
class UnifiedAPIClient {
  constructor(apiKey, baseUrl = 'http://localhost:3000') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }
  
  async generateImage(model, prompt, options = {}) {
    return this._generate(model, prompt, options)
  }
  
  async generateVideo(model, prompt, options = {}) {
    return this._generate(model, prompt, options)
  }
  
  async _generate(model, prompt, options) {
    const response = await fetch(`${this.baseUrl}/v1/responses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        ...options
      })
    })
    
    const result = await response.json()
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    // Return in legacy-compatible format
    return {
      created: result.created,
      data: result.items.map(item => ({
        url: this._extractUrl(item),
        revised_prompt: null
      })),
      cost: result.usage?.total_cost
    }
  }
  
  _extractUrl(item) {
    const content = item.content[0]
    if (content.type === 'image_url') return content.image_url.url
    if (content.type === 'video_url') return content.video_url.url
    if (content.type === 'audio_url') return content.audio_url.url
    return null
  }
}

// Usage - almost identical to legacy API!
const client = new UnifiedAPIClient(process.env.API_KEY)

const result = await client.generateImage(
  'openai/dall-e-3',
  'A sunset over mountains',
  { size: '1024x1024', quality: 'hd' }
)

console.log(result.data[0].url) // Works like before!
```

### Response Parser Helper

```javascript
function parseUnifiedResponse(response) {
  return {
    // Legacy compatible
    created: response.created,
    data: response.items.map(item => {
      const content = item.content[0]
      return {
        url: content.image_url?.url || content.video_url?.url || content.audio_url?.url,
        revised_prompt: null
      }
    }),
    
    // New fields
    id: response.id,
    model: response.model,
    cost: response.usage?.total_cost,
    latency: response.usage?.latency_ms
  }
}
```

## Gradual Migration Strategy

You don't have to migrate everything at once:

### Phase 1: Add Unified Support (Dual Mode)
```javascript
const USE_UNIFIED_API = process.env.USE_UNIFIED_API === 'true'

async function generateImage(prompt, options) {
  if (USE_UNIFIED_API) {
    return await generateImageUnified(prompt, options)
  } else {
    return await generateImageLegacy(prompt, options)
  }
}
```

### Phase 2: Migrate New Features Only
- Use unified API for new features
- Keep legacy API for existing functionality
- Test unified API in production

### Phase 3: Full Migration
- Migrate all legacy calls to unified API
- Deprecate legacy API access
- Update documentation

## Common Pitfalls

### ❌ Forgetting to Add Provider Prefix

```javascript
// Wrong
model: "dall-e-3"

// Correct
model: "openai/dall-e-3"
```

### ❌ Using Old Response Structure

```javascript
// Wrong
const url = response.data[0].url

// Correct
const url = response.items[0].content[0].image_url.url
```

### ❌ Not Handling Content Types

```javascript
// Wrong - assumes image_url
const url = response.items[0].content[0].image_url.url

// Correct - check type
const content = response.items[0].content[0]
const url = content.type === 'image_url' 
  ? content.image_url.url 
  : content.video_url.url
```

## Testing Your Migration

### 1. Side-by-Side Comparison
```javascript
const [legacy, unified] = await Promise.all([
  callLegacyAPI(prompt),
  callUnifiedAPI(prompt)
])

console.log('Legacy:', legacy.data[0].url)
console.log('Unified:', unified.items[0].content[0].image_url.url)
```

### 2. Unit Tests
```javascript
test('unified API returns compatible format', async () => {
  const result = await generateImage('openai/dall-e-3', 'test')
  
  expect(result).toHaveProperty('created')
  expect(result).toHaveProperty('items')
  expect(result.items[0]).toHaveProperty('content')
})
```

### 3. Load Testing
Test with your actual traffic patterns to ensure performance.

## Need Help?

- 📖 [Full API Documentation](./UNIFIED_API.md)
- 🚀 [Quick Start Guide](./QUICK_START.md)
- 💡 [Real-World Examples](./examples/real-world-examples.md)
- 🐛 Report issues on GitHub

## Timeline

- **Now**: Both APIs work side-by-side
- **Q1 2026**: Unified API is recommended
- **Q2 2026**: Legacy API may be deprecated
- **Q3 2026**: Legacy API may be removed (with notice)

Start migrating today to take advantage of new features!
