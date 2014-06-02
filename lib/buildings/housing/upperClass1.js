window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.FlatBlock, true, options);
  };
  block.prototype = {
    cost: 50000,
    assets: [
      'assets/richHouse1.png',
    ],
    maxPop: 1,
    buy: function(mole) {
      mole.money -= this.cost;
      this.owner = mole;
      mole.setHome(this.cityBlock);
    }
  };

  window.moletube.models.UpperClassHousing1 = block;
})();