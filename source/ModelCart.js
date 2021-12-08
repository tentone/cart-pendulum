/**
 * Model to control the cart, its parameters can be set and used to control the cart.
 * 
 * The model is composed of 3 linear regressions for wich their parameters can be trained and used to control the cart object.
 */
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
