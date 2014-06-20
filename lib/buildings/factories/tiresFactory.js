window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.Factory, true, options);
  };
  block.prototype = {
    productName: 'records',
    input: 'vinyl',
    cost: 100000,
    assets: [
      'assets/factory1.png',
    ],
    maxPops: 3,
    hourlyWage: 8
  };

  window.moletube.models.TiresFactory = block;
})();