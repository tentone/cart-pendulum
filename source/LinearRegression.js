/**
 * Linear regression is represented by two parameters: the origin and slope of the line.
 * 
 * @param [number] ori Origin of the line.
 * @param [number] decl Slope of the line.
 */
function LinearRegression(ori, decl)
{
    this.ori = ori;
    this.decl = decl;
}

/**
 * Jitter the values in the regression randomly.
 * 
 * Usefull for training purposes.
 * 
 * @param [number] scale Scale of the jittering. 
 */
LinearRegression.prototype.jitter = function(scale) {
    this.ori += (Math.random() - 0.5) * scale;
    this.decl += (Math.random() - 0.5) * scale;
};

/**
 * Create a copy of the linear regression object.
 * 
 * @returns Clone of the linear regression object.
 */
LinearRegression.prototype.clone = function()
{
    return new LinearRegression(this.ori, this.decl);
};

export {LinearRegression};