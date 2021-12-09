import {Utils} from "./Utils"


# Data recorder can be used to record data from a game session.
#
# That data can then be used for training of models.
class DataRecorder
	constructor: () ->
		# Active state of the data recorder
		@active = false
		
		# Current data being recorded
		@data = []
		
		# Best score recorded until now
		@bestScore = 0

		# Best dataset recorded util now
		@bestData = []


	# End 

	# Record state of a simulation and the control action state
	record: (cart) ->
		if @active
			@data.push({
				input: {
					velocity: cart.velocity,
					angle: cart.angle,
					position: cart.position
				},
				output: {
					left: cart.leftPressed,
					right: cart.rightPressed
				}
			})

	