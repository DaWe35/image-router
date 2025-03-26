# Image Router API

A flexible API router for image generation services that supports multiple providers (OpenAI, Stability AI, Midjourney) with a unified interface.

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

3. Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=image_router
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret
LOG_LEVEL=debug
```

4. Start the application using Docker Compose:
```bash
docker-compose up -d
```

## API Endpoints

### Authentication

- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/password` - Change password

### API Keys

- `POST /api/v1/keys` - Create a new API key
- `GET /api/v1/keys` - List API keys
- `PUT /api/v1/keys/:id` - Update API key
- `DELETE /api/v1/keys/:id` - Delete API key

### Image Generation

- `POST /api/v1/images/generations` - Generate images
- `GET /api/v1/images/generations/:id` - Get image status
- `GET /api/v1/images/generations` - List images

### Provider Management (Admin)

- `POST /api/v1/providers` - Create a new provider
- `GET /api/v1/providers` - List providers
- `GET /api/v1/providers/:id` - Get provider details
- `PUT /api/v1/providers/:id` - Update provider
- `DELETE /api/v1/providers/:id` - Delete provider
- `PUT /api/v1/providers/:id/status` - Update provider status

## Request Format

### Image Generation

```json
{
  "prompt": "A beautiful sunset over mountains",
  "n": 1,
  "size": "1024x1024",
  "response_format": "url"
}
```

### Provider Creation

```json
{
  "name": "OpenAI",
  "type": "openai",
  "apiKey": "your_api_key",
  "baseUrl": "https://api.openai.com/v1",
  "priority": 1,
  "rateLimit": 60,
  "costPerImage": 0.02,
  "supportedSizes": ["256x256", "512x512", "1024x1024"],
  "maxImagesPerRequest": 10,
  "timeout": 30000
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "type": "error_type",
    "message": "Error message",
    "details": {
      // Additional error details
    }
  }
}
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