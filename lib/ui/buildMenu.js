window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var menu = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.city = options.stage.city;
    this.stage = options.stage;
    this.init();
  };
  menu.prototype = {
    height: moletube.config.height,
    width: 100,
    x: moletube.config.width - 100,
    y: 0,
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
    getActions: function() {
      var actionRoad = {
        image: 'assets/tiles/road0110.png',
        name: 'road'
      };
      var actionUpperHouse = {
        image: 'assets/richHouse1.png',
        name: 'upperClassHouse'
      };
      var actionWorkerHouse = {
        image: 'assets/block.png',
        name: 'workerClassHouse'
      };
      var vinylFactory = {
        image: 'assets/factory1.png',
        name: 'vinylFactory'
      };
      var vinylShop = {
        image: 'assets/recordStore.png',
        name: 'vinylShop'
      };
      return [actionRoad, actionUpperHouse, actionWorkerHouse, vinylFactory, vinylShop];
    },
    drawMenu: function() {
      var actions = this.getActions();
      for (var i in actions) {
        var action = new PIXI.Sprite.fromImage(actions[i].image);
        action.imageUrl = actions[i].image;
        action.data = actions[i];
        this.currentOptions.push(action);
        action.setInteractive(true);
        action.click = this.clickAction.bind(this, action);
        action.x = this.x + 10;
        action.y = 10 + i * 60;
        // action.view.scale.set(0.4, 0.4);
        action.viewType = 'text';

        action.mouseover = this.overaction.bind(this, action);
        action.mouseout = this.outaction.bind(this, action);

        this.stage.addVisualEntity(action);
      }
    },
    clickAction: function(action) {
      if (this.city.selectedAction) {
        this.city.selectedAction.tint = 0xFFFFFF;
      }
      this.city.selectedAction = action;
      action.tint = 0xFF0000;
    },
    overaction: function(action) {
      if (action !== this.city.selectedAction) {
        action.tint = (0xFFFF00);
      }
    },
    outaction: function(action) {
      if (action !== this.city.selectedAction) {
        action.tint = (0xFFFFFF);
      }
    },
    mouseclick: function() {
      this.destroy();
      this.trigger('clicked');
    },
    tick: function(counter) {},
    destroy: function() {
      try {
        this.city.selectedAction = null;
        if (this.background) this.stage.pixiStage.removeChild(this.background);
        if (this.closeButton) this.stage.pixiStage.removeChild(this.closeButton);
        for (var i in this.currentOptions) {
          this.stage.pixiStage.removeChild(this.currentOptions[i]);
        }
        this.stage.resaltTiles = false;
      } catch (err) {

      }
    }
  };
  window.moletube.models.BuildMenu = menu;
})();