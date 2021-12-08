import {Vector2} from "./Vector2";

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

export {Line};