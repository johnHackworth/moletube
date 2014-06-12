window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var recreation = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding);
    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.city = options.stage.city;
    this.cityBlock = options.cityBlock;
    this.init();
  };
  recreation.prototype = {
    maxPop: 1,
    tileHeight: window.moletube.config.tileWidth,
    initBaseRecreation: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(this.imageView);
      this.view.viewType = 'building';
      this.y = this.y + (2 * this.tileHeight - this.view.height);
      this.view.position.x = this.x;
      this.view.position.y = this.y;
      this.view.setInteractive(true);

      this.view.click = this.mouseclick.bind(this);
      this.city.on('hourChange', this.changeHour.bind(this));
    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.x);
      this.view.y = this.stage.viewport.getY(this.y);
      this.stage.viewport.hideIfNotInViewPort(this.view);

    },
    changeHour: function() {
      this.work();
    },
    work: function() {
      for (var i in this.cityBlock.moles) {
        if (!this.isWorker(this.cityBlock.moles[i])) {
          this.sellTo(this.cityBlock.moles[i]);
        }
      }
    },
    isWorker: function(mole) {
      return mole.workPlace == this.cityBlock;
    },
    sellTo: function(mole) {
      this.city.tradeCouncil.buyProduct(this.input, this);
      var cost = this.city.tradeCouncil.getProductFinalPrice(this.productName);
      mole.money -= cost;
      this.owner.money += cost;
      mole.buyProduct(this.productName);

      console.log(mole.name + ' bought a  ' + this.productName);
    }
  };

  window.moletube.models.BaseRecreation = recreation;
})();