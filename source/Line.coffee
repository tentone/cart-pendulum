import {Vector2} from "./Vector2"

# Line between two points (origin to end).
#
# @param [Vector2] origin 
# @param [Vector2] end
class Line
    constructor: (origin, end) ->
        @origin = origin
        @end = end
    
    # Calculate the distance between the origin and end points.
    # 
    # @returns {number} Size of the line.
    size: () ->
        return Math.sqrt(Math.pow(@origin.x - @end.x, 2) + Math.pow(@origin.y - @end.y, 2))

    # Draw the line into a canvas 2D context.
    # 
    # @param [CanvasRenderingContext2D] context 
    draw: (context) ->
        context.lineWidth = 3
        context.beginPath()
        context.moveTo(@origin.x, @origin.y)
        context.lineTo(@end.x, @end.y)
        context.stroke()


export {Line}