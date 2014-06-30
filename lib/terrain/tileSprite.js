window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var tile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.options = options;
    this.origX = options.x;
    this.origY = options.y;
    this.origYFixed = this.origY;
    this.type = options.type;
    this.stage = options.stage;
    this.city = this.stage.city;
    this.block = options.block;
    this.init();
  };
  tile.prototype = {
    baseTint: 0xFFFFFF,
    height: 50,
    width: 100,
    counter: 0,
    lowBlocks: [
      '0000',
      '0000-0110',
      '0000-0011',
      '0000-1001',
      '0001',
      '0010',
      '0011',
      '1111'
    ],
    init: function() {
      this.drawView();
      this.openSea = this.isOpenSea();
    },
    drawView: function() {
      var self = this;
      var x = this.origX;
      var y = this.origY;
      var w = this.width;
      var h = this.height;
      this.borderingTiles = {};
      this.getBorderingTiles();
      this.view = PIXI.Sprite.fromImage(this.getSprite());
      // this.origY = this.origY + (2 * h - this.view.height);
      this.view.viewType = 'tile';

      this.origX = this.origX - this.width / 2;

      this.view.position.x = this.origX;
      this.view.position.y = this.origY;

      this.view.setInteractive(true);


      this.view.mouseover = this.resalt.bind(this);
      this.view.mouseout = this.unresalt.bind(this);
      this.view.click = this.clickOnTile.bind(this);
      // this.view.setInteractive(true);
    },
    refreshSprite: function() {
      var texture = new PIXI.Texture.fromImage(this.getSprite());
      console.log(this.getSprite());
      this.view.setTexture(texture);
      // this.origY -= 7;
    },
    getBorderingTiles: function() {
      var cityMap = this.city.getCityMap();
      var x = this.block.blockNumber.x;
      var y = this.block.blockNumber.y;
      var borders = {
        nw: cityMap[y - 1] ? cityMap[y - 1][x - 1] : undefined,
        n: cityMap[y - 1] ? cityMap[y - 1][x] : undefined,
        ne: cityMap[y - 1] ? cityMap[y - 1][x + 1] : undefined,
        w: cityMap[y] ? cityMap[y][x - 1] : undefined,
        e: cityMap[y] ? cityMap[y][x + 1] : undefined,
        sw: cityMap[y + 1] ? cityMap[y + 1][x - 1] : undefined,
        s: cityMap[y + 1] ? cityMap[y + 1][x] : undefined,
        se: cityMap[y + 1] ? cityMap[y + 1][x + 1] : undefined
      };
      this.borderingTiles = borders;
      return borders;
    },
    getSprite: function() {
      if (this.type === 'r') {
        return this.getRoadSprite();
      } else if (this.type === 'b') {
        return 'assets/tiles/grass.png';
      } else if (this.type === 's') {
        return this.getBeachSprite();
      } else if (this.type === 'w') {
        return 'assets/tiles/factoryFloor.png'
      }
      return 'assets/tiles/grass.png';
    },
    getRoadSprite: function() {
      var sprCode = [0, 0, 0, 0];
      if (this.borderingTiles.n == 'r') {
        sprCode[1] = "1";
      }
      if (this.borderingTiles.e == 'r') {
        sprCode[2] = "1";
      }
      if (this.borderingTiles.s == 'r') {
        sprCode[3] = "1";
      }
      if (this.borderingTiles.w == 'r') {
        sprCode[0] = "1";
      }

      return 'assets/tiles/road' + sprCode.join('') + '.png';
    },
    getBeachSprite: function() {
      var sprCode = [0, 0, 0, 0];
      if (this.borderingTiles.n != 's' && this.borderingTiles.n != undefined) {
        sprCode[1] = "1";
      }
      if (this.borderingTiles.e != 's' && this.borderingTiles.e != undefined) {
        sprCode[2] = "1";
      }
      if (this.borderingTiles.s != 's' && this.borderingTiles.s != undefined) {
        sprCode[3] = "1";
      }
      if (this.borderingTiles.w != 's' && this.borderingTiles.w != undefined) {
        sprCode[0] = "1";
      }

      var code = sprCode.join('');

      if (code === "0000") {
        if (this.borderingTiles.sw != 's' && this.borderingTiles.sw != undefined) {
          code += '-1001';
        } else if (this.borderingTiles.nw != 's' && this.borderingTiles.nw != undefined) {
          code += '-1100';
        } else if (this.borderingTiles.ne != 's' && this.borderingTiles.ne != undefined) {
          code += '-0110';
        } else if (this.borderingTiles.se != 's' && this.borderingTiles.se != undefined) {
          code += '-0011';
        }
      }

      if (this.lowBlocks.indexOf(code) >= 0) {
        this.origY += 7;
        this.origYFixed += 7;
      }
      return 'assets/tiles/beach' + code + '.png';
    },
    isOpenSea: function() {
      if (this.borderingTiles.sw != 's' && this.borderingTiles.sw != undefined) {
        return false;
      } else if (this.borderingTiles.nw != 's' && this.borderingTiles.nw != undefined) {
        return false;
      } else if (this.borderingTiles.ne != 's' && this.borderingTiles.ne != undefined) {
        return false;
      } else if (this.borderingTiles.se != 's' && this.borderingTiles.se != undefined) {
        return false;
      }
      return true;
    },
    getBackgroundColor: function() {
      if (this.hoverColor) {
        return this.hoverColor;
      }
      if (this.type == 'r') {
        return 0x999999;
      } else if (this.type == 'c') {
        return 0x99FF99;
      } else if (this.type == 'h') {
        return 0xFFCCCC;
      }
      return 0x559999;
    },
    getBorderColor: function() {
      return 0xAAAAAA;
    },
    mouseclick: function() {
      this.trigger('click');
    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.origX);
      this.view.y = this.stage.viewport.getY(this.origY);
      if (this.viewSquare) {
        this.viewSquare.x = this.stage.viewport.getGraphicsX();
        this.viewSquare.y = this.stage.viewport.getGraphicsY();
      }
      if (this.projectDemo) {
        this.projectDemo.x = this.stage.viewport.getX(this.origX);
        this.projectDemo.y = this.stage.viewport.getY(this.origY) - this.projectDemo.height + this.height;
      }
      if (this.type === 's') {
        this.seaWaves();
      } else {
        this.tinted--;
        if (!this.tinted) {
          this.view.tint = this.baseTint;
        }
      }
      this.stage.viewport.hideIfNotInViewPort(this.view);
    },
    seaWaves: function() {
      if (this.openSea && !this.tinted && Math.random() < 0.001) {
        this.tinted = 50;
        var tints = [0xFFFFFF, 0xFEFEFE, 0xEEFFFF, 0xEEFFEE, 0xEFEFEF];
        this.view.tint = tints[Math.floor(Math.random() * tints.length)];
      }
      if (this.openSea && Math.random() > 0.98) {
        var hVariation = 1 - Math.floor(Math.random() * 3);
        this.origY = this.origYFixed + hVariation;
      } else if (this.openSea && Math.random() > 0.98) {
        var rVariation = 1 - Math.floor(Math.random() * 3);
        this.view.rotation = rVariation / 80;
      }
    },
    resalt: function() {
      if (this.stage.resaltTiles) {
        this.drawBorder();
        this.stage.addVisualEntity(this.viewSquare);
        if (this.stage.city.selectedProject) {
          this.showProjectDemo();
        }

      }
    },
    showProjectDemo: function() {
      this.projectDemo = new PIXI.Sprite.fromImage(this.stage.city.selectedProject.imageUrl);
      this.projectDemo.x = this.x;
      this.projectDemo.y = this.y - this.projectDemo.height + this.height;
      this.projectDemo.tint = 0x999999;
      this.projectDemo.alpha = 0.5;
      if (!this.allowsBuilding()) {
        this.projectDemo.tint = 0xFF4444;
      }
      this.stage.addVisualEntity(this.projectDemo);
    },
    allowsBuilding: function() {
      // temporal, improve it;
      if (this.type === 'c' && !this.block.building) {
        return true;
      }
    },
    unresalt: function() {
      if (this.viewSquare) {
        this.stage.removeView(this.viewSquare);
        delete this.viewSquare;
        if (this.projectDemo) {
          this.removeProjectDemo();
        }
      }
    },
    removeProjectDemo: function() {
      this.stage.removeView(this.projectDemo);
      delete this.projectDemo;
    },
    clickOnTile: function() {
      if (this.allowsBuilding() && this.stage.city.selectedProject) {
        this.stage.city.constructSelectedProject(this.block);
        this.unresalt();
      } else if (this.allowsBuilding() && this.stage.city.selectedAction) {
        this.stage.city.doSelectedAction(this.block, this.stage.city.selectedAction);
        this.unresalt();
      } else {
        this.trigger('click');
      }
    },
    drawBorder: function() {
      var self = this;

      var w = this.width / 2;
      var h = this.height;
      var x = this.origX + w;
      var y = this.origY;

      this.viewSquare = new PIXI.Graphics();
      this.viewSquare.clear();

      this.viewSquare.lineStyle(2, 0xFF0000, 1);
      this.viewSquare.lineCap = 'round';
      this.viewSquare.moveTo(x, y);
      this.viewSquare.lineTo(x + w, y + h / 2);
      this.viewSquare.lineTo(x, y + h);
      this.viewSquare.lineTo(x - w, y + h / 2);
      this.viewSquare.lineTo(x, y);
    },
  };
  window.moletube.models.Tile = tile;
})();