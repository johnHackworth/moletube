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
    showMoleProfile: function(mole) {
      this.clean();
      var moleProfile = new moletube.models.MoleProfile({
        profiled: mole,
        stage: this.stage
      });
      this.addLayer(moleProfile);
    },
    showBuildMenu: function() {
      this.clean();
      this.stage.resaltTiles = true;
      var lateralMenu = new moletube.models.BuildMenu({
        stage: this.stage
      });
      this.addLayer(lateralMenu);
    },
    showBuildingProfile: function(building) {
      this.clean();
      this.selectedBuilding = building;
      if (building.select) {
        building.select();
      }
      var selectedProfile = new moletube.models.FactoryProfile({
        stage: this.stage,
        profiled: building
      });
      this.addLayer(selectedProfile);
    },
  };
  window.moletube.models.OverlayManager = overlay;
})();