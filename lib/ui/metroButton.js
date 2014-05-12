window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var metroButton = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.init();
  };
  metroButton.prototype = {
    height: 100,
    width: 100,
    init: function() {
      this.textures = {
        normal: new PIXI.Texture.fromImage('assets/metroButton.png'),
        hover: new PIXI.Texture.fromImage('assets/metroButtonHover.png')
      };
      this.view = new PIXI.Sprite.fromImage('assets/metroButton.png');
      // this.view.scale.set(0.2, 0.2);
      this.view.position.x = window.moletube.config.width - this.view.width - 10;
      this.view.position.y = 10;
      this.view.setInteractive(true);
      this.stage.addInvisibleEntity(this.view);

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
  window.moletube.models.MetroButton = metroButton;
})();