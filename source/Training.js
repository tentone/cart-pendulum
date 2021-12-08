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
 * @returns {ModelCart} Trained model that can be used to control the simulation.
 */
Training.trainModelCart = function(epochs, iterations)
{
    if (!epochs) {
        epochs = 3000;
    }

    if (!iterations) {
        iterations = 10;
    }

    function runModel(model)
    {
        var points = 0;
        var runs = 5;

        // Runs per test
        for(var r = 0; r < runs; r++)
        {
            points += runHeadless(function(cart)
            {
                model.control(cart);
            });
        }

        points /= runs;
        return points;
    }

    var bestGlobal = new ModelCart();
    var bestGlobalPoints = runModel(bestGlobal);
    var lastEpochPoints = 0;

    var jitterEpoch = 0.1;
    var jitterEpochDiff = 0.1;

    // Epoch
    for(var epoch = 0; epoch < epochs; epoch++)
    {
        console.log("Running epoch " + epoch + ", points: " + bestGlobalPoints + ", model: ", bestGlobal);

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
