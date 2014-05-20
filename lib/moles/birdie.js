window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var bird = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.options = options;
    this.stage = options.stage;
    this.init();
  };
  bird.prototype = {
    rides: 0,
    height: window.moletube.config.tileWidth,
    width: window.moletube.config.tileWidth,
    speed: 1,
    destination: null,
    currentBlock: null,
    counter: 0,
    assets: [{
      standing: 'assets/birdie.png',
      moving: [
        'assets/birdie1.png',
        'assets/birdie2.png'
      ],
    }, {
      standing: 'assets/birdie-2.png',
      moving: [
        'assets/birdie1-2.png',
        'assets/birdie2-2.png'
      ],
    }, {
      standing: 'assets/birdie-3.png',
      moving: [
        'assets/birdie1-3.png',
        'assets/birdie2-3.png'
      ],
    }],
    workHours: {

    },
    init: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      // debugger;
      this.textures = {
        standing: new PIXI.Texture.fromImage(this.imageView.standing),
        moving: []
      };
      this.textures.standing.height = 30;
      for (var i in this.imageView.moving) {
        this.textures.moving.push(new PIXI.Texture.fromImage(this.imageView.moving[i]));
      }
      this.view = PIXI.Sprite.fromFrame(this.imageView.standing);
      // this.view.scale.set(0.5, 0.5  );
      this.view.viewType = 'bird';
      this.view.height = 10;
      this.view.width = 10;
      this.pos = {
        x: 0,
        y: 0
      };
      this.setBlock(this.options.block);
      this.at(this.options.block.getCenter());
      this.city = this.options.city;
      this.speed = 3 + Math.floor(Math.random() * 5) * 0.1;
    },
    at: function(point) {
      this.pos = point;
      this.drawPos();
    },
    setBlock: function(block) {
      var oldY = 0;
      if (this.currentBlock) {
        oldY = this.currentBlock.blockNumber.y;
        this.currentBlock.removeBird(this.name);
      }
      this.currentBlock = block;
      this.currentBlock.addBird(this);
      this.redrawBird();
    },
    drawPos: function() {
      this.view.position.x = this.stage.viewport.getX(this.pos.x - this.view.width / 2);
      this.view.position.y = this.stage.viewport.getY(this.pos.y - this.view.height);
      if (this.currentBlock.building) {
        this.view.position.y -= this.currentBlock.building.view.height + this.height;
      }
      this.stage.viewport.hideIfNotInViewPort(this.view);
    },
    tick: function(counter) {
      this.isMoving = (this.destination !== null);
      this.counter++;
      this.animate();
      if (this.isMoving) {
        this.updateDestination();
      } else {
        this.seaMovement();
        this.jump();
        this.drawPos();
      }
    },
    jump: function() {
      if (Math.random() > 0.99) {
        this.destination = {
          x: this.currentBlock.getCenter().x + -15 + Math.floor(Math.random() * 31),
          y: this.currentBlock.getCenter().y + -15 + Math.floor(Math.random() * 31)
        };
        this.destinationBlock = this.currentBlock;

      } else if (Math.random() > 0.9999 || this.areMoles()) {
        var block = this.chooseRandomBlock();
        this.destination = block.getCenter();
        this.destinationBlock = block;
        this.currentBlock.removeBird(this);
      }
    },
    seaMovement: function() {
      if (this.currentBlock.type === 's' && this.counter % 5 === 0) {
        var y = this.view.position.y;
        this.pos.y += -1 + Math.floor(Math.random() * 3);
      }
    },
    updateDestination: function() {
      var pos = this.pos;
      if (this.destination && (pos.x != this.destination.x || pos.y != this.destination.y)) {
        var diffX = Math.floor(pos.x - this.destination.x);
        if (diffX !== 0) {
          var directionX = diffX / Math.abs(diffX);
          pos.x -= directionX * this.speed;
        }
        var diffY = Math.floor(pos.y - this.destination.y);
        if (diffY !== 0) {
          var directionY = diffY / Math.abs(diffY);
          pos.y -= directionY * this.speed / 2;
        }
        this.drawPos();
      }
      if (
        this.destination &&
        this.destinationBlock &&
        Math.abs(this.destination.x - pos.x) < 3 &&
        Math.abs(this.destination.y - pos.y) < 3
      ) {
        this.currentBlock = this.destinationBlock;
        this.destination = null;
        this.destinationBlock = null;
        this.currentBlock.addBird(this);
      }
    },
    animate: function() {
      var step = Math.floor(this.counter / 5) % 2;
      if (this.isMoving) {
        this.view.alpha = 1;
        this.view.setTexture(this.textures.moving[step]);
      } else {
        this.view.setTexture(this.textures.standing);
      }
    },
    redrawBird: function() {
      if (this.city) {
        var stage = this.stage;
        stage.removeView(this.view);
        stage.addViewAfter(this.view, this.currentBlock.tile.view);
      }
    },
    areMoles: function() {
      if (this.currentBlock && this.currentBlock.moles.length > 0) {
        return true;
      }
      return false;
    },
    chooseRandomBlock: function() {
      var block = null;
      for (var i in this.city.blocks) {
        if (this.city.blocks[i].birds.length > 0) {
          if (Math.random() > 0.90) {
            block = this.city.blocks[i];
          }
        }
      }
      if (!block) {
        var n = Math.floor(Math.random() * this.city.blocks.length);
        block = this.city.blocks[n];
      }
      return block;
    }
  };

  window.moletube.models.Bird = bird;
})();