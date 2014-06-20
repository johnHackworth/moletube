window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.FlatBlock, true, options);
  };
  block.prototype = {
    cost: 60000,
    assets: [
      'assets/block2.png',
    ],
    maxPops: 4,
    rent: 60
  };

  window.moletube.models.WorkersHousing2 = block;
})();