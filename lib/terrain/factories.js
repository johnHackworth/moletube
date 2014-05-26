window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var factories = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.city = options.city;
    this.init();
  };
  factories.prototype = {
    counter: 0,
    init: function() {
      this.factories = [];
    },
    tick: function(counter) {

    },
    getEmptyFactories: function() {
      var emptyHouses = 0;
      for (var i in this.factories) {
        emptyHouses += this.factories[i].getFreePlaces();
      }
      return emptyHouses;
    },
    addFactory: function(block) {
      this.factories.push(block);
    },
    getFreeJobPosition: function() {
      for (var i in this.factories) {
        if (this.factories[i].getFreePlaces() > 0) {
          return this.factories[i];
        }
      }
    }
  };

  window.moletube.models.Factories = factories;
})();