- Mini-batch gradient descent **finally takes the best of both worlds** and performs an update for every mini-batch of _n_ training examples.
- Reduces the **variance of the parameter updates**, which can lead to more stable convergence
- Can make use of **highly optimized matrix optimizations** common to state-of-the-art deep learning libraries that make **computing the gradient w.r.t. a mini-batch very efficient.**