canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.onresize = ->
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	return

left = false
right = false

document.body.onkeydown = (event) ->
	# Left
	if event.keyCode == 37
		left = true
	# Right
	if event.keyCode == 39
		right = true
	return

document.body.onkeyup = (event) ->
	# Left
	if event.keyCode == 37
		left = false
	# Right
	if event.keyCode == 39
		right = false
	return

recorder = new CP.DataRecorder()
CP.Runner.runGraphical canvas, ((cart) ->
	cart.leftPressed = left
	cart.rightPressed = right
	recorder.record cart
	return
), (cart, score) ->
	recorder.end score
	return
exp = document.getElementById('export')

exp.onclick = ->
	CP.Utils.writeFile recorder.getData(), 'data.json'
	return
