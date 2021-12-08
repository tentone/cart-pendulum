# Cart Balance

- Small game written in JavaScript to demonstrate some basics machine learning using a simple linear regression model.
- The objective of the game is to balance the stick in the cart while keeping the cart inside of the lines as long as possible.
- The game ends if the stick falls off the cart or if the cart hits the side walls. To control the cart the player can press left or right to accelerate the cart.
- Might seem a fairly simple task but takes a while even for a human player to master it. Try it out here for yourself.





### Model

- The inputs of the model are the position of the cart, the angle of stick and the distance to the walls.
- The model has to outputs, left button pressed and right button pressed.



### Training

- A trivial approach to train the model is simply to randomly test for values until a good set of parameters appears.

- For this simple scenario this approach can get fairly good results after a couple of minutes but it would not be usable for any real complex environment.

  



### License

- This project is distributed under MIT license and can be used for commercial applications.
- License is available on the Github page of the project.