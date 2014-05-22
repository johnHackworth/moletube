window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var baseBuilding = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.moles = [];
  };
  baseBuilding.prototype = {
    damage: 0,
    destroyedAssets: [
      'assets/ruin1.png',
    ],
    profileType: 'building',
    getDamage: function(dmg) {
      this.damage++;
      if (this.damage > 100) {
        this.damage = 100;
        this.destroyed = true;
        this.destroyBuilding();
      }
      if (this.damage < 0) {
        this.damage = 0;
      }
    },
    destroyBuilding: function() {
      this.ruinImage = this.destroyedAssets[Math.floor(Math.random() * this.destroyedAssets.length)];
      // debugger;
      var prevHeight = this.view.height;
      this.destoyTexture = new PIXI.Texture.fromImage(this.ruinImage);
      this.view.setTexture(this.destoyTexture);
      var newHeight = this.view.height;

      this.y += prevHeight - newHeight;
    },
    select: function() {

    },
    mouseclick: function() {
      this.trigger('click', this);
    },
    centerView: function() {
      this.stage.viewport.panTo(this.x, this.y, 20);
    }
  };

  window.moletube.models.BaseBuilding = baseBuilding;
})();
