window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var tile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.origX = options.x;
    this.origY = options.y;
    this.type = options.type;
    this.stage = options.stage;
    this.city = this.stage.city;
    this.block = options.block;
    this.init();
  };
  tile.prototype = {
    altitude: 0,
    height: window.moletube.config.tileWidth,
    width: window.moletube.config.tileWidth,
    init: function() {
      var x = this.origX;
      var y = this.origY;
      var w = this.width;
      var h = this.height;
      this.borderingTiles = {};
      this.getBorderingTiles();
      this.view = new PIXI.Graphics();
      this.view.viewType = 'tile';
      this.drawView();
      this.view.hitArea = new PIXI.Polygon(x, y, x + w, y + h / 2, x, y + h, x - w, y + h / 2);

      // this.view.setInteractive(true);

      // this.view.click = this.mouseclick.bind(this);
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
    drawView: function() {
      var self = this;
      var x = this.origX;
      var y = this.origY;
      var w = this.width;
      var h = this.height;
      this.view.clear();
      var background = this.getBackgroundColor();
      if (background) {
        this.view.beginFill(background);
      }
      this.view.lineStyle(1, this.getBorderColor(), 1);
      this.view.lineCap = 'round';
      this.view.moveTo(x, y);
      this.view.lineTo(x + w, y + h / 2);
      this.view.lineTo(x, y + h);
      this.view.lineTo(x - w, y + h / 2);
      this.view.lineTo(x, y);
      if (background) {
        this.view.endFill();
      }
      this.drawLines();
    },
    drawLines: function() {
      if (this.type === 'r') {
        this.drawRoadLines();
      }
    },
    drawRoadLines: function() {
      var self = this;
      var x = this.origX;
      var y = this.origY;
      var w = this.width;
      var h = this.height;
      this.view.lineStyle(10, 0xCCCCCC, 1);
      if (this.borderingTiles.n != 'r') {
        this.view.moveTo(x - 4, y - 2);
        this.view.lineTo(x + w + 4, y + 2 + h / 2);
      }
      if (this.borderingTiles.w != 'r') {
        this.view.moveTo(x + 4 + 5, y - 2);
        this.view.lineTo(x - 4 + 5 - w, y + 2 + h / 2);
      }
      if (this.borderingTiles.e != 'r') {
        this.view.moveTo(x + w + 4, y - 5 - 2 + h / 2);
        this.view.lineTo(x - 4, y - 5 + 2 + h);
      }
      if (this.borderingTiles.s != 'r') {
        this.view.moveTo(x + 4 + 5, y - 5 + 2 + h);
        this.view.lineTo(x + 5 - 4 - w, y - 5 - 2 + h / 2);
      }

    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getGraphicsX();
      this.view.y = this.stage.viewport.getGraphicsY() + 10 * this.altitude;
    },
    getBackgroundColor: function() {
      if (this.hoverColor) {
        return this.hoverColor;
      }
      if (this.type == 'r') {
        return '0xAAAAAA';
      } else if (this.type == 'c') {
        return 0x559955;
      } else if (this.type == 'h') {
        return '';
      } else if (this.type == 's') {
        return 0x0066AA;
      } else if (this.type == 'b') {
        return 0xFFFF88;
      }
      return '';
    },
    getBorderColor: function() {
      return this.getBackgroundColor() - 2000;
    },
    mouseclick: function() {
      this.trigger('click');
      this.stage.viewport.panTo(this.origX, this.origY, 25);
    }

  };
  window.moletube.models.Tile = tile;
})();