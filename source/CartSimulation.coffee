import {Vector2} from './Vector2'
import {Line} from './Line'
import {Box} from './Box'

# Cart simulation object, that contains the entire logic for the simulation.
# 
# The cart can be configured
class CartSimulation
	constructor: () ->
		# Distance of the barriers relative to the center.
		@barrierDistance = 400

		# Half the size of the cart box.
		@boxHalfSize = 50

		# Acceleration used for movement of the cart on key press.
		@moveAcceleration = 250

		# Limit angle that the pendulum can reach.
		@limitAngle = 0.8

		# Friction applyed to the velocity of the cart
		@friction = 0.5

		# Gravity defines the intensity of the force pulling the pendulum down.
		@pendulumGravity = 1.4

		# Pendulum momentum defines how speed afects the pendulum
		@pendulumMomentum = 0.01

		# Box that represents the cart.
		@cart = new Box(new Vector2(-@boxHalfSize, -30), new Vector2(@boxHalfSize, 30))

		# Line to represent the pendulum
		@pendulum = new Line(new Vector2(0, 0), new Vector2(0, 100))
		
		# Left barrier limit.
		@barrierLeft = new Line(new Vector2(-@barrierDistance, -1000), new Vector2(-@barrierDistance, 1000))
		
		# Right barrier limit.
		@barrierRight = new Line(new Vector2(@barrierDistance, -1000), new Vector2(@barrierDistance, 1000))
		@reset()

	# Reset the simulation parameters back to a initial state.
	# 
	# The initial velocity of the cart is randomized.
	reset: () ->
		@gameOver = false
		@score = 0

		@leftPressed = false
		@rightPressed = false
		
		@angle = 0
		@acceleration = 0.0
		@position = 0
		@velocity = (Math.random() * 2 - 1.0) * 100
		@velocity += @velocity < 0 ? -50 : 50

	# Draw the simulation to a context 2D for visualization.
	# 
	# @param [CanvasRenderingContext2D] context 
	draw: (context) ->
		@barrierLeft.draw(context)
		@barrierRight.draw(context)

		context.translate(@position, 0)

		# Guidelines
		context.strokeStyle = '#FF0000'
		context.lineWidth = 1
		context.beginPath()
		context.moveTo(Math.sin(-@limitAngle) * 100, Math.cos(-@limitAngle) * 100)
		context.lineTo(0, 0)
		context.lineTo(Math.sin(@limitAngle) * 100, Math.cos(@limitAngle) *  100)
		context.stroke()

		context.strokeStyle = '#000000'
		context.lineWidth = 3
		@pendulum.end.x = Math.sin(@angle) * 100
		@pendulum.end.y = Math.cos(@angle) * 100
		@pendulum.draw(context)
		@cart.draw(context)


	# Update the logic of the simulation.
	# 
	# The cart moves according to its velocity, the stick is used based on velocity and its current angle (gravity).
	#
	# @param [number] delta Time elapsed since last frame in seconds.
	update: (delta) ->
		# If game over return
		if @gameOver
			return

		# Process key presses
		if @leftPressed
			@acceleration = -@moveAcceleration
		else if @rightPressed
			@acceleration = @moveAcceleration
		else
			@acceleration = 0.0

		# Update physics
		@velocity += @acceleration * delta
		@velocity *= 1 - (@friction * delta)
		@position += @velocity * delta

		@angle += @angle * @pendulumGravity * delta
		@angle -= @velocity * @pendulumMomentum * delta

		@score += delta

		# If the angle of the pendulum drop bellow the minium end the game
		if @angle > @limitAngle or @angle < -@limitAngle
			@gameOver = true

		# If the cart hits the barried end the game
		if @position + @boxHalfSize > @barrierDistance or @position - @boxHalfSize < -@barrierDistance
			@gameOver = true

export {CartSimulation}