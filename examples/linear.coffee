canvas = document.getElementById('canvas')

clearTerminal = ->
	terminal = document.getElementById('terminal')
	terminal.innerHTML = ''
	return

canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.onresize = ->
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	return

model = new (CP.LinearModel)
recorder = new (CP.DataRecorder)
run = document.getElementById('run')

run.onclick = ->
	CP.Runner.runGraphical canvas, ((cart) ->
		model.control cart
		recorder.record cart
		return
	), (cart, score) ->
		recorder.end score
		return
	return

exp = document.getElementById('export')

exp.onclick = ->
	CP.Utils.writeFile recorder.getData(), 'data.json'
	return

train = document.getElementById('trainIterative')

train.onclick = ->
	clearTerminal()
	epochs = Number.parseInt(document.getElementById('epochs').value)
	iterations = Number.parseInt(document.getElementById('iterations').value)
	runs = Number.parseInt(document.getElementById('runs').value)
	model = CP.LinearModelTrain.trainIterative(epochs, iterations, runs)
	return

trainRandomized = document.getElementById('trainRandomized')

trainRandomized.onclick = ->
	clearTerminal()
	iterations = Number.parseInt(document.getElementById('iterations').value)
	runs = Number.parseInt(document.getElementById('runs').value)
	model = Training.trainRandom(iterations, runs)
	return

clear = document.getElementById('clear')
clear.onclick = clearTerminal
consoleLog = console.log

console.log = (a, b, c, d, e, f) ->
	consoleLog a, b, c, d, e, f
	terminal = document.getElementById('terminal')
	p = document.createElement('p')
	p.style.color = '#FFFFFF'
	i = 0
	while i < arguments.length
		arg = arguments[i]
		if typeof arg == 'object'
			arg = JSON.stringify(arg)
		p.innerHTML += String(arg)
		i++
	terminal.appendChild p
	return
