import * as brain from 'brain.js/dist/brain-browser.js';

# Neural network based model using brain.js.
#
# Can learn how to play the game and automatically control it.
#
# The network can be configured with different activation functions (https://www.wikiwand.com/en/Activation_function).
class NeuralModel
	constructor: () ->
		@config = {
			# Threshold to apply for binary classification
			binaryThresh: 0.5
			# Sizes of the hidden layers in the network
			hiddenLayers: [10, 6]
			 # ['sigmoid', 'relu', 'leaky-relu', 'tanh']
			activation: 'relu'
			# Leaky ReLUs allow a small, positive gradient when the unit is not active
			leakyReluAlpha: 0.01
		}

		@trainConfig = {
			# Maximum times to iterate the training data
			iterations: 20000
			# Acceptable error percentage from training data
			errorThresh: 0.005
			# Scales with delta to effect training rate
			learningRate: 0.3
			# Scales with next layer's change value
			momentum: 0.1
			# Max number of milliseconds to train for
			timeout: Infinity
		}

		@net = new brain.NeuralNetwork(@config)

		console.log(brain, @net)

	# Train the model using input and output samples.
	#
	# Expects data using the format {input: [velocity, angle, position], output: [left, right]}.
	train: (data) ->
		@net.train(data, @trainConfig);

	# Create representation of the network.
	#
	# @param [object] option Options of the visualization generated.
	toSVG: (options) ->
		return brain.utilities.toSVG(@net.toJSON(), options)

	# Control the simulation using prediction provided by the neural network.
	control: (cart) ->
		input = [cart.velocity, cart.angle, cart.position]

		output = @net.run(input)

		cart.leftPressed = output[0] > 0.5
		cart.rightPressed = output[1] > 0.5

export {NeuralModel}