from flask import Flask, request, jsonify
import requests
from pymongo import MongoClient
from bson import ObjectId
import re

client = MongoClient("mongodb+srv://projectsaarthi56:Password123@saarthidb.6bcnn.mongodb.net/test?retryWrites=true&w=majority&appName=saarthidb")
db = client["test"]
orders_collection = db["orders"]
products_collection = db["Product"]

app = Flask(__name__)
OLLAMA_URL = "http://localhost:11434/api/generate"
NODEJS_BACKEND_URL = "http://localhost:8000/api/saarthi/chat"

PROMPT_TEMPLATE = """
You are an AI support assistant for an e-commerce store called Saarthi.

Respond conversationally to customer queries about:
- orders
- order status
- product recommendations
- product availability
- product details
- cancelling an order

User query: "{user_query}"
"""

def detect_intent(query):
    query = query.lower()
    if re.search(r'\b(order|purchase|buy|placed|made)\b', query):
        if re.search(r'\bstatus|track|tracking\b', query):
            return "order_status"
        elif re.search(r'\bcancel|refund|return\b', query):
            return "cancel_order"
        else:
            return "orders"
    elif re.search(r'\brecommend|suggest\b', query):
        return "product_recommendations"
    elif re.search(r'\bavailable|stock|inventory\b', query):
        return "product_availability"
    elif re.search(r'\bdetails|information|specifications\b', query):
        return "product_details"
    else:
        return "general"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_query = data.get("query")
    buyer_id = data.get("buyer_id")

    if not user_query or not buyer_id:
        return jsonify({"error": "Missing 'query' or 'buyer_id' in request"}), 400

    try:
        # Get chat history from Node.js backend
        history_response = requests.get(f"{NODEJS_BACKEND_URL}/history/{buyer_id}")

        if history_response.status_code == 200:
            chat_history = history_response.json().get("history", [])
        else:
            chat_history = []

        # Check if user is asking about recent orders
        if "order" in user_query.lower():
            try:
                recent_orders = list(
                    orders_collection.find({"buyerId": ObjectId(buyer_id)}).sort("orderDate", -1)
                )

            except Exception as e:
                return jsonify({"error": f"Invalid buyer_id or database error: {str(e)}"}), 400

            if recent_orders:
                orders_text = ""
                for order in recent_orders:
                    for item in order["items"]:
                        product = products_collection.find_one({"_id": item["productId"]})
                        product_name = product.get("name", "Unknown Product")
                        order_date = order.get("orderDate")
                        formatted_date = order_date.strftime("%Y-%m-%d") if order_date else "Unknown Date"
                        orders_text += f"- Order {order['_id']}: {product_name} x{item['quantity']} on {formatted_date}\n"
                data_for_prompt = f"Here are your recent orders:\n{orders_text}\n\n"
            else:
                data_for_prompt = "You have no recent orders.\n\n"
        else:
            data_for_prompt = ""

        # Prepare prompt with context and injected data
        full_prompt = f"{data_for_prompt}User query: {user_query}\nAnswer as Saarthi chatbot."

        # Call Ollama
        response = requests.post(OLLAMA_URL, json={
            "model": "mistral",
            "prompt": full_prompt,
            "stream": False
        })

        if response.status_code != 200:
            return jsonify({"error": "Failed to contact Ollama"}), 500

        result = response.json()
        answer = result.get("response", "").strip()

        # Save user message to Node.js backend
        requests.post(f"{NODEJS_BACKEND_URL}/message", json={
            "buyerId": buyer_id,
            "role": "user",
            "content": user_query
        })

        # Save assistant response to Node.js backend
        requests.post(f"{NODEJS_BACKEND_URL}/message", json={
            "buyerId": buyer_id,
            "role": "assistant",
            "content": answer
        })

        # Get updated history
        updated_history_response = requests.get(f"{NODEJS_BACKEND_URL}/history/{buyer_id}")
        if updated_history_response.status_code == 200:
            updated_history = updated_history_response.json().get("history", [])
        else:
            updated_history = chat_history + [
                {"role": "user", "content": user_query},
                {"role": "assistant", "content": answer}
            ]

        return jsonify({
            "response": answer,
            "history": updated_history,
            "buyer_id": buyer_id
        })

    except Exception as e:
        return jsonify({"error": f"Error processing chat: {str(e)}"}), 500

@app.route("/chat-simple", methods=["POST"])
def chat_simple():
    """
    Simple chat endpoint that uses Node.js backend for processing and storage
    """
    data = request.get_json()

    try:
        # Forward the request to Node.js backend
        response = requests.post(f"{NODEJS_BACKEND_URL}/process", json=data)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "Failed to process chat request"}), response.status_code

    except Exception as e:
        return jsonify({"error": f"Error connecting to backend: {str(e)}"}), 500

@app.route("/")
def home():
    return "Saarthi Chatbot API is running."

if __name__ == "__main__":
    app.run(port=5001, debug=True)
