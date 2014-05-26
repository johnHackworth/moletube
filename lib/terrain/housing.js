window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var housing = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.city = options.city;
    this.init();
  };
  housing.prototype = {
    counter: 0,
    init: function() {
      this.workerHouses = [];
      this.upperClassHouses = [];
    },
    tick: function(counter) {

    },
    getEmptyHouses: function() {
      var emptyHouses = 0;
      for (var i in this.workerHouses) {
        emptyHouses += this.workerHouses[i].getFreePlaces();
      }
      return emptyHouses;
    },
    addWorkerHouse: function(block) {
      this.workerHouses.push(block);
    },
    addUpperClassHouse: function(block) {
      this.upperClassHouses.push(block);
    },
    getFreeWorkerHouse: function() {
      for (var i in this.workerHouses) {
        if (this.workerHouses[i].getFreePlaces() > 0) {
          return this.workerHouses[i];
        }
      }
    },
    getFreeUpperClassHouse: function() {
      for (var i in this.upperClassHouses) {
        if (this.upperClassHouses[i].getFreePlaces() > 0) {
          return this.upperClassHouses[i];
        }
      }
    }
  };

  window.moletube.models.Housing = housing;
})();