window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var cityBlock = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.isoX = options.x;
    this.isoY = options.y;
    this.type = options.type;
    this.stage = options.stage;
    this.city = this.stage.city;
    this.blockNumber = options.blockNumber;
    this.tile = null;
    this.building = null;
    this.moles = [];
    this.birds = [];
    this.init();
  };
  cityBlock.prototype = {
    height: window.moletube.config.tileWidth,
    width: window.moletube.config.tileWidth,
    STATION_COST: 200,
    recreationTypes: ['Cinema', 'Bar'],
    init: function() {
      this.tile = new moletube.models.Tile({
        x: this.isoX,
        y: this.isoY,
        type: this.type,
        stage: this.stage,
        block: this
      });
      this.tile.on('click', this.mouseclick.bind(this));
      // this.stage.addEntity(this.tile);
      // this.addBuildings();
    },
    addBuildings: function() {
      if (this.type === 'h') {
        this.addHouses();
      } else if (this.type === 'w') {
        this.addFactories();
      } else if (this.type === 'p') {
        this.addParksAndRecreation();
      } else if (this.type === 'f') {
        this.addRecreation();
      } else if (this.type === 'Stadium') {
        this.addStadium();
      } else if (this.type === 'Farm') {
        this.addFarm();
      } else {
        this.addBlank();
      }
    },
    addStadium: function() {
      this.getCity().parks.push(this);
      this.building = new moletube.models.Stadium({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        stage: this.stage,
        z: 9999
      });
    },
    addFarm: function() {
      this.getCity().factories.push(this);
      this.building = new moletube.models.Farm({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        stage: this.stage,
        z: 9999
      });
    },
    addParksAndRecreation: function() {
      this.getCity().parks.push(this);
      this.building = new moletube.models.ParksAndRecreation({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        stage: this.stage,
        z: 9999
      });
    },
    addRecreation: function() {
      this.getCity().parks.push(this);
      var recreationType = this.recreationTypes[Math.floor(Math.random() * this.recreationTypes.length)];
      console.log(recreationType)
      this.building = new moletube.models[recreationType]({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        stage: this.stage,
        z: 9999
      });
    },
    addHouses: function() {
      this.getCity().houses.push(this);
      this.building = new moletube.models.flatBlock({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        stage: this.stage,
        z: 9999
      });
    },
    addFactories: function() {
      this.getCity().factories.push(this);
      this.building = new moletube.models.Factory({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        stage: this.stage
      });
    },
    addBlank: function() {
      // this.building = {
      //   view: new PIXI.Graphics(),
      //   tick: function() {},
      //   type: 'transparent'
      // }
    },
    getCenter: function() {
      return {
        x: this.isoX,
        y: this.isoY + this.height / 2
      };
    },
    getPathCenter: function(isGoingUp, isGoingRigth) {
      if (isGoingRigth && isGoingUp) {
        return {
          x: this.isoX + this.width / 4,
          y: this.isoY + 3 * this.height / 4
        };
      } else if (isGoingRigth && !isGoingUp) {
        return {
          x: this.isoX - this.width / 4,
          y: this.isoY + 3 * this.height / 4
        };
      } else if (!isGoingRigth && !isGoingUp) {
        return {
          x: this.isoX - this.width / 4,
          y: this.isoY + this.height / 4
        };
      } else if (!isGoingRigth && isGoingUp) {
        return {
          x: this.isoX + this.width / 4,
          y: this.isoY + this.height / 4
        };
      } else {
        return this.getCenter();
      }

    },
    drawTile: function() {
      this.stage.addEntity(this.tile);
    },
    drawBuilding: function() {
      if (this.building && this.building.type != 'transparent') {
        this.stage.addEntity(this.building, true);

        // this.stage.removeView(this.building.view);
        // this.stage.addViewAfter(this.building.view, this.tile.view);

      }
    },
    searchMole: function(moleName) {
      for (var i in this.moles) {
        if (this.moles[i].name === moleName) {
          return this.moles[i];
        }
      }
    },
    removeMole: function(moleName) {
      for (var i in this.moles) {
        if (this.moles[i].name === moleName) {
          var mole = this.moles[i];
          this.moles.splice(i, 1);
          return mole;
        }
      }
    },
    addMole: function(mole) {
      this.moles.push(mole);
    },
    removeBird: function(bird) {
      for (var i in this.birds) {
        if (this.birds[i] === bird) {
          var b = this.birds[i];
          this.birds.splice(i, 1);
          return b;
        }
      }
    },
    addBird: function(birds) {
      this.birds.push(birds);
    },
    drawMoles: function() {
      for (var i in this.moles) {
        this.stage.addEntity(this.moles[i]);
      }
    },
    drawBirdies: function() {
      for (var i in this.birds) {
        this.stage.addEntity(this.birds[i]);
      }
    },
    tick: function(counter) {
      // if(this.moles.length > 0) {
      //   if(!this.tile.hoverColor) {
      //     this.tile.hoverColor = 0xFFFF00;
      //     this.tile.drawView();
      //   }
      // } else {
      //   if(this.tile.hoverColor) {
      //     this.tile.hoverColor = null;
      //     this.tile.drawView();
      //   }
      // }
    },
    setTransparentBuilding: function() {
      this.underground = true;
      if (this.building && this.building.type != 'metroStation') {
        this.building.view.alpha = 0.2;
      } else if (this.building && this.building.type === 'metroStation') {
        this.building.setUnderground();
      }
    },
    setOpaqueBuilding: function() {
      this.underground = false;
      if (this.building && this.building.type != 'metroStation') {
        this.building.view.alpha = 1;
      } else if (this.building && this.building.type === 'metroStation') {
        this.building.setOverground();
      }
    },
    mouseclick: function() {
      if (!this.building && this.underground) {
        this.addMetroStation();
      }
      this.trigger('click', this);
    },
    addMetroStation: function() {
      var city = this.getCity();
      if (city.budget > this.STATION_COST) {
        city.budget -= this.STATION_COST;
        city.stations.push(this);
        this.building = new moletube.models.Station({
          x: this.isoX - this.height,
          y: this.isoY - this.width,
          stage: this.stage,
          block: this,
          z: 9999
        });
        this.drawBuilding();
      } else {
        city.trigger('warning', 'not enough money');
      }
    },
    getCity: function() {
      return this.stage.city;
    },
    getPreviousBlockView: function() {
      var prevBlock = this.city.getBlockFromMap({
        x: this.blockNumber.x - 1,
        y: this.blockNumber.y + 1
      });


      var prevBuilding = prevBlock ? prevBlock.building : null;

      if (!prevBuilding) {
        prevBlock = this.city.getBlockFromMap({
          x: this.blockNumber.x - 1,
          y: this.blockNumber.y
        });
        prevBuilding = prevBlock ? prevBlock.building : null;
      }
      if (!prevBuilding) {
        prevBlock = this.city.getBlockFromMap({
          x: this.blockNumber.x + 1,
          y: this.blockNumber.y - 1
        });
        prevBuilding = prevBlock ? prevBlock.building : null;
      }
      if (!prevBuilding) {
        prevBlock = this.city.getBlockFromMap({
          x: this.blockNumber.x,
          y: this.blockNumber.y - 1
        });
        prevBuilding = prevBlock ? prevBlock.building : null;
      }
      if (!prevBuilding) {
        prevBlock = this.city.getBlockFromMap({
          x: this.blockNumber.x - 1,
          y: this.blockNumber.y - 1
        });
        prevBuilding = prevBlock ? prevBlock.building : null;
      }


      return prevBuilding;

    }
  };
  window.moletube.models.CityBlock = cityBlock;
})();