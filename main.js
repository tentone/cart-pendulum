function Cart()
{
    this.barrierDistance = 400;
    this.boxHalfSize = 50;
    this.limitPoints = Infinity; //1e5;

    this.box = new Box(new Vector2(-this.boxHalfSize, -30), new Vector2(this.boxHalfSize, 30));
    this.line = new Line(new Vector2(0, 0), new Vector2(0, 100));
    
    this.barrierLeft = new Line(new Vector2(-this.barrierDistance, -1000), new Vector2(-this.barrierDistance, 1000));
    this.barrierRight = new Line(new Vector2(this.barrierDistance, -1000), new Vector2(this.barrierDistance, 1000));
    this.reset();
}

Cart.moveAcceleration = 0.2;
Cart.limitAngle = 0.7;

Cart.prototype.reset = function()
{
    this.gameOver = false;
    this.points = 0;
    this.position = 0;
    this.leftPressed = false;
    this.rightPressed = false;
    this.acceleration = 0.0;
    this.friction = 0.99;
    this.velocity = (Math.random() * 2 - 1.0);
    this.velocity += this.velocity < 0 ? -0.2 : 0.2;
    this.angle = 0;
};

Cart.prototype.draw = function(context)
{
    this.barrierLeft.draw(context);
    this.barrierRight.draw(context);

    context.translate(this.position, 0);

    // Guidelines
    context.strokeStyle = "#FF0000";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(Math.sin(-Cart.limitAngle) * 100, Math.cos(-Cart.limitAngle) * 100);
    context.lineTo(0, 0);
    context.lineTo(Math.sin(Cart.limitAngle) * 100, Math.cos(Cart.limitAngle) * 100);
    context.stroke();

    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    this.line.end.x = Math.sin(this.angle) * 100;
    this.line.end.y = Math.cos(this.angle) * 100;
    this.line.draw(context);
    this.box.draw(context);
};

Cart.prototype.update = function()
{
    if(this.gameOver)
    {
        return;
    }

    if(this.leftPressed){this.acceleration = -Cart.moveAcceleration;}
    else if(this.rightPressed){this.acceleration = Cart.moveAcceleration;}
    else {this.acceleration = 0.0;}

    this.velocity += this.acceleration;
    this.velocity *= this.friction;
    this.position += this.velocity;

    this.angle += (this.angle * 3e-2) + (-this.velocity * 5e-3);
    this.points++;

    if(this.angle > Cart.limitAngle || this.angle < -Cart.limitAngle)
    {
        this.gameOver = true;
    }
    if(this.position + this.boxHalfSize > this.barrierDistance || this.position - this.boxHalfSize < -this.barrierDistance)
    {
        this.gameOver = true;
    }
    if(this.points > this.limitPoints)
    {
        this.gameOver = true;
    }
};

// Its a my vectario 2
function Vector2(x, y)
{
    this.x = x;
    this.y = y;
}

// Its a pau
function Line(origin, end)
{
    this.origin = origin;
    this.end = end;
}

Line.prototype.size = function()
{
    return Math.sqrt(Math.pow(this.origin.x - this.end.x, 2) + Math.pow(this.origin.y - this.end.y, 2));
};

Line.prototype.draw = function(context)
{
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(this.origin.x, this.origin.y);
    context.lineTo(this.end.x, this.end.y);
    context.stroke();
};

// Its a boxa
function Box(min, max)
{
    this.min = min;
    this.max = max;
}

Box.prototype.getSize = function()
{
    return new Vector2(this.max.x - this.min.x, this.max.y - this.min.y);
};

Box.prototype.draw = function(context)
{
    var size = this.getSize();
    context.lineWidth = 3;
    context.strokeRect(this.min.x, this.min.y, size.x, size.y);
};

var canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.top = "0px";
canvas.style.left = "0px";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

document.body.onresize = function()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

function NeuralNode()
{
    this.action = null;
}

function NeuralConnection()
{
    this.condition = null;
    this.from = null;
    this.to = null;
}

var NeuralConditions = 
[
    //TODO <ADD CODE HERE>
];

var NeuralActions = 
[
    function(agent){agent.leftPressed = false; agent.rightPressed = true;},
    function(agent){agent.leftPressed = true; agent.rightPressed = false;},
    function(agent){agent.leftPressed = false; agent.rightPressed = false;},
];

function runHeadless(logicCallback, logPerformance)
{
    var cart = new Cart();
    
    if(logPerformance)
    {
        var time = performance.now();
    }

    while(!cart.gameOver)
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
        console.log("Simulation ended with " + cart.points + " points, took " + (end - time) + ".");
    }

    return cart.points;
}

