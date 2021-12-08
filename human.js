import { func } from "assert-plus";

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

Runner.runGraphical(canvas, function(cart)
{
	cart.leftPressed = left;
	cart.rightPressed = right;
},
function(cart, score)
{
	cart;
});


var exp = document.getElementById("export");
exp.onclick = function()
{
	Runner.runGraphical(canvas, function(cart)
	{
		model.control(cart);	
	});
};