from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob

# ✅ Define the Flask app first
app = Flask(__name__)
CORS(app)

# ✅ Then define your route
@app.route('/api/sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
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
    app.run(port=5000)
