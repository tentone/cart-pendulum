import {CartSimulation} from './CartSimulation'

# Methods to run the simulation in headless mode (terminal only), or attached to a canvas (Graphical).
class Runner
	# Run the simulation headlessly (in terminal).
	# 
	# The simulation is run until the stick is dropped off.
	# 
	# @param [Function] logicCallback Callback method to process the cart logic.
	# @param [number] scoreLimit How much time to simulate in the limit (prevent infinite run).
	# @param [boolean] logPerformance If true console logs with performance of the simulation are printed out.
	# @returns [number] Returns the ammount of points accumulated during the simulation.
	@runHeadless: (logicCallback, scoreLimit, logPerformance) ->
		scoreLimit = if scoreLimit != undefined then scoreLimit else Infinity

		cart = new CartSimulation()
		frequency = 1 / 60

		if logPerformance
			time = performance.now()

		while !cart.gameOver and cart.score < scoreLimit
			if logicCallback != undefined
				logicCallback(cart)
			
			cart.update(frequency)
		
		if logPerformance
			end = performance.now()
			console.log(' - Simulation ended with ' + cart.score + ' points, took ' + (end - time) + '.')

		return cart.score

	# Run the simulation with visualization, (attached to a canvas).
	# 
	# Runs at real time speed for visualization purposes.
	# 
	# @param [Element] canvas Canvas element where the interface is drawn.
	# @param [Function] onIteration Method called every iteration of the simulation to control the cart.
	# @param [Function] onGameOver Method called when the simulation ends.
	@runGraphical: (canvas, onIteration, onGameOver) ->
		cart = new CartSimulation()
		context = canvas.getContext('2d')
		maxScore = 0

		# Time of the last frame in ms
		last = 0;

		update = (time) ->
			if time
				delta = (time - last) / 1000.0
				last = time
			else
				delta = 0

			if onIteration != undefined
				onIteration(cart)

			cart.update(delta)

			if cart.gameOver
				if onGameOver != undefined
					onGameOver(cart, maxScore)

				if cart.score > maxScore 
					maxScore = cart.score

				cart.reset()
			
			# Render
			context.save()
			context.clearRect(0, 0, canvas.width, canvas.height)
			
			# Text in the canvas
			context.font = '15px Arial'
			context.textAlign = 'left'
			context.fillText('Points: ' + cart.score, 10, 20)
			context.fillText('Max: ' + maxScore, 10, 40)

			# Transform
			context.transform(1, 0, 0, -1, 0, canvas.height)
			context.translate(canvas.width / 2, canvas.height / 2)
			cart.draw(context)

			context.restore()
			requestAnimationFrame(update)

		update()

export {Runner}
