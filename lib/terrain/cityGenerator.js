window.moletube = window.moletube || {};
window.moletube.tools = window.moletube.tools || {};

(function() {
  var cityGenerator = function(options) {
    this.cityMap = [];
    this.size = options.size;
    this.cityLimit = Math.ceil(options.size * 0.15)
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
      for(var x = this.cityLimit; x < this.size - this.cityLimit; x++) {
        this.cityMap[this.cityLimit][x] = 'r';
        this.cityMap[this.size - 1 - this.cityLimit][x] = 'r';
      }
      for(var y = this.cityLimit; y < this.size - this.cityLimit; y++) {
        this.cityMap[y][this.cityLimit] = 'r';
        this.cityMap[y][this.size - this.cityLimit - 1] = 'r';
      }
      var lastXstreet = 0;
      for(var x = 0; x < this.size; x++) {
        if(x - lastXstreet > 2) {
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
        if(y - lastYstreet > 1) {
          if(Math.random() > 0.7) {
            for(var x = 0; x < this.size; x++) {
              this.cityMap[y][x] = 'r';
            }
            lastYstreet = y;
          }
        }
      }

    },
    generateZones: function() {
      for(var y = this.cityLimit; y < this.size - this.cityLimit; y++) {
        for(var x = this.cityLimit; x < this.size - this.cityLimit; x++) {
          if(this.cityMap[y][x] === 'c') {
            this.cityMap[y][x] = this.getRandomType(x,y);
          }
        }
      }
    },
    generateSquares: function() {
      for(var y = 0; y < this.size; y++) {
        for(var x = 0; x < this.size; x++) {
          if(this.cityMap[y][x] === 'r' &&
            this.cityMap[y-1] &&
            this.cityMap[y-1][x] === 'r' &&
            this.cityMap[y+1] &&
            this.cityMap[y+1][x] === 'r' &&
            this.cityMap[y][x-1] === 'r' &&
            this.cityMap[y][x+1] === 'r' &&
            Math.random() > 0.90
         ) {
            this.cityMap[y-1][x-1] = 'r';
            this.cityMap[y-1][x+1] = 'r';
            this.cityMap[y+1][x-1] = 'r';
            this.cityMap[y+1][x+1] = 'r';
            this.cityMap[y][x] = 'p';
          }
        }
      }
    },
    getRandomType: function(x,y) {
      var types = ['c','c','c', 'h', 'h', 'h', 'h', 'w'];
      for(var i = - 1; i <= 1; i++) {
        for(var j = -1; j <= 1; j++) {
          if(this.cityMap[x + i]) {
            if(this.cityMap[x + i][y + j] &&
              this.cityMap[x + i][y + j] != 'r' &&
              this.cityMap[x + i][y + j] != 'c') {
              types.push(this.cityMap[x + i][y + j]);
              types.push(this.cityMap[x + i][y + j]);
              types.push(this.cityMap[x + i][y + j]);
              types.push(this.cityMap[x + i][y + j]);
              types.push(this.cityMap[x + i][y + j]);
              types.push(this.cityMap[x + i][y + j]);
            }
          }
        }
      };
      return types[Math.floor(Math.random() * types.length)];
    },
    generateCoast: function() {
      var coasts = [];
      var coastWidth = Math.floor(Math.random() * 5) + this.cityLimit;
      for(var y = 0; y < coastWidth; y++) {
        for(var x = 0; x < this.size; x++) {
          this.cityMap[y][x] = 's';
          coasts[x] = true;
        }
      }

      for(y = coastWidth; y < this.size; y++) {
        for(x = 0; x < this.size; x++) {
          if(coasts[x]) {
            if(Math.random() > 0.60) {
              this.cityMap[y][x] = 's';
            } else {
              if(Math.random() > 0.60) {
                this.cityMap[y][x] = 'b';
              }
              coasts[x] = false;
            }
          }
        }
      }


    },
    generateStadium: function() {
      var x = 4 + Math.floor(Math.random() * (this.size - 8))
      var y = 4 + Math.floor(Math.random() * (this.size - 8))
      this.cityMap[y][x] = 'Stadium';
      this.reserveAround(x,y,3);
      this.roadAround(x,y,3);
    },
    reserveAround: function(x,y, size) {
      for(var i = 0; i< size; i++) {
        for(var j = 0; j< size; j++) {
          if(!(i == 0 && j == 0)) {
            this.cityMap[y - i][x - j] = 'reserved4';
          }
        }
      }

    },
    roadAround: function(x,y,size) {
      for(var i = 0; i < size+2; i++) {
        this.cityMap[y - size][x - size + i] = 'r';
        this.cityMap[y + 1][x - size + i] = 'r';
      }
      for(var i = 0; i < size+2; i++) {
        this.cityMap[y - size + i][x - size] = 'r';
        this.cityMap[y - size + i][x + 1] = 'r';
      }
    },
    getCity: function() {
      return this.cityMap;
    },
    generateCity: function() {
      this.generateStreets()
      this.generateZones();
      this.generateSquares();
      this.generateCoast();
      this.generateStadium();
    }

  }
  window.moletube.tools.CityGenerator = cityGenerator;
})()
