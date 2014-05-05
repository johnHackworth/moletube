window.pixEngine = window.pixEngine || {};

pixEngine.Stage = function(options) {
  window.s = this;
  this.supportsWebGL = function() {
    try {
      var canvas = document.createElement( 'canvas' );
      return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
    } catch( e ) {
      return false;
    }
    return true;
  }
  var self = this;
  pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  this.pixiStage = new PIXI.Stage(0x67EBA1, true);

  if(this.supportsWebGL()) {
    this.renderer = new PIXI.WebGLRenderer(
      options.width,
      options.height,
      null,
      null,
      true
    );
    this.assets = options.assets;
    this.engine = new window.pixEngine.Engine({
      renderer: this.renderer,
      stage: this
    });

    this.mouse = new pixEngine.Mouse(options.width, options.height, this);
    this.mouse.on('click', function(mousedata) {
      self.engine.running = true;
      self.trigger('click', mousedata)
    })
    this.initStage = options.init;
    // console.log(pixEngine.Viewport)
    this.viewport = new pixEngine.Viewport({
      maxX: options.maxX || options.width,
      maxY: options.maxY || options.height,
      minX: options.minX || 0,
      minY: options.minY || 0,
      width: options.width,
      height: options.height,
      x: Math.floor(options.width / 2),
      y: Math.floor(options.height / 2),
    })
  } else {
    var loader = document.getElementById('loader');
    loader.innerHTML = 'Your browser doesn\'t support webGL, sorry';
    loader.setAttribute('class', 'warning');
    this.init = function(){};
  }
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

pixEngine.Stage.prototype.tick = function(counter) {
  this.viewport.tick(counter);
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

pixEngine.Stage.prototype.removeView = function(entity) {
  this.pixiStage.removeChild(entity);
}

pixEngine.Stage.prototype.addViewAfter = function(entity, afterEntity) {
  this.pixiStage.addChild(entity);
  var i = this.pixiStage.children.indexOf(afterEntity);
  if(i >= 0) {
    var pixiEntity = this.pixiStage.children.pop();
    this.pixiStage.children.splice(i+1, 0, pixiEntity);
  }
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
