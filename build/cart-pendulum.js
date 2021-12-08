(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CP = {}));
})(this, (function (exports) { 'use strict';

	/**
	 * 2D Vector object represented by x and y coordinates.
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 */
	function Vector2(x, y)
	{
	    this.x = x;
	    this.y = y;
	}

	/**
	 * Box is represented from a minimum and a maximum points.
	 * 
	 * @param {Vector2} min 
	 * @param {Vector2} max 
	 */
	function Box(min, max)
	{
	    this.min = min;
	    this.max = max;
	}

	/**
	 * Get the size of the box in a Vector.
	 * 
	 * @returns {Vector2} Size of the box. 
	 */
	Box.prototype.getSize = function()
	{
	    return new Vector2(this.max.x - this.min.x, this.max.y - this.min.y);
	};

	/**
	 * Draw the box into a context for visualization.
	 * 
	 * @param {CanvasRenderingContext2D} context 
	 */
	Box.prototype.draw = function(context)
	{
	    var size = this.getSize();
	    context.lineWidth = 3;
	    context.strokeRect(this.min.x, this.min.y, size.x, size.y);
	};

	/**
	 * Line between two points (origin to end).
	 * 
	 * @param {Vector2} origin 
	 * @param {Vector2} end 
	 */
	function Line(origin, end)
	{
	    this.origin = origin;
	    this.end = end;
	}

	/**
	 * Calculate the ditance between the origin and end points.
	 * 
	 * @returns {number} Size of the line.
	 */
	Line.prototype.size = function()
	{
	    return Math.sqrt(Math.pow(this.origin.x - this.end.x, 2) + Math.pow(this.origin.y - this.end.y, 2));
	};

	/**
	 * Draw the line into a canvas 2D context.
	 * 
	 * @param {CanvasRenderingContext2D} context 
	 */
	Line.prototype.draw = function(context)
	{
	    context.lineWidth = 3;
	    context.beginPath();
	    context.moveTo(this.origin.x, this.origin.y);
	    context.lineTo(this.end.x, this.end.y);
	    context.stroke();
	};

	/**
	 * Cart object, that contains the entire logic for the simulation.
	 * 
	 * The cart can be configured
	 */
	function Cart()
	{
	    /**
	     * Distance of the barriers relative to the center.
	     */
	    this.barrierDistance = 400;

	    /**
	     * Half the size of the cart box.
	     */
	    this.boxHalfSize = 50;

	    /**
	     * Acceleration used for movement of the cart on key press.
	     */
	    this.moveAcceleration = 0.2;

	    /**
	     * Limit angle that the pendulum can reach.
	     */
	    this.limitAngle = 0.7;

	    /**
	     * Box that represents the cart.
	     */
	    this.cart = new Box(new Vector2(-this.boxHalfSize, -30), new Vector2(this.boxHalfSize, 30));

	    /**
	     * Line to represent the pendulum
	     */
	    this.pendulum = new Line(new Vector2(0, 0), new Vector2(0, 100));
	    
	    /**
	     * Left barrier limit.
	     */
	    this.barrierLeft = new Line(new Vector2(-this.barrierDistance, -1000), new Vector2(-this.barrierDistance, 1000));
	    
	    /**
	     * Right barrier limit.
	     */
	    this.barrierRight = new Line(new Vector2(this.barrierDistance, -1000), new Vector2(this.barrierDistance, 1000));
	    this.reset();
	}



	/**
	 * Reset the simulation parameters back to a initial state.
	 * 
	 * The initial velocity of the cart is randomized.
	 */
	Cart.prototype.reset = function()
	{
	    this.gameOver = false;
	    this.score = 0;
	    this.position = 0;
	    this.leftPressed = false;
	    this.rightPressed = false;
	    this.acceleration = 0.0;
	    this.friction = 0.99;
	    this.velocity = (Math.random() * 2 - 1.0);
	    this.velocity += this.velocity < 0 ? -0.2 : 0.2;
	    this.angle = 0;
	};

	/**
	 * Draw the simulation to a context 2D for visualization.
	 * 
	 * @param {CanvasRenderingContext2D} context 
	 */
	Cart.prototype.draw = function(context)
	{
	    this.barrierLeft.draw(context);
	    this.barrierRight.draw(context);

	    context.translate(this.position, 0);

	    // Guidelines
	    context.strokeStyle = "#FF0000";
	    context.lineWidth = 1;
	    context.beginPath();
	    context.moveTo(Math.sin(-this.limitAngle) * 100, Math.cos(-this.limitAngle) * 100);
	    context.lineTo(0, 0);
	    context.lineTo(Math.sin(this.limitAngle) * 100, Math.cos(this.limitAngle) * 100);
	    context.stroke();

	    context.strokeStyle = "#000000";
	    context.lineWidth = 3;
	    this.pendulum.end.x = Math.sin(this.angle) * 100;
	    this.pendulum.end.y = Math.cos(this.angle) * 100;
	    this.pendulum.draw(context);
	    this.cart.draw(context);
	};

	/**
	 * Update the logic of the simulation.
	 * 
	 * The cart moves according to its velocity, the stick is used based on velocity and its current angle (gravity).
	 */
	Cart.prototype.update = function()
	{
	    // If game over return
	    if(this.gameOver)
	    {
	        return;
	    }

	    // Process key presses
	    if(this.leftPressed){this.acceleration = -this.moveAcceleration;}
	    else if(this.rightPressed){this.acceleration = this.moveAcceleration;}
	    else {this.acceleration = 0.0;}

	    // Update physics
	    this.velocity += this.acceleration;
	    this.velocity *= this.friction;
	    this.position += this.velocity;

	    this.angle += (this.angle * 3e-2) + (-this.velocity * 5e-3);
	    this.score++;

	    // If the angle of the pendulum drop bellow the minium end the game
	    if(this.angle > this.limitAngle || this.angle < -this.limitAngle)
	    {
	        this.gameOver = true;
	    }

	    // If the cart hits the barried end the game
	    if(this.position + this.boxHalfSize > this.barrierDistance || this.position - this.boxHalfSize < -this.barrierDistance)
	    {
	        this.gameOver = true;
	    }
	};

	/**
	 * Linear regression is represented by two parameters: the origin and slope of the line.
	 * 
	 * @param {number} ori Origin of the line.
	 * @param {number} decl Slope of the line.
	 */
	function LinearRegression(ori, decl)
	{
	    this.ori = ori;
	    this.decl = decl;
	}

	/**
	 * Jitter the values in the regression randomly.
	 * 
	 * Usefull for training purposes.
	 * 
	 * @param {number} scale Scale of the jittering. 
	 */
	LinearRegression.prototype.jitter = function(scale) {
	    this.ori += (Math.random() - 0.5) * scale;
	    this.decl += (Math.random() - 0.5) * scale;
	};

	/**
	 * Create a copy of the linear regression object.
	 * 
	 * @returns Clone of the linear regression object.
	 */
	LinearRegression.prototype.clone = function()
	{
	    return new LinearRegression(this.ori, this.decl);
	};

	/**
	 * Model to control the cart, its parameters can be set and used to control the cart.
	 * 
	 * The model is composed of 3 linear regressions for wich their parameters can be trained and used to control the cart object.
	 */
	function LinearModel()
	{
		this.vel = new LinearRegression(0, 0.0);

		this.angle = new LinearRegression(0, 0.0);

		this.pos = new LinearRegression(0, 0.0);

		this.e = 0.0;
	}

	LinearModel.prototype.jitter = function(scale)
	{
		this.vel.jitter(scale);
		this.angle.jitter(scale);
		this.pos.jitter(scale);

		this.e += (Math.random() - 0.5) * scale;
	};

	LinearModel.prototype.clone = function()
	{
		var m = new LinearModel();
		
		m.vel = this.pos.clone();
		m.angle = this.pos.clone();
		m.pos = this.pos.clone();
		m.e = this.e;

		return m;
	};

	LinearModel.prototype.control = function(cart)
	{
		var v = this.vel.decl * cart.velocity + this.vel.ori;
		var a = this.angle.decl * cart.angle + this.angle.ori;
		var p = this.pos.decl * cart.position + this.pos.ori;

		var value = a + v + p;

		cart.leftPressed = value < this.e;
		cart.rightPressed = value > this.e;
	};

	/**
	 * Methods to run the simulation in headless mode (terminal only), or attached to a canvas (Graphical).
	 */
	function Runner() {}

	/**
	 * Run the simulation headlessly (in terminal).
	 * 
	 * The simulation is run until the stick is dropped off.
	 * 
	 * @param {Function} logicCallback Callback method to process the cart logic.
	 * @param {number} pointLimit How much time to simulate in the limit (prevent infinite run).
	 * @param {boolean} logPerformance If true console logs with performance of the simulation are printed out.
	 * @returns Returns the ammount of points accumulated during the simulation.
	 */
	Runner.runHeadless = function(logicCallback, pointLimit, logPerformance)
	{
	    pointLimit = pointLimit !== undefined ? pointLimit : Infinity;

	    var cart = new Cart();
	    
	    if(logPerformance)
	    {
	        var time = performance.now();
	    }

	    while(!cart.gameOver && cart.score < pointLimit)
	    {	
	        if(logicCallback !== undefined)
	        {
	            logicCallback(cart);
	        }

	        cart.update();
	    }
	    
	    if(logPerformance)
	    {
	        var end = performance.now();

	        console.log(" - Simulation ended with " + cart.score + " points, took " + (end - time) + ".");
	    }

	    return cart.score;
	};

	/**
	 * Run the simulation with visualization, (attached to a canvas).
	 * 
	 * Runs at real time speed for visualization purposes.
	 * 
	 * @param {Element} canvas Canvas element where the interface is drawn.
	 * @param {Function} onIteration Method called every iteration of the simulation to control the cart.
	 * @param {Function} onGameOver Method called when the simulation ends.
	 */
	Runner.runGraphical = function(canvas, onIteration, onGameOver)
	{
	    var cart = new Cart();
	    var context = canvas.getContext("2d");
	    var maxPoints = 0;

	    function loop()
	    {
	        if(onIteration !== undefined)
	        {
	            onIteration(cart);
	        }

	        cart.update();

	        if(cart.gameOver)
	        {
	            if(onGameOver !== undefined)
	            {
	                onGameOver(cart, maxPoints);
	            }

	            if(cart.score > maxPoints)
	            {
	                maxPoints = cart.score;
	            }

	            cart.reset();
	        }

	        // Render
	        context.save();
	        context.clearRect(0, 0, canvas.width, canvas.height);
	        
	        // Text in the canvas
	        context.font = "15px Arial";
	        context.textAlign = "left";
	        context.fillText("Points: " + cart.score, 10, 20);
	        context.fillText("Max: " + maxPoints, 10, 40);

	        //Transform
	        context.transform(1, 0, 0, -1, 0, canvas.height);
	        context.translate(canvas.width / 2, canvas.height / 2);
	        cart.draw(context);

	        context.restore();
	        requestAnimationFrame(loop);
	    }

	    loop();
	};

	/**
	 * Methods for training of the cart model.
	 */
	function Training(){}

	/**
	 * Train the model of the cart iterativelly.
	 * 
	 * Uses a seasonal training approach for wich many epochs are executed and the best from each epoch is selected as based for the next.
	 * 
	 * @param {number} epochs Number of iterations/epochs to simulate.
	 * @param {number} iterations Number of variations tested in each epoch.
	 * @param {number} runs How many times to run each variation to get an average performance.
	 * @returns {LinearModel} Trained model that can be used to control the simulation.
	 */
	 Training.trainIterative = function(epochs, iterations, runs, scoreLimit)
	 {
		epochs = epochs !== undefined ? epochs : 500;
		iterations = iterations !== undefined ? iterations : 100;
		runs = runs !== undefined ? runs : 5;

		// If the model reaches this level of performance the training is stopped.
		scoreLimit = scoreLimit !== undefined ? scoreLimit : 2000.0;

		console.log(" - Training process starting. ", {epochs, iterations, runs});

		var bestModel = new LinearModel();
		var bestScore = Training.testModel(bestModel, runs, scoreLimit);

		var jitter = 1.0;
		
		// Epoch
		for(var e = 0; e < epochs; e++)
		{
			console.log(" - Running epoch ", e, " score ", bestScore);

			var epochModel = null;
			var epochScore = 0;

			// Number of iterations per epoch
			for(var i = 0; i < iterations; i++)
			{
				var model = bestModel.clone();
				model.jitter(jitter);
				
				var points = Training.testModel(model, runs, scoreLimit);
				if(points > epochScore)
				{
					epochModel = model;
					epochScore = points;
				}
			}

			if(epochScore >= bestScore)
			{
				bestModel = epochModel;
				bestScore = epochScore;
			}

			if (bestScore >= scoreLimit)
			{
				break;
			}
		}

		console.log(" - Training finished with score ", bestScore, " model ", bestModel);
		return bestModel;
	 };

	/**
	 * Fully randomized training, test many parameters and select the best from all.
	 * 
	 * @param {number} iterations Number of variations tested in each epoch.
	 * @param {number} runs How many times to run each variation to get an average performance.
	 * @returns {LinearModel} Trained model that can be used to control the simulation.
	 */
	 Training.trainRandom = function(iterations, runs, scoreLimit)
	 {
		iterations = iterations !== undefined ? iterations : 1e5;
		runs = runs !== undefined ? runs : 5;

		// If the model reaches this level of performance the training is stopped.
		scoreLimit = scoreLimit !== undefined ? scoreLimit : 2000.0;

		console.log(" - Training process starting. ", {iterations, runs});

		var bestModel = null;
		var bestScore = 0;
		
		var jitter = 2.0;

		// Tests per epoch
		for(var i = 0; i < iterations; i++)
		{
			var model = new LinearModel();
			model.jitter(jitter);
			
			var score = Training.testModel(model, runs, scoreLimit);
			if(score > bestScore)
			{
				bestModel = model;
				bestScore = score;
			}

			console.log(" - Iteration ", i, " score ", bestScore);

			if (bestScore >= scoreLimit)
			{
				break;
			}
		}

		console.log(" - Training finished with score ", bestScore, " model ", bestModel);

		return bestModel;
	};

	/**
	 * Run the model, multiple times and average the pontuation of the runs.
	 * 
	 * @param {LinearModel} model Model to be tested.
	 * @param {number} runs Number of iterations to test the model.
	 * @param {number} scoreLimit If the score of the model gets better than the limit the simulation stops.
	 * @return {number} The average performance score of the model.
	 */
	Training.testModel = function(model, runs, scoreLimit)
	{
		var score = 0;
		for(var r = 0; r < runs; r++)
		{
			score += Runner.runHeadless(function(cart)
			{
				model.control(cart);
			}, scoreLimit);
		}
		return score / runs;
	};

	/**
	 * Auxiliar methods.
	 */
	function Utils() {}

	/**
	 * Write data into a file. Useful to export JSON data.
	 * 
	 * @param {string | object} data Data to be written to file. 
	 * @param {string} fname Name of the file to be written.
	 */
	Utils.writeFile = function(data, fname)
	{
	    if (typeof data === 'object')
	    {
	        data = JSON.stringify(data, null, '\t');
	    }
	    
	    var blob = new Blob([data], {type: 'octet/stream'});
	    
	    var download = document.createElement('a');
	    download.download = fname;
	    download.href = window.URL.createObjectURL(blob);
	    download.style.display = 'none';
	    download.onclick = function ()
	    {
	        document.body.removeChild(this);
	    };
	    document.body.appendChild(download);
	    
	    download.click();
	};

	/**
	 * Choose file and read data from it.
	 */
	Utils.readFile = function(onLoad)
	{
	    var chooser = document.createElement("input");
		chooser.type = "file";
		chooser.style.display = "none";
		document.body.appendChild(chooser);

		chooser.onchange = function()
		{	
	        var files = chooser.files;
	        if (files.length === 0) {
	            return;
	        }

	        var reader = new FileReader();
	        reader.onload = function() {
	            var text = reader.result;
	            onLoad(text);
	        };
	        reader.readAsText(files[0]);

			document.body.removeChild(chooser);
		};

		chooser.click();
	};

	exports.Box = Box;
	exports.Cart = Cart;
	exports.Line = Line;
	exports.LinearModel = LinearModel;
	exports.LinearRegression = LinearRegression;
	exports.Runner = Runner;
	exports.Training = Training;
	exports.Utils = Utils;
	exports.Vector2 = Vector2;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
