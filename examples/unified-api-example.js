/**
 * Unified API Examples - Open Responses Format
 * 
 * This demonstrates how to use the unified /v1/responses endpoint
 * to generate images, videos, and audio with a consistent API.
 */

const API_KEY = 'your-api-key-here'
const BASE_URL = 'http://localhost:3000'

// Example 1: Text-to-Image Generation
async function textToImage() {
    const response = await fetch(`${BASE_URL}/v1/responses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'openai/dall-e-3',
            messages: [
                {
                    role: 'user',
                    content: 'A serene mountain landscape at sunset'
                }
            ],
            max_items: 1,
            size: '1024x1024',
            quality: 'standard'
        })
    })

    const result = await response.json()
    console.log('Text-to-Image Result:', JSON.stringify(result, null, 2))
    
    /**
     * Response format:
     * {
     *   "id": "resp_1234567890",
     *   "object": "response",
     *   "created": 1234567890,
     *   "model": "openai/dall-e-3",
     *   "items": [
     *     {
     *       "id": "item_1234567890_0",
     *       "type": "message",
     *       "role": "assistant",
     *       "content": [
     *         {
     *           "type": "image_url",
     *           "image_url": {
     *             "url": "https://..."
     *           }
     *         }
     *       ]
     *     }
     *   ],
     *   "usage": {
     *     "total_cost": 0.04,
     *     "latency_ms": 3245
     *   }
     * }
     */
}

// Example 2: Text-to-Video Generation
async function textToVideo() {
    const response = await fetch(`${BASE_URL}/v1/responses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'google/veo-2',
            messages: [
                {
                    role: 'user',
                    content: 'A cat playing with a ball of yarn in slow motion'
                }
            ],
            max_items: 1,
            size: '1280x720',
            seconds: 5
        })
    })

    const result = await response.json()
    console.log('Text-to-Video Result:', JSON.stringify(result, null, 2))
}

// Example 3: Image-to-Image (Editing)
async function imageToImage() {
    const response = await fetch(`${BASE_URL}/v1/responses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'black-forest-labs/FLUX-2-dev',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Transform this image to have a cyberpunk aesthetic'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: 'data:image/png;base64,iVBORw0KGgoAAAANS...'
                            }
                        }
                    ]
                }
            ],
            max_items: 1
        })
    })

    const result = await response.json()
    console.log('Image-to-Image Result:', JSON.stringify(result, null, 2))
}

// Example 4: Image-to-Video
async function imageToVideo() {
    const response = await fetch(`${BASE_URL}/v1/responses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'google/veo-3.1',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Animate this image with gentle camera movement'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: 'https://example.com/image.jpg'
                            }
                        }
                    ]
                }
            ],
            max_items: 1,
            seconds: 5
        })
    })

    const result = await response.json()
    console.log('Image-to-Video Result:', JSON.stringify(result, null, 2))
}

// Example 5: Multiple Images with Multipart Form Data
async function multipartImageGeneration() {
    const formData = new FormData()
    
    // Add the main request body as a field
    formData.append('model', 'qwen/qwen-image-edit')
    formData.append('messages', JSON.stringify([
        {
            role: 'user',
            content: 'Remove the background from this image'
        }
    ]))
    
    // Add image file
    const imageFile = new File([/* blob data */], 'input.jpg', { type: 'image/jpeg' })
    formData.append('image', imageFile)

    const response = await fetch(`${BASE_URL}/v1/responses`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`
            // Note: Don't set Content-Type, let fetch set it with boundary
        },
        body: formData
    })

    const result = await response.json()
    console.log('Multipart Result:', JSON.stringify(result, null, 2))
}

// Example 6: Using Model Discovery
async function discoverModels() {
    // Get all available models
    const response = await fetch(`${BASE_URL}/v1/models`)
    const models = await response.json()
    
    // Filter for video models
    const videoModels = Object.entries(models)
        .filter(([id, config]) => config.output?.includes('video'))
        .map(([id, config]) => ({
            id,
            name: id,
            output: config.output,
            providers: config.providers
        }))
    
    console.log('Available Video Models:', videoModels)
}

// Run examples
async function main() {
    console.log('=== Unified API Examples ===\n')
    
    try {
        console.log('1. Text-to-Image:')
        await textToImage()
        console.log('\n')
        
        console.log('2. Text-to-Video:')
        await textToVideo()
        console.log('\n')
        
        console.log('3. Image-to-Image:')
        await imageToImage()
        console.log('\n')
        
        console.log('4. Image-to-Video:')
        await imageToVideo()
        console.log('\n')
        
        console.log('5. Discover Models:')
        await discoverModels()
    } catch (error) {
        console.error('Error:', error)
    }
}

// Uncomment to run
// main()

export {
    textToImage,
    textToVideo,
    imageToImage,
    imageToVideo,
    multipartImageGeneration,
    discoverModels
}
