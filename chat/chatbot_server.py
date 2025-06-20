# from flask import Flask, request, jsonify
# import requests
# from pymongo import MongoClient
# from flask_cors import CORS
# from bson import ObjectId
# import re

# client = MongoClient("mongodb+srv://projectsaarthi56:Password123@saarthidb.6bcnn.mongodb.net/test?retryWrites=true&w=majority&appName=saarthidb")
# db = client["test"]
# orders_collection = db["orders"]
# products_collection = db["Product"]

# app = Flask(__name__)
# CORS(app)
# OLLAMA_URL = "http://localhost:11434/api/generate"

# PROMPT_TEMPLATE = """
# You are an AI support assistant for an e-commerce store called Saarthi.

# Respond conversationally to customer queries about:
# - orders
# - order status
# - product recommendations
# - product availability
# - product details
# - cancelling an order

# User query: "{user_query}"
# """

# def detect_intent(query):
#     query = query.lower()
#     if re.search(r'\b(order|purchase|buy|placed|made)\b', query):
#         if re.search(r'\bstatus|track|tracking\b', query):
#             return "order_status"
#         elif re.search(r'\bcancel|refund|return\b', query):
#             return "cancel_order"
#         else:
#             return "orders"
#     elif re.search(r'\brecommend|suggest\b', query):
#         return "product_recommendations"
#     elif re.search(r'\bavailable|stock|inventory\b', query):
#         return "product_availability"
#     elif re.search(r'\bdetails|information|specifications\b', query):
#         return "product_details"
#     else:
#         return "general"

# def translate_to_hindi(text):
#     prompt = f"Translate the following English response to Hindi:\n\n{text}"
#     response = requests.post(OLLAMA_URL, json={
#         "model": "mistral",
#         "prompt": prompt,
#         "stream": False
#     })

#     if response.status_code == 200:
#         translated = response.json().get("response", "").strip()
#         return translated
#     else:
#         return "क्षमा करें, अनुवाद करने में असमर्थ हूँ।"

# @app.route("/chat", methods=["POST"])
# def chat():
#     data = request.get_json()
#     user_query = data.get("query")
#     chat_history = data.get("history", [])
#     buyer_id = data.get("buyer_id")
#     translate = data.get("translate", False)

#     if not user_query or not buyer_id:
#         return jsonify({"error": "Missing 'query' or 'buyer_id' in request"}), 400

#     data_for_prompt = ""

#     # If the user asks about orders
#     if "order" in user_query.lower():
#         try:
#             recent_orders = list(
#                 orders_collection.find({"buyerId": ObjectId(buyer_id)}).sort("orderDate", -1)
#             )
#         except Exception as e:
#             return jsonify({"error": f"Invalid buyer_id or database error: {str(e)}"}), 400

#         if recent_orders:
#             orders_text = ""
#             for order in recent_orders:
#                 for item in order["items"]:
#                     product = products_collection.find_one({"_id": item["productId"]})
#                     product_name = product.get("name", "Unknown Product") if product else "Unknown Product"
#                     order_date = order.get("orderDate")
#                     formatted_date = order_date.strftime("%Y-%m-%d") if order_date else "Unknown Date"
#                     orders_text += f"- Order {order['_id']}: {product_name} x{item['quantity']} on {formatted_date}\n"
#             data_for_prompt += f"Here are your recent orders:\n{orders_text}\n\n"
#         else:
#             data_for_prompt += "You have no recent orders.\n\n"

#     # If the user asks to list fruits or products
#     if re.search(r'\blist\b.*\b(fruit|fruits|items|products|vegetables)\b', user_query.lower()):
#         try:
#             matched_products = list(products_collection.find(
#                 {"category": {"$regex": "fruit", "$options": "i"}},
#                 {"name": 1}
#             ))

#             if matched_products:
#                 product_names = [prod["name"] for prod in matched_products if "name" in prod]
#                 products_text = "\n".join(f"- {name}" for name in product_names)
#                 data_for_prompt += f"Here are the available fruits:\n{products_text}\n\n"
#             else:
#                 data_for_prompt += "No fruits are currently available in the store.\n\n"

#         except Exception as e:
#             return jsonify({"error": f"Database error while fetching products: {str(e)}"}), 500

#     # Construct full prompt for Ollama
#     full_prompt = f"{data_for_prompt}User query: {user_query}\nAnswer as Saarthi chatbot."

