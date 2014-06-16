window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var build = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.init();
  };
  build.prototype = {
    height: 50,
    width: 50,
    init: function() {
      this.textures = {
        normal: new PIXI.Texture.fromImage('assets/buttons/build.png'),
        hover: new PIXI.Texture.fromImage('assets/buttons/build.png')
      };
      this.view = new PIXI.Sprite.fromImage('assets/buttons/build.png');
      // this.view.scale.set(0.2, 0.2);
      this.view.position.x = window.moletube.config.width - 2 * this.view.width;
      this.view.position.y = 10;
      this.view.height = this.height;
      this.view.width = this.width;
      this.view.setInteractive(true);
      this.stage.addVisualEntity(this.view);

      this.view.mouseover = this.mouseover.bind(this);
      this.view.mouseout = this.mouseout.bind(this);
      this.view.click = this.mouseclick.bind(this);
    },
    mouseover: function() {
      this.view.setTexture(this.textures.hover);
    },
    mouseout: function() {
      this.view.setTexture(this.textures.normal);
    },
    mouseclick: function() {
      this.trigger('clicked');
    },
    tick: function(counter) {

    }
  };
  window.moletube.models.BuildButton = build;
})();