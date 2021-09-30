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