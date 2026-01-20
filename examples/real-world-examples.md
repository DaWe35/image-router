# Real-World Unified API Examples

## 1. AI Image Generator App

Build a simple image generation app using the unified API.

```javascript
async function generateImage(prompt, size = '1024x1024') {
  const response = await fetch('http://localhost:3000/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/dall-e-3',
      messages: [{
        role: 'user',
        content: prompt
      }],
      size,
      quality: 'hd'
    })
  })
  
  const result = await response.json()
  
  if (result.error) {
    throw new Error(result.error.message)
  }
  
  return {
    url: result.items[0].content[0].image_url.url,
    cost: result.usage.total_cost,
    latency: result.usage.latency_ms
  }
}

// Usage
const { url, cost, latency } = await generateImage(
  'A futuristic city at sunset with flying cars'
)
console.log(`Generated in ${latency}ms for $${cost}: ${url}`)
```

## 2. Video Content Creation Pipeline

Generate marketing videos from text descriptions.

```javascript
async function createMarketingVideo(script, duration = 5) {
  const models = [
    'google/veo-2',
    'google/veo-3.1-fast',
    'openai/sora-2'
  ]
  
  const results = await Promise.allSettled(
    models.map(async (model) => {
      const response = await fetch('http://localhost:3000/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: script }],
          seconds: duration,
          size: '1920x1080'
        })
      })
      
      const result = await response.json()
      return {
        model,
        url: result.items[0].content[0].video_url.url,
        cost: result.usage.total_cost
      }
    })
  )
  
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
}

// Usage
const videos = await createMarketingVideo(
  'Product showcase: sleek smartphone rotating on a pedestal',
  5
)
videos.forEach(v => console.log(`${v.model}: ${v.url} ($${v.cost})`))
```

## 3. Image Editing Service

Remove backgrounds, upscale, or transform images.

```javascript
class ImageEditor {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = 'http://localhost:3000/v1/responses'
  }
  
  async removeBackground(imageUrl) {
    return this._edit('bria/Remove-Background', imageUrl, 'Remove background')
  }
  
  async upscale(imageUrl) {
    return this._edit('upscale/Clarity', imageUrl, 'Upscale to 4K')
  }
  
  async transform(imageUrl, instruction) {
    return this._edit('black-forest-labs/FLUX-2-dev', imageUrl, instruction)
  }
  
  async _edit(model, imageUrl, instruction) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: instruction },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }]
      })
    })
    
    const result = await response.json()
    return result.items[0].content[0].image_url.url
  }
}

// Usage
const editor = new ImageEditor(process.env.API_KEY)

const noBg = await editor.removeBackground('https://example.com/photo.jpg')
const upscaled = await editor.upscale(noBg)
const cyberpunk = await editor.transform(upscaled, 'Add cyberpunk aesthetic')
```

## 4. Multi-Model Comparison Tool

Compare outputs from different models for the same prompt.

```javascript
async function compareModels(prompt, modelIds) {
  const results = await Promise.all(
    modelIds.map(async (model) => {
      const start = Date.now()
      
      try {
        const response = await fetch('http://localhost:3000/v1/responses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            size: '1024x1024'
          })
        })
        
        const result = await response.json()
        
        return {
          model,
          success: !result.error,
          url: result.items?.[0]?.content?.[0]?.image_url?.url,
          cost: result.usage?.total_cost,
          latency: Date.now() - start,
          error: result.error?.message
        }
      } catch (error) {
        return {
          model,
          success: false,
          error: error.message,
          latency: Date.now() - start
        }
      }
    })
  )
  
  return results
}

// Usage
const comparison = await compareModels(
  'A serene Japanese garden with cherry blossoms',
  [
    'openai/dall-e-3',
    'black-forest-labs/FLUX-1.1-pro',
    'google/imagen-4',
    'midjourney/midjourney'
  ]
)

comparison.forEach(r => {
  console.log(`${r.model}:`)
  console.log(`  Success: ${r.success}`)
  console.log(`  Cost: $${r.cost}`)
  console.log(`  Latency: ${r.latency}ms`)
  console.log(`  URL: ${r.url || r.error}`)
})
```

## 5. Batch Video Generation

Process multiple video requests efficiently.

