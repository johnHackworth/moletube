window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var trade = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.city = options.stage.city;
    this.city.tradeCouncil = this;
    this.init();
  };
  trade.prototype = {
    importatTax: 1.25,
    exportTax: 1.40,
    counter: 0,
    products: {
      rubber: {
        basePrice: 10
      },
      wheel: {
        basePrice: 25
      }
    },
    init: function() {},
    tick: function(counter) {

    },
    buyProduct: function(productName, destination) {
      for (var i in this.city.factories) {
        if (this.city.factories[i].productName &&
          this.city.factories[i].storage) {
          return buyProductFromFactory(this.city.factories[i], destination);
        } else {
          return importProduct(productName, destination);
        }
      }
    },
    buyProductFromFactory: function(factory, destination) {
      var price = this.products[productName].basePrice;
      destination.owner.money -= price;
      factory.owner.money += price;
      factory.storage--;
      return 1;
    },
    importProduct: function(productName, destination) {
      destination.owner.money -= this.products[productName].basePrice * this.importatTax;
      return 1;
    },
    exportProduct: function(productName, origin) {
      origin.owner.money += this.products[productName].basePrice * this.exportTax;
      origin.storage--;
      return 1;
    },

  };

  window.moletube.models.TradeCouncil = trade;
})();