function runGraphical(logicCallback)
{
    var cart = new Cart();
    var context = canvas.getContext("2d");
    var maxPoints = 0;

    function loop()
    {
        if(logicCallback !== undefined)
        {
            logicCallback(cart);
        }

        cart.update();

        if(cart.gameOver)
        {
            if(cart.points > maxPoints)
            {
                maxPoints = cart.points;
            }

            cart.reset();
        }

        // Render
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.font = "15px Arial";
        context.textAlign = "left";
        context.fillText("Points: " + cart.points, 10, 20);
        context.fillText("Max: " + maxPoints, 10, 40);

        //Transform
        context.transform(1, 0, 0, -1, 0, canvas.height);
        context.translate(canvas.width / 2, canvas.height / 2);
        cart.draw(context);

        context.restore();
        requestAnimationFrame(loop);
    }
    loop();
}

// Run with bot controls
function runBot()
{
    runGraphical(function(cart)
    {
        cart.leftPressed = cart.angle < 0;
        cart.rightPressed = cart.angle > 0;		
    });
}

// Run with hu,an player controls
function runHumanPlayer()
{
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

    runGraphical(function(cart)
    {
        cart.leftPressed = left;
        cart.rightPressed = right;		
    });
}

function runHeadlessBot()
{
    runHeadless(function(cart)
    {
        cart.leftPressed = cart.angle < 0;
        cart.rightPressed = cart.angle > 0;		
    });
}

function ModelCart()
{
    this.velOri = 0;
    this.velDecl = 0.1;

    this.angleOri = 0;
    this.angleDecl = 0.9;

    this.posOri = 0;
    this.posDecl = 0.0;

    this.e = 0.0;
}

ModelCart.prototype.jitter = function(max)
{
    this.velOri += (Math.random() * max) - (max / 2);
    this.velDecl += (Math.random() * max) - (max / 2);

    this.angleOri += (Math.random() * max) - (max / 2);
    this.angleDecl += (Math.random() * max) - (max / 2);

    this.posOri += (Math.random() * max) - (max / 2);
    this.posDecl += (Math.random() * max) - (max / 2);

    this.e += (Math.random() * max) - (max / 2);
};

ModelCart.prototype.clone = function()
{
    var m = new ModelCart();
    
    for(var i in m)
    {
        m[i] = this[i];
    }

    return m;
}

ModelCart.prototype.control = function(cart)
{
    var v = this.velDecl * cart.velocity + this.velOri;
    var a = this.angleDecl * cart.angle + this.angleOri
    var p = this.posDecl * cart.position + this.posOri;

    var value = a - v - p;

    cart.leftPressed = value < this.e;
    cart.rightPressed = value > this.e;
};


function trainModelCart()
{
    function runModel(model)
    {
        var points = 0;
        var runs = 5;

        // Runs per test
        for(var r = 0; r < runs; r++)
        {
            points += runHeadless(function(cart)
            {
                model.control(cart);
            });
        }

        points /= runs;
        return points;
    }

    var bestGlobal = new ModelCart();
    var bestGlobalPoints = runModel(bestGlobal);
    var lastEpochPoints = 0;

    var jitterEpoch = 0.1;
    var jitterEpochDiff = 0.1;

    // Epoch
    for(var epoch = 0; epoch < 4000; epoch++)
    {

        console.log("Running epoch " + epoch + ", points: " + bestGlobalPoints + ", model: ", bestGlobal);

        var bestEpoch = bestGlobal.clone();
        var bestEpochPoints = bestGlobalPoints;

        // Tests per epoch
        for(var t = 0; t < 300; t++)
        {
            var model = bestEpoch.clone();
            model.jitter(jitterEpoch);
            var points = runModel(model);

            if(points > bestEpochPoints)
            {
                bestEpoch = model;
                bestEpochPoints = points;
            }
        }

        if(bestEpochPoints >= bestGlobalPoints)
        {
            bestGlobal = model;
            bestGlobalPoints = bestEpochPoints;
        }

        if(lastEpochPoints === bestEpochPoints)
        {
            jitterEpoch += jitterEpochDiff;
        }

        lastEpochPoints = bestEpochPoints;
    }

    return bestGlobal;
}


function runTrigno(model)
{
    if(model === undefined)
    {
        model = new ModelCart();
    }

    runGraphical(function(cart)
    {
        model.control(cart);
    });
}
