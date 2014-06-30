window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var basicKaiju = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  };
  basicKaiju.prototype = {
    destination: null,
    currentBlock: null,
    counter: 0,
    init: function() {
      this.path = [];
      pixEngine.utils.extend.call(this, window.moletube.models.BasicMole, true);
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      // debugger;
      this.textures = {
        standing: new PIXI.Texture.fromImage(this.imageView.standing),
        moving: []
      };
      this.textures.standing.height = this.height;
      for (var i in this.imageView.moving) {
        this.textures.moving.push(new PIXI.Texture.fromImage(this.imageView.moving[i]));
      }
      this.view = PIXI.Sprite.fromFrame(this.imageView.standing);
      // this.view.scale.set(0.5, 0.5  );
      this.view.viewType = 'mole';
      this.view.height = this.height;
      this.view.width = this.width;
      this.pos = {
        x: 0,
        y: 0
      };
      // this.city = this.stage.city;
      this.setBlock(this.options.block);
      this.at(this.options.block.getCenter());
      this.city = this.options.city;
      this.speed = this.baseSpeed;
    },
    at: function(point) {
      this.pos = point;
      this.drawPos();
    },
    setBlock: function(block) {
      var oldY = 0;
      if (this.currentBlock) {
        oldY = this.currentBlock.blockNumber.y;
        this.currentBlock.removebasicKaiju(this.name);
      }
      this.currentBlock = block;
      this.currentBlock.addBird(this);
      this.redrawBird();
    },
    drawPos: function() {
      this.view.position.x = this.stage.viewport.getX(this.pos.x - this.view.width / 2);
      this.view.position.y = this.stage.viewport.getY(this.pos.y - this.view.height / 2);
      this.stage.viewport.hideIfNotInViewPort(this.view);
    },
    tick: function(counter) {
      this.isMoving = (this.destination !== null);
      this.counter++;
      this.animate();
      if (this.isMoving) {
        this.updateDestination();
      } else if (this.isDestroying) {
        this.destroyBuildings();
        this.drawPos();
      } else {
        this.jump();
        this.drawPos();
      }
    },
    destroyBuildings: function() {
      if (this.currentBlock.building && this.currentBlock.building.getDamage) {
        this.currentBlock.building.getDamage(1);
        if (this.currentBlock.building.destroyed) {
          this.isDestroying = false;
        }
      } else {
        this.isDestroying = false;
      }
    },
    jump: function() {
      if (Math.random() > 0.90) {
        var block = this.chooseRandomBlock();
        this.createPathTo(block);
        this.setDestination(block);
        this.currentBlock.removeBird(this);
      }
    },
    setDestination: function(block) {
      this.destination = block.getCenter();
      this.destinationBlock = block;
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
        this.isDestroying = true;
      }
    },
    animate: function() {
      var step;
      if (this.isMoving) {
        step = Math.floor(this.counter / 8) % 2;
        this.alphaGoal = 1;
        this.view.setTexture(this.textures.moving[step]);
      } else if (this.isDestroying) {
        step = Math.floor(this.counter / 2) % 2;
        this.alphaGoal = 1;
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
        if (this.city.blocks[i].building) {
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

  window.moletube.models.BasicKaiju = basicKaiju;
})();