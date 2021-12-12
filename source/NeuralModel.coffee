import * as brain from 'brain.js/dist/brain-browser.js';

# Neural network based model using brain.js
class NeuralModel
	constructor: () ->
		@config = {
			binaryThresh: 0.5,
			hiddenLayers: [3], # Array of ints for the sizes of the hidden layers in the network
			activation: 'sigmoid', # ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
			leakyReluAlpha: 0.01, # Supported for activation type 'leaky-relu'
		}

		@trainConfig = {
			iterations: 20000, # Maximum times to iterate the training data
			errorThresh: 0.005, # Acceptable error percentage from training data
			learningRate: 0.3, # Scales with delta to effect training rate
			momentum: 0.1, # Scales with next layer's change value
			timeout: Infinity, # Max number of milliseconds to train for
		}

		@net = new brain.NeuralNetwork(@config) # NeuralNetworkGPU

		console.log(brain, @net)

	# Train the model using input and output samples.
	#
	# Expects data using the format {input: [velocity, angle, position], output: [left, right]}.
	train: (data) ->
		@net.train(data, @trainConfig);

	# Control the simulation using prediction provided by the neural network.
	control: (cart) ->
		input = [cart.velocity, cart.angle, cart.position]

		output = @net.run(input)

		console.log(output)

		cart.leftPressed = output[0] > 0.5
		cart.rightPressed = output[1] > 0.5

export {NeuralModel}