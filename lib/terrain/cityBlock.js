window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var cityBlock = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.isoX = options.x;
    this.isoY = options.y;
    this.type = options.type;
    this.stage = options.stage;
    this.tile = null;
    this.building = null;
    this.moles = [];
    this.init();
  }
  cityBlock.prototype = {
    height: 25,
    width: 25,
    STATION_COST: 200,
    init: function() {
      this.tile = new moletube.models.Tile({
        x: this.isoX,
        y: this.isoY,
        type: this.type
      })
      this.tile.on('click', this.mouseclick.bind(this));
      this.stage.addEntity(this.tile);
      // this.addBuildings();
    },
    addBuildings: function() {
      if(this.type === 'h') {
        this.addHouses();
      } else if(this.type === 'w') {
        this.addFactories();
      }
    },
    addHouses: function() {
      this.getCity().houses.push(this);
      this.building = new moletube.models.flatBlock({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        z: 9999
      })
    },
    addFactories: function() {

      this.getCity().factories.push(this);
      this.building = new moletube.models.Factory({
        x: this.isoX - this.height,
        y: this.isoY - this.width,
        z: 9999
      })
    },
    getCenter: function() {
      return {
        x: this.isoX,
        y: this.isoY + this.height / 2
      }
    },
    drawBuilding: function() {
      if(this.building) {
        this.stage.addEntity(this.building);
      }
    },
    searchMole: function(moleName) {
      for(var i in this.moles) {
        if(this.moles[i].name === moleName) {
          return this.moles[i];
        }
      }
    },
    removeMole: function(moleName) {
      for(var i in this.moles) {
        if(this.moles[i].name === moleName) {
          var mole = this.moles[i];
          this.moles.splice(i,1);
          return mole;
        }
      }
    },
    addMole: function(mole) {
      this.moles.push(mole);
    },
    drawMoles: function() {
      for(var i in this.moles) {
        this.stage.addEntity(this.moles[i])
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
      if(this.building && this.building.type != 'metroStation') {
        this.building.view.alpha = 0.2;
      } else if(this.building && this.building.type === 'metroStation') {
        this.building.setUnderground();
      }
    },
    setOpaqueBuilding: function() {
      this.underground = false;
      if(this.building && this.building.type != 'metroStation') {
        this.building.view.alpha = 1;
      } else if(this.building && this.building.type === 'metroStation') {
        this.building.setOverground();
      }
    },
    mouseclick: function() {
      if(!this.building && this.underground) {
        this.addMetroStation();
      }
      this.trigger('click', this);
    },
    addMetroStation: function() {
      var city = this.getCity();
      if(city.budget > this.STATION_COST) {
        city.budget -= this.STATION_COST;
        city.stations.push(this);
        this.building = new moletube.models.Station({
          x: this.isoX - this.height,
          y: this.isoY - this.width,
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
    }
  }
  window.moletube.models.CityBlock = cityBlock;
})()
