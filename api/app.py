from flask import Flask, request, jsonify
from collaborative_filtering import build_interaction_matrix, matrix_factorization
from content_based_filtering import compute_content_scores, get_bundle_recommendations
from reinforcement_learning import compute_rl_scores
import numpy as np

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    buyer_id = data.get("buyer_id")
    buyers = data.get("buyers", [])
    products = data.get("products", [])
    interactions = data.get("interactions", [])

    if not buyer_id:
        return jsonify({"error": "Missing buyer_id in request."}), 400
    if not buyers or not products or not interactions:
        return jsonify({"error": "Missing buyers, products, or interactions data."}), 400

    # Filter buyer list to contain only the requested buyer
    selected_buyer = next((b for b in buyers if b['_id'] == buyer_id), None)
    if not selected_buyer:
        return jsonify({"error": f"Buyer with ID {buyer_id} not found."}), 404

    # --- Collaborative Filtering ---
    R, buyer_to_index, product_to_index = build_interaction_matrix(buyers, products, interactions)
    U, V, R_pred = matrix_factorization(R, k=3, epochs=100, lr=0.01, reg=0.1)

    collab_scores = {
        buyer['_id']: {
            product['_id']: R_pred[buyer_to_index[buyer['_id']], product_to_index[product['_id']]]
            for product in products
        }
        for buyer in buyers
    }

    # --- Content-Based Filtering ---
    content_scores = compute_content_scores(buyers, products, interactions)

    # --- Reinforcement Learning ---
    rl_scores = compute_rl_scores(buyers, products, interactions, alpha=0.5)

    # --- Final Combined Scores for selected buyer only ---
    combined_scores = {}
    combined_scores[buyer_id] = {
        product['_id']: (
            collab_scores[buyer_id][product['_id']] +
            content_scores[buyer_id][product['_id']] +
            rl_scores[buyer_id][product['_id']]
        ) / 3.0
        for product in products
    }

    # --- Compile Recommendations for the selected Buyer ---
    interacted_products = {
        inter['product_id'] for inter in interactions if inter['buyer_id'] == buyer_id
    }

    recs = [
        {
            "product_id": product['_id'],
            "product_name": product['name'],
            "score": round(combined_scores[buyer_id][product['_id']], 3)
        }
        for product in products if product['_id'] not in interacted_products
    ]
    recs.sort(key=lambda x: x["score"], reverse=True)

    return jsonify({
        "buyer_id": buyer_id,
        "recommendations": recs[:5]
    })

@app.route("/")
def home():
    return "Saarthi Recommendation System API is running."


if __name__ == "__main__":
    app.run(debug=True)
