window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var line = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stations = options.stations || [];
    this.lineData = options.lineData;
    this.stage = options.stage;
    this.init();
  }
  line.prototype = {
    height: 25,
    width: 25,
    init: function() {
      var x = this.origX;
      var y = this.origY;
      var w = this.width;
      var h = this.height;
      this.view = new PIXI.Graphics();
      this.drawView();
      this.stage.addEntity(this);
    },
    drawView: function() {
      var self = this;
      var x = this.origX;
      var y = this.origY;
      var w = this.width;
      var h = this.height;
      this.view.clear();
      console.log(this.lineData.color);
      if(this.stations.length <= 0) {
        return;
      }this.view.lineStyle(15, this.lineData.color, 1);
      this.view.moveTo(this.stations[0].block.isoX, this.stations[0].block.isoY + 10)
      for(var i = 1, l = this.stations.length; i < l; i++) {
        this.view.lineTo(this.stations[i].block.isoX, this.stations[i].block.isoY + 10);
      }
      for(var i in this.stations) {
        this.view.lineStyle(15, 0xFFFFFF, 1);
        this.view.drawEllipse(this.stations[i].block.isoX + 5, this.stations[i].block.isoY + 10, 15, 8);
      }
    },
    tick: function(counter) {

    },
    hideLines: function() {
      this.view.alpha = 0;
    },
    showLines: function() {
      this.view.alpha = 1;
    }
  }
  window.moletube.models.Line = line;
})()
