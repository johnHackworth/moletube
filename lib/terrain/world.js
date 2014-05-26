window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var world = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.setStage(options.stage);
    this.init();
  };
  world.prototype = {
    counter: 0,
    init: function() {},
    setCity: function(city) {
      this.city = city;
    },
    setStage: function(stage) {
      this.stage = stage;
    },
    tick: function(counter) {
      if (counter % 50 === 0) {
        var numberOfPlaces = this.city.houses.getEmptyHouses();
        if (numberOfPlaces > 0 && Math.random() > 0.90) {
          this.createInmigrant();
        }
      }
      if (counter % 225 === 0) {
        if (this.needCapitalist()) {
          this.createCapitalist();
        }
      }
    },
    createInmigrant: function() {
      var mole = this.city.createMole();
    },
    createCapitalist: function() {
      var capitalist = this.city.createCapitalist();
    },
    needCapitalist: function() {
      var house = this.city.houses.getFreeUpperClassHouse()
      return (house && Math.random() > 0.99);
    }
  };

  window.moletube.models.World = world;
})();