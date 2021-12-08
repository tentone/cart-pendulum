var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.onresize = function()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

Runner.runGraphical(canvas, function(cart)
{
	cart.leftPressed = cart.angle < 0;
	cart.rightPressed = cart.angle > 0;		
});
