
# Linear regression is represented by two parameters: the origin and slope of the line.
# 
# @param [number] ori Origin of the line.
# @param [number] decl Slope of the line.
class LinearRegression
    constructor: (ori, decl) ->
        @ori = ori
        @decl = decl


    # Jitter the values in the regression randomly.
    # 
    # Usefull for training purposes.
    # 
    # @param [number] scale Scale of the jittering. 
    jitter: (scale) ->
        @ori += (Math.random() - 0.5) * scale
        @decl += (Math.random() - 0.5) * scale


    # Create a copy of the linear regression object.
    # 
    # @returns Clone of the linear regression object.
    clone: () ->
        return new LinearRegression(@ori, @decl)

export {LinearRegression}