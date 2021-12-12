canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.onresize = ->
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

model = new CP.NeuralModel()
run = document.getElementById('run')

visualizer = new CP.NeuralModelVisualizer(model.net, document.body)

run.onclick = ->
	CP.Runner.runGraphical canvas, (cart) ->
		model.control(cart)

viz = document.getElementById('viz')

train = document.getElementById('train')
train.onclick = ->
	CP.Utils.readFile (data) ->
		data = JSON.parse(data)
		model.train(data)

		options = {
			width: 600
			height: 350
			radius: 6
			line: {
				width: 1.0
				color: '#000000'
			}
			fontSize: '18px',
			hidden: {
				color: "#BB0000BB"
			}
			outputs: {
				color: "#0000BBBB"
			}
			inputs: {
				color: '#00BB00BB'
				labels: ['Speed', 'Angle', 'Position']
			}
		}
		
		viz.innerHTML = model.toSVG(options)
		visualizer.render()
