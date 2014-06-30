window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var recreationBlock = function(options) {
    this.isoX = options.x;
    this.isoY = options.y;
    this.type = options.type;
    this.stage = options.stage;
    this.buildingType = options.buildingType;
    this.city = this.stage.city;
    this.blockNumber = options.blockNumber;
    this.tile = null;
    this.building = null;
    this.moles = [];
    this.birds = [];

    pixEngine.utils.extend.call(this, moletube.models.CityBlock, true, options);
    this.init(options);
  };
  recreationBlock.prototype = {
    recreationTypes: ['RecordStore'],
    addBuildings: function() {
      this.addRecreation();
    },
    addRecreation: function() {
      this.getCity().parks.push(this);
      this.getCity().factories.addFactory(this);
      var recreationType = this.recreationTypes[Math.floor(Math.random() * this.recreationTypes.length)];
      this.building = new moletube.models[recreationType]({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        stage: this.stage,
        cityBlock: this,
        z: 9999
      });
    },
    addWorker: function(mole) {
      this.building.addPop(mole);
    }
  };
  window.moletube.models.RecreationBlock = recreationBlock;
})();