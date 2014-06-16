window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var ui = function(options) {
    this.currentlyVisible = [];
    this.overlayManager = options.overlayManager;
    this.stage = options.stage;
    this.init();
  };
  ui.prototype = {
    init: function() {
      this.initConstructionButtons();
    },
    initConstructionButtons: function() {

      this.buyButton = new moletube.models.BuyButton({
        stage: this.stage,
        x: 1000,
        y: 0
      });
      this.buildButton = new moletube.models.BuildButton({
        stage: this.stage,
        x: 1000,
        y: 0
      });

      this.buyButton.on('clicked', this.overlayManager.showFinancedProjectsMenu.bind(this.overlayManager));
      this.buildButton.on('clicked', this.overlayManager.showBuildMenu.bind(this.overlayManager));

    }
  };
  window.moletube.models.UIManager = ui;
})();