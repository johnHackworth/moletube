window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var recreation = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding);

  };
  recreation.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    initBaseRecreation: function() {
      var imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(imageView);
      this.view.viewType = 'building';
      this.y = this.y + (2 * this.tileHeight - this.view.height);
      this.view.position.x = this.x;
      this.view.position.y = this.y;
    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.x);
      this.view.y = this.stage.viewport.getY(this.y);
      this.stage.viewport.hideIfNotInViewPort(this.view);

    }
  };

  window.moletube.models.BaseRecreation = recreation;
})();