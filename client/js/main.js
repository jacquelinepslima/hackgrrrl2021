document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#analysis-form');
    const textInput = document.querySelector('#text-input');
    const charCount = document.querySelector('.char-count');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    // Create results section
    const resultSection = document.createElement('section');
    resultSection.id = 'results';
    resultSection.className = 'results-section';
    resultSection.innerHTML = `
        <div class="container">
            <h2>Analysis Results</h2>
            <div class="loading" style="display: none;">
                <div class="spinner"></div>
                <p>🤖 AI is analyzing your text...</p>
                <p class="loading-details">This may take a few seconds</p>
            </div>
            <div class="result-content" style="display: none;">
                <div class="quality-metrics"></div>
                <div class="tone-analysis"></div>
                <div class="suggestions"></div>
                <div class="text-summary"></div>
                <div class="action-buttons">
                    <button class="new-analysis-btn" onclick="location.reload()">📝 Analyze New Text</button>
                </div>
            </div>
            <div class="error-content" style="display: none;"></div>
        </div>
    `;
    
    // Insert results section after the header
    document.querySelector('header').insertAdjacentElement('afterend', resultSection);

    // Character counting
    textInput.addEventListener('input', () => {
        const count = textInput.value.length;
        charCount.textContent = `${count} characters`;
        
        // Update character count color based on length
        if (count < 10) {
            charCount.style.color = '#e74c3c';
        } else if (count > 10000) {
            charCount.style.color = '#e74c3c';
        } else {
            charCount.style.color = '#27ae60';
        }
        
        validateInput();
    });

    // Real-time validation
    textInput.addEventListener('blur', validateInput);

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            showLoading();
            const response = await analyzeText(textInput.value.trim());
            showResults(response);
        } catch (error) {
            console.error('Analysis error:', error);
            showError('An error occurred while analyzing the text. Please try again.', error);
        }
    });

    function validateInput() {
        const text = textInput.value.trim();
        const errorElement = textInput.parentNode.querySelector('.input-error');
        
        // Remove previous error message
        if (errorElement) {
            errorElement.remove();
        }
        
        // Validations
        if (text.length > 0 && text.length < 10) {
            showInputError('Text must have at least 10 characters');
            return false;
        }
        
        if (text.length > 10000) {
            showInputError('Text must have a maximum of 10,000 characters');
            return false;
        }
        
        return true;
    }

    function showInputError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'input-error';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.9em';
        errorElement.style.marginTop = '5px';
        textInput.parentNode.appendChild(errorElement);
    }

    function validateForm() {
        const text = textInput.value.trim();
        
        if (!text) {
            showInputError('Please enter a text for analysis.');
            textInput.focus();
            return false;
        }
        
        if (text.length < 10) {
            showInputError('Text must have at least 10 characters.');
            textInput.focus();
            return false;
        }
        
        if (text.length > 10000) {
            showInputError('Text must have a maximum of 10,000 characters.');
            textInput.focus();
            return false;
        }
        
        return true;
    }

    async function analyzeText(text) {
        console.log('Sending text for analysis:', text);
        
        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Analysis result:', result);
        return result;
    }

    function showLoading() {
        const loading = resultSection.querySelector('.loading');
        const resultContent = resultSection.querySelector('.result-content');
        const errorContent = resultSection.querySelector('.error-content');
        
        // Update button state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        // Show loading, hide other content
        loading.style.display = 'flex';
        resultContent.style.display = 'none';
        errorContent.style.display = 'none';
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    function showResults(response) {
        const loading = resultSection.querySelector('.loading');
        const resultContent = resultSection.querySelector('.result-content');
        const errorContent = resultSection.querySelector('.error-content');
        
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
        // Hide loading, show results
        loading.style.display = 'none';
        resultContent.style.display = 'block';
        errorContent.style.display = 'none';

        const { tones, suggestions, qualityMetrics, originalText } = response.data;

        // Display quality metrics
        showQualityMetrics(qualityMetrics);
        
        // Display tone analysis
        showToneAnalysis(tones);
        
        // Display suggestions
        showSuggestions(suggestions);
        
        // Display text summary
        showTextSummary(originalText);
        
        // Clear input
        textInput.value = '';
        charCount.textContent = '0 characters';
    }

    function showQualityMetrics(metrics) {
        const qualityMetricsDiv = resultSection.querySelector('.quality-metrics');
        
        qualityMetricsDiv.innerHTML = `
            <h3>📊 Quality Metrics</h3>
            <div class="metrics-grid">
                <div class="metric-card primary">
                    <div class="metric-value">${metrics.overallScore}%</div>
                    <div class="metric-label">Overall Score</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.wordCount}</div>
                    <div class="metric-label">Words</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.charCount}</div>
                    <div class="metric-label">Characters</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.diversityScore}%</div>
                    <div class="metric-label">Diversity</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.emotionalBalance}%</div>
                    <div class="metric-label">Emotional Balance</div>
                </div>
            </div>
        `;
    }

    function showToneAnalysis(tones) {
        const toneAnalysis = resultSection.querySelector('.tone-analysis');
        
        if (Object.keys(tones).length === 0) {
            toneAnalysis.innerHTML = `
                <h3>🎭 Tone Analysis</h3>
                <p class="no-tones">No specific tone was detected in the text.</p>
            `;
            return;
        }

        toneAnalysis.innerHTML = `
            <h3>🎭 Tone Analysis</h3>
            <div class="tone-scores">
                ${Object.entries(tones).map(([tone, score]) => `
                    <div class="tone-item">
                        <div class="tone-header">
                            <span class="tone-name">${getToneDisplayName(tone)}</span>
                            <span class="tone-score">${(score * 100).toFixed(1)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${score * 100}%"></div>
                        </div>
                        <div class="tone-description">${getToneDescription(tone)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function showSuggestions(suggestions) {
        const suggestionsDiv = resultSection.querySelector('.suggestions');
        
        suggestionsDiv.innerHTML = `
            <h3>💡 Improvement Suggestions</h3>
            <div class="suggestions-list">
                ${suggestions.map(suggestion => `
                    <div class="suggestion-item suggestion-${suggestion.type}">
                        <div class="suggestion-icon">${getSuggestionIcon(suggestion.type)}</div>
                        <div class="suggestion-content">
                            <p class="suggestion-message">${suggestion.message}</p>
                            <div class="suggestion-meta">
                                <span class="suggestion-tone">${getToneDisplayName(suggestion.tone)}</span>
                                <span class="suggestion-score">${(suggestion.score * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function showTextSummary(text) {
        const textSummary = resultSection.querySelector('.text-summary');
        
        textSummary.innerHTML = `
            <h3>📝 Analyzed Text</h3>
            <div class="text-preview">
                <p>${text.length > 200 ? text.substring(0, 200) + '...' : text}</p>
                <small>${text.length} characters analyzed</small>
            </div>
        `;
    }

    function showError(message, error = null) {
        const loading = resultSection.querySelector('.loading');
        const resultContent = resultSection.querySelector('.result-content');
        const errorContent = resultSection.querySelector('.error-content');
        
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
        // Hide loading and results, show error
        loading.style.display = 'none';
        resultContent.style.display = 'none';
        errorContent.style.display = 'block';
        
        errorContent.innerHTML = `
            <div class="error-message">
                <h3>❌ Analysis Error</h3>
                <p>${message}</p>
                ${error ? `<details><summary>Technical details</summary><pre>${error.message}</pre></details>` : ''}
                <button onclick="location.reload()" class="retry-button">🔄 Try Again</button>
            </div>
        `;
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Helper functions
    function getToneDisplayName(tone) {
        const toneNames = {
            'joy': 'Joy',
            'sadness': 'Sadness',
            'anger': 'Anger',
            'fear': 'Fear',
            'disgust': 'Disgust',
            'analytical': 'Analytical',
            'confident': 'Confident',
            'tentative': 'Tentative',
            'openness': 'Openness',
            'conscientiousness': 'Conscientiousness',
            'extraversion': 'Extraversion',
            'agreeableness': 'Agreeableness',
            'neuroticism': 'Neuroticism'
        };
        return toneNames[tone] || tone.charAt(0).toUpperCase() + tone.slice(1);
    }

    function getToneDescription(tone) {
        const descriptions = {
            'joy': 'Feeling of happiness and satisfaction',
            'sadness': 'Feeling of sadness and melancholy',
            'anger': 'Feeling of irritation and frustration',
            'fear': 'Feeling of worry and anxiety',
            'disgust': 'Feeling of repulsion and aversion',
            'analytical': 'Fact and logic-based language',
            'confident': 'Assertive and determined language',
            'tentative': 'Hesitant and cautious language'
        };
        return descriptions[tone] || 'Characteristic detected in the text';
    }

    function getSuggestionIcon(type) {
        const icons = {
            'positive': '✅',
            'negative': '⚠️',
            'warning': '🚨',
            'improvement': '🔧',
            'info': 'ℹ️',
            'success': '🎉',
            'balanced': '⚖️'
        };
        return icons[type] || '💡';
    }
});