window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var lineButton = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.line = options.line
    this.stage = options.stage;
    this.color = options.color;
    this.init();
  }
  lineButton.prototype = {
    height: 60,
    width: 60,
    init: function() {
      this.textures = {
        normal: new PIXI.Texture.fromImage('assets/L'+this.line+'.png'),
        selected: new PIXI.Texture.fromImage('assets/L'+this.line+'on.png'),
      };
      this.view = new PIXI.Sprite.fromImage('assets/L'+this.line+'.png'),
      this.view.scale.set(0.2, 0.2);
      this.view.position.x = 1130;
      this.view.position.y = 10 + this.line * (this.height + 10);
      this.view.setInteractive(true);
      this.stage.addInvisibleEntity(this.view);

      this.view.click = this.mouseclick.bind(this);
    },
    mouseclick: function() {
      this.toggle();
      this.trigger('clicked');
    },
    toggle: function() {
      if(this.selected) {
        this.unselect();
      } else {
        this.select();
      }
    },
    select: function() {
      this.selected = true;
      this.view.setTexture(this.textures.selected);
      this.trigger('selected', this)
    },
    unselect: function() {
      this.deselect();
      this.trigger('unselected', this);
    },
    deselect: function() {
      this.selected = false;
      this.view.setTexture(this.textures.normal);
    },
    tick: function(counter) {

    },
    show: function() {
      this.view.alpha = 1;
    },
    hide: function() {
      this.view.alpha = 0;
    }
  }
  window.moletube.models.LineButton = lineButton;
})()
