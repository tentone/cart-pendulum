import {Runner} from './Runner'
import {LinearModel} from './LinearModel'

# Methods for training of the cart model.
#
# Training produces a linear model of the cart, that can be used to control the simulation.
class LinearModelTrain
	# Train the model of the cart iterativelly.
	# 
	# Uses a seasonal training approach for wich many epochs are executed and the best from each epoch is selected as based for the next.
	# 
	# @param [number] epochs Number of iterations/epochs to simulate.
	# @param [number] iterations Number of variations tested in each epoch.
	# @param [number] runs How many times to run each variation to get an average performance.
	# @returns {LinearModel} Trained model that can be used to control the simulation.
	@trainIterative: (epochs, iterations, runs, scoreLimit) ->
		epochs = if epochs != undefined then epochs else 500
		iterations = if iterations != undefined then iterations else 100
		runs = if runs != undefined then runs else 5

		# If the model reaches this level of performance the training is stopped.
		scoreLimit = if scoreLimit != undefined then scoreLimit else 2000.0

		console.log(' - Training process starting. ', {epochs, iterations, runs})

		bestModel = new LinearModel()
		bestScore = LinearModelTrain.testModel(bestModel, runs, scoreLimit)

		jitter = 1.0
		
		# Epoch
		e = 0
		while e < epochs
			console.log(' - Running epoch ', e, ' score ', bestScore)

			epochModel = null
			epochScore = 0

			# Number of iterations per epoch
			i = 0
			while i < iterations
				model = bestModel.clone()
				model.jitter(jitter)
				
				points = LinearModelTrain.testModel(model, runs, scoreLimit)
				if points > epochScore
					epochModel = model
					epochScore = points
				
				i++

			if epochScore >= bestScore
				bestModel = epochModel
				bestScore = epochScore

			if bestScore >= scoreLimit
				break
			e++

		console.log(' - Training finished with score ', bestScore, ' model ', bestModel)
		return bestModel

	# Fully randomized training, test many parameters and select the best from all.
	# 
	# @param [number] iterations Number of variations tested in each epoch.
	# @param [number] runs How many times to run each variation to get an average performance.
	# @returns {LinearModel} Trained model that can be used to control the simulation.
	@trainRandom: (iterations, runs, scoreLimit) ->
		iterations = if iterations != undefined then iterations else 1e5
		runs = if runs != undefined then runs else 5

		# If the model reaches this level of performance the training is stopped.
		scoreLimit = if scoreLimit != undefined then scoreLimit else 2000.0

		console.log(' - Training process starting. ', {iterations, runs})

		bestModel = null
		bestScore = 0
		
		jitter = 2.0

		# Tests per epoch
		i = 0
		while i < iterations
			model = new LinearModel()
			model.jitter(jitter)
			
			score = LinearModelTrain.testModel(model, runs, scoreLimit)
			if score > bestScore
				bestModel = model
				bestScore = score

			console.log(' - Iteration ', i, ' score ', bestScore)

			if bestScore >= scoreLimit
				break
			
			i++

		console.log(' - Training finished with score ', bestScore, ' model ', bestModel)

		return bestModel

	# Run the model, multiple times and average the pontuation of the runs.
	# 
	# @param [LinearModel] model Model to be tested.
	# @param [number] runs Number of iterations to test the model.
	# @param [number] scoreLimit If the score of the model gets better than the limit the simulation stops.
	# @return {number} The average performance score of the model.
	@testModel: (model, runs, scoreLimit) ->
		score = 0
		r = 0
		while r < runs
			control = (cart) ->
				model.control(cart)
				return
				
			score += Runner.runHeadless(control, scoreLimit)
			r++
		
		return score / runs

export {LinearModelTrain}
