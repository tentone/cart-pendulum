canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.onresize = ->
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

model = new CP.NeuralModel()
run = document.getElementById('run')

visualizer = new CP.NeuralModelVisualizer(model, document.body)

run.onclick = ->
	CP.Runner.runGraphical canvas, (cart) ->
		model.control(cart)

train = document.getElementById('train')

train.onclick = ->
	CP.Utils.readFile (data) ->
		data = JSON.parse(data)
		model.train(data)
		visualizer.render()
