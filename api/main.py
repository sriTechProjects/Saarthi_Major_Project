# main.py
import json
import numpy as np
from collaborative_filtering import build_interaction_matrix, matrix_factorization
from content_based_filtering import compute_content_scores, get_bundle_recommendations
from reinforcement_learning import compute_rl_scores

def load_json(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def main():
    # Load JSON data files
    buyers = load_json("buyers.json")
    sellers = load_json("sellers.json")
    products = load_json("products.json")
    interactions = load_json("interactions.json")
    
    # -------- Collaborative Filtering Component --------
    # Build the user-item interaction matrix R (Section 3.1.2)
    R, buyer_to_index, product_to_index = build_interaction_matrix(buyers, products, interactions)
    # Perform matrix factorization via SGD (Equations (1), (2), (8), (9))
    U, V, R_pred = matrix_factorization(R, k=3, epochs=100, lr=0.01, reg=0.1)
    collab_scores = {}
    for buyer in buyers:
        buyer_id = buyer['_id']
        collab_scores[buyer_id] = {}
        for product in products:
            product_id = product['_id']
            i = buyer_to_index[buyer_id]
            j = product_to_index[product_id]
            collab_scores[buyer_id][product_id] = R_pred[i, j]
    
    # -------- Content-Based Filtering Component --------
    # Compute content-based scores (Equations (3) and (4))
    content_scores = compute_content_scores(buyers, products, interactions)
    
    # -------- Reinforcement Learning Component --------
    # Compute Q-values for each buyer-product pair (Equation (6))
    rl_scores = compute_rl_scores(buyers, products, interactions, alpha=0.5)
    
    # -------- Combine All Components --------
    # Final score S_ij = (w1*collab + w2*content + w3*RL) with equal weights (Equation (7))
    combined_scores = {}
    for buyer in buyers:
        buyer_id = buyer['_id']
        combined_scores[buyer_id] = {}
        for product in products:
            product_id = product['_id']
            score = (collab_scores[buyer_id][product_id] +
                     content_scores[buyer_id][product_id] +
                     rl_scores[buyer_id][product_id]) / 3.0
            combined_scores[buyer_id][product_id] = score

    # -------- Main Loop for User Interaction --------
    while True:
        print("\nSelect a buyer for whom to generate recommendations:")
        for i, buyer in enumerate(buyers):
            print(f"{i+1}. {buyer['_id']} - {buyer['fullName']['firstName']} {buyer['fullName']['lastName']}")
        try:
            choice = int(input("Enter choice number (or 0 to exit): ")) - 1
        except ValueError:
            print("Invalid input. Please enter a number.")
            continue
        if choice == -1:
            print("Exiting the recommendation system. Goodbye!")
            break
        if choice < 0 or choice >= len(buyers):
            print("Invalid choice. Please try again.")
            continue
        selected_buyer = buyers[choice]['_id']
        
        # Exclude products the buyer has already interacted with
        interacted_products = {inter['product_id'] for inter in interactions if inter['buyer_id'] == selected_buyer}
        
        recommendations = []
        for product in products:
            product_id = product['_id']
            if product_id not in interacted_products:
                recommendations.append((product_id, combined_scores[selected_buyer][product_id]))
        
        # Sort recommendations by descending score
        recommendations.sort(key=lambda x: x[1], reverse=True)
        
        print(f"\nTop product recommendations for buyer {selected_buyer}:")
        for prod_id, score in recommendations[:5]:
            product_name = next((p['name'] for p in products if p['_id'] == prod_id), prod_id)
            print(f"• {product_name} (ID: {prod_id}), Combined Score: {score:.3f}")
        
        # -------- Bundle Recommendations (Products Often Bought Together) --------
        print("\n--- Bundle Recommendations ---")
        buyer_interactions = list({inter['product_id'] for inter in interactions if inter['buyer_id'] == selected_buyer})
        if not buyer_interactions:
            print("No prior purchase data available for bundle recommendations.")
        else:
            print("Select one of your purchased products to see what is often bought together:")
            for i, pid in enumerate(buyer_interactions):
                prod_name = next((p['name'] for p in products if p['_id'] == pid), pid)
                print(f"{i+1}. {prod_name} (ID: {pid})")
            try:
                prod_choice = int(input("Enter choice number: ")) - 1
            except ValueError:
                print("Invalid input. Skipping bundle recommendations.")
                prod_choice = None
            if prod_choice is not None and 0 <= prod_choice < len(buyer_interactions):
                selected_product = buyer_interactions[prod_choice]
                bundle_recs = get_bundle_recommendations(selected_product, products, top_n=3)
                print(f"\nProducts often bought together with '{next((p['name'] for p in products if p['_id'] == selected_product), selected_product)}':")
                for rec_pid, sim in bundle_recs:
                    rec_name = next((p['name'] for p in products if p['_id'] == rec_pid), rec_pid)
                    print(f"• {rec_name} (ID: {rec_pid}), Similarity: {sim:.3f}")
            else:
                print("Invalid product choice for bundle recommendations.")
        
        cont = input("\nWould you like to generate recommendations for another buyer? (y/n): ")
        if cont.lower() != 'y':
            print("Exiting the recommendation system. Goodbye!")
            break

if __name__ == "__main__":
    main()
