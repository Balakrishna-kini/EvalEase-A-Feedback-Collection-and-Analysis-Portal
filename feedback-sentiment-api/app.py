import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob

# Define the Flask app
app = Flask(__name__)
CORS(app)

# Root route for health check
@app.route('/')
def health_check():
    return jsonify({"status": "AI Sentiment Service is running"}), 200

# Sentiment analysis route
@app.route('/api/sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400
        
    text = data.get("text", "")

    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return jsonify({
        "polarity": sentiment,
        "score": round(polarity, 3)
    })

if __name__ == '__main__':
    # Use PORT from environment for deployment (Render requirement)
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
