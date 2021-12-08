var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.onresize = function()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

var left = false;
var right = false;

document.body.onkeydown = function(event)
{
	// Left
	if(event.keyCode === 37)
	{
		left = true;
	}
	// Right
	if(event.keyCode === 39)
	{
		right = true;	
	}
};

document.body.onkeyup = function(event)
{
	// Left
	if(event.keyCode === 37)
	{
		left = false;
	}
	// Right
	if(event.keyCode === 39)
	{
		right = false;	
	}
};

var data = [];
var bestData = [];
var bestScore = 0;
var recordData = true;

Runner.runGraphical(canvas, function(cart)
{
	cart.leftPressed = left;
	cart.rightPressed = right;

	if(recordData) {
		data.push({
			input: {
				velocity: cart.velocity,
				angle: cart.angle,
				position: cart.position
			},
			output: {
				left: cart.leftPressed,
				right: cart.rightPressed
			}
		});
	}
},
function(cart, score)
{
	if (recordData) {
		if (score > bestScore) {
			bestData = data;
			bestScore = score;
		}
		data = [];
	}
});

var exp = document.getElementById("export");
exp.onclick = function()
{
	Utils.writeFile(bestData, "data.json");
};