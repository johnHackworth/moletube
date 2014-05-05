window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var tile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.origX = options.x;
    this.origY = options.y;
    this.type = options.type;
    this.stage = options.stage;
    this.init();
  }
  tile.prototype = {
    height: 25,
    width: 50,
    init: function() {
      this.origX = this.origX - Math.floor(this.width / 2);
      this.origY = this.origY - Math.floor(this.height * 0/ 1);
      var x = this.origX;
      var y = this.origY;
      var w = this.width;
      var h = this.height;
      this.view = new PIXI.Graphics();
      // this.drawView();
      thisen.view = PIXI.Sprite.fromImage('assets/tile.png');
      this.view.viewType = 'tile';

      this.view.position.x = this.origX - Math.floor(2 * this.width);
      this.view.position.y = this.origY - Math.floor(3 * this.height);
      this.view.setInteractive(true);
      this.view.tint = (this.getBackgroundColor());
      this.view.click = this.mouseclick.bind(this);
    },
    drawView: function() {
      var self = this;
      // var x = this.origX;
      // var y = this.origY;
      // var w = this.width;
      // var h = this.height;
      // this.view.clear();
      // this.view.beginFill(this.getBackgroundColor());
      // // this.view.lineStyle(1, this.getBorderColor(), 1);

      // this.view.moveTo(x, y);
      // this.view.lineTo(x + w, y + h/2);
      // this.view.lineTo(x, y + h);
      // this.view.lineTo(x - w, y + h/2);
      // this.view.lineTo(x , y);
      // this.view.endFill();
    },
    tick: function(counter) {
      // this.view.x = this.stage.viewport.getX(this.origX);
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
    },
    tick: function(counter) {
      this.view.x = this.stage.viewport.getX(this.origX);
      this.view.y = this.stage.viewport.getY(this.origY);
    },
  }
  window.moletube.models.Tile = tile;
})()
