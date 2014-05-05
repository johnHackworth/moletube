window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var mole = function (options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.options = options;
    this.stage = options.stage;
    this.init();
  }
  mole.prototype = {
    rides: 0,
    moleNames: [
      'John', 'Peter', 'Walter', 'Jessie', 'Vincent', 'Michael', 'Gerard', 'Thomas', 'Richard'
    ],
    moleSurnames: [
      'Mole', 'Talpidae', 'Topo', 'Muldvarp', 'Topillo', 'Muld'
    ],
    height: window.moletube.config.tileWidth,
    width: window.moletube.config.tileWidth,
    happiness: 50,
    speed: 1,
    currentBlock: null,
    counter: 0,
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
    },{
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
    },{
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
    },{
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
    }
    ],
    workHours: {

    },
    init: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      // debugger;
      this.textures = {
        standing: new PIXI.Texture.fromImage(this.imageView.standing),
        moving: [],
        movingBack: []
      }
      for(var i in this.imageView.moving) {
        this.textures.moving.push(new PIXI.Texture.fromImage(this.imageView.moving[i]))
      }
      for(var i in this.imageView.movingBack) {
        this.textures.movingBack.push(new PIXI.Texture.fromImage(this.imageView.movingBack[i]))
      }
      this.view = PIXI.Sprite.fromFrame(this.imageView.standing);
      // this.view.scale.set(0.5, 0.5  );
      this.view.viewType = 'mole';
      this.pos = {x:0, y:0};
      this.path = [];
      this.name = this.options.name || this.getName();
      this.setBlock(this.options.home)
      this.at(this.options.block.getCenter());
      this.home = this.options.home;
      this.city = this.options.city;
      this.workPlace = this.options.work;
      this.speed = 2 + Math.floor(Math.random()*5) * 0.1;
      this.view.setInteractive(true);
      this.view.click = this.mouseclick.bind(this);
      this.city.on('hourChange', this.changeHour.bind(this));
      var randomInitHour = 6 + Math.floor(Math.random() * 12);
      this.workHours = this.options.workHours || {
        init: randomInitHour % 24,
        end: (randomInitHour + 9 ) % 24
      }

    },
    getName: function() {
      var name = this.moleNames[Math.floor(Math.random() * this.moleNames.length)]
      var surname = this.moleSurnames[Math.floor(Math.random() * this.moleSurnames.length)]
      var letters = "ABCDEFHIJKLMNOPQRSTUVWXYZ";
      var letter = letters[Math.floor(Math.random() * letters.length)];
      return name + ' ' + letter + '. ' + surname;
    },
    at: function(point) {
      this.pos = point;
      this.drawPos();
    },
    drawPos: function() {
      this.view.position.x = this.stage.viewport.getX(this.pos.x);
      this.view.position.y = this.stage.viewport.getY(this.pos.y - this.view.height);
    },
    setPath: function(path) {
      this.path = path;
    },
    setBlock: function(block) {
      var oldY = 0;
      if(this.currentBlock) {
        oldY = this.currentBlock.blockNumber.y;
        this.currentBlock.removeMole(this.name);
      }
      this.currentBlock = block;
      this.currentBlock.addMole(this);
      if(block.blockNumber.y != oldY) {
        this.trigger('moleChange');

      }
      this.redrawMole();
    },
    setDestination: function(point) {
      this.destination = point;
    },
    setDestinationBlock: function(block) {
      this.destinationBlock = block;
    },
    tick: function(counter) {
      this.counter++;
      this.updatePosition();
      this.animate();
      if(counter % 60 === 0) {
        this.updateHappiness();
      }
      if(counter % 4 === 0) {
        this.movingForward = this.isMovingForward();
      }
    },
    animate: function() {
      var step = Math.floor(this.counter / 2) % 2;
      if(this.isMoving) {
        this.view.alpha = 1;
        if(this.movingForward) {
          this.view.setTexture(this.textures.moving[step]);
        } else {
          this.view.setTexture(this.textures.movingBack[step]);
        }
      } else {
        this.view.setTexture(this.textures.standing);
      }
      if(this.currentBlock.type != 'r') {
        this.view.alpha = 0;
      } else {
        this.view.alpha = 1;
      }
    },
    isMovingForward: function() {
      if(this.destination && this.pos.y < this.destination.y) {
        return true;
      } else {
        return false;
      }
    },
    updatePosition: function() {
      this.isMoving = this.destination != null;
      var pos = this.view.position;
      this.updateDestinationBlock();
      this.updateDestination();
      this.updatePath();
    },
    updateDestination: function() {
      var pos = this.pos;
      if(this.destination && (pos.x != this.destination.x || pos.y != this.destination.y)) {
        var diffX = Math.floor(pos.x - this.destination.x);
        if(diffX != 0) {
          var directionX = diffX / Math.abs(diffX);
          pos.x -= directionX * this.speed;
        }
        var diffY = Math.floor(pos.y - this.destination.y);
        if(diffY != 0) {
          var directionY = diffY / Math.abs(diffY);
          pos.y -= directionY * this.speed / 2;
        }
        this.drawPos();
      }
      if(
        this.destination &&
        Math.abs(this.destination.x - pos.x) < 3 &&
        Math.abs(this.destination.y - pos.y) < 3
      ) {
        this.destination = null;
        this.destinationBlock = null;
      }
    },
    updateDestinationBlock: function() {
      if(this.destinationBlock && this.destinationBlock.getCenter) {
        this.destination = this.destinationBlock.getCenter();
        if(this.currentBlock != this.destinationBlock) {
          if(
            this.getDistanceTo(this.currentBlock.getCenter()) >
            this.getDistanceTo(this.destinationBlock.getCenter())
          ) {
            this.setBlock(this.destinationBlock);
          }
        }
      }
    },
    getDistanceTo: function(point) {
      var pos = this.pos;
      var xDist = Math.abs(point.x - pos.x);
      var yDist = Math.abs(point.y - pos.y);
      return Math.sqrt(xDist * xDist + yDist * yDist);
    },
    updatePath: function() {
      if(this.path.length > 0) {
        if(!this.destinationBlock) {
          this.destinationBlock = this.path[0];
          this.path.splice(0,1);
          if(this.destinationBlock == 'metro') {
            this.takeMetro();
          }
        }
      }
    },
    takeMetro: function() {
      this.rides++;
      if(this.currentBlock.building && this.currentBlock.building.metroRide) {
        this.currentBlock.building.metroRide(this);
        this.destinationBlock = this.path[0];
        this.at(this.destinationBlock.getCenter());
        this.path.splice(0,1);
      }
    },
    changeHour: function(hour) {
      var destination = this.whereShouldIBe(hour);
      if(destination && destination != this.destinationBlock) {
        this.createPathTo(destination);
      }
    },
    whereShouldIBe: function(hour) {
      if(hour == this.workHours.init) {
        return this.workPlace;
      }
      if(hour == this.workHours.end) {
        return this.home;
      }
    },
    createPathTo: function(target) {
      var path = this.city.pathBetweenBlocks(this.currentBlock, target);
      var metroPath = this.city.getMetroPath(this.currentBlock, target);
      if(!metroPath || path.length < metroPath.length) {
        this.setPath(path);
      } else {
        this.setPath(metroPath);
      }
    },
    mouseclick: function() {
      this.trigger('click', this);
    },
    addHappiness: function(happiness) {
      this.happiness += happiness;
      if(this.happiness > 100) {
        this.happiness = 100;
      } else if(this.happiness < 1) {
        this.happiness = 1;
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
      if(this.isAtHome()) {
        tempHappy = 1;
      }
      if(this.isAtWork()) {
        tempHappy = 0;
      }
      this.addHappiness(tempHappy);
    },
    redrawMole: function() {
      if(this.city) {
        var stage = this.stage;
        stage.removeView(this.view);
        stage.addViewAfter(this.view, this.currentBlock.tile.view);
      }
    }
  }

  window.moletube.models.JohnMole = mole;
})()
