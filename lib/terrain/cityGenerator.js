window.moletube = window.moletube || {};
window.moletube.tools = window.moletube.tools || {};

(function() {
  var cityGenerator = function(options) {
    this.cityMap = [];
    this.size = options.size;
    this.init();
  }
  cityGenerator.prototype = {
    init: function() {
      for(var y = 0; y < this.size; y++) {
        this.cityMap.push([])
        for(var x = 0; x < this.size; x++) {
          this.cityMap[y].push('c');
        }
      }
    },
    generateStreets: function() {
      for(var x = 0; x < this.size; x++) {
        this.cityMap[0][x] = 'r';
        this.cityMap[this.size - 1][x] = 'r';
      }
      for(var y = 0; y < this.size; y++) {
        this.cityMap[y][0] = 'r';
        this.cityMap[y][this.size - 1] = 'r';
      }
      var lastXstreet = 0;
      for(var x = 0; x < this.size; x++) {
        if(x - lastXstreet > 1) {
          if(Math.random() > 0.5) {
            for(var y = 0; y < this.size; y++) {
              this.cityMap[y][x] = 'r';
            }
            lastXstreet = x;
          }
        }
      }
      var lastYstreet = 0;
      for(var y = 0; y < this.size; y++) {
        if(y - lastYstreet > 3) {
          if(Math.random() > 0.8) {
            for(var x = 0; x < this.size; x++) {
              this.cityMap[y][x] = 'r';
            }
            lastYstreet = y;
          }
        }
      }

    },
    generateZones: function() {
      for(var y = 0; y < this.size; y++) {
        for(var x = 0; x < this.size; x++) {
          if(this.cityMap[y][x] === 'c') {
            this.cityMap[y][x] = this.getRandomType(x,y);
          }
        }
      }
    },
    getRandomType: function(x,y) {
      var types = ['c', 'h', 'h', 'h', 'h', 'w'];
      for(var i = - 1; i <= 1; i++) {
        for(var j = -1; j <= 1; j++) {
          if(this.cityMap[x + i]) {
            if(this.cityMap[x + i][y + j] &&
              this.cityMap[x + i][y + j] != 'r' &&
              this.cityMap[x + i][y + j] != 'c') {
              types.push(this.cityMap[x + i][y + j]);
            }
          }
        }
      };
      return types[Math.floor(Math.random() * types.length)];
    },
    getCity: function() {
      return this.cityMap;
    }

  }
  window.moletube.tools.CityGenerator = cityGenerator;
})()
