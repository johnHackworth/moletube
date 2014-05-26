window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.FlatBlock, true, options);
  };
  block.prototype = {
    assets: [
      'assets/richHouse1.png',
    ],
    maxPop: 1
  };

  window.moletube.models.UpperClassHousing1 = block;
})();