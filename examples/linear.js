var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.onresize = function()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

var model = new CP.LinearModel;

var run = document.getElementById("run");
run.onclick = function()
{
	CP.Runner.runGraphical(canvas, function(cart)
	{
		model.control(cart);	
	});
};

var trainIterative = document.getElementById("trainIterative");
trainIterative.onclick = function()
{
	clearTerminal();

	var epochs = Number.parseInt(document.getElementById("epochs").value);
	var iterations = Number.parseInt(document.getElementById("iterations").value);
	var runs = Number.parseInt(document.getElementById("runs").value);

	model = CP.LinearModelTrain.trainIterative(epochs, iterations, runs);
};

var trainRandomized = document.getElementById("trainRandomized");
trainRandomized.onclick = function()
{
	clearTerminal();

	var iterations = Number.parseInt(document.getElementById("iterations").value);
	var runs = Number.parseInt(document.getElementById("runs").value);

	model = Training.trainRandom(iterations, runs);
};

function clearTerminal()
{
	var terminal = document.getElementById("terminal");
	terminal.innerHTML = "";
};
var clear = document.getElementById("clear");
clear.onclick = clearTerminal;

var consoleLog = console.log;
console.log = function() {
	consoleLog(...arguments);
	var terminal = document.getElementById("terminal");
	var p = document.createElement("p");
	p.style.color = "#FFFFFF";
	for(var i of arguments) {
		if (typeof i === "object") {
			i = JSON.stringify(i);
		}
		p.innerHTML += String(i);
	}
	terminal.appendChild(p);
}
