// Generated by CoffeeScript 2.6.1
(function() {
  var canvas, model, run, train, visualizer;

  canvas = document.getElementById('canvas');

  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;

  document.body.onresize = function() {
    canvas.width = window.innerWidth;
    return canvas.height = window.innerHeight;
  };

  model = new CP.NeuralModel();

  run = document.getElementById('run');

  visualizer = new CP.NeuralModelVisualizer(model, document.body);

  run.onclick = function() {
    return CP.Runner.runGraphical(canvas, function(cart) {
      return model.control(cart);
    });
  };

  train = document.getElementById('train');

  train.onclick = function() {
    return CP.Utils.readFile(function(data) {
      data = JSON.parse(data);
      model.train(data);
      return visualizer.render();
    });
  };

}).call(this);
