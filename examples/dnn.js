// Generated by CoffeeScript 2.6.1
(function() {
  var canvas, model, run, train;

  canvas = document.getElementById('canvas');

  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;

  document.body.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  model = new (CP.NeuralModel)();

  run = document.getElementById('run');

  run.onclick = function() {
    CP.Runner.runGraphical(canvas, function(cart) {
      model.control(cart);
    });
  };

  train = document.getElementById('train');

  train.onclick = function() {
    CP.Utils.readFile(function(data) {
      data = JSON.parse(data);
      model.train(data);
    });
    clearTerminal();
  };

}).call(this);
