/**
 * Model to control the cart, its parameters can be set and used to control the cart.
 * 
 * The model is composed of 3 linear regressions for wich their parameters can be trained and used to control the cart object.
 */
function ModelCart()
{
    this.vel = new LinearRegression(0, 0.0);

    this.angle = new LinearRegression(0, 0.0);

    this.pos = new LinearRegression(0, 0.0);

    this.e = 0.0;
}

ModelCart.prototype.jitter = function(scale)
{
    this.vel.jitter(scale);
    this.angle.jitter(scale);
    this.pos.jitter(scale);

    this.e += (Math.random() * scale) - (scale / 2);
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
    var v = this.vel.decl * cart.velocity + this.vel.ori;
    var a = this.angle.decl * cart.angle + this.angle.ori
    var p = this.pos.decl * cart.position + this.pos.ori;

    var value = a - v - p;

    cart.leftPressed = value < this.e;
    cart.rightPressed = value > this.e;
};
