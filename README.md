# Cart Pendulum

- Small game written in JavaScript to demonstrate some basics machine learning using a simple linear regression model.

- The objective of the game is to balance the stick in the cart while keeping the cart inside of the lines as long as possible.

- The game ends if the stick falls off the cart or if the cart hits the side walls. To control the cart the player can press left or right to accelerate the cart.

  <img src="\readme\inverted-pendulum.png" width="300">

- Might seem a fairly simple task but takes a while even for a human player to master it. [Try it out here for yourself.](https://tentone.github.io/cart-pendulum/human) Or just watch me trying to play it bellow.
- While the game is running a score is calculated based on the amount of time that the player was able to hold the pendulum without hitting the wall.

<img src="\readme\human.gif" width="600">



### Linear Model

- A [live demo of the model](https://tentone.github.io/cart-pendulum/model) is available. Its parameters can be changed in the GUI.
- The model has three inputs: the `position` and `velocity` of the cart and the `angle` of pendulum.
- The model has two outputs: `left` button pressed and `right` button pressed.
- For each input parameter a linear weight (m) and offset (b) are be applied.
- The final decision is the sum of all weights that is then compared with a threshold to decide the action.

<img src="\readme\model-diagram.png" width="500">



### Training Linear Model

- The challenge with training is to determine the ideal `m` and`b` for each input variable and the `e` value.
- In other words training will consist in experimenting different values until we reach a value that is successful.
- A simple approach to train the model is simply to randomly test for values until a good set of parameters appears that yields a good score.

<img src="\readme\model.gif" width="600">

- For this simple scenario this approach can get fairly good results after a couple of minutes but it would not be usable for any real complex environment.
- To ensure convergence of the training process a iterative/genetic approach can be use used.
- We start with a random base model, test variations of the model and select the one that improved results, repeat until we get good results.



Neural-Network





### License

- This project is distributed under [MIT license](https://opensource.org/licenses/MIT) and can be used for commercial applications.
- License is available on the [Github](https://github.com/tentone/cart-pendulum) page of the project.