#     # Query the language model
#     response = requests.post(OLLAMA_URL, json={
#         "model": "mistral",
#         "prompt": full_prompt,
#         "stream": False
#     })

#     if response.status_code != 200:
#         return jsonify({"error": "Failed to contact Ollama"}), 500

#     result = response.json()
#     answer = result.get("response", "").strip()

#     # Translate if requested
#     if translate:
#         answer = translate_to_hindi(answer)

#     updated_history = chat_history + [
#         {"role": "user", "content": user_query},
#         {"role": "assistant", "content": answer}
#     ]

#     return jsonify({
#         "response": answer,
#         "history": updated_history
#     })


# @app.route("/")
# def home():
#     return "Saarthi Chatbot API is running."

# if __name__ == "__main__":
#     app.run(port=5001, debug=True)


from flask import Flask, request, jsonify
import requests
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId
from datetime import datetime
import re

client = MongoClient("mongodb+srv://projectsaarthi56:Password123@saarthidb.6bcnn.mongodb.net/test?retryWrites=true&w=majority&appName=saarthidb")
db = client["test"]
orders_collection = db["orders"]
products_collection = db["Product"]
chat_history_collection = db["chathistories"] 

app = Flask(__name__)
CORS(app)
OLLAMA_URL = "http://localhost:11434/api/generate"

def translate(text, target_language):
    if target_language == "en":
        return text  # No translation needed

    prompt = f"Translate the following English response to {target_language}:\n\n{text}"
    response = requests.post(OLLAMA_URL, json={
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    })

    if response.status_code == 200:
        return response.json().get("response", "").strip()
    else:
        return "Sorry, I couldn't translate your message."

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_query = data.get("query")
    chat_history = data.get("history", [])
    buyer_id = data.get("buyer_id")
    language = data.get("language", "en")  # Default to English

    if not user_query or not buyer_id:
        return jsonify({"error": "Missing 'query' or 'buyer_id' in request"}), 400

    chat_doc = chat_history_collection.find_one({"buyerId": buyer_id})
    existing_history = chat_doc.get("messages", []) if chat_doc else []

    data_for_prompt = ""

    # If the user asks about orders
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
                    product_name = product.get("name", "Unknown Product") if product else "Unknown Product"
                    order_date = order.get("orderDate")
                    formatted_date = order_date.strftime("%Y-%m-%d") if order_date else "Unknown Date"
                    orders_text += f"- Order {order['_id']}: {product_name} x{item['quantity']} on {formatted_date}\n"
            data_for_prompt += f"Here are your recent orders:\n{orders_text}\n\n"
        else:
            data_for_prompt += "You have no recent orders.\n\n"

    # If the user asks to list fruits or products
    if re.search(r'\blist\b.*\b(fruit|fruits|items|products|vegetables)\b', user_query.lower()):
        try:
            matched_products = list(products_collection.find(
                {"category": {"$regex": "fruit", "$options": "i"}},
                {"name": 1}
            ))

            if matched_products:
                product_names = [prod["name"] for prod in matched_products if "name" in prod]
                products_text = "\n".join(f"- {name}" for name in product_names)
                data_for_prompt += f"Here are the available fruits:\n{products_text}\n\n"
            else:
                data_for_prompt += "No fruits are currently available in the store.\n\n"

        except Exception as e:
            return jsonify({"error": f"Database error while fetching products: {str(e)}"}), 500

    # Construct the prompt
    full_prompt = f"{data_for_prompt}User query: {user_query}\nAnswer as Saarthi chatbot."

        # Call Ollama
        response = requests.post(OLLAMA_URL, json={
            "model": "mistral",
            "prompt": full_prompt,
            "stream": False
        })

        if response.status_code != 200:
            return jsonify({"error": "Failed to contact Ollama"}), 500

    answer = response.json().get("response", "").strip()

    # Translate if language is not English
    if language != "English":
        answer = translate(answer, language)

    new_messages = existing_history + [
        {"role": "user", "content": user_query, "timestamp": datetime.utcnow()},
        {"role": "assistant", "content": answer, "timestamp": datetime.utcnow()}
    ]
    
    chat_history_collection.update_one(
        {"buyerId": buyer_id},
        {"$set": {"messages": new_messages, "lastUpdated": datetime.utcnow()}},
        upsert=True
    )

    return jsonify({
        "response": answer,
        "history": new_messages
    })

@app.route("/")
def home():
    return "Saarthi Chatbot API is running."

if __name__ == "__main__":
    app.run(port=5001, debug=True)

