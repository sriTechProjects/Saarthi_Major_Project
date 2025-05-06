# reinforcement_learning.py

def initialize_q_values(buyers, products):
    """
    Initialize Q-values for each buyer-product pair to zero.
    """
    Q = {}
    for buyer in buyers:
        buyer_id = buyer['_id']
        Q[buyer_id] = {}
        for product in products:
            product_id = product['_id']
            Q[buyer_id][product_id] = 0.0
    return Q

def update_q_values(Q, interactions, alpha=0.5):
    """
    Update Q-values for each interaction:
       Q_ij = Q_ij + alpha * (r_ij - Q_ij)
    where r_ij is the reward (assumed to be 1 for an interaction).
    (Implements Equation (6) in our model.)
    """
    for inter in interactions:
        buyer_id = inter['buyer_id']
        product_id = inter['product_id']
        reward = inter.get('interaction', 1)
        old_q = Q[buyer_id][product_id]
        Q[buyer_id][product_id] = old_q + alpha * (reward - old_q)
    return Q

def compute_rl_scores(buyers, products, interactions, alpha=0.5):
    """
    Compute the RL scores (Q-values) for all buyer-product pairs.
    """
    Q = initialize_q_values(buyers, products)
    Q = update_q_values(Q, interactions, alpha)
    return Q
