function NeuralNode()
{
    this.action = null;
}

function NeuralConnection()
{
    this.condition = null;
    this.from = null;
    this.to = null;
}

var NeuralActions = 
[
    function(agent){agent.leftPressed = false; agent.rightPressed = true;},
    function(agent){agent.leftPressed = true; agent.rightPressed = false;},
    function(agent){agent.leftPressed = false; agent.rightPressed = false;},
];
