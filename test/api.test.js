import fetch from 'node-fetch'

const API_URL = 'http://localhost:3000/v1/openai/images' // 3000 because it runs inside the container

describe('Image Router API Tests', () => {
    describe('GET /models', () => {
        it('should return a list of available models', async () => {
            const response = await fetch(`${API_URL}/models`)
            const data = await response.json()

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

    /* describe('POST /generations', () => {
        it('should generate an image with valid parameters', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_KEY}`
                },
                body: JSON.stringify({
                    model: 'stabilityai/sdxl-turbo',
                    prompt: 'A photo of a cat',
                    size: '512x512',
                    n: 1,
                    response_format: 'b64_json'
                })
            })

            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data).toHaveProperty('data')
            expect(Array.isArray(data.data)).toBe(true)
            expect(data.data.length).toBe(1)
            expect(data.data[0]).toHaveProperty('b64_json')
            expect(data).toHaveProperty('cost')
            expect(typeof data.cost).toBe('number')
        })

        it('should return error for invalid parameters', async () => {
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_KEY}`
                },
                body: JSON.stringify({
                    model: 'invalid-model',
                    prompt: 'A photo of a cat',
                    size: 'invalid-size',
                    n: 1
                })
            })

            const data = await response.json()

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
                    model: 'stabilityai/sdxl-turbo',
                    prompt: 'A photo of a cat',
                    size: '512x512',
                    n: 1
                })
            })

            const data = await response.json()

            expect(response.status).toBe(401)
            expect(data).toHaveProperty('error')
            expect(data.error).toHaveProperty('message')
            expect(data.error).toHaveProperty('type')
        })
    }) */
}) 