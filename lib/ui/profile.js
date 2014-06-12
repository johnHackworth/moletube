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
    height: 100,
    width: moletube.config.width,
    x: 0,
    y: moletube.config.height - 100,
    init: function() {
      this.stage.overlayManager.clean();
      this.stage.overlayManager.addLayer(this);
      this.background = new PIXI.Graphics();
      this.background.clear();
      this.background.beginFill(0xD2F47A);
      var x = this.x;
      var y = this.y;
      this.background.moveTo(x, y);
      this.background.lineTo(this.width, y);
      this.background.lineTo(this.width, y + 100);
      this.background.lineTo(x, y + 100);
      this.background.lineTo(x, y);
      this.background.endFill();
      this.background.alpha = 0.6;
      this.background.viewType = 'text';

      this.stage.addVisualEntity(this.background);

      this.closeButton = new PIXI.Text('close', {
        font: "20px Verdana",
        fill: "#333333"
      });

      this.centerButton = new PIXI.Text('center', {
        font: "20px Verdana",
        fill: "#333333"
      });

      this.closeButton.x = this.x + this.width - 100;
      this.closeButton.y = this.y + 20;
      this.closeButton.viewType = 'text';
      this.stage.addVisualEntity(this.closeButton);
      this.closeButton.setInteractive(true);

      this.closeButton.click = this.mouseclick.bind(this);

      this.centerButton.x = this.x + this.width - 100;
      this.centerButton.y = this.y + 50;
      this.centerButton.viewType = 'text';
      this.stage.addVisualEntity(this.centerButton);
      this.centerButton.setInteractive(true);

      this.centerButton.click = this.clickCenter.bind(this);

      if (this.profiled.profileType === 'mole') {
        this.profileMole();
      } else if (this.profiled.profileType === 'building') {
        this.profileBuilding();
      }

    },
    profileBuilding: function() {
      this.pictureBuilding = new PIXI.Sprite.fromImage(this.profiled.imageView);

      this.moles = [];

      for (var i in this.profiled.moles) {
        var mole = {
          mole: this.profiled.moles[i],
          view: new PIXI.Sprite.fromImage(this.profiled.moles[i].imageView.big)
        };
        this.moles.push(mole);
        mole.view.setInteractive(true);
        mole.view.click = mole.mole.centerView.bind(mole.mole);
      }
      this.drawProfile();
    },
    profileMole: function() {
      this.picture = new PIXI.Sprite.fromImage(this.profiled.imageView.big);
      this.name = new PIXI.Text(this.profiled.name, {
        font: "30px Verdana",
        fill: "#333333"
      });
      this.happy = new PIXI.Text(this.profiled.happiness + '% happy', {
        font: "20px Verdana",
        fill: "#333333"
      });
      this.rides = new PIXI.Text(this.profiled.rides + ' underground rides', {
        font: "20px Verdana",
        fill: "#333333"
      });
      this.currentStatus = new PIXI.Text(this.profiled.whatAmIDoing(), {
        font: "20px Verdana",
        fill: "#333333"
      });

      this.money = new PIXI.Text(this.profiled.money + '$', {
        font: "20px Verdana",
        fill: "#333333"
      });


      if (this.profiled.workHours.length) {
        this.workHours = new PIXI.Text('Working hours: ' + this.profiled.workHours[0] + ' - ' + this.profiled.workHours[7] + 'h.', {
          font: "20px Verdana",
          fill: "#333333"
        });
      } else if (this.profiled.properties) {
        this.properties = new PIXI.Text('Properties: ' + this.profiled.properties.length, {
          font: "20px Verdana",
          fill: "#333333"
        });
      }

      this.drawProfile();
      // setTimeout(this.destroy.bind(this), 3000);
    },
    drawProfile: function() {
      if (this.picture) {
        this.picture.x = this.x + 40;
        this.picture.y = this.y - 40;
        this.picture.viewType = 'text';
        // this.picture.setTexture(this.profiled.textures.big);
        this.stage.addVisualEntity(this.picture);
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
      if (this.pictureBuilding) {
        this.pictureBuilding.x = this.x + 40;
        this.pictureBuilding.y = this.y;
        this.pictureBuilding.viewType = 'text';
        // this.picture.setTexture(this.profiled.textures.big);
        this.stage.addVisualEntity(this.pictureBuilding);
      }
      if (this.name) {
        this.name.x = this.x + 150;
        this.name.y = this.y + 30;
        this.name.viewType = 'text';
        this.stage.addVisualEntity(this.name);
      }

      if (this.happy) {
        this.happy.x = this.x + 450;
        this.happy.y = this.y + 40;
        this.happy.viewType = 'text';
        this.stage.addVisualEntity(this.happy);
      }

      if (this.workHours) {
        this.workHours.x = this.x + 650;
        this.workHours.y = this.y + 60;
        this.workHours.viewType = 'text';
        this.stage.addVisualEntity(this.workHours);
      } else if (this.properties) {
        this.properties.x = this.x + 650;
        this.properties.y = this.y + 60;
        this.properties.viewType = 'text';
        this.stage.addVisualEntity(this.properties);

      }

      if (this.money) {
        this.money.x = this.x + 650;
        this.money.y = this.y + 75;
        this.money.viewType = 'text';
        this.stage.addVisualEntity(this.money);
      }

      if (this.currentStatus) {
        this.currentStatus.x = this.x + 650;
        this.currentStatus.y = this.y + 40;
        this.currentStatus.viewType = 'text';
        this.stage.addVisualEntity(this.currentStatus);
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
        if (this.profiled.unselect) this.profiled.unselect();
        if (this.currentStatus) this.stage.pixiStage.removeChild(this.currentStatus);
        if (this.workHours) this.stage.pixiStage.removeChild(this.workHours);
        if (this.happy) this.stage.pixiStage.removeChild(this.happy);
        if (this.name) this.stage.pixiStage.removeChild(this.name);
        if (this.picture) this.stage.pixiStage.removeChild(this.picture);
        if (this.pictureBuilding) this.stage.pixiStage.removeChild(this.pictureBuilding);
        if (this.background) this.stage.pixiStage.removeChild(this.background);
        if (this.properties) this.stage.pixiStage.removeChild(this.properties);
        if (this.money) this.stage.pixiStage.removeChild(this.money);

        if (this.closeButton) this.stage.pixiStage.removeChild(this.closeButton);
        if (this.centerButton) this.stage.pixiStage.removeChild(this.centerButton);
        if (this.moles) {
          for (var i in this.moles) {
            this.stage.pixiStage.removeChild(this.moles[i].view);
          }
        }
      } catch (err) {

      }
    }
  };
  window.moletube.models.Profile = profile;
})();