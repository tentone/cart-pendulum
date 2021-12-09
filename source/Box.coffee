import {Vector2} from './Vector2'

# Box is represented from a minimum and a maximum points.
class Box
	# @param [Vector2] min 
	# @param [Vector2] max 
	constructor: (min, max) ->
		@min = min
		@max = max

	# Get the size of the box in a Vector.
	# 
	# @returns [Vector2] Size of the box. 
	getSize: () ->
		return new Vector2(@max.x - @min.x, @max.y - @min.y)

	# Draw the box into a context for visualization.
	# 
	# @param [CanvasRenderingContext2D] context 
	draw: (context) ->
		size = @getSize()
		context.lineWidth = 3
		context.strokeRect(@min.x, @min.y, size.x, size.y)

export {Box}