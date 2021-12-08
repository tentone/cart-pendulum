/**
 * Methods for training of the cart model.
 */
function Training(){}

/**
 * Train the model of the cart iterativelly.
 * 
 * Uses a seasonal training approach for wich many epochs are executed and the best from each epoch is selected as based for the next.
 * 
 * @param {number} epochs Number of iterations/epochs to simulate.
 * @param {number} iterations Number of variations tested in each epoch.
 * @param {number} runs How many times to run each variation to get an average performance.
 * @returns {ModelCart} Trained model that can be used to control the simulation.
 */
 Training.trainIterative = function(epochs, iterations, runs, scoreLimit)
 {
	epochs = epochs !== undefined ? epochs : 500;
	iterations = iterations !== undefined ? iterations : 100;
	runs = runs !== undefined ? runs : 5;

	// If the model reaches this level of performance the training is stopped.
	scoreLimit = scoreLimit !== undefined ? scoreLimit : 2000.0;

	console.log(" - Training process starting. ", {epochs, iterations, runs});

	var bestModel = new ModelCart();
	var bestScore = Training.testModel(bestModel, runs, scoreLimit);

	var jitter = 0.3;
	
	// Epoch
	for(var e = 0; e < epochs; e++)
	{
		console.log(" - Running epoch ", e, " score ", bestScore);

		var epochModel = bestModel.clone();
		var epochScore = bestScore;

		// Number of iterations per epoch
		for(var i = 0; i < iterations; i++)
		{
			var model = epochModel.clone();
			model.jitter(jitter);
			
			var points = Training.testModel(model, runs, scoreLimit);

			if(points > epochScore)
			{
				epochModel = model;
				epochScore = points;
			}
		}

		if(epochScore >= bestScore)
		{
			bestModel = epochModel;
			bestScore = epochScore;
		}

		if (bestScore >= scoreLimit)
		{
			break;
		}
	}

	console.log(" - Training finished with score ", bestScore, " model ", bestModel);
	return bestModel;
 };

/**
 * Fully randomized training, test many parameters and select the best from all.
 * 
 * @param {number} iterations Number of variations tested in each epoch.
 * @param {number} runs How many times to run each variation to get an average performance.
 * @returns {ModelCart} Trained model that can be used to control the simulation.
 */
 Training.trainRandom = function(iterations, runs, scoreLimit)
 {
	iterations = iterations !== undefined ? iterations : 1e5;
	runs = runs !== undefined ? runs : 5;

	// If the model reaches this level of performance the training is stopped.
	scoreLimit = scoreLimit !== undefined ? scoreLimit : 2000.0;

	console.log(" - Training process starting. ", {iterations, runs});

	var bestModel = new ModelCart();
	var bestScore = Training.testModel(bestModel, runs, scoreLimit);
 
	// Tests per epoch
	for(var i = 0; i < iterations; i++)
	{
		var model = new ModelCart();
		model.jitter(2.0);
		
		var score = Training.testModel(model, runs, scoreLimit);
		if(score > bestScore)
		{
			bestModel = model;
			bestScore = score;
		}

		console.log(" - Iteration ", i, " score ", bestScore);

		if (bestScore >= scoreLimit)
		{
			break;
		}
	}

	console.log(" - Training finished with score ", bestScore, " model ", bestModel);

	return bestModel;
}

/**
 * Run the model, multiple times and average the pontuation of the runs.
 * 
 * @param {ModelCart} model Model to be tested.
 * @param {number} runs Number of iterations to test the model.
 * @param {number} scoreLimit If the score of the model gets better than the limit the simulation stops.
 * @return {number} The average performance score of the model.
 */
Training.testModel = function(model, runs, scoreLimit)
{
	var score = 0;
	for(var r = 0; r < runs; r++)
	{
		score += Runner.runHeadless(function(cart)
		{
			model.control(cart);
		}, scoreLimit);
	}
	return score / runs;
};
