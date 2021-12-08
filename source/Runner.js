/**
 * Methods to run the simulation in headless mode (terminal only), or attached to a canvas (Graphical).
 */
function Runner() {}

/**
 * Run the simulation headlessly (in terminal).
 * 
 * The simulation is run until the stick is dropped off.
 * 
 * @param {Function} logicCallback Callback method to process the cart logic.
 * @param {number} pointLimit How much time to simulate in the limit (prevent infinite run).
 * @param {boolean} logPerformance If true console logs with performance of the simulation are printed out.
 * @returns Returns the ammount of points accumulated during the simulation.
 */
Runner.runHeadless = function(logicCallback, pointLimit, logPerformance)
{
    pointLimit = pointLimit !== undefined ? pointLimit : Infinity;

    var cart = new Cart();
    
    if(logPerformance)
    {
        var time = performance.now();
    }

    while(!cart.gameOver && cart.points < pointLimit)
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

        console.log(" - Simulation ended with " + cart.points + " points, took " + (end - time) + ".");
    }

    return cart.points;
};

/**
 * Run the simulation with visualization, (attached to a canvas).
 * 
 * Runs at real time speed for visualization purposes.
 * 
 * @param {Element} canvas Canvas element where the interface is drawn.
 * @param {Function} onIteration Method called every iteration of the simulation to control the cart.
 * @param {Function} onGameOver Method called when the simulation ends.
 */
Runner.runGraphical = function(canvas, onIteration)
{
    var cart = new Cart();
    var context = canvas.getContext("2d");
    var maxPoints = 0;

    function loop()
    {
        if(onIteration !== undefined)
        {
            onIteration(cart);
        }

        cart.update();

        if(cart.gameOver)
        {
            if(onGameOver !== undefined)
            {
                onGameOver(cart, maxPoints);
            }

            if(cart.points > maxPoints)
            {
                maxPoints = cart.points;
            }

            cart.reset();
        }

        // Render
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Text in the canvas
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
};