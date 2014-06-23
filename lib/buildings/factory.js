window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var factory = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding, true, options);
    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.city = options.stage.city;
    this.cityBlock = options.cityBlock;
    this.init();
  };
  factory.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    maxPops: 1,
    initWork: 8,
    owner: null,
    storage: 0,
    maxStorage: 10,
    init: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(this.imageView);
      this.view.viewType = 'building';
      this.y = this.y + (2 * this.tileHeight - this.view.height);
      this.view.position.x = this.x;
      this.view.position.y = this.y;
      this.pops = [];
      this.mouseclick = this.city.overlayManager.showBuildingProfile.bind(this.city.overlayManager, this);

      this.city.on('hourChange', this.changeHour.bind(this));
      this.tradeCouncil = this.stage.tradeCouncil;
    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.x);
      this.view.y = this.stage.viewport.getY(this.y);
      this.stage.viewport.hideIfNotInViewPort(this.view);

    },
    addPop: function(mole) {
      if (this.pops.length < this.maxPops) {
        this.pops.push(mole);
        return true;
      }
      return false;
    },
    changeHour: function() {
      this.work();
    },
    work: function() {
      for (var i in this.cityBlock.moles) {
        this.manufacture();
      }
    },
    manufacture: function() {
      if (this.owner) {
        var cost = this.city.tradeCouncil.buyProduct(this.input, this);
        this.addCost(cost);
        this.storage++;
        if (this.storage > this.maxStorage) {
          this.sellSurplus();
        }
      }
    },
    sellSurplus: function() {
      var revenue = this.city.tradeCouncil.exportProduct(this.productName, this);
      this.addRevenue(revenue);
    }


  };

  window.moletube.models.Factory = factory;
})();