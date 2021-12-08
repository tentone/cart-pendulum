import {LinearRegression} from "./LinearRegression"

# Model to control the cart, its parameters can be set and used to control the cart.
# 
# The model is composed of 3 linear regressions for wich their parameters can be trained and used to control the cart object.
function LinearModel()
	constructor: () ->
		@vel = new LinearRegression(0, 0.0)
		@angle = new LinearRegression(0, 0.0)
		@pos = new LinearRegression(0, 0.0)
		@e = 0.0

	jitter: (scale) ->
		@vel.jitter(scale)
		@angle.jitter(scale)
		@pos.jitter(scale)

		@e += (Math.random() - 0.5) * scale

	clone: () ->
		m = new LinearModel()
		
		m.vel = @pos.clone()
		m.angle = @pos.clone()
		m.pos = @pos.clone()
		m.e = @e

		return m

	control: (cart) ->
		v = @vel.decl * cart.velocity + @vel.ori
		a = @angle.decl * cart.angle + @angle.ori
		p = @pos.decl * cart.position + @pos.ori

		value = a + v + p

		cart.leftPressed = value < @e
		cart.rightPressed = value > @e

export {LinearModel}