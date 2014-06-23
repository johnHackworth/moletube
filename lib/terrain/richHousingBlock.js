window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var housingBlock = function(options) {
    this.isoX = options.x;
    this.isoY = options.y;
    this.type = options.type;
    this.stage = options.stage;
    this.city = this.stage.city;
    this.blockNumber = options.blockNumber;
    this.tile = null;
    this.building = null;
    this.moles = options.moles || [];
    this.birds = options.birds || [];

    pixEngine.utils.extend.call(this, moletube.models.CityBlock, true, options);
    this.init();
  };
  housingBlock.prototype = {
    housingTypes: ['UpperClassHousing1'],
    addBuildings: function() {
      this.addHouses();
    },
    addHouses: function(housingType) {
      this.getCity().houses.addUpperClassHouse(this);
      housingType = housingType || this.housingTypes[Math.floor(Math.random() * this.housingTypes.length)];
      this.building = new moletube.models[housingType]({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        stage: this.stage,
        cityBlock: this,
        z: 9999
      });
    },
    getFreePlaces: function() {
      return this.building.maxPops - this.building.pops.length;
    },
    addInhabittant: function(mole) {
      this.building.addPop(mole);
    }
  };
  window.moletube.models.UpperClassHousingBlock = housingBlock;
})();