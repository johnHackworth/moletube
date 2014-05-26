window.moletube = window.moletube || {};
window.moletube.tools = window.moletube.tools || {};

(function() {
  var cityGenerator = function(options) {
    this.cityMap = [];
    this.size = options.size;
    this.cityLimit = Math.ceil(options.size * 0.45);
    this.seaLimit = Math.ceil(options.size * 0.10);
    this.init();
  };
  cityGenerator.prototype = {
    init: function() {
      for (var y = 0; y < this.size; y++) {
        this.cityMap.push([]);
        for (var x = 0; x < this.size; x++) {
          this.cityMap[y].push('c');
        }
      }
    },
    generateStreets: function() {
      // for (var x = this.cityLimit; x < this.size - this.cityLimit; x++) {
      //   this.cityMap[this.cityLimit][x] = 'r';
      //   this.cityMap[this.size - 1 - this.cityLimit][x] = 'r';
      // }
      // for (var y = this.cityLimit; y < this.size - this.cityLimit; y++) {
      //   this.cityMap[y][this.cityLimit] = 'r';
      //   this.cityMap[y][this.size - this.cityLimit - 1] = 'r';
      // }
      var lastXstreet = 0;
      var turnChance = 0.05;
      for (x = this.cityLimit; x < this.size - this.cityLimit; x++) {
        turnChance = 0.05;
        if (x - lastXstreet > 3) {
          if (Math.random() > 0.5) {
            var streetX = x;
            var baseCorrection = 3;
            for (y = 0; y < this.size; y++) {
              if (this.cityMap[y][streetX] != 's') {
                this.cityMap[y][streetX] = 'r';

                if (Math.random() <= turnChance) {
                  turnChance = turnChance * 1.25;
                  var correction = -1 + Math.floor(Math.random() * baseCorrection);
                  if (this.cityMap[y][streetX]) {
                    streetX += correction;
                    if (this.cityMap[y][streetX] != 's') {
                      this.cityMap[y][streetX] = 'r';
                    }
                  }
                }
              }
            }
            lastXstreet = x;
          }
        }
      }
      var lastYstreet = 0;
      for (y = 0; y < this.size; y++) {
        turnChance = 0.05;
        if (y - lastYstreet > 3) {
          if (Math.random() > 0.7) {
            var streetY = y;
            var baseCorrectionY = 3;
            for (x = 0; x < this.size; x++) {
              if (this.cityMap[streetY][x] != 's') {
                this.cityMap[streetY][x] = 'r';

                if (Math.random() <= turnChance) {
                  turnChance = turnChance * 1.25;
                  var correctionY = -1 + Math.floor(Math.random() * baseCorrectionY);
                  if (this.cityMap[streetY + correctionY]) {
                    streetY += correctionY;
                    if (this.cityMap[streetY][x] != 's') {
                      this.cityMap[streetY][x] = 'r';
                    }
                  }
                }
              }
            }
            lastYstreet = y;
          }
        }
      }

    },
    generateZones: function() {
      for (var y = this.cityLimit; y < this.size - this.cityLimit; y++) {
        for (var x = this.cityLimit; x < this.size - this.cityLimit; x++) {
          if (this.cityMap[y][x] === 'c') {
            this.cityMap[y][x] = this.getRandomType(x, y);
          }
        }
      }
    },
    generateSquares: function() {
      for (var y = this.cityLimit; y < this.size - this.cityLimit; y++) {
        for (var x = 0; x < this.size; x++) {
          if (this.cityMap[y][x] === 'r' &&
            this.cityMap[y - 1] &&
            this.cityMap[y - 1][x] === 'r' &&
            this.cityMap[y + 1] &&
            this.cityMap[y + 1][x] === 'r' &&
            this.cityMap[y][x - 1] === 'r' &&
            this.cityMap[y][x + 1] === 'r' &&
            Math.random() > 0.90
          ) {
            this.cityMap[y - 1][x - 1] = 'r';
            this.cityMap[y - 1][x + 1] = 'r';
            this.cityMap[y + 1][x - 1] = 'r';
            this.cityMap[y + 1][x + 1] = 'r';
            this.cityMap[y][x] = 'p';
          }
        }
      }
    },
    getRandomType: function(x, y) {
      var types = [];
      for (var i = 0; i < 20; i++) {
        types.push('c');
      }
      for (i = 0; i < 20; i++) {
        types.push('h');
      }
      for (i = 0; i < 8; i++) {
        types.push('w');
      }
      for (i = 0; i < 1; i++) {
        types.push('f');
      }
      // c = country
      // h = housing
      // r = road
      // w = work
      // f = fun

      for (i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (this.cityMap[x + i]) {
            if (this.cityMap[x + i][y + j] &&
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
      }
      return types[Math.floor(Math.random() * types.length)];
    },
    generateCoast: function() {
      var coasts = [];
      var coastWidth = Math.floor(Math.random() * 5) + this.seaLimit;
      var x, y;
      for (y = 0; y < coastWidth; y++) {
        for (x = 0; x < this.size; x++) {
          this.cityMap[y][x] = 's';
          coasts[x] = true;
        }
      }
      var seaProb = 0.50;
      for (x = 0; x < this.size; x++) {
        var xLane = x;
        y = coastWidth;
        while (coasts[x]) {
          if (Math.random() < seaProb && this.cityMap[y] && this.cityMap[y][xLane]) {
            this.cityMap[y][xLane] = 's';
            if (Math.random() < 0.35) {
              if (seaProb < 0.70) {
                seaProb += 0.03;
              }

              var correction = -1 + Math.floor(Math.random() * 3);
              if (this.cityMap[y][xLane + correction]) {
                xLane += correction;
                this.cityMap[y][xLane] = 's';
              }
            }
            y++;
          } else {
            coasts[x] = false;
          }
        }
      }

    },
    generateStadium: function() {
      var x = 4 + Math.floor(Math.random() * (this.size - 8));
      var y = 4 + Math.floor(Math.random() * (this.size - 8));
      this.cityMap[y][x] = 'Stadium';
      this.reserveAround(x, y, 3);
      this.roadAround(x, y, 3);
    },
    reserveAround: function(x, y, size) {
      for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
          if (!(i === 0 && j === 0)) {
            this.cityMap[y - i][x - j] = 'reserved4';
          }
        }
      }
    },
    generateFarm: function() {
      var where = Math.floor(Math.random() * 3);
      var x, y;
      if (where === 0) {
        x = 2 + Math.floor(Math.random() * 2);
        y = 4 + Math.floor(Math.random() * (this.size - 4));
      } else if (where === 1) {
        x = 4 + Math.floor(Math.random() * (this.size - 8));
        y = this.size - (1 + Math.floor(Math.random() * 2));
      } else if (where === 2) {
        x = this.size - (2 + Math.floor(Math.random() * 2));
        y = 4 + Math.floor(Math.random() * (this.size - 8));
      }
      this.cityMap[y][x] = 'Farm';
      this.reserveAround(x, y, 4);
    },
    roadAround: function(x, y, size) {
      for (var i = 0; i < size + 2; i++) {
        this.cityMap[y - size][x - size + i] = 'r';
        this.cityMap[y + 1][x - size + i] = 'r';
      }
      for (i = 0; i < size + 2; i++) {
        this.cityMap[y - size + i][x - size] = 'r';
        this.cityMap[y - size + i][x + 1] = 'r';
      }
    },
    getCity: function() {
      return this.cityMap;
    },
    generateCity: function() {

      this.generateStreets();

      this.generateZones();
      this.generateCoast();
      this.generateSquares();

      this.generateStadium();
      this.generateFarm();
      this.generateFarm();

      this.emptyIsles();
      // console.log(this.detectIsles());
    },
    detectIsles: function() {
      this.isleMap = [];
      var x, y;
      for (y = 0; y < this.size; y++) {
        this.isleMap.push([]);
        for (x = 0; x < this.size; x++) {
          this.isleMap[y][x] = 'isle';
        }
      }

      for (y = this.size - 1; y >= 0; y--) {
        for (x = this.size - 1; x >= 0; x--) {
          if (this.cityMap[y][x] === 's') {
            this.isleMap[y][x] = 's';
          } else if (!this.isleMap[y + 1]) {
            this.isleMap[y][x] = 'no';
          } else {
            if (this.isleMap[y + 1][x] !== undefined &&
              this.isleMap[y + 1][x] === 'no') {
              this.isleMap[y][x] = 'no';
            }
            if (this.isleMap[y][x + 1] !== undefined && this.isleMap[y][x + 1] === 'no') {
              this.isleMap[y][x] = 'no';
            }
          }
        }
      }
      return this.isleMap;
    },
    emptyIsles: function() {
      var isles = this.detectIsles();
      for (var y = 0; y < isles.length; y++) {
        var isleY = isles[y];
        for (var x = 0; x < isleY.length; x++) {
          isIsle = isles[y][x];
          if (isIsle === 'isle') {
            this.cityMap[y][x] = 'b';
          }
        }
      }
    }

  };
  window.moletube.tools.CityGenerator = cityGenerator;
})();