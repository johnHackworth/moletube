window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var station = function (options) {
    this.x = options.x;
    this.y = options.y;
    this.block = options.block;
    this.lines = [];
    this.init();
  }
  station.prototype = {
    assets: [
      'assets/metroStation.png',
    ],
    travellers: 0,
    init: function() {
      var imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      this.view = PIXI.Sprite.fromFrame(imageView);
      this.view.scale.set(0.5, 0.5);
      // this.view.rotation = 0.35;
      this.type = 'metroStation';
      this.view.viewType = 'building'
      this.view.position.x = this.x;
      this.view.position.y = this.y;
      this.view.setInteractive(true);
      this.view.click = this.mouseclick.bind(this);
    },
    tick: function(counter) {

    },
    setUnderground: function() {

    },
    setOverground: function() {
      this.unassignToLine();
    },
    mouseclick: function() {
      var city = this.block.getCity();
      if(city.selectedLine) {
        this.assignToLine(city.selectedLine);
        city.selectStation(this);
      }
    },
    assignToLine: function(linebutton) {
      var city = this.block.getCity();
      this.view.tint =  linebutton.color;
    },
    unassignToLine: function() {
      this.view.tint =  0xFFFFFF;
    },
    metroRide: function(mole) {

      var city = this.block.getCity();
      this.travellers++;
      city.budget += 5;
    }
  }

  window.moletube.models.Station = station;
})()
