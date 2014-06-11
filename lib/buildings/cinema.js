window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var cinema = function(options) {
    pixEngine.utils.extend.call(this, window.moletube.models.BaseRecreation, true, options);
  };
  cinema.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    assets: [
      'assets/cinema1.png'
    ],
    init: function() {
      this.initBaseRecreation();
    }
  };

  window.moletube.models.Cinema = cinema;
})();