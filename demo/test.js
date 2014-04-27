var width = 1200;
var height = 600;
var stage = new pixEngine.Stage({
  width: width,
  height: height,
  init: function(stage) {
    for(var i = 0; i<100; i++) {
      var leaf = grass(Math.random() * width, Math.random() * height)
      leaf.speed = Math.ceil(Math.random() * 10)
      leaf.fall = Math.ceil(Math.random() * 3);
      stage.addEntity(leaf);
      stage.addEntity(leaf.shadow);
    }

  }
})

stage.init()
