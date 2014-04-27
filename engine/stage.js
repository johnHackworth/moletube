window.pixEngine = window.pixEngine || {};

pixEngine.Stage = function(options) {
  var self = this;
  pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  this.pixiStage = new PIXI.Stage(0x67EBA1, true);
  // let pixi choose WebGL or canvas
  this.renderer = PIXI.autoDetectRenderer(
    options.width,
    options.height
  );
  this.assets = options.assets;
  this.engine = new window.pixEngine.Engine({
    renderer: this.renderer,
    stage: this.pixiStage
  });

  this.mouse = new pixEngine.Mouse(options.width, options.height, this);
  this.mouse.on('click', function(mousedata) {
    self.engine.running = true;
    self.trigger('click', mousedata)
  })
  this.initStage = options.init;
}

pixEngine.Stage.prototype.init = function() {
  var self = this;
  document.body.appendChild(this.renderer.view);
  this.loader = new PIXI.AssetLoader(this.assets);
  this.loader.onComplete = function() {
    self.initStage(self);
    self.engine.gameloop();
  }
  this.loader.load();
}

pixEngine.Stage.prototype.addEntity = function(entity) {
  this.pixiStage.addChild(entity.view);
  this.engine.addEntity(entity);
}

pixEngine.Stage.prototype.addInvisibleEntity = function(entity) {
  this.pixiStage.addChild(entity);
}

pixEngine.Stage.prototype.addNotVisualEntity = function(entity) {
  this.engine.addEntity(entity);
}

pixEngine.Stage.prototype.resetPixiView = function(condition, value) {
  var removables = [];
  for(var i in this.pixiStage.children) {
    if(!condition || this.pixiStage.children[i][condition] === value) {
      removables.push(this.pixiStage.children[i]);
    }
  }
  for(var j in removables) {
    this.pixiStage.removeChild(removables[j]);
  }
}

pixEngine.Stage.prototype.toFrontPixiView = function(condition, value) {
  var removables = [];
  for(var i in this.pixiStage.children) {
    if(!condition || this.pixiStage.children[i][condition] === value) {
      removables.push(this.pixiStage.children[i]);
    }
  }
  for(var j in removables) {
    this.pixiStage.removeChild(removables[j]);
    this.pixiStage.addChild(removables[j]);
  }
}
