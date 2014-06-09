window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var factory = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding);
    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.city = options.stage.city;
    this.tradeCouncil = options.stage.tradeCouncil;
    this.init();
  };
  factory.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    maxPops: 1,
    initWork: 8,
    owner: null,
    storage: 0,
    init: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(this.imageView);
      this.view.viewType = 'building';
      this.y = this.y + (2 * this.tileHeight - this.view.height);
      this.view.position.x = this.x;
      this.view.position.y = this.y;
      this.view.setInteractive(true);
      this.pops = [];
      this.view.click = this.mouseclick.bind(this);
      this.city.on('hourChange', this.changeHour.bind(this));
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
      for (var i in this.moles) {
        this.manufacture();
      }
    },
    manufacture: function() {

    }

  };

  window.moletube.models.Factory = factory;
})();