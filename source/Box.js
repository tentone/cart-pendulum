import {Vector2} from "./Vector2.coffee";

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

export {Box};