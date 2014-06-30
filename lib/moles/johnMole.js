window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var mole = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    pixEngine.utils.extend.call(this, pixEngine.utils.Loggable, true, 30);
    pixEngine.utils.extend.call(this, window.moletube.models.BasicMole, true, options);
    this.options = options;
    this.stage = options.stage;
    this.init();
  };
  mole.prototype = {
    likesFun: 25,
    rides: 0,
    wage: 0,
    rent: 0,
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
      this.workHours = [];
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
      this.setBlock(this.options.block);
      this.at(this.currentBlock.getCenter());
      this.city = this.options.city;
      this.speed = 1 + Math.floor(Math.random() * 5) * 0.1;
      this.view.setInteractive(true);
      this.view.click = this.mouseclick.bind(this);
      this.city.on('hourChange', this.changeHour.bind(this));
    },
    getName: function() {
      var name = this.moleNames[Math.floor(Math.random() * this.moleNames.length)];
      var surname = this.moleSurnames[Math.floor(Math.random() * this.moleSurnames.length)];
      var letters = "ABCDEFHIJKLMNOPQRSTUVWXYZ";
      var letter = letters[Math.floor(Math.random() * letters.length)];
      return name + ' ' + letter + '. ' + surname;
    },
    updatePath: function() {
      if (this.path && this.path.length > 0) {
        if (!this.destinationBlock) {
          this.destinationBlock = this.path[0];
          this.path.splice(0, 1);
        }
      }
    },
    getFinalDestination: function() {
      if (this.path) {
        return this.path[this.path.length - 1];
      }
    },
    changeHour: function(hour) {
      this.checkDestination(hour);
      if (hour === 0) {
        this.payRent(hour);
      }
      if (this.isAtWork()) {
        this.earnMoney();
      }
    },
    payRent: function() {
      if (this.home) {
        this.log('Payed ' + this.rent + ' as home rent', 'normal');
        this.money -= this.rent;
      }
    },
    checkDestination: function(hour) {
      var destination = this.whereShouldIBe(hour);
      if (destination === this.getFinalDestination()) {
        return;
      }

      if (destination === this.workPlace && this.currentBlock != this.workplace) {
        this.createPathTo(destination);
        this.freeTime = 0;
        this.delayCall(this.thinkOnWork, 2000);
      } else if (this.isAtHome() || Math.random() > 0.5) {
        if (Math.random() * 100 < this.likesFun) {
          this.freeTime = 3;
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
      return this.city.getRandomOpenRecreation();
    },
    whereShouldIBe: function(hour) {
      if (this.workHours.indexOf(hour) >= 0) {
        if (this.workPlace) {
          return this.workPlace;
        } else {
          this.city.getRandomLocation();
        }
      } else {
        return this.home;
      }
    },
    createPathTo: function(target) {
      var path = this.city.getPath(this.currentBlock, target);
      this.setPath(path);
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
    onTick: function() {
      if (this.counter % 60 === 0) {
        this.updateHappiness();
      }
      if (!this.home && this.counter % 200 === 0 && Math.random() > 0.75) {
        this.getAHome();
      }
      if (!this.workPlace && this.counter % 200 === 0 && Math.random() > 0.75) {
        this.getAJob();
      }
    },

    earnMoney: function() {
      if (this.workPlace && this.workPlace.owner) {
        this.workPlace.payWages(this, this.wage);
      }
    },

    delayCall: function(call, maxDelay) {
      var delay = 2000 + Math.floor(Math.random() * maxDelay);
      setTimeout(call.bind(this), delay);
    },
    getAHome: function() {
      var home = this.city.houses.getFreeWorkerHouse();
      if (home) {
        this.log('Got a new home');
        this.setHome(home);
        this.rent = home.building.rent;
      }
    },
    getAJob: function() {
      var job = this.city.factories.getFreeJobPosition();
      if (job) {
        this.log('Got a new job at ' + job.name);
        this.setWork(job);
        this.workHours = [];
        var initWork = job.building.getInitWork();
        for (var j = 0; j < 8; j++) {
          this.workHours.push((initWork + j) % 24);
        }
        this.wage = job.building.hourlyWage;
      }
    },
    buyProduct: function(productName) {
      this.log('bought a ' + productName);
      this.happiness += 3;
    }
  };

  window.moletube.models.JohnMole = mole;
})();