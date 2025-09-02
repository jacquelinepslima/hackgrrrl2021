# 🚀 Ariel - AI for Advertising Analysis

Ariel is an artificial intelligence trained with IBM Watson to analyze advertising text tone and provide improvement suggestions. Our AI recognizes emotional and linguistic characteristics in texts, helping create more inclusive and effective advertising campaigns.

## ✨ Features

### 🎯 **Core Functionality**
- **Tone Analysis**: Detects emotions (joy, sadness, anger, fear) and linguistic characteristics (analytical, confident, tentative)
- **Quality Metrics**: Calculates overall score, diversity, and emotional balance
- **Smart Suggestions**: Personalized improvement recommendations based on analysis
- **Real-time Validation**: Input validation with immediate feedback

### 🛡️ **Robust System**
- **Input Validation**: Strict validation (10-10,000 characters, type checking)
- **Error Handling**: Comprehensive error handling for Watson API and application errors
- **Security**: CORS configured, input sanitization, size limits
- **Logging**: Detailed logging for monitoring and debugging

### 🎨 **Modern Interface**
- **Responsive Design**: Works on all devices (desktop, tablet, mobile)
- **Visual Feedback**: Color-coded suggestions, progress bars, animations
- **User Experience**: Intuitive interface with real-time validation

## 🚀 Quick Start

### 1. **Setup Backend**
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
VERSION=2017-09-21
APIKEY=your_watson_api_key_here
URL=https://gateway.watsonplatform.net/tone-analyzer/api
PORT=3000
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```

### 2. **Open Frontend**
- Open `client/index.html` in a browser
- Or use a local server like Live Server (VS Code)

### 3. **Test the System**
1. Enter advertising text (minimum 10 characters)
2. Click "Analyze"
3. View results and suggestions

## 🔧 API Endpoints

### **GET /** - API Status
Returns API information and available endpoints.

### **POST /analyze** - Text Analysis
Analyzes text tone and returns comprehensive results.

**Request Body:**
```json
{
  "text": "Your advertising text here..."
}
```

**Response:**
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
        "message": "The text is very positive...",
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

### **GET /health** - Health Check
Returns service health status, uptime, and system information.

## 🎯 How It Works

### **Text Analysis Process**
1. **Input Validation**: Checks text length, type, and sanitizes input
2. **Watson Analysis**: Sends text to IBM Watson Tone Analyzer
3. **Result Processing**: Extracts tones and calculates metrics
4. **Suggestion Generation**: Creates personalized improvement suggestions
5. **Response**: Returns structured data with analysis results

### **Quality Metrics**
- **Overall Score**: Combined evaluation of text quality
- **Word/Character Count**: Text length statistics
- **Diversity Score**: Variety of detected tones
- **Emotional Balance**: How well emotions are balanced

### **Suggestion Types**
- **✅ Positive**: Good aspects to maintain
- **⚠️ Negative**: Areas that need improvement
- **🚨 Warning**: Potential issues to address
- **🔧 Improvement**: Specific enhancement suggestions
- **ℹ️ Info**: Informational notes
- **🎉 Success**: Well-balanced text feedback

## 🛠️ Technical Stack

### **Backend Technologies**
- **Node.js** (v12.0.0+) - JavaScript runtime environment
- **Express.js** (v4.17.1) - Web application framework
- **IBM Watson Tone Analyzer** (v6.0.4) - AI-powered text analysis
- **CORS** (v2.8.5) - Cross-origin resource sharing
- **dotenv** (v8.2.0) - Environment variable management

### **Frontend Technologies**
- **HTML5** - Semantic markup and modern web standards
- **CSS3** - Advanced styling with Grid, Flexbox, and CSS Variables
- **JavaScript ES6+** - Modern JavaScript with async/await, arrow functions
- **Responsive Design** - Mobile-first approach with media queries

### **Development & Build Tools**
- **Nodemon** (v2.0.7) - Development server with auto-restart
- **Jest** (v26.6.3) - Testing framework (configured)
- **npm** - Package manager and script runner
- **Git** - Version control system

### **AI & Machine Learning**
- **IBM Watson Tone Analyzer API** - Natural language processing
- **Tone Analysis** - Emotional and linguistic characteristic detection
- **Sentiment Analysis** - Joy, sadness, anger, fear detection
- **Language Style Analysis** - Analytical, confident, tentative patterns

### **Architecture & Patterns**
- **RESTful API** - Standard HTTP methods and status codes
- **Middleware Pattern** - Request validation and error handling
- **MVC Architecture** - Separation of concerns
- **Async/Await** - Modern asynchronous programming
- **Error Handling** - Comprehensive error management

### **Security & Performance**
- **Input Validation** - Client and server-side validation
- **Data Sanitization** - XSS and injection attack prevention
- **CORS Configuration** - Controlled cross-origin access
- **Rate Limiting** - Ready for future implementation
- **Response Caching** - Prepared for performance optimization

### **Deployment & Infrastructure**
- **Environment Variables** - Configuration management
- **Port Configuration** - Flexible port assignment
- **Health Checks** - Service monitoring endpoints
- **Logging** - Comprehensive request and error logging
- **Cross-platform** - Windows, macOS, and Linux support

## 🔧 Configuration

### **Environment Variables**
| Variable | Description | Default |
|----------|-------------|---------|
| `VERSION` | Watson API version | `2017-09-21` |
| `APIKEY` | Watson API key | Required |
| `URL` | Watson service URL | Required |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

### **Watson Setup**
1. Create IBM Cloud account
2. Create Tone Analyzer service
3. Get API key and service URL
4. Add to `.env` file

## 🚨 Error Handling

### **HTTP Status Codes**
- **400**: Input validation errors
- **401**: Watson authentication error
- **429**: Watson quota exceeded
- **503**: Watson service unavailable
- **500**: Internal server error

### **Error Response Format**
```json
{
  "error": "Error type",
  "message": "User-friendly message",
  "code": "ERROR_CODE",
  "timestamp": "ISO timestamp"
}
```

## 📱 Responsive Design

- **Desktop**: Full layout with metric grid
- **Tablet**: Adaptive grid layout
- **Mobile**: Vertical layout optimized for touch
- **Touch**: Optimized interactions for mobile devices

## 🎨 UI Components

### **Quality Metrics Cards**
- Gradient backgrounds with hover effects
- Large numbers for easy reading
- Color-coded for visual appeal

### **Tone Analysis**
- Progress bars with smooth animations
- Tone descriptions and scores
- Responsive layout for all screen sizes

### **Suggestions**
- Color-coded by type
- Icons for quick identification
- Hover effects and animations

## 🚀 Development

### **Running in Development**
```bash
# Backend
cd server
npm run dev

