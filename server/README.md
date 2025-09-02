# Ariel Server - AI for Advertising Analysis

## Configuration

### 1. Environment Variables

Create a `.env` file in the server root with the following variables:

```env
# IBM Watson Tone Analyzer Configuration
VERSION=2017-09-21
APIKEY=your_api_key_here
URL=https://gateway.watsonplatform.net/tone-analyzer/api

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 2. Get Watson Credentials

1. Access [IBM Cloud](https://cloud.ibm.com/)
2. Create an account or login
3. Create a "Tone Analyzer" service
4. Copy the API Key and service URL
5. Paste them in the `.env` file

### 3. Install Dependencies

```bash
npm install
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Endpoints

### GET /
- **Description**: API status
- **Response**: Information about the API and available endpoints

### POST /analyze
- **Description**: Analyzes text tone
- **Body**: `{ "text": "text to analyze" }`
- **Validations**:
  - Text required
  - Minimum 10 characters
  - Maximum 10,000 characters
- **Response**: Tone analysis, suggestions and quality metrics

### GET /health
- **Description**: Service health status
- **Response**: Information about uptime, memory and environment

## Features

- ✅ Emotional and linguistic tone analysis
- ✅ Personalized suggestion generation
- ✅ Quality metrics calculation
- ✅ Robust input validation
- ✅ Watson-specific error handling
- ✅ Detailed logging
- ✅ CORS configured
- ✅ Validation middleware
- ✅ Global error handling

## Response Structure

```json
{
  "success": true,
  "data": {
    "tones": {
      "joy": 0.8,
      "analytical": 0.6
    },
    "suggestions": [
      {
        "type": "positive",
        "message": "Personalized suggestion",
        "tone": "joy",
        "score": 0.8
      }
    ],
    "qualityMetrics": {
      "wordCount": 150,
      "charCount": 800,
      "diversityScore": 85,
      "emotionalBalance": 70,
      "overallScore": 78
    },
    "originalText": "Analyzed text",
    "analysisTimestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Handling

- **400**: Input validation (text too short/long, required field)
- **401**: Watson authentication error
- **429**: Watson quota exceeded
- **503**: Watson service unavailable
- **500**: Internal server error

## Logs

The server logs:
- All requests with timestamp and IP
- Analysis start and completion
- Detailed errors with stack trace
- Usage metrics

## Security

- Rigorous input validation
- Data sanitization
- Text size limits
- CORS configured
- Security headers
