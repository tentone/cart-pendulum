// Generated by CoffeeScript 2.6.1
(function() {
  var canvas, model, run, train, visualizer, viz;

  canvas = document.getElementById('canvas');

  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;

  document.body.onresize = function() {
    canvas.width = window.innerWidth;
    return canvas.height = window.innerHeight;
  };

  model = new CP.NeuralModel();

  run = document.getElementById('run');

  visualizer = new CP.NeuralModelVisualizer(model.net, document.body);

  run.onclick = function() {
    return CP.Runner.runGraphical(canvas, function(cart) {
      return model.control(cart);
    });
  };

  viz = document.getElementById('viz');

  train = document.getElementById('train');

  train.onclick = function() {
    return CP.Utils.readFile(function(data) {
      var options;
      data = JSON.parse(data);
      model.train(data);
      options = {
        width: 600,
        height: 350,
        radius: 6,
        line: {
          width: 2.0,
          color: '#000000'
        },
        fontSize: '12px',
        hidden: {
          color: "#BB7733BB"
        },
        outputs: {
          color: "#3333BBBB",
          labels: ['Left', 'Right']
        },
        inputs: {
          color: '#3BB33BB',
          labels: ['Position', 'Velocity', 'Angle']
        }
      };
      viz.innerHTML = model.toSVG(options);
      return visualizer.render();
    });
  };

}).call(this);
