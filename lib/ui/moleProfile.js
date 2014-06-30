window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var profile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.profiled = options.profiled;
    this.init();
  };
  profile.prototype = {
    height: moletube.config.height - 100,
    width: moletube.config.width - 100,
    x: 50,
    y: 50,
    init: function() {
      window.w = this;
      this.destroyables = [];
      this.stage.overlayManager.clean();
      this.stage.overlayManager.addLayer(this);
      this.background = this.stage.addBackground(this.x, this.y, this.width, this.height, 0xD2F47A, 0.6, this.destroyables);

      this.closeButton = this.stage.addText('close', {
        x: this.x + this.width - 100,
        y: this.y + 20,
        fontSize: '20px',
        color: '#333333'
      }, this.destroyables);
      this.centerButton = this.stage.addText('center', {
        x: this.x + this.width - 100,
        y: this.y + 50,
        fontSize: '20px',
        color: '#333333'
      }, this.destroyables);
      this.closeButton.setInteractive(true);
      this.centerButton.setInteractive(true);
      this.closeButton.click = this.mouseclick.bind(this);
      this.drawProfile();
    },
    drawProfile: function() {
      this.pictureBuilding = this.stage.addImage(this.profiled.imageView.standing, {
          x: this.x + 40,
          y: this.y + 10,
          scale: 1.2
        },
        this.destroyables);
      this.nameOwner = this.stage.addText(this.profiled.name, {
        x: this.x + 20,
        y: this.y + 200,
        fontSize: '15px',
        color: '#555533',
        centered: false
      }, this.destroyables);
      this.showLog();
      this.showLocation();
    },
    showLocation: function() {
      var location = this.stage.addText(this.profiled.currentBlock.blockNumber.x + '-' + this.profiled.currentBlock.blockNumber.y, {
        x: this.x + this.width - 200,
        y: this.y + 20,
        fontSize: '30px',
        color: '#555533',
        centered: true
      }, this.destroyables);
    },
    showLog: function() {
      var logTitle = this.stage.addText('Log', {
        x: this.x + 200,
        y: this.y + 20,
        fontSize: '15px',
        color: '#555533',
        centered: false
      }, this.destroyables);
      var n = 0;
      var log = this.profiled.getLog();
      for (var i in log) {
        var logLine = this.stage.addText(log[i].text, {
          x: this.x + 200,
          y: this.y + 40 + n * 11,
          fontSize: '9px',
          color: '#555533',
          centered: false
        }, this.destroyables);
        n++;
      }
    },
    mouseclick: function() {
      this.destroy();
      this.trigger('clicked');
    },
    tick: function(counter) {},
    destroy: function() {
      try {
        while (this.destroyables.length) {
          var destroyable = this.destroyables.shift();
          this.stage.pixiStage.removeChild(destroyable);
        }
      } catch (err) {

      }
    }
  };
  window.moletube.models.MoleProfile = profile;
})();