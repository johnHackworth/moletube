window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function (options) {
    this.x = options.x;
    this.y = options.y;
    this.init();
  }
  block.prototype = {
    assets: [
      'assets/block.png',
      'assets/block2.png',
      'assets/block3.png',
      'assets/block4.png',
      'assets/block5.png'
    ],
    init: function() {
      var imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(imageView);
      this.view.viewType = 'building'
      this.view.position.x = this.x;
      this.view.position.y = this.y;
    },
    tick: function(counter) {

    }
  }

  window.moletube.models.flatBlock = block;
})()
