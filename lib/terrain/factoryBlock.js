window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var factoryBlock = function(options) {
    this.isoX = options.x;
    this.isoY = options.y;
    this.type = options.type;
    this.stage = options.stage;
    this.city = this.stage.city;
    this.blockNumber = options.blockNumber;
    this.tile = null;
    this.building = null;
    this.moles = [];
    this.birds = [];

    pixEngine.utils.extend.call(this, moletube.models.CityBlock, true, options);
  };
  factoryBlock.prototype = {
    workTypes: ['TiresFactory'],
    addBuildings: function() {
      this.addFactory();
    },
    addFactory: function() {
      this.getCity().factories.addFactory(this);
      var workType = this.workTypes[Math.floor(Math.random() * this.workTypes.length)];

      this.building = new moletube.models[workType]({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        stage: this.stage,
        cityBlock: this
      });
    },
    getFreePlaces: function() {
      return this.building.maxPop - this.building.pops.length;
    },
    addWorker: function(mole) {
      this.building.addPop(mole);
    }
  };
  window.moletube.models.FactoryBlock = factoryBlock;
})();