```javascript
async function batchGenerateVideos(requests, concurrency = 3) {
  const results = []
  const queue = [...requests]
  
  async function processNext() {
    if (queue.length === 0) return
    
    const request = queue.shift()
    
    try {
      const response = await fetch('http://localhost:3000/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: request.model || 'google/veo-2',
          messages: [{ role: 'user', content: request.prompt }],
          seconds: request.duration || 5
        })
      })
      
      const result = await response.json()
      
      results.push({
        id: request.id,
        success: !result.error,
        url: result.items?.[0]?.content?.[0]?.video_url?.url,
        cost: result.usage?.total_cost,
        error: result.error?.message
      })
    } catch (error) {
      results.push({
        id: request.id,
        success: false,
        error: error.message
      })
    }
    
    // Process next in queue
    await processNext()
  }
  
  // Start concurrent workers
  await Promise.all(
    Array(concurrency).fill(null).map(() => processNext())
  )
  
  return results
}

// Usage
const videoRequests = [
  { id: 1, prompt: 'Ocean waves at sunset', duration: 5 },
  { id: 2, prompt: 'City traffic time-lapse', duration: 5 },
  { id: 3, prompt: 'Mountain landscape panning shot', duration: 5 },
  { id: 4, prompt: 'Abstract colorful paint swirls', duration: 5 }
]

const results = await batchGenerateVideos(videoRequests, 2)
console.log(`Completed ${results.filter(r => r.success).length}/${results.length} videos`)
```

## 6. Social Media Content Generator

Create images optimized for different platforms.

```javascript
const PLATFORM_SIZES = {
  instagram_post: '1080x1080',
  instagram_story: '1080x1920',
  twitter_post: '1200x675',
  facebook_post: '1200x630',
  linkedin_post: '1200x627',
  youtube_thumbnail: '1280x720'
}

async function generateForPlatform(prompt, platform) {
  const size = PLATFORM_SIZES[platform]
  
  if (!size) {
    throw new Error(`Unknown platform: ${platform}`)
  }
  
  const response = await fetch('http://localhost:3000/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/dall-e-3',
      messages: [{
        role: 'user',
        content: `${prompt} [optimized for ${platform}]`
      }],
      size,
      quality: 'hd'
    })
  })
  
  const result = await response.json()
  return result.items[0].content[0].image_url.url
}

// Usage
const prompt = 'Product launch announcement with vibrant colors'

const socialAssets = await Promise.all(
  Object.keys(PLATFORM_SIZES).map(async (platform) => ({
    platform,
    url: await generateForPlatform(prompt, platform)
  }))
)

socialAssets.forEach(({ platform, url }) => {
  console.log(`${platform}: ${url}`)
})
```

## 7. Animated Storyboard Creator

Turn a script into a video storyboard.

```javascript
async function createStoryboard(scenes) {
  const storyboard = []
  
  for (const scene of scenes) {
    // Generate image for the scene
    const imageResponse = await fetch('http://localhost:3000/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/dall-e-3',
        messages: [{ role: 'user', content: scene.description }],
        size: '1792x1024'
      })
    })
    
    const imageResult = await imageResponse.json()
    const imageUrl = imageResult.items[0].content[0].image_url.url
    
    // Animate the image
    const videoResponse = await fetch('http://localhost:3000/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/veo-3.1',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: scene.animation || 'Gentle camera movement' },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }],
        seconds: scene.duration || 5
      })
    })
    
    const videoResult = await videoResponse.json()
    
    storyboard.push({
      scene: scene.id,
      imageUrl,
      videoUrl: videoResult.items[0].content[0].video_url.url,
      description: scene.description
    })
  }
  
  return storyboard
}

// Usage
const script = [
  {
    id: 1,
    description: 'Wide shot of a medieval castle at dawn',
    animation: 'Slow zoom in'
  },
  {
    id: 2,
    description: 'Close-up of a knight\'s armor gleaming in sunlight',
    animation: 'Rotate around the subject'
  },
  {
    id: 3,
    description: 'Dragon flying over the castle',
    animation: 'Follow the dragon'
  }
]

const storyboard = await createStoryboard(script)
storyboard.forEach(s => {
  console.log(`Scene ${s.scene}: ${s.description}`)
  console.log(`  Image: ${s.imageUrl}`)
  console.log(`  Video: ${s.videoUrl}`)
})
```

## Tips for Production Use

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Rate Limiting**: Respect API rate limits and implement backoff
3. **Cost Tracking**: Monitor the `usage.total_cost` field
4. **Caching**: Cache results when appropriate to reduce costs
5. **Retries**: Implement exponential backoff for failed requests
6. **Timeouts**: Set appropriate timeouts for long-running operations
7. **Webhooks**: Consider implementing webhooks for async processing
8. **Validation**: Validate inputs before sending to the API
