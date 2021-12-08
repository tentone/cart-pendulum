import {Vector2} from "./Vector2.coffee";
import {Line} from "./Line";
import {Box} from "./Box";

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

export {Cart};