# Frontend
# Open client/index.html in browser
# Or use Live Server extension
```

### **Production Build**
```bash
cd server
npm start
```

### **Testing**
```bash
cd server
npm test
```

## 📊 Performance

- **Input Validation**: Real-time client-side + server-side validation
- **API Optimization**: Efficient Watson API calls
- **Response Caching**: Ready for future implementation
- **Error Recovery**: Graceful fallbacks and retry mechanisms

## 🔒 Security Features

- **Input Sanitization**: Prevents injection attacks
- **Size Limits**: Prevents large payload attacks
- **CORS Configuration**: Controlled cross-origin access
- **Error Masking**: Production error messages don't expose internals

## 🚀 Future Enhancements

1. **User Authentication**: User accounts and history
2. **Result Caching**: Improve performance with caching
3. **Export Features**: PDF reports and data export
4. **Advanced Analytics**: Usage statistics and insights
5. **API Rate Limiting**: Protect against abuse
6. **Multi-language Support**: Internationalization
7. **Batch Processing**: Analyze multiple texts at once
8. **Integration APIs**: Connect with other services

## 🤝 Contributing

This project was developed by **Team 14 - Hack Grrrl 2021**.

### **Development Guidelines**
- Follow existing code style
- Add tests for new features
- Update documentation for changes
- Use meaningful commit messages

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### **Common Issues**

#### **Watson API Errors**
- Check API key and URL in `.env`
- Verify Watson service is active
- Check quota limits

#### **CORS Errors**
- Ensure backend is running on port 3000
- Check frontend URL configuration

#### **Port Already in Use**
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### **Getting Help**
- Check console logs for detailed errors
- Verify all environment variables are set
- Ensure Watson service is properly configured

---

**🎉 Ready to analyze your advertising text with AI-powered insights!**

For technical questions, check the server logs and browser console for detailed information.