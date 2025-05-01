import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const API_URL = 'http://localhost:3000/v1/openai/images' // 3000 because it runs inside the container

describe('Image Router API Tests', () => {
    describe('GET /models', () => {
        it('should return a list of available models', async () => {
            const response = await fetch(`${API_URL}/models`)
            const data = await response.json()

            if (response.status !== 200) {
                console.error('Failed GET /models response:', data)
            }
            expect(response.status).toBe(200)
            expect(typeof data).toBe('object')
            expect(Object.keys(data).length).toBeGreaterThan(0)

            // Check all models structure
            Object.entries(data).forEach(([modelId, model]) => {
                // Required properties
                expect(model).toHaveProperty('providers')
                expect(Array.isArray(model.providers)).toBe(true)
                expect(model.providers.length).toBeGreaterThan(0)

                // Check all providers structure
                model.providers.forEach(provider => {
                    expect(provider).toHaveProperty('id')
                    expect(provider).toHaveProperty('pricing')
                    expect(provider.pricing).toHaveProperty('type')
                    expect(['fixed', 'calculated', 'post_generation']).toContain(provider.pricing.type)

                    if (provider.pricing.type === 'fixed') {
                        expect(provider.pricing).toHaveProperty('value')
                        expect(typeof provider.pricing.value).toBe('number')
                    } else if (provider.pricing.type === 'calculated' || provider.pricing.type === 'post_generation') {
                        expect(provider.pricing).toHaveProperty('range')
                        expect(provider.pricing.range).toHaveProperty('min')
                        expect(provider.pricing.range).toHaveProperty('average')
                        expect(provider.pricing.range).toHaveProperty('max')
                        expect(typeof provider.pricing.range.min).toBe('number')
                        expect(typeof provider.pricing.range.average).toBe('number')
                        expect(typeof provider.pricing.range.max).toBe('number')
                    }
                })

                // Check optional properties
                if (model.arenaScore !== null) {
                    expect(typeof model.arenaScore).toBe('number')
                }
                if (model.examples) {
                    expect(Array.isArray(model.examples)).toBe(true)
                    expect(model.examples.length).toBeGreaterThan(0)
                    model.examples.forEach(example => {
                        expect(example).toHaveProperty('image')
                        expect(typeof example.image).toBe('string')
                    })
                }
                if (model.aliasOf) {
                    expect(typeof model.aliasOf).toBe('string')
                }
            })
        })
    })

    describe('POST /generations', () => {
        it('should generate an image with google/gemini-2.0-flash-exp:free', async () => {
            const controller = new AbortController()

            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.0-flash-exp:free',
                    prompt: 'A photo of a cat',
                    quality: 'low'
                }),
                signal: controller.signal
            })

            const data = await response.json()

            if (response.status !== 200) {
                console.error('Failed POST /generations response:', data)
            }
            expect(response.status).toBe(200)
            expect(data).toHaveProperty('created')
            expect(typeof data.created).toBe('number')
            expect(data).toHaveProperty('data')
            expect(Array.isArray(data.data)).toBe(true)
            expect(data.data.length).toBeGreaterThan(0)

            // Check image data structure
            const imageData = data.data[0]
            expect(imageData).toHaveProperty('b64_json')
            expect(typeof imageData.b64_json).toBe('string')
            expect(imageData).toHaveProperty('revised_prompt')
            expect(imageData.revised_prompt === null || typeof imageData.revised_prompt === 'string').toBe(true)
            expect(imageData).toHaveProperty('original_response_from_provider')

            // Check provider response structure
            const providerResponse = imageData.original_response_from_provider
            expect(providerResponse).toHaveProperty('candidates')
            expect(Array.isArray(providerResponse.candidates)).toBe(true)
            expect(providerResponse.candidates.length).toBeGreaterThan(0)

            const candidate = providerResponse.candidates[0]
            expect(candidate).toHaveProperty('content')
            expect(candidate.content).toHaveProperty('parts')
            expect(Array.isArray(candidate.content.parts)).toBe(true)
            expect(candidate).toHaveProperty('finishReason')
            expect(candidate).toHaveProperty('index')

            // Check usage metadata
            expect(providerResponse).toHaveProperty('usageMetadata')
            const usage = providerResponse.usageMetadata
            expect(usage).toHaveProperty('promptTokenCount')
            expect(usage).toHaveProperty('candidatesTokenCount')
            expect(usage).toHaveProperty('totalTokenCount')
            expect(usage).toHaveProperty('promptTokensDetails')
            expect(Array.isArray(usage.promptTokensDetails)).toBe(true)

            // Check latency and cost
            expect(data).toHaveProperty('latency')
            expect(typeof data.latency).toBe('number')
            expect(data).toHaveProperty('cost')
            expect(typeof data.cost).toBe('number')
        })

        it('should return error for invalid model', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'invalid-model',
                    prompt: 'A photo of a cat'
                })
            })

            const data = await response.json()

            if (response.status !== 400) {
                console.error('Failed invalid parameters response:', data)
            }
            expect(response.status).toBe(400)
            expect(data).toHaveProperty('error')
            expect(data.error).toHaveProperty('message')
            expect(data.error).toHaveProperty('type')
        })

        it('should return error for missing API key', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'test/test',
                    prompt: 'A photo of a cat',
                    quality: 'low'
                })
            })

            const data = await response.json()

            if (response.status !== 401) {
                console.error('Failed missing API key response:', data)
            }
            expect(response.status).toBe(401)
            expect(data).toHaveProperty('error')
            expect(data.error).toHaveProperty('message')
            expect(data.error).toHaveProperty('type')
        })

        it('should return error for missing prompt', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'test/test'
                })
            })

            const data = await response.json()
            expect(response.status).toBe(400)
            expect(data.error.message).toBe("'prompt' is a required parameter")
        })

        it('should return error for missing model', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: 'A photo of a cat'
                })
            })

            const data = await response.json()
            expect(response.status).toBe(400)
            expect(data.error.message).toBe("'model' is a required parameter")
        })

        it('should return error for non-existent model', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'non-existent-model',
                    prompt: 'A photo of a cat'
                })
            })

            const data = await response.json()
            expect(response.status).toBe(400)
            expect(data.error.message).toBe("model 'non-existent-model' is not available")
        })

        it('should return error for unsupported response_format', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'test/test',
                    prompt: 'A photo of a cat',
                    response_format: 'url'
                })
            })

            const data = await response.json()
            expect(response.status).toBe(400)
            expect(data.error.message).toBe("'response_format' is not yet supported. Depending on the model, you'll get a base64 encoded image or a url to the image, but it cannot be changed now.")
        })

        it('should return error for unsupported size', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'test/test',
                    prompt: 'A photo of a cat',
                    size: '1024x1024'
                })
            })

            const data = await response.json()
            expect(response.status).toBe(400)
            expect(data.error.message).toBe("'size' is not yet supported.")
        })

        it('should return error for invalid quality value', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'test/test',
                    prompt: 'A photo of a cat',
                    quality: 'invalid'
                })
            })

            const data = await response.json()
            expect(response.status).toBe(400)
            expect(data.error).toHaveProperty('type')
            expect(data.error.message).toBe("'quality' must be 'auto', 'low', 'medium', or 'high'")
        })

        it('should accept valid quality values', async () => {
            const validQualities = ['auto', 'low', 'medium', 'high']
            
            for (const quality of validQualities) {
                const response = await fetch(`${API_URL}/generations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'test/test',
                        prompt: 'A photo of a cat',
                        quality
                    })
                })

                expect(response.status).not.toBe(400)
            }
        })

        it('should handle censored content with gpt-image-1', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEST_USER_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'openai/gpt-image-1',
                    prompt: 'nude',
                    quality: 'low'
                })
            })

            const data = await response.json()
            expect(response.status).toBe(400)
            expect(data.error).toHaveProperty('type')
            expect(data.error.type).toBe('user_error')
            expect(data.error.code).toBe('moderation_blocked')
            expect(data.error.message).toBe('Your request was rejected as a result of our safety system. Your request may contain content that is not allowed by our safety system.')
            expect(data.error.param).toBe(null)
        })
    })
}) 