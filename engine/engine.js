window.pixEngine = window.pixEngine || {};
pixEngine.Engine = function(options) {
  this.counter = 0;
  this.entities = [];
  this.renderer = options.renderer;
  this.stage = options.stage
}

pixEngine.Engine.prototype.gameloop = function() {
  requestAnimFrame(this.gameloop.bind(this));
  if(this.running == true) {
    this.counter++;
    for(var i in this.entities) {
      this.entities[i].tick(this.counter);
    }
  }
  this.renderer.render(this.stage);
}

pixEngine.Engine.prototype.addEntity = function(entity) {
  if(this.searchEntity(entity) < 0) {
    this.entities.push(entity)
  }
}

pixEngine.Engine.prototype.searchEntity = function(entity) {
  for(var i in this.entities) {
    if(this.entities[i] === entity) {
      return i;
    }
  }
  return -1;
}

