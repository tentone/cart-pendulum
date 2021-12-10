canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.onresize = ->
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	return

model = new (CP.NeuralModel)
run = document.getElementById('run')

run.onclick = ->
	CP.Runner.runGraphical canvas, (cart) ->
		model.control cart
		return
	return

train = document.getElementById('train')

train.onclick = ->
	CP.Utils.readFile (data) ->
		data = JSON.parse(data)
		model.train data
		return
	clearTerminal()
	return
