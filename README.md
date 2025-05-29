# ImageRouter API

A simple API router for image generation models. This service acts as a proxy between your application and other image generation APIs, simplifying the process of using different models.

## [Documentation](https://ir-docs.myqa.cc/) - [ImageRouter](https://ir.myqa.cc/)

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

## Deploy in production

If you're behind a proxy, don't forget to set timeout to 10 minutes!
Update: after the empty character streaming that I added to bypass Cloudflare timeouts, I'm not sure if this is still needed.
Nginx example:
```
proxy_connect_timeout 600s;
proxy_send_timeout 600s;
proxy_read_timeout 600s;
send_timeout 600s;
```

## Running Tests

To run tests inside the Docker container:

```bash
# Run tests with console output visible
docker compose down && docker compose up -d
docker compose exec api npm test -- --verbose
```

## After database migrations

```bash
docker compose -f docker-compose.generate.yml up
```

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

# Google Vertex AI Setup

To use Google Vertex AI models (Imagen for images and Veo for videos), you need:

## 1. Environment Variables
Add these to your `.env` file:

```bash
# Google Cloud Project ID (required)
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Google Cloud Region (optional, defaults to us-central1)
GOOGLE_CLOUD_LOCATION=us-central1

# Service Account Key (required) - base64 encoded JSON
GOOGLE_SERVICE_ACCOUNT_KEY=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsC...
```

## 2. Get Service Account Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the "Vertex AI API"
4. Go to "IAM & Admin" > "Service Accounts"
5. Create a new service account with "Vertex AI User" role
6. Create a JSON key for this service account
7. Convert the JSON to base64: `cat service-account.json | base64 -w 0`
8. Put the base64 string in `GOOGLE_SERVICE_ACCOUNT_KEY`
