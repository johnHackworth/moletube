window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var bar = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding);
    pixEngine.utils.extend.call(this, window.moletube.models.BaseRecreation);

    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.init();
  };
  bar.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    assets: [
      'assets/bar1.png'
    ],
    init: function() {
      this.initBaseRecreation();
    }
  };

  window.moletube.models.Bar = bar;
})();