window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.FlatBlock, true, options);
  };
  block.prototype = {
    assets: [
      'assets/block2.png',
    ],
    maxPop: 4
  };

  window.moletube.models.WorkersHousing2 = block;
})();