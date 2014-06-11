window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseRecreation, true, options);
  };
  block.prototype = {
    productName: 'tires',
    input: 'tires',
    cost: 100000,
    assets: [
      'assets/recordStore.png',
    ],
    maxPop: 2,
    hourlyWage: 6,
    init: function() {
      this.initBaseRecreation();
    }
  };

  window.moletube.models.RecordStore = block;
})();