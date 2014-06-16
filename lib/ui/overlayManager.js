window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var overlay = function(options) {
    this.currentlyVisible = [];
    this.stage = options.stage;
  };
  overlay.prototype = {
    clean: function() {
      while (this.currentlyVisible.length) {
        var view = this.currentlyVisible.shift();
        view.destroy();
      }
    },
    addLayer: function(layer) {
      this.currentlyVisible.push(layer);
    },
    showFinancedProjectsMenu: function() {
      this.clean();
      this.stage.resaltTiles = true;
      var lateralMenu = new moletube.models.FinancedProjectsMenu({
        stage: this.stage
      });
      this.addLayer(lateralMenu);
    },
    showBuildMenu: function() {
      this.clean();
      this.stage.resaltTiles = true;
      var lateralMenu = new moletube.models.BuildMenu({
        stage: this.stage
      });
      this.addLayer(lateralMenu);
    },
  };
  window.moletube.models.OverlayManager = overlay;
})();