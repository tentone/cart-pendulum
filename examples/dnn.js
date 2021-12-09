var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.onresize = function()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

var model = new CP.NeuralModel();

var run = document.getElementById("run");
run.onclick = function()
{
	CP.Runner.runGraphical(canvas, function(cart)
	{
		model.control(cart);	
	});
};

var train = document.getElementById("train");
train.onclick = function()
{	
	CP.Utils.readFile(function(data) {
		data = JSON.parse(dat);

		console.log(data);
	});
	clearTerminal();

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
