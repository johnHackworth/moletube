window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var overlay = function(options) {
    this.currentlyVisible = [];
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
    }
  };
  window.moletube.models.OverlayManager = overlay;
})();