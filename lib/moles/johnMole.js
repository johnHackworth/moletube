window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var mole = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    pixEngine.utils.extend.call(this, window.moletube.models.BasicMole);
    this.options = options;
    this.stage = options.stage;
    this.init();
  };
  mole.prototype = {
    likesFun: 25,
    rides: 0,
    moleNames: [
      'John', 'Peter', 'Walter', 'Jessie', 'Vincent', 'Michael', 'Gerard', 'Thomas', 'Richard'
    ],
    moleSurnames: [
      'Mole', 'Talpidae', 'Topo', 'Muldvarp', 'Topillo', 'Muld'
    ],
    happiness: 50,
    assets: [{
      standing: 'assets/mole1.png',
      big: 'assets/mole1big.png',
      moving: [
        'assets/mole1_2.png',
        'assets/mole1_1.png'
      ],
      movingBack: [
        'assets/mole1_2b.png',
        'assets/mole1_1b.png'
      ]
    }, {
      standing: 'assets/mole2.png',
      big: 'assets/mole2big.png',
      moving: [
        'assets/mole2_2.png',
        'assets/mole2_1.png'
      ],
      movingBack: [
        'assets/mole2_2b.png',
        'assets/mole2_1b.png'
      ]
    }, {
      standing: 'assets/mole3.png',
      big: 'assets/mole3big.png',
      moving: [
        'assets/mole3_2.png',
        'assets/mole3_1.png'
      ],
      movingBack: [
        'assets/mole3_2b.png',
        'assets/mole3_1b.png'
      ]
    }, {
      standing: 'assets/mole4.png',
      big: 'assets/mole4big.png',
      moving: [
        'assets/mole4_2.png',
        'assets/mole4_1.png'
      ],
      movingBack: [
        'assets/mole4_2b.png',
        'assets/mole4_1b.png'
      ]
    }, {
      standing: 'assets/mole5.png',
      big: 'assets/mole5.png',
      moving: [
        'assets/mole5_2.png',
        'assets/mole5_1.png'
      ],
      movingBack: [
        'assets/mole5_2b.png',
        'assets/mole5_1b.png'
      ]
    }, {
      standing: 'assets/mole6.png',
      big: 'assets/mole6.png',
      moving: [
        'assets/mole6_2.png',
        'assets/mole6_1.png'
      ],
      movingBack: [
        'assets/mole6_2b.png',
        'assets/mole6_1b.png'
      ]
    }, {
      standing: 'assets/mole7.png',
      big: 'assets/mole7.png',
      moving: [
        'assets/mole7_2.png',
        'assets/mole7_1.png'
      ],
      movingBack: [
        'assets/mole7_2b.png',
        'assets/mole7_1b.png'
      ]
    }, {
      standing: 'assets/mole8.png',
      big: 'assets/mole8.png',
      moving: [
        'assets/mole8_2.png',
        'assets/mole8_1.png'
      ],
      movingBack: [
        'assets/mole8_2b.png',
        'assets/mole8_1b.png'
      ]
    }],
    workHours: [],
    init: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      // debugger;
      this.textures = {
        standing: new PIXI.Texture.fromImage(this.imageView.standing),
        moving: [],
        movingBack: []
      };
      this.textures.standing.height = 100;
      for (var i in this.imageView.moving) {
        this.textures.moving.push(new PIXI.Texture.fromImage(this.imageView.moving[i]));
      }
      for (i in this.imageView.movingBack) {
        this.textures.movingBack.push(new PIXI.Texture.fromImage(this.imageView.movingBack[i]));

      }
      this.view = PIXI.Sprite.fromFrame(this.imageView.standing);
      // this.view.scale.set(0.5, 0.5  );
      this.view.viewType = 'mole';
      this.view.height = 25;
      this.view.width = 10;
      this.pos = {
        x: 0,
        y: 0
      };
      this.path = [];
      this.name = this.options.name || this.getName();
      this.setBlock(this.options.home);
      this.at(this.options.block.getCenter());
      this.home = this.options.home;
      this.city = this.options.city;
      this.workPlace = this.options.work;
      this.speed = 1 + Math.floor(Math.random() * 5) * 0.1;
      this.view.setInteractive(true);
      this.view.click = this.mouseclick.bind(this);
      this.city.on('hourChange', this.changeHour.bind(this));
      var randomInitHour = 6 + Math.floor(Math.random() * 12);
      var initWork = randomInitHour % 24;
      this.workHours = [];
      for (var j = 0; j < 8; j++) {
        this.workHours.push((initWork + j) % 24);
      }

    },
    getName: function() {
      var name = this.moleNames[Math.floor(Math.random() * this.moleNames.length)];
      var surname = this.moleSurnames[Math.floor(Math.random() * this.moleSurnames.length)];
      var letters = "ABCDEFHIJKLMNOPQRSTUVWXYZ";
      var letter = letters[Math.floor(Math.random() * letters.length)];
      return name + ' ' + letter + '. ' + surname;
    },
    updatePath: function() {
      if (this.path.length > 0) {
        if (!this.destinationBlock) {
          this.destinationBlock = this.path[0];
          this.path.splice(0, 1);
          if (this.destinationBlock == 'metro') {
            this.takeMetro();
          }
        }
      }
    },
    takeMetro: function() {
      this.rides++;
      if (this.currentBlock.building && this.currentBlock.building.metroRide) {
        this.currentBlock.building.metroRide(this);
        this.destinationBlock = this.path[0];
        this.at(this.destinationBlock.getPathCenter(this.isGoingUp(), this.isGoingRight()));
        this.path.splice(0, 1);
      }
    },
    getFinalDestination: function() {
      if (this.path) {
        return this.path[this.path.length - 1];
      }
    },
    changeHour: function(hour) {
      var destination = this.whereShouldIBe(hour);
      if (destination === this.getFinalDestination()) {
        return;
      }

      if (destination === this.workPlace && this.currentBlock != this.workplace) {
        this.createPathTo(destination);
        this.freeTime = 0;
        this.delayCall(this.thinkOnWork, 2000);
      } else if (this.isAtHome()) {
        if (Math.random() * 100 < this.likesFun) {
          this.freeTime = 2000;
          var recreationDestination = this.getRecreationPlace();
          this.createPathTo(recreationDestination);
          this.delayCall(this.thinkOnFun, 2000);
        }
      } else if (!this.freeTime) {
        this.createPathTo(this.home);
        this.delayCall(this.thinkOnHome, 2000);
      } else {
        this.freeTime--;
      }
    },
    getRecreationPlace: function() {
      return this.city.getRandomRecreation();
    },
    whereShouldIBe: function(hour) {
      if (this.workHours.indexOf(hour) >= 0) {
        return this.workPlace;
      } else {
        return this.home;
      }
    },
    createPathTo: function(target) {
      var path = this.city.pathBetweenBlocks(this.currentBlock, target);
      var metroPath = this.city.getMetroPath(this.currentBlock, target);
      if (!metroPath || path.length < metroPath.length) {
        this.setPath(path);
      } else {
        this.setPath(metroPath);
      }
    },
    addHappiness: function(happiness) {
      this.happiness += happiness;
      if (this.happiness > 100) {
        this.happiness = 100;
      } else if (this.happiness < 1) {
        this.happiness = 1;
      }
    },
    whatAmIDoing: function() {
      if (this.isAtWork()) {
        return 'at work';
      } else if (this.isAtHome()) {
        return 'at home';
      } else if (this.path && this.path.length > 0 && this.path[this.path.length - 1] == this.workPlace) {
        return 'going to work';
      } else if (this.path && this.path.length > 0 && this.path[this.path.length - 1] == this.home) {
        return 'going home';
      } else {
        return 'free time';
      }
    },
    isAtWork: function() {
      return this.currentBlock == this.workPlace;
    },
    isAtHome: function() {
      console.log(this.currentBlock.blockNumber.x, this.currentBlock.blockNumber.y, this.home.blockNumber.x, this.home.blockNumber.y);
      return this.currentBlock == this.home;
    },
    updateHappiness: function() {
      var tempHappy = -1;
      if (this.isAtHome()) {
        tempHappy = 1;
      }
      if (this.isAtWork()) {
        tempHappy = 0;
      }
      this.addHappiness(tempHappy);
    },
    onTick: function(counter) {
      if (counter % 60 === 0) {
        this.updateHappiness();
      }
    },
    delayCall: function(call, maxDelay) {
      var delay = 2000 + Math.floor(Math.random() * maxDelay);
      setTimeout(call.bind(this), delay);
    }
  };

  window.moletube.models.JohnMole = mole;
})();