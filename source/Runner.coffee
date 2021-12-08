import {Cart} from "./Cart"

# Methods to run the simulation in headless mode (terminal only), or attached to a canvas (Graphical).
class Runner
    # Run the simulation headlessly (in terminal).
    # 
    # The simulation is run until the stick is dropped off.
    # 
    # @param [Function] logicCallback Callback method to process the cart logic.
    # @param [number] pointLimit How much time to simulate in the limit (prevent infinite run).
    # @param [boolean] logPerformance If true console logs with performance of the simulation are printed out.
    # @returns Returns the ammount of points accumulated during the simulation.
    @runHeadless: (logicCallback, pointLimit, logPerformance) ->
        pointLimit = if pointLimit != undefined then pointLimit else Infinity

        cart = new Cart()
        
        if logPerformance
            time = performance.now()

        while !cart.gameOver and cart.score < pointLimit
            if logicCallback != undefined
                logicCallback(cart)
            
            cart.update()
        
        if logPerformance
            end = performance.now()
            console.log(" - Simulation ended with " + cart.score + " points, took " + (end - time) + ".")

        return cart.score

    # Run the simulation with visualization, (attached to a canvas).
    # 
    # Runs at real time speed for visualization purposes.
    # 
    # @param [Element] canvas Canvas element where the interface is drawn.
    # @param [Function] onIteration Method called every iteration of the simulation to control the cart.
    # @param [Function] onGameOver Method called when the simulation ends.
    runGraphical: (canvas, onIteration, onGameOver) ->
        cart = new Cart()
        context = canvas.getContext("2d")
        maxPoints = 0

        update = () ->
            if onIteration != undefined
                onIteration(cart)

            cart.update()

            if cart.gameOver
                if onGameOver != undefined
                    onGameOver(cart, maxPoints)

                if cart.score > maxPoints 
                    maxPoints = cart.score

                cart.reset()
            
            # Render
            context.save()
            context.clearRect(0, 0, canvas.width, canvas.height)
            
            # Text in the canvas
            context.font = "15px Arial"
            context.textAlign = "left"
            context.fillText("Points: " + cart.score, 10, 20)
            context.fillText("Max: " + maxPoints, 10, 40)

            # Transform
            context.transform(1, 0, 0, -1, 0, canvas.height)
            context.translate(canvas.width / 2, canvas.height / 2)
            cart.draw(context)

            context.restore()
            requestAnimationFrame(update)

        update()

export {Runner}
