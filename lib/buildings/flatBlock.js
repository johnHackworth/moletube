window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding);
    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.cityBlock = options.cityBlock;
    this.init();
  };
  block.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    init: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(this.imageView);
      this.view.viewType = 'building';
      this.maxPop = this.maxPop || 1;
      // this.view.visible = false;
      // console.log(this.view.height);
      this.pops = [];
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
    },
    addPop: function(mole) {
      if (this.pops.length < this.maxPop) {
        this.pops.push(mole);
        mole.setHome(this.cityBlock);
        return true;
      } else {
        return false;
      }
    }
  };

  window.moletube.models.FlatBlock = block;
})();