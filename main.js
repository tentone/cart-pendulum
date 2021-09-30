var canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.top = "0px";
canvas.style.left = "0px";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

document.body.onresize = function()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

function runHeadless(logicCallback, logPerformance)
{
    var cart = new Cart();
    
    if(logPerformance)
    {
        var time = performance.now();
    }

    while(!cart.gameOver)
    {	
        if(logicCallback !== undefined)
        {
            logicCallback(cart);
        }
        cart.update();
    }
    
    if(logPerformance)
    {
        var end = performance.now();
        console.log("Simulation ended with " + cart.points + " points, took " + (end - time) + ".");
    }

    return cart.points;
}

function runGraphical(logicCallback)
{
    var cart = new Cart();
    var context = canvas.getContext("2d");
    var maxPoints = 0;

    function loop()
    {
        if(logicCallback !== undefined)
        {
            logicCallback(cart);
        }

        cart.update();

        if(cart.gameOver)
        {
            if(cart.points > maxPoints)
            {
                maxPoints = cart.points;
            }

            cart.reset();
        }

        // Render
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.font = "15px Arial";
        context.textAlign = "left";
        context.fillText("Points: " + cart.points, 10, 20);
        context.fillText("Max: " + maxPoints, 10, 40);

        //Transform
        context.transform(1, 0, 0, -1, 0, canvas.height);
        context.translate(canvas.width / 2, canvas.height / 2);
        cart.draw(context);

        context.restore();
        requestAnimationFrame(loop);
    }
    loop();
}

// Run with bot controls
function runBot()
{
    runGraphical(function(cart)
    {
        cart.leftPressed = cart.angle < 0;
        cart.rightPressed = cart.angle > 0;		
    });
}

// Run with hu,an player controls
function runHumanPlayer()
{
    var left = false;
    var right = false;
    document.body.onkeydown = function(event)
    {
        // Left
        if(event.keyCode === 37)
        {
            left = true;
        }
        // Right
        if(event.keyCode === 39)
        {
            right = true;	
        }
    };

    document.body.onkeyup = function(event)
    {
        // Left
        if(event.keyCode === 37)
        {
            left = false;
        }
        // Right
        if(event.keyCode === 39)
        {
            right = false;	
        }
    };

    runGraphical(function(cart)
    {
        cart.leftPressed = left;
        cart.rightPressed = right;		
    });
}

function runHeadlessBot()
{
    runHeadless(function(cart)
    {
        cart.leftPressed = cart.angle < 0;
        cart.rightPressed = cart.angle > 0;		
    });
}

function trainModelCart()
{
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
    for(var epoch = 0; epoch < 4000; epoch++)
    {

        console.log("Running epoch " + epoch + ", points: " + bestGlobalPoints + ", model: ", bestGlobal);

        var bestEpoch = bestGlobal.clone();
        var bestEpochPoints = bestGlobalPoints;

        // Tests per epoch
        for(var t = 0; t < 300; t++)
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

function runTrigno(model)
{
    if(model === undefined)
    {
        model = new ModelCart();
    }

    runGraphical(function(cart)
    {
        model.control(cart);
    });
}
