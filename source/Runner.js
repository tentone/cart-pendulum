/**
 * Methods to run the simulation in headless mode (terminal only), or attached to a canvas (Graphical).
 */
function Runner() {}

/**
 * Run the simulation headlessly (in terminal).
 * 
 * The simulation is run until the stick is dropped off.
 * 
 * @param {Function} logicCallback 
 * @param {boolean} logPerformance 
 * @returns Returns the ammount of points accumulated during the simulation.
 */
Runner.runHeadless = function(logicCallback, logPerformance)
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
};

/**
 * Run the simulation with visualization, (attached to a canvas).
 * 
 * Runs at real time speed for visualization purposes.
 * 
 * @param {Element} canvas
 * @param {Function} logicCallback 
 */
Runner.runGraphical = function(canvas, logicCallback)
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