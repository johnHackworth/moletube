window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var baseBuilding = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.moles = [];
  };
  baseBuilding.prototype = {
    tileHeight: window.moletube.config.tileWidth,
    damage: 0,
    cost: 0,
    owner: null,
    destroyedAssets: [
      'assets/ruin1.png',
    ],
    profileType: 'building',
    baseInit: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(this.imageView);
      this.view.viewType = 'building';
      this.y = this.y + (2 * this.tileHeight - this.view.height);
      // this.x = this.x - this.tileHeight;
      this.view.position.x = this.x;
      this.view.position.y = this.y;
    },
    baseTick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.x);
      this.view.y = this.stage.viewport.getY(this.y);
      this.stage.viewport.hideIfNotInViewPort(this.view);

    },
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
    },
    buy: function(mole) {
      mole.money -= this.cost;
      mole.properties.push(this);
      this.owner = mole;
    }
  };

  window.moletube.models.BaseBuilding = baseBuilding;
})();