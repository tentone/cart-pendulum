/**
 * Cart object, that contains the entire logic for the simulation.
 * 
 * The cart can be configured
 */
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

/**
 * Reset the simulation parameters back to a initial state.
 * 
 * The initial velocity of the cart is randomized.
 */
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

/**
 * Update the logic of the simulation.
 * 
 * The cart moves according to its velocity, the stick is used based on velocity and its current angle (gravity).
 */
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

