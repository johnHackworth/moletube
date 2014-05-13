window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function(options) {
    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.init();
  };
  block.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    assets: [
      'assets/block.png',
      'assets/block2.png',
      'assets/block3.png',
      'assets/block4.png',
      'assets/block5.png',
      'assets/block6.png'
    ],
    init: function() {
      var imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(imageView);
      this.view.viewType = 'building';
      // this.view.visible = false;
      // console.log(this.view.height);
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
    },
    mouseclick: function() {
      this.stage.viewport.panTo(this.x, this.y, 10);
    }
  };

  window.moletube.models.flatBlock = block;
})();