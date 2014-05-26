window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var block = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.Factory, true, options);
  };
  block.prototype = {
    assets: [
      'assets/factory1.png',
    ],
    maxPop: 2
  };

  window.moletube.models.TiresFactory = block;
})();