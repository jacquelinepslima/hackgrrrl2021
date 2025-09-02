require('dotenv/config');
const express = require('express');
const cors = require('cors');
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

// Express configuration
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit to prevent very large texts

// Tone Analyzer configuration
const toneAnalyzer = new ToneAnalyzerV3({
    version: process.env.VERSION,
    authenticator: new IamAuthenticator({
        apikey: process.env.APIKEY,
    }),
    serviceUrl: process.env.URL,
});

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

// Input validation middleware
const validateTextInput = (req, res, next) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({
            error: 'Missing required field',
            message: 'The "text" field is required',
            field: 'text'
        });
    }
    
    if (typeof text !== 'string') {
        return res.status(400).json({
            error: 'Invalid data type',
            message: 'The "text" field must be a string',
            field: 'text'
        });
    }
    
    if (text.trim().length < 10) {
        return res.status(400).json({
            error: 'Text too short',
            message: 'Text must have at least 10 characters',
            field: 'text',
            minLength: 10,
            currentLength: text.trim().length
        });
    }
    
    if (text.length > 10000) {
        return res.status(400).json({
            error: 'Text too long',
            message: 'Text must have a maximum of 10,000 characters',
            field: 'text',
            maxLength: 10000,
            currentLength: text.length
        });
    }
    
    // Basic sanitization
    req.body.text = text.trim();
    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Watson-specific errors
    if (err.code === 'UNAUTHORIZED') {
        return res.status(401).json({
            error: 'Authentication error',
            message: 'Invalid credentials for Watson service',
            code: 'WATSON_AUTH_ERROR'
        });
    }
    
    if (err.code === 'QUOTA_EXCEEDED') {
        return res.status(429).json({
            error: 'Quota exceeded',
            message: 'Watson service request limit exceeded',
            code: 'WATSON_QUOTA_ERROR'
        });
    }
    
    // Network/timeout errors
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
        return res.status(503).json({
            error: 'Service unavailable',
            message: 'Watson service is temporarily unavailable',
            code: 'WATSON_SERVICE_ERROR'
        });
    }
    
    // Generic error
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
    });
};

// Function to generate suggestions based on analysis
function generateSuggestions(tones) {
    const suggestions = [];
    
    // Emotional tone analysis
    if (tones.joy > 0.7) {
        suggestions.push({
            type: 'positive',
            message: 'The text is very positive. Consider balancing with more objective information.',
            tone: 'joy',
            score: tones.joy
        });
    }
    if (tones.sadness > 0.5) {
        suggestions.push({
            type: 'negative',
            message: 'The text may be too negative. Consider adding more positive elements.',
            tone: 'sadness',
            score: tones.sadness
        });
    }
    if (tones.anger > 0.3) {
        suggestions.push({
            type: 'warning',
            message: 'The text contains elements that may be interpreted as aggressive. Consider softening the language.',
            tone: 'anger',
            score: tones.anger
        });
    }
    if (tones.fear > 0.4) {
        suggestions.push({
            type: 'warning',
            message: 'The text may be causing fear or anxiety. Consider a more reassuring approach.',
            tone: 'fear',
            score: tones.fear
        });
    }

    // Language tone analysis
    if (tones.analytical < 0.3) {
        suggestions.push({
            type: 'improvement',
            message: 'The text could be more analytical and fact-based.',
            tone: 'analytical',
            score: tones.analytical
        });
    }
    if (tones.confident > 0.7) {
        suggestions.push({
            type: 'info',
            message: 'The text is very assertive. Consider adding more inclusive elements.',
            tone: 'confident',
            score: tones.confident
        });
    }
    if (tones.tentative > 0.6) {
        suggestions.push({
            type: 'improvement',
            message: 'The text is too hesitant. Consider being more direct in your statements.',
            tone: 'tentative',
            score: tones.tentative
        });
    }
    
    // If no specific suggestions, give general feedback
    if (suggestions.length === 0) {
        suggestions.push({
            type: 'success',
            message: 'The text presents good emotional and linguistic balance.',
            tone: 'balanced',
            score: 0.5
        });
    }

    return suggestions;
}

// Function to calculate quality metrics
function calculateQualityMetrics(tones, text) {
    const wordCount = text.split(/\s+/).length;
    const charCount = text.length;
    
    // Calculate overall score based on tone diversity
    const toneCount = Object.keys(tones).length;
    const diversityScore = Math.min(toneCount / 7, 1); // Maximum 7 different tones
    
    // Calculate emotional balance score
    const emotionalTones = ['joy', 'sadness', 'anger', 'fear', 'disgust'];
    const emotionalScores = emotionalTones.map(tone => tones[tone] || 0);
    const emotionalBalance = 1 - Math.max(...emotionalScores);
    
    return {
        wordCount,
        charCount,
        diversityScore: Math.round(diversityScore * 100),
        emotionalBalance: Math.round(emotionalBalance * 100),
        overallScore: Math.round(((diversityScore + emotionalBalance) / 2) * 100)
    };
}

// Test route
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Ariel API - AI for advertising analysis',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            analyze: 'POST /analyze - Analyze text tone'
        }
    });
});

// Text analysis route
app.post('/analyze', validateTextInput, async (req, res, next) => {
    try {
        const { text } = req.body;
        
        console.log(`Starting text analysis with ${text.length} characters`);
        
        // Tone analysis
        const toneParams = {
            toneInput: { text },
            contentType: 'application/json'
        };

        const toneAnalysis = await toneAnalyzer.tone(toneParams);
        
        console.log('Watson analysis completed successfully');
        
        // Process results
        const tones = {};
        if (toneAnalysis.result.document_tone.tones) {
            toneAnalysis.result.document_tone.tones.forEach(tone => {
                tones[tone.tone_name.toLowerCase()] = tone.score;
            });
        }

        // Generate suggestions
        const suggestions = generateSuggestions(tones);
        
        // Calculate quality metrics
        const qualityMetrics = calculateQualityMetrics(tones, text);

        // Response
        const response = {
            success: true,
            data: {
                tones,
                suggestions,
                qualityMetrics,
                originalText: text,
                analysisTimestamp: new Date().toISOString()
            }
        };
        
        console.log(`Analysis completed with ${Object.keys(tones).length} tones detected`);
        res.json(response);

    } catch (error) {
        console.error('Analysis error:', error);
        next(error);
    }
});

// Service health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Apply error handling middleware
app.use(errorHandler);

// Middleware for routes not found
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `The route ${req.method} ${req.originalUrl} does not exist`,
        availableRoutes: ['GET /', 'POST /analyze', 'GET /health']
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Ariel Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Available endpoints:`);
    console.log(`   - GET  / (API status)`);
    console.log(`   - POST /analyze (text analysis)`);
    console.log(`   - GET  /health (health status)`);
});