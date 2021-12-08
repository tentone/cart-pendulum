import {LinearRegression} from "./LinearRegression"

# Model to control the cart, its parameters can be set and used to control the cart.
# 
# The model is composed of 3 linear regressions for wich their parameters can be trained and used to control the cart object.
class LinearModel
	constructor: () ->
		@vel = new LinearRegression(0, 0.0)
		@angle = new LinearRegression(0, 0.0)
		@pos = new LinearRegression(0, 0.0)
		@e = 0.0

	# Jitter all values of the model
	#
	# Can be used during training to produce variations of the current state of the model.
	#
	# @param [number] scale Scale of the jittering the values will variate half of the scale up and down.
	jitter: (scale) ->
		@vel.jitter(scale)
		@angle.jitter(scale)
		@pos.jitter(scale)

		@e += (Math.random() - 0.5) * scale

	# Create a new object with a copy of the values stored in this one.
	clone: () ->
		m = new LinearModel()
		
		m.vel = @pos.clone()
		m.angle = @pos.clone()
		m.pos = @pos.clone()
		m.e = @e

		return m

	# Control the simulation using the parameters stored in this model.
	control: (cart) ->
		v = @vel.decl * cart.velocity + @vel.ori
		a = @angle.decl * cart.angle + @angle.ori
		p = @pos.decl * cart.position + @pos.ori

		value = a + v + p

		cart.leftPressed = value < @e
		cart.rightPressed = value > @e

export {LinearModel}