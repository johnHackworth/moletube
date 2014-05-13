window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var park = function(options) {
    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.init();
  }
  park.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    assets: [
      'assets/parks1.png',
      'assets/parks2.png',
      'assets/parks3.png',
      'assets/parks4.png'
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

  window.moletube.models.ParksAndRecreation = park;
})()