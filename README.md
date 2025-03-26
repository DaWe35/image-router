# Image Router API

A simple API router for image generation services that follows the OpenAI API schema. This service acts as a proxy between your application and DeepInfra's image generation API.

## Features

- OpenAI-compatible API endpoints
- Rate limiting
- Security headers with Helmet
- CORS support
- Docker support
- Health check endpoint

## Prerequisites

- Docker and Docker Compose
- DeepInfra API key

## Setup

1. Clone the repository
2. Create a `.env` file in the root directory with your DeepInfra API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   PORT=3000
   ```

## Running the Service

Using Docker Compose:
```bash
docker compose up
```

The service will be available at `http://localhost:3000`

## API Endpoints

### Generate Image
```
POST /v1/images/generations
```

Request body:
```json
{
  "prompt": "A beautiful sunset over mountains",
  "n": 1,
  "size": "1024x1024",
  "model": "stabilityai/sdxl-turbo"
}
```

Parameters:
- `prompt` (required): Description of the image to generate
- `n` (optional): Number of images to generate (default: 1)
- `size` (optional): Image size (256x256, 512x512, or 1024x1024)
- `model` (optional): Model to use (stabilityai/sdxl-turbo)

Example curl command:
```bash
curl -X POST http://localhost:3000/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "n": 1,
    "size": "128x128",
    "model": "stabilityai/sdxl-turbo"
  }'
```

### Health Check
```
GET /health
```

Example curl command:
```bash
curl http://localhost:3000/health
```

## Error Handling

The API follows OpenAI's error response format:
```json
{
  "error": {
    "message": "Error description",
    "type": "error_type"
  }
}
```

## Security

- Rate limiting is enabled (100 requests per 15 minutes per IP)
- Security headers are implemented using Helmet
- CORS is enabled for cross-origin requests
- API key is required for image generation