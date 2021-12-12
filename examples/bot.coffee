canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.onresize = ->
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

CP.Runner.runGraphical canvas, (cart) ->
	cart.leftPressed = cart.angle < 0
	cart.rightPressed = cart.angle > 0
