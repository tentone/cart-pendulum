/**
 * Methods for training of the cart model.
 */
function Training(){}

/**
 * Train the model of the cart iterativelly.
 * 
 * Uses a seasonal training approach for wich many epochs are executed and the best from each epoch is selected as based for the next.
 * 
 * @param {number} epochs Number of epochs to simulate.
 * @param {number} iterations Number of variations tested in each epoch.
 * @param {number} runs How many times to run each variation to get an average performance.
 * @returns {ModelCart} Trained model that can be used to control the simulation.
 */
Training.trainModelCart = function(epochs, iterations, runs)
{
    epochs = epochs !== undefined ? epochs : 30;
    iterations = iterations !== undefined ? iteration : 10;
    runs = runs !== undefined ? runs : 5;

    function runModel(model)
    {
        var points = 0;

        // Runs per test
        for(var r = 0; r < runs; r++)
        {
            points += Runner.runHeadless(function(cart)
            {
                model.control(cart);
            });
        }

        return points / runs;
    }

    console.log(" - Training process starting.")

    var bestGlobal = new ModelCart();
    var bestGlobalPoints = runModel(bestGlobal);

    console.log(" - Baseline results is ", bestGlobal)

    var lastEpochPoints = 0;

    var jitterEpoch = 0.1;
    var jitterEpochDiff = 0.1;

    // Epoch
    for(var epoch = 0; epoch < epochs; epoch++)
    {
        console.log(" - Running epoch ", epoch, " performance ", bestGlobalPoints, " model ", bestGlobal);

        var bestEpoch = bestGlobal.clone();
        var bestEpochPoints = bestGlobalPoints;

        // Tests per epoch
        for(var t = 0; t < iterations; t++)
        {
            var model = bestEpoch.clone();
            model.jitter(jitterEpoch);
            
            var points = runModel(model);

            if(points > bestEpochPoints)
            {
                bestEpoch = model;
                bestEpochPoints = points;
            }
        }

        if(bestEpochPoints >= bestGlobalPoints)
        {
            bestGlobal = model;
            bestGlobalPoints = bestEpochPoints;
        }

        if(lastEpochPoints === bestEpochPoints)
        {
            jitterEpoch += jitterEpochDiff;
        }

        lastEpochPoints = bestEpochPoints;
    }

    return bestGlobal;
}
