window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var factory = function(options) {
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
      'assets/factory6.png',
      'assets/factory7.png',
      'assets/factory8.png'
    ],
    init: function() {
      var imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(imageView);
      this.view.viewType = 'building'
      this.y = this.y + (2 * this.tileHeight - this.view.height);
      this.view.position.x = this.x;
      this.view.position.y = this.y;
    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.x);
      this.view.y = this.stage.viewport.getY(this.y);
      this.stage.viewport.hideIfNotInViewPort(this.view);

    }
  }

  window.moletube.models.Factory = factory;
})()