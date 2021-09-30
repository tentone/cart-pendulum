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
