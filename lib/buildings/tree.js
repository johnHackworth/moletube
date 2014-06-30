window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var tree = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding);

    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.city = this.stage.city;
    this.block = options.block;
    this.init();
  };
  tree.prototype = {
    tileWidth: window.moletube.config.tileWidth,
    tileHeight: window.moletube.config.tileWidth / 2,
    assets: [
      'assets/decoration/tree1.png',
      'assets/decoration/tree2.png',
      'assets/decoration/tree3.png',
      'assets/decoration/tree4.png',
      'assets/decoration/tree5.png',
      'assets/decoration/tree6.png',
      'assets/decoration/tree7.png',
      'assets/decoration/tree8.png'
    ],
    init: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(this.imageView);
      this.view.viewType = 'decoration';
      this.x = this.x - this.view.width / 2;
      this.y = this.y - this.view.height;
      /*      this.y = this.y + (2 * this.tileHeight - this.view.height);
      this.x -= Math.floor(this.view.width / 2);

      this.y += Math.floor(Math.random() * this.tileHeight);
      this.x = this.x - Math.floor(this.tileWidth / 2) + Math.floor(Math.random() * this.tileWidth);
*/
      this.view.position.x = this.x;
      this.view.position.y = this.y;
    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.x);
      this.view.y = this.stage.viewport.getY(this.y);
      this.stage.viewport.hideIfNotInViewPort(this.view);

    },
    reorderView: function() {
      var prevElement = this.city.getPreviousBuildElement(this.block);
      if (prevElement && prevElement.building) {
        this.stage.removeView(this.view);
        this.stage.addViewAfter(this.view, prevElement.building.view);
      } else if (prevElement && prevElement.decoration.length > 0 && this.building) {
        this.stage.removeView(this.view);
        this.stage.addViewAfter(this.view, prevElement.decoration[0].view);
      }
    },
  };

  window.moletube.models.Tree = tree;
})();