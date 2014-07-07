window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var recreation = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding, true, options);
    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.city = options.stage.city;
    this.cityBlock = options.cityBlock;
    this.init();
  };
  recreation.prototype = {
    maxPops: 2,
    initWork: [8, 12, 16],
    getInitWork: function() {
      return this.initWork[Math.floor(Math.random() * this.initWork.length)];
    },
    tileHeight: window.moletube.config.tileWidth,
    initBaseRecreation: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(this.imageView);
      this.view.viewType = 'building';
      this.y = this.y + (2 * this.tileHeight - this.view.height);
      this.view.position.x = this.x;
      this.view.position.y = this.y;

      this.mouseclick = this.city.overlayManager.showBuildingProfile.bind(this.city.overlayManager, this);

      this.pops = [];
      this.city.on('hourChange', this.changeHour.bind(this));
    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.x);
      this.view.y = this.stage.viewport.getY(this.y);
      this.stage.viewport.hideIfNotInViewPort(this.view);

    },
    isOpen: function() {
      return this.pops.length > 0;
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
      var cost = this.city.tradeCouncil.buyProduct(this.input, this);
      var price = this.city.tradeCouncil.getProductFinalPrice(this.productName);
      this.addCost(cost);
      mole.money -= price;
      this.owner.money += price;
      mole.buyProduct(this.productType);

      this.addRevenue(cost);
      console.log(mole.name + ' bought a  ' + this.productName);
    },
    addPop: function(mole) {
      if (this.pops.length < this.maxPops) {
        this.pops.push(mole);
        return true;
      }
      return false;
    },
  };

  window.moletube.models.BaseRecreation = recreation;
})();