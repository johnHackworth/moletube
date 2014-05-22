window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var factory = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding);
    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.init();
  }
  factory.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    assets: [
      'assets/factory1.png',
      'assets/factory2.png',
      'assets/factory3.png',
      'assets/factory4.png',
      'assets/factory5.png',
      'assets/factory6.png'
    ],
    init: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(this.imageView);
      this.view.viewType = 'building'
      this.y = this.y + (2 * this.tileHeight - this.view.height);
      this.view.position.x = this.x;
      this.view.position.y = this.y;
      this.view.setInteractive(true);

      this.view.click = this.mouseclick.bind(this);
    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.x);
      this.view.y = this.stage.viewport.getY(this.y);
      this.stage.viewport.hideIfNotInViewPort(this.view);

    }
  }

  window.moletube.models.Factory = factory;
})()