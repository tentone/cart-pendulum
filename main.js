var canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.top = "0px";
canvas.style.left = "0px";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

document.body.onresize = function()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};


// Run with bot controls
function runBot()
{
    runGraphical(function(cart)
    {
        cart.leftPressed = cart.angle < 0;
        cart.rightPressed = cart.angle > 0;		
    });
}

// Run with hu,an player controls
function runHumanPlayer()
{
    var left = false;
    var right = false;
    document.body.onkeydown = function(event)
    {
        // Left
        if(event.keyCode === 37)
        {
            left = true;
        }
        // Right
        if(event.keyCode === 39)
        {
            right = true;	
        }
    };

    document.body.onkeyup = function(event)
    {
        // Left
        if(event.keyCode === 37)
        {
            left = false;
        }
        // Right
        if(event.keyCode === 39)
        {
            right = false;	
        }
    };

    runGraphical(function(cart)
    {
        cart.leftPressed = left;
        cart.rightPressed = right;		
    });
}

function runHeadlessBot()
{
    runHeadless(function(cart)
    {
        cart.leftPressed = cart.angle < 0;
        cart.rightPressed = cart.angle > 0;		
    });
}

function runTrigno(model)
{
    if(model === undefined)
    {
        model = new ModelCart();
    }

    runGraphical(function(cart)
    {
        model.control(cart);
    });
}
