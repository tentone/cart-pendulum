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

        @net = new brain.NeuralNetworkGPU(@config);

    # Train the model using input and output samples.
    train: (data) ->
      xorTrainingData = [
        { input: [0, 0], output: [0] },
        { input: [0, 1], output: [1] },
        { input: [1, 0], output: [1] },
        { input: [1, 1], output: [0] },
      ]

      @net.train(xorTrainingData)

    control: (cart) ->
      @net.run([0, 0])

export {NeuralModel}