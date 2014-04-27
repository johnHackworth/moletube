window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var tile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.origX = options.x;
    this.origY = options.y;
    this.type = options.type;
    this.init();
  }
  tile.prototype = {
    height: 25,
    width: 25,
    init: function() {
      var x = this.origX;
      var y = this.origY;
      var w = this.width;
      var h = this.height;
      this.view = new PIXI.Graphics();
      this.drawView();

      this.view.hitArea = new PIXI.Polygon(x,y,x+w,y+h/2,x,y+h,x-w,y+h/2);

        // x - w, y, w * 2, h);
      this.view.setInteractive(true);

      this.view.click = this.mouseclick.bind(this);
    },
    drawView: function() {
      var self = this;
      var x = this.origX;
      var y = this.origY;
      var w = this.width;
      var h = this.height;
      this.view.clear();
      this.view.beginFill(this.getBackgroundColor());
      this.view.lineStyle(1, this.getBorderColor(), 1);

      this.view.moveTo(x, y);
      this.view.lineTo(x + w, y + h/2);
      this.view.lineTo(x, y + h);
      this.view.lineTo(x - w, y + h/2);
      this.view.lineTo(x , y);
      this.view.endFill();
    },
    tick: function(counter) {

    },
    getBackgroundColor: function() {
      if(this.hoverColor) {
        return this.hoverColor;
      }
      if(this.type == 'r') {
        return 0x999999;
      } else if(this.type == 'c') {
        return 0x99FF99;
      } else if(this.type == 'h') {
        return 0xFFCCCC;
      }
      return 0x559999;
    },
    getBorderColor: function() {
      return 0xAAAAAA ;
    },
    mouseclick: function() {
      this.trigger('click');
    }

  }
  window.moletube.models.Tile = tile;
})()
