window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var toll = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding);

    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.init();
  };
  toll.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    assets: [
      'assets/tolls.png'
    ],
    init: function() {
      this.baseInit();
    },
    tick: function() {
      this.baseTick();
    }
  };

  window.moletube.models.Toll = toll;
})();