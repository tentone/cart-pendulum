import brain from 'brain.js/dist/brain-browser.js';

# Neural network based model using brain.js
class NeuralModel
	constructor: () ->
		@config = {
			binaryThresh: 0.5,
			hiddenLayers: [3], # Array of ints for the sizes of the hidden layers in the network
			activation: 'sigmoid', # ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
			leakyReluAlpha: 0.01, # Supported for activation type 'leaky-relu'
		}

		@net = new brain.NeuralNetworkGPU(@config)

	# Train the model using input and output samples.
	#
	# Expects data using the format {input: {velocity, angle, position}, output: {left, right}}.
	train: (data) ->
		@net.train(data)

	control: (cart) ->
		input = {
			velocity: @cart.velocity,
			angle: @cart.angle,
			position: @cart.position
		}

		output = @net.run(input)

		cart.leftPressed = output.left
		cart.rightPressed = output.right

export {NeuralModel}