window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var manager = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init();
  };
  manager.prototype = {
    categories: ['music', 'food', 'read', 'cinema'],
    init: function() {
      this.generateLikes();
    },
    generateLikes: function() {
      for (var i in this.categories) {
        this[this.categories[i]] = Math.floor(Math.random() * 100);
      }
    },
    getCraving: function() {
      var cat = Math.floor(Math.random() * this.categories.length);
      if (Math.random() * 100 < this[cat]) {
        return cat;
      }
    },
    getHappinessFromProduct: function(type) {
      return this[type] || 1;
    }

  };

  window.moletube.models.DesireManager = manager;
})();