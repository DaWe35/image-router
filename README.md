# Image Router API

A simple API router for image generation models. This service acts as a proxy between your application and other image generation APIs, simplifying the process of using different models.

## [Documentation](https://ir-docs.myqa.cc/) - [Demo](https://ir.myqa.cc/)

## Features

- OpenAI compatible API endpoint
- Rate limiting
- Free and paid model usage tracking

## Prerequisites

- Docker and Docker Compose
- API keys for the models you want to use

## Setup

1. Clone the repository
2. Create a `.env` file and add your API keys

## Running the Service

Using Docker Compose:
```bash
docker compose up
```

The service will be available at `http://localhost:3000`

## API Endpoints

See [API Reference](https://ir-docs.myqa.cc/)

## Upcoming Features and Limitations

See [Upcoming Features](https://ir-docs.myqa.cc/upcoming-features/)

### Health Check
```
GET /health
```

Example curl command:
```bash
curl http://localhost:3000/health
```

## Security

- Rate limiting is enabled (100 requests per 15 minutes per IP)
- Security headers are implemented using Helmet
- CORS is enabled for cross-origin requests
- API key is required for image generation