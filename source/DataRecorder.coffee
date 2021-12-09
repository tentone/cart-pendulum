import {Utils} from "./Utils"


# Data recorder can be used to record data from a game session.
#
# That data can then be used for training of models.
class DataRecorder
	constructor: () ->
		# Active state of the data recorder
		@active = true
		
		# Current data being recorded
		@data = []
		
		# Best score recorded until now
		@bestScore = 0

		# Best dataset recorded util now
		@bestData = []


	# Get the best data obtained from the recorder.
	getData: () ->
		return @bestData

	# End recording session the score will be compared with previous best session to decide what data to keep.
	end: (score) ->
		if @active
			if score > @bestScore
				@bestData = @data
				@bestScore = score
			@data = []

	# Record state of a simulation and the control action state
	record: (cart) ->
		if @active
			@data.push({
				input: [cart.velocity, cart.angle, cart.position]
				output: [cart.leftPressed, cart.rightPressed]
			})

export {DataRecorder}