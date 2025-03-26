# Image Router API

A flexible API router for image generation services, supporting multiple providers including OpenAI, Stability AI, and Midjourney.

## Features

- Multiple provider support (OpenAI, Stability AI, Midjourney)
- Provider fallback and load balancing
- Rate limiting and API key management
- User authentication and authorization
- Request validation and error handling
- Comprehensive logging
- Docker support

## Prerequisites

- Node.js >= 18.0.0
- Docker and Docker Compose
- PostgreSQL >= 16.0.0

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/image-router-api.git
cd image-router-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration.

5. Start the application:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

#### Register User
```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### API Keys

#### Create API Key
```bash
curl -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test API Key",
    "rateLimit": 100,
    "rateLimitWindow": 3600000,
    "expiresAt": "2024-12-31T23:59:59Z"
  }'
```

#### List API Keys
```bash
curl -X GET http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Image Generation

#### Generate Image with OpenAI
```bash
curl -X POST http://localhost:3000/api/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "provider": "openai",
    "model": "dall-e-3",
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid"
  }'
```

#### Generate Image with Stability AI
```bash
curl -X POST http://localhost:3000/api/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "provider": "stability",
    "model": "stable-diffusion-xl-1024-v1-0",
    "width": 1024,
    "height": 1024,
    "steps": 30,
    "cfg_scale": 7
  }'
```

#### Generate Image with Midjourney
```bash
curl -X POST http://localhost:3000/api/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "provider": "midjourney",
    "model": "v6",
    "aspectRatio": "1:1",
    "quality": "standard",
    "style": "photorealistic"
  }'
```

### Provider Management (Admin Only)

#### Create Provider
```bash
curl -X POST http://localhost:3000/api/v1/providers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OpenAI",
    "type": "openai",
    "apiKey": "your-openai-api-key",
    "baseUrl": "https://api.openai.com/v1",
    "models": ["dall-e-2", "dall-e-3"],
    "defaultModel": "dall-e-3",
    "timeout": 30000,
    "rateLimit": 50,
    "rateLimitWindow": 60000,
    "active": true
  }'
```

#### List Providers
```bash
curl -X GET http://localhost:3000/api/v1/providers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Provider Status
```bash
curl -X PUT http://localhost:3000/api/v1/providers/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "active": false
  }'
```

### Testing Error Handling

#### Test Rate Limiting
```bash
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/v1/images/generations \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "prompt": "Test rate limit",
      "provider": "openai"
    }'
  sleep 0.1
done
```

#### Test Validation Error
```bash
curl -X POST http://localhost:3000/api/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "",
    "provider": "invalid-provider"
  }'
```

## Development

1. Start the development server:
```bash
npm run dev
```

2. Run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.