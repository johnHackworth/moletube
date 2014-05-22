window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var telecom = function(options) {
    // pixEngine.utils.extend.call(this, window.moletube.models.BaseBuilding, true, options);

    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    pixEngine.utils.extend.call(this, window.moletube.models.Factory, true, options);

    this.initTelecom();
  };
  telecom.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    assets: [
      'assets/factory7.png',
      'assets/factory8.png'
    ],
    initTelecom: function() {}
  };

  window.moletube.models.Telecom = telecom;
})();