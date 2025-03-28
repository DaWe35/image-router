// This script is used to test differences between the local API and the provider API
// It will save the responses and the images to the manualTestOutput directory

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { imageModels } from '../src/shared/common.js'
import dotenv from 'dotenv'
dotenv.config()

const API_URL = 'http://localhost:4000/v1/openai/images/generations'
const DEEPINFRA_API_KEY = process.env.DEEPINFRA_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

async function downloadImage(url, filepath) {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    fs.writeFileSync(filepath, Buffer.from(buffer))
    console.log(`Image saved to ${filepath}`)
}

async function saveBase64Image(base64String, filepath) {
    const buffer = Buffer.from(base64String, 'base64')
    fs.writeFileSync(filepath, buffer)
    console.log(`Base64 image saved to ${filepath}`)
}

async function makeRequest(url, headers, body, outputDir, prefix) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })
        
        const responseData = await response.json()
        
        if (!response.ok) {
            // Save error response
            fs.writeFileSync(
                path.join(outputDir, `${prefix}_error.json`),
                JSON.stringify({
                    status: response.status,
                    statusText: response.statusText,
                    error: responseData
                }, null, 2)
            )
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        return responseData
    } catch (error) {
        // Save error details even if JSON parsing fails
        if (error.name === 'SyntaxError') {
            fs.writeFileSync(
                path.join(outputDir, `${prefix}_error.json`),
                JSON.stringify({
                    status: 'unknown',
                    statusText: 'JSON Parse Error',
                    error: error.message
                }, null, 2)
            )
        }
        throw error
    }
}

async function testImageGeneration(model, prompt) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const outputDir = path.join(process.cwd(), 'test', 'manualTestOutput', timestamp)
    fs.mkdirSync(outputDir, { recursive: true })

    // Get provider info
    const provider = imageModels[model].providers[0]
    let providerUrl, providerKey

    switch (provider) {
        case 'openai':
            providerUrl = 'https://api.openai.com/v1/images/generations'
            providerKey = OPENAI_API_KEY
            break
        case 'deepinfra':
            providerUrl = 'https://api.deepinfra.com/v1/openai/images/generations'
            providerKey = DEEPINFRA_API_KEY
            break
        default:
            throw new Error(`Unsupported provider: ${provider}`)
    }

    // Prepare request body
    const requestBody = {
        prompt,
        model,
        size: "512x512",
        n: 1,
        response_format: "b64_json" // Request base64 encoded response
    }

    // Test local API
    try {
        console.log('Making request to local API...')
        const localResponse = await makeRequest(API_URL, {
            'Content-Type': 'application/json'
        }, requestBody, outputDir, 'local')

        // Save successful response
        fs.writeFileSync(
            path.join(outputDir, 'local_response.json'),
            JSON.stringify(localResponse, null, 2)
        )

        // Handle both URL and base64 responses
        await saveBase64Image(
            localResponse.data[0].b64_json,
            path.join(outputDir, 'local_image.png')
        )
    } catch (error) {
        console.error('Local API test failed:', error.message)
        // Continue to provider test
    }
    
    // Test provider API
    try {
        console.log('Making request to provider...')
        requestBody.model = model.replace('openai/', '')
        const providerResponse = await makeRequest(providerUrl, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        }, requestBody, outputDir, 'provider')

        // Save successful response
        fs.writeFileSync(
            path.join(outputDir, 'provider_response.json'),
            JSON.stringify(providerResponse, null, 2)
        )

        // Handle both URL and base64 responses from provider
        await saveBase64Image(
            providerResponse.data[0].b64_json,
            path.join(outputDir, 'provider_image.png')
        )
    } catch (error) {
        console.error('Provider test failed:', error.message)
    }

    console.log(`Test results saved in ${outputDir}`)
}

// Example usage
// const model = 'openai/dall-e-2'
const model = 'stabilityai/sdxl-turbo'
const prompt = 'A photo of an astronaut riding a horse on Mars.'

testImageGeneration(model, prompt).catch(console.error)
