window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var kaiju = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    pixEngine.utils.extend.call(this, window.moletube.models.BasicKaiju, true);
    this.options = options;
    this.stage = options.stage;
    this.init();
  };
  kaiju.prototype = {
    width: 100,
    height: 100,
    baseSpeed: 5,
    assets: [{
      standing: 'assets/kaiju1.png',
      big: 'assets/kaiju1.png',
      moving: [
        'assets/kaiju1_1.png',
        'assets/kaiju1_2.png'
      ],
      movingBack: [
        'assets/kaiju1_1.png',
        'assets/kaiju1_2.png'
      ]
    }],
  };

  window.moletube.models.Kaiju = kaiju;
})();