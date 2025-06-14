# ImageRouter API

A simple API router for image generation models. This service acts as a proxy between your application and other image generation APIs, simplifying the process of using different models.

## [Documentation](https://docs.imagerouter.io) - [ImageRouter](https://imagerouter.io)

## Features

- OpenAI compatible API endpoint
- Rate limiting
- Free and paid model usage tracking

## API Endpoints

See [API Reference](https://docs.imagerouter.io)

## Upcoming Features and Limitations

See [Upcoming Features](https://docs.imagerouter.io/upcoming-features/)



## Setup

#### Prerequisites

- Docker and Docker Compose
- API keys for the models you want to use

#### Setup

1. Clone the repository
2. Create a `.env` file and add your API keys
3. Follow instructions below to get Vertex API key
4. Enable CORS for S3 image storage

## Running the Service

Using Docker Compose:
```bash
docker compose up
```

The API will be available at `http://localhost:4000`

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


# Deploy in production

## ~~Nginx example:~~

Update: after the empty character streaming that I added to bypass Cloudflare timeouts, I'm not sure if this is still needed.
```
proxy_connect_timeout 600s;
proxy_send_timeout 600s;
proxy_read_timeout 600s;
send_timeout 600s;
```

## S3 setup

Create a public s3 bucket and update the .env.
1. Add a new CNAME DNS record:
```
CNAME   storage  s3.provider.com
```
2. Add CLoudflare transform rule:

Filter: 
```
Hostname   equals  storage.imagerouter.io
# (http.host eq "storage.imagerouter.io")
Rewrite to  Dynamic Redirectconcat("/file/BUCKET_NAME", http.request.uri.path)
```

3. Allow CORS for storage:

Create a new HTTP Response Header Transform Rule:

Filter:
```
Hostname   equals  storage.imagerouter.io
# (http.host eq "storage.imagerouter.io")
Set static      Access-Control-Allow-Origin     *
```


## Google Vertex AI Setup

To use Google Vertex AI models (Imagen for images and Veo for videos), you need:

### 1. Environment Variables
Add these to your `.env` file:

```bash
# Google Cloud Project ID (required)
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Google Cloud Region (optional, defaults to us-central1)
GOOGLE_CLOUD_LOCATION=us-central1

# Service Account Key (required) - base64 encoded JSON
GOOGLE_SERVICE_ACCOUNT_KEY=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsC...
```

#### 2. Get Service Account Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the "Vertex AI API"
4. Go to "IAM & Admin" > "Service Accounts"
5. Create a new service account with "Vertex AI User" role
6. Create a JSON key for this service account
7. Convert the JSON to base64: `cat service-account.json | base64 -w 0`
8. Put the base64 string in `GOOGLE_SERVICE_ACCOUNT_KEY`
