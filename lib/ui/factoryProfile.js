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
      this.centerButton.click = this.clickCenter.bind(this);
      this.drawProfile();
    },
    showOwner: function() {
      this.titleOwner = this.stage.addText('Owner', {
        x: this.x + 270,
        y: this.y + 10,
        fontSize: '10px',
        color: '#333333',
        centered: true
      }, this.destroyables);
      this.pictureOwner = this.stage.addImage(this.profiled.owner.imageView.standing, {
          x: this.x + 270,
          y: this.y + 25,
          scale: 0.5,
          centered: true
        },
        this.destroyables);
      this.nameOwner = this.stage.addText(this.profiled.owner.name, {
        x: this.x + 270,
        y: this.y + 90,
        fontSize: '10px',
        color: '#555533',
        centered: true
      }, this.destroyables);
    },
    drawProfile: function() {
      this.pictureBuilding = this.stage.addImage(this.profiled.imageView, {
          x: this.x + 40,
          y: this.y + 20,
          scale: 1.2
        },
        this.destroyables);

      if (this.profiled.owner) {
        this.showOwner();
      }
      if (this.moles) {
        for (var i in this.moles) {

          this.moles[i].view.x = this.x + 150 + i * 20;
          this.moles[i].view.y = this.y + 10;
          this.moles[i].view.scale.set(0.4, 0.4);
          this.moles[i].view.viewType = 'text';
          this.stage.addVisualEntity(this.moles[i].view);
        }
      }
    },
    mouseclick: function() {
      this.destroy();
      this.trigger('clicked');
    },
    clickCenter: function() {
      this.profiled.centerView();
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
  window.moletube.models.FactoryProfile = profile;
})();