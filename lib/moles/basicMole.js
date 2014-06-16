window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var mole = function(options) {};
  mole.prototype = {
    money: 5000,
    visibleTileTypes: ['r', 'c', 'b'],
    height: window.moletube.config.tileWidth,
    width: window.moletube.config.tileWidth,
    overheadSize: 20,
    speed: 1,
    currentBlock: null,
    counter: 0,
    profileType: 'mole',
    initMole: function() {
      this.imageView = this.assets[Math.floor(Math.random() * this.assets.length)];
      // debugger;
      this.textures = {
        standing: new PIXI.Texture.fromImage(this.imageView.standing),
        moving: [],
        movingBack: []
      };
      for (var i in this.imageView.moving) {
        this.textures.moving.push(new PIXI.Texture.fromImage(this.imageView.moving[i]));
      }
      for (i in this.imageView.movingBack) {
        this.textures.movingBack.push(new PIXI.Texture.fromImage(this.imageView.movingBack[i]));

      }
      this.view = PIXI.Sprite.fromFrame(this.imageView.standing);
      this.view.height = 12;
      this.view.width = 6;
      this.pos = {
        x: 0,
        y: 0
      };
      this.path = [];
      if (this.options.block) {
        this.setBlock(this.options.block);
      }
      this.at(this.options.block.getCenter());
      this.city = this.options.city;
      this.speed = 1 + Math.floor(Math.random() * 5) * 0.1;
    },
    at: function(point) {
      this.pos = point;
    },
    makeVisible: function() {
      this.view.visible = true;
      if (this.overheadView) {
        this.overheadView.visible = true;
      }
    },
    makeInvisible: function() {
      this.view.visible = false;
      if (this.overheadView) {
        this.overheadView.visible = false;
      }
    },
    drawPos: function() {
      this.view.position.x = this.stage.viewport.getX(this.pos.x - this.view.width / 2);
      this.view.position.y = this.stage.viewport.getY(this.pos.y - this.view.height);
      if (this.overheadView) {
        this.overheadView.position.x = this.stage.viewport.getX(this.pos.x - this.overheadView.width / 2);
        this.overheadView.position.y = this.stage.viewport.getY(this.pos.y - this.view.height - 20);

        if (this.thinkingTime) {
          this.thinkingTime--;
          if (!this.thinkingTime) {
            this.removeOverHead();
          }
        }
      }
      this.stage.viewport.hideIfNotInViewPort(this.view);
    },
    setPath: function(path) {
      this.path = path;
    },
    setBlock: function(block) {
      var oldY = 0;
      if (this.currentBlock) {
        oldY = this.currentBlock.blockNumber.y;
        this.currentBlock.removeMole(this.name);
      }
      this.currentBlock = block;
      this.currentBlock.addMole(this);
      if (block.blockNumber.y != oldY) {
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
      if (counter % 5 === 0) {
        this.movingForward = this.isMovingForward();
      }
      this.walkAround();
      if (this.onTick) {
        this.onTick();
      }
      this.drawPos();
    },
    walkAround: function() {
      if (this.currentBlock && this.path.length === 0 && Math.random() > 0.99) {
        this.destination = {
          x: this.currentBlock.getCenter().x + -10 + Math.floor(Math.random() * 21),
          y: this.currentBlock.getCenter().y + -10 + Math.floor(Math.random() * 21)
        };
      }
    },
    animate: function() {
      var step = Math.floor(this.counter / 4) % 2;
      if (this.isMoving) {
        this.makeVisible();
        if (this.movingForward) {
          this.view.setTexture(this.textures.moving[step]);
        } else {
          this.view.setTexture(this.textures.movingBack[step]);
        }
      } else {
        this.view.setTexture(this.textures.standing);
      }
      if (!this.currentBlock || this.visibleTileTypes.indexOf(this.currentBlock.type) < 0) {
        this.makeInvisible();
      } else {
        this.makeVisible();
      }
    },
    addOverheadView: function(sprite, w, h) {
      this.removeOverHead();
      this.overheadView = PIXI.Sprite.fromImage(sprite);
      this.overheadView.width = w || this.overheadSize * 0.8;
      this.overheadView.height = h || this.overheadSize;
      this.stage.addVisualEntity(this.overheadView);
    },
    select: function() {
      this.addOverheadView('assets/yellowFlag.png', 10, 16);
    },
    unselect: function() {
      this.removeOverHead();
    },
    removeOverHead: function() {
      if (this.overheadView) {
        this.stage.removeView(this.overheadView);
        delete this.overheadView;
      }
    },
    thinkOnWork: function() {
      this.addOverheadView('assets/thoughts/work.png');
      this.thinkingTime = 80;
    },
    thinkOnFun: function() {
      this.addOverheadView('assets/thoughts/fun.png');
      this.thinkingTime = 80;
    },
    thinkOnHome: function() {
      this.addOverheadView('assets/thoughts/home.png');
      this.thinkingTime = 80;
    },


    isMovingForward: function() {
      if (this.destination && this.pos.y < this.destination.y) {
        return true;
      } else {
        return false;
      }
    },
    updatePosition: function() {
      this.isMoving = (this.destination !== null);
      this.updateDestinationBlock();
      this.updateDestination();
      this.updatePath();
    },
    updateDestination: function() {
      var pos = this.pos;
      if (this.destination && (pos.x != this.destination.x || pos.y != this.destination.y)) {
        var diffX = Math.floor(pos.x - this.destination.x);
        if (diffX !== 0) {
          var directionX = diffX / Math.abs(diffX);
          pos.x -= Math.floor(10 * directionX * this.speed) / 10;
        }
        var diffY = Math.floor(pos.y - this.destination.y);
        if (diffY !== 0) {
          var directionY = diffY / Math.abs(diffY);
          pos.y -= Math.floor(10 * directionY * this.speed / 2) / 10;
        }
      }
      if (
        this.destination &&
        Math.floor(Math.abs(this.destination.x - pos.x)) < 20 &&
        Math.floor(Math.abs(this.destination.y - pos.y)) < 10
      ) {
        this.destination = null;
        this.destinationBlock = null;
      }
    },
    isGoingUp: function() {
      return (this.destination && this.pos.y <
        this.destination.y);
    },
    isGoingRight: function() {
      return (this.destination && this.pos.x < this.destination.x);
    },
    updateDestinationBlock: function() {
      if (!this.currentBlock) {
        return null;
      }
      if (this.destinationBlock && this.destinationBlock.getCenter) {
        if (this.path.length > 0) {
          this.destination = this.destinationBlock.getPathCenter(this.isGoingUp(), this.isGoingRight());
        } else {
          this.destination = this.destinationBlock.getCenter();
        }
        if (this.currentBlock != this.destinationBlock) {
          if (
            this.getDistanceTo(this.currentBlock.getPathCenter(this.isGoingUp(), this.isGoingRight())) >
            this.getDistanceTo(this.destinationBlock.getPathCenter(this.isGoingUp(), this.isGoingRight()))
          ) {
            this.setBlock(this.destinationBlock);
          }
        }
      }
    },
    getDistanceTo: function(point) {
      var pos = this.pos;
      var xDist = Math.abs(point.x - pos.x);
      var yDist = Math.abs(point.y - pos.y) / 2;
      return Math.sqrt(xDist * xDist + yDist * yDist);
    },
    updatePath: function() {
      if (this.path.length > 0) {
        if (!this.destinationBlock) {
          this.destinationBlock = this.path[0];
          this.path.splice(0, 1);
        }
      }
    },
    createPathTo: function(trg) {
      var self = this;
      setTimeout(function() {
        var target = trg;
        var path = self.city.pathBetweenBlocks(self.currentBlock, target);
        self.setPath(path);
      }, Math.floor(Math.random() * 500));
    },
    mouseclick: function() {
      this.trigger('click', this);
    },
    redrawMole: function() {
      if (this.city) {
        var prevBlock = this.currentBlock.getPreviousBlockView();
        if (prevBlock) {
          var stage = this.stage;
          stage.removeView(this.view);
          stage.addViewAfter(this.view, prevBlock.view);
        }
      }
    },
    centerView: function() {
      this.stage.viewport.panTo(this.pos.x, this.pos.y, 20);
    },
    setHome: function(block) {
      this.home = block;
      block.addInhabittant(this);
    },
    setWork: function(block) {
      this.workPlace = block;
      block.addWorker(this);

    }
  };

  window.moletube.models.BasicMole = mole;
})();