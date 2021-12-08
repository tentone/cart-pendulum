# Cart Pendulum

- Small game to demonstrate basic machine learning concepts using a simple linear regression model.

- The objective of the game is to balance the stick in the cart while keeping the cart inside of the lines as long as possible.

- The game ends if the stick falls off the cart or if the cart hits the side walls. To control the cart the player can press left or right to accelerate the cart.

  <img src="https://tentone.github.io/cart-pendulum/readme/inverted-pendulum.png" width="300">

- Might seem a fairly simple task but takes a while even for a human player to master it. [Try it out here for yourself.](https://tentone.github.io/cart-pendulum/examples/human) Or just watch me trying to play it bellow.
- While the game is running a score is calculated based on the amount of time that the player was able to hold the pendulum without hitting the wall.

<img src="https://tentone.github.io/cart-pendulum/readme/human.gif" width="600">



### Linear Model

- A [live demo of the linear model](https://tentone.github.io/cart-pendulum/examples/linear) is available with two training approaches for the linear model. Training parameters can be changed in the GUI.
- The model has three inputs: the `position` and `velocity` of the cart and the `angle` of pendulum.
- The model has two outputs: `left` button pressed and `right` button pressed.
- For each input parameter a linear weight (m) and offset (b) are be applied.
- The final decision is the sum of all weights that is then compared with a threshold to decide the action.

<img src="https://tentone.github.io/cart-pendulum/readme/model-diagram.png" width="500">



### Training Linear Model

- The challenge with training is to determine the ideal `m` and`b` for each input variable and the `e` value.
- In other words training will consist in experimenting different values until we reach a value that is successful.
- A simple approach to train the model is simply to randomly test for values until a good set of parameters appears that yields a good score.
- As we can see for this case after 490K combinations we obtained one that yields perfect results! 
- Took a while but means that simple linear model can handle the task.

<img src="https://tentone.github.io/cart-pendulum/readme/model.gif" width="600">

- This training approach of course would not be usable for any real complex environment.
- To ensure convergence of the training process a iterative/genetic approach should be used.

<img src="https://tentone.github.io/cart-pendulum/readme/iterative-training.png" width="400">

- We start with a random base model, test variations of the model and select the one that improved results, repeat until we get good results.
- With iterative training we can get near perfect results few epochs (~5 in average) wich is a lot faster than random testing.

- During this process we should also look out for local maximum. This happens when we get stuck with values that cannot be improved further.

<img src="https://tentone.github.io/cart-pendulum/readme/maxima-minima.png" width="500">

### Neural-Network

- Now that we got the basics right lets try and train the system using a more complex neural model with [brain.js](https://brain.js.org/)
- Our inputs will be the same `position`, `velocity` and `angle` and the outputs will be `right` and `left`.
- Contraty to the linear model where we test combinations of parameters to find the best configuration.
- For the neural-network we need to provide datasets of game variables and decisions for training.
- These datasets can be recorded from sessions from human players or even for example from the linear model.

```json
[
	{
		"input": {"velocity": 1.246, "angle": -0.0163, "position": 3.17},
		"output": {"left": false, "right": true}
	},
	...
]
```





### License

- This project is distributed under [MIT license](https://opensource.org/licenses/MIT) and can be used for commercial applications.
- License is available on the [Github](https://github.com/tentone/cart-pendulum) page of the project.