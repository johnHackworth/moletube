window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var floatingWindow = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.city = options.stage.city;
    this.stage = options.stage;
    this.init();
  };
  floatingWindow.prototype = {
    height: moletube.config.height - 100,
    x: 50,
    width: moletube.config.width - 100,
    y: 50,
    init: function() {
      this.currentOptions = [];
      if (this.city.openOverlay) {
        this.city.openOverlay.destroy();
      }
      this.city.openOverlay = this;
      this.background = new PIXI.Graphics();
      this.background.clear();
      this.background.beginFill(0xD2F47A);
      var x = this.x;
      var y = 0;
      this.background.moveTo(x, y);
      this.background.lineTo(this.x + this.width, y);
      this.background.lineTo(this.x + this.width, y + this.height);
      this.background.lineTo(x, y + this.height);
      this.background.lineTo(x, y);
      this.background.endFill();
      this.background.alpha = 0.6;
      this.background.viewType = 'text';

      this.stage.addVisualEntity(this.background);

      this.closeButton = new PIXI.Text('close', {
        font: "20px Verdana",
        fill: "#333333"
      });

      this.closeButton.x = this.x + 20;
      this.closeButton.y = this.y + this.height - 20;
      this.closeButton.viewType = 'text';
      this.stage.addVisualEntity(this.closeButton);
      this.closeButton.setInteractive(true);

      this.closeButton.click = this.mouseclick.bind(this);

      this.drawMenu();
    },
    drawMenu: function() {

    },
    mouseclick: function() {
      this.destroy();
      this.trigger('clicked');
    },
    tick: function(counter) {},
    destroy: function() {
      try {
        this.city.selectedProject = null;
        if (this.background) this.stage.pixiStage.removeChild(this.background);
        if (this.closeButton) this.stage.pixiStage.removeChild(this.closeButton);
      } catch (err) {

      }
    }
  };
  window.moletube.models.FloatingWindow = floatingWindow;
})();