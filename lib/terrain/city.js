window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var city = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);

    this.overlayManager = options.overlayManager;
    this.origX = options.x;
    this.origY = options.y;
    this.stage = options.stage;
    this.world = options.world;
    this.world.setCity(this);
    this.pathFinder = new moletube.models.PathFinder({
      city: this
    });
    this.houses = new moletube.models.Housing({
      city: this,
      stage: this.stage
    });
    this.projects = new moletube.models.ConstructionProjects({
      city: this,
      stage: this.stage
    });
    this.factories = new moletube.models.Factories({
      city: this,
      stage: this.stage
    });
    this.init();
  };
  city.prototype = {
    blockTypes: {
      'h': 'HousingBlock',
      's': 'CityBlock',
      'w': 'FactoryBlock',
      'f': 'RecreationBlock',
      'r': 'CityBlock',
      'c': 'CityBlock',
      'b': 'CityBlock',
      'p': 'CityBlock',
      'reserved4': 'CityBlock',
      'reserved3': 'CityBlock',
      'Stadium': 'CityBlock',
      'Farm': 'CityBlock'

    },
    counter: 0,
    N_MOLES: 40,
    N_BIRDIES: 50,
    tileWidth: window.moletube.config.tileWidth,
    tileHeight: window.moletube.config.tileWidth,
    budget: 1000,
    CITY_WIDTH: 40,
    MAX_WALKING_DISTANCE: 8,
    init: function() {
      this.setMoney();
      this.moles = [];
      this.capitalists = [];
      this.birds = [];
      this.stations = [];
      this.parks = [];
      this.cityGenerator = new moletube.tools.CityGenerator({
        size: this.CITY_WIDTH
      });
      this.cityGenerator.generateCity();
      this.cityMap = this.cityGenerator.getCity();
    },
    getCityMap: function() {
      return this.cityGenerator.cityMap;
    },
    tick: function(counter) {
      this.counter = counter;
      var hour = this.getHour();
      if (hour != this.currentHour) {
        if (hour === 22) {
          this.setNight();
        } else if (hour === 20) {
          this.setSunset();
        } else if (hour == 8) {
          this.setDay();
        } else if (hour == 6) {
          this.setSunrise();
        } else if (hour == 4) {
          this.setNight();
        } else if (hour === 0) {
          this.setPitchBlack();
        }
        this.currentHour = hour;
        this.hourDisplay.setText(this.currentHour + ':00');
        this.trigger('hourChange', hour);
      }
      if (this.isDirty && counter % 2 === 0) {
        this.resetCityDraw();
        this.isDirty = false;
      }
      if (counter % 20 === 0) {
        this.moneyDisplay.setText(this.budget + '$');
      }
    },
    drawCity: function() {
      this.createCityLayout();
      this.createCityBuildings();
      this.createBirdies();
      this.drawCityBuildings();

      this.setHour();
    },
    getHour: function() {
      return Math.floor((8 + (this.counter - 1) / 300) % 24);
    },
    setHour: function() {
      this.hourDisplay = new PIXI.Text('0:00', {
        font: "50px Verdana",
        fill: "#FFFFDD"
      });
      this.stage.addVisualEntity(this.hourDisplay);
    },
    setMoney: function() {
      this.moneyDisplay = new PIXI.Text('1000$', {
        font: "30px Verdana",
        fill: "#FFFFAA",
        strokeThickness: 2,
        stroke: "#333333"
      });
      this.moneyDisplay.x = 1000;
      this.moneyDisplay.y = 10;
      this.stage.addVisualEntity(this.moneyDisplay);
    },
    setHappiness: function() {},
    createCityLayout: function() {
      this.blocks = [];
      var nBlock = 0;
      for (var y in this.cityMap) {
        for (var x in this.cityMap[y]) {
          var type = this.cityMap[y][x];
          var xPos = this.tileWidth * x;
          var yPos = this.tileHeight * y;
          var isoX = this.origX + xPos - yPos;
          var isoY = this.origY + (xPos + yPos) / 2;
          var tile = new moletube.models[this.blockTypes[type]]({
            x: isoX,
            y: isoY,
            type: type,
            stage: this.stage,
            blockNumber: {
              x: 1 * x,
              y: 1 * y,
              n: nBlock
            }
          });
          nBlock++;
          this.blocks.push(tile);
        }
      }
      for (var j in this.blocks) {
        this.blocks[j].drawTile();
      }
      for (var i in this.blocks) {
        this.blocks[i].addDecoration();
        this.blocks[i].addBuildings();
        this.blocks[i].drawBuilding();
      }
      this.basicInitPopulation();
    },
    basicInitPopulation: function() {
      this.createUpperClassHouse();
      this.createUpperClassHouse();
      this.createCustoms();
      this.createCapitalist();
      this.createCapitalist();
      for (var k in this.capitalists) {
        for (var l = 0; l < 5; l++) {
          this.capitalists[k].checkInversions(0);
        }
      }
      for (var ll = 0; ll < 5; ll++) {
        var mole = this.createMole();
        mole.getAJob();
        mole.getAHome();
      }
    },
    resetCityDraw: function() {
      // this.stage.resetPixiView('viewType', 'mole');
      // this.stage.resetPixiView('viewType', 'building');
      // this.drawCityBuildings();
      // this.stage.toFrontPixiView('viewType', 'text');
    },
    createCityBuildings: function() {},
    drawCityBuildings: function() {
      for (var i in this.blocks) {
        // this.blocks[i].drawBuilding();
        this.blocks[i].drawMoles();
        this.blocks[i].drawBirdies();
      }
    },
    setTransparentBuildings: function() {
      this.underground = true;
      this.undergroundDisplay.alpha = 1;
      this.showLines();
      for (var i in this.blocks) {
        this.blocks[i].setTransparentBuilding();
      }
    },
    setOpaqueBuildings: function() {
      this.underground = false;
      this.undergroundDisplay.alpha = 0;
      this.hideLines();
      for (var i in this.blocks) {
        this.blocks[i].setOpaqueBuilding();
      }
    },
    createMole: function() {
      var mole = new moletube.models.JohnMole({
        city: this,
        block: this.getInmigrantEntryPoint(),
        stage: this.stage
      });
      this.moles.push(mole);
      this.stage.addEntity(mole);
      mole.on('moleChange', this.markAsDirty.bind(this));
      mole.on('click', this.showMoleProfile.bind(this));
      return mole;
    },
    createCapitalist: function() {
      var mole = new moletube.models.ScroogeMcMole({
        city: this,
        block: this.getInmigrantEntryPoint(),
        stage: this.stage
      });
      this.capitalists.push(mole);
      this.stage.addEntity(mole);
      mole.on('moleChange', this.markAsDirty.bind(this));
      mole.on('click', this.showMoleProfile.bind(this));
      return mole;
    },
    createBirdies: function() {
      for (var i = 0; i < this.N_BIRDIES; i++) {
        var block = this.blocks[Math.floor(Math.random() * this.blocks.length)];

        var bird = new moletube.models.Bird({
          block: block,
          city: this,
          stage: this.stage
        });
        this.birds.push(bird);
      }
    },
    getInmigrantEntryPoint: function() {
      if (!this.customs) {
        this.createCustoms();
      }
      return this.customs;
    },
    createCustoms: function() {
      var n = this.cityMap.length;
      var customsBlock = null;
      for (var m = n; m; m--) {
        if (this.blocks[n * m - 1].type === 'r') {
          customsBlock = this.blocks[n * m - 1];
        }
      }
      customsBlock.addCustoms();
      customsBlock.drawBuilding();
    },

    markAsDirty: function() {
      this.isDirty = true;
    },



    tintAll: function(color) {
      for (var i in this.blocks) {
        if (this.blocks[i].building) {
          this.blocks[i].building.view.tint = color;
        }
        if (this.blocks[i].tile) {
          this.blocks[i].tile.baseTint = color;
          this.blocks[i].tile.view.tint = color;
        }
        for (var j in this.blocks[i].moles) {
          this.blocks[i].moles[j].view.tint = color;
        }
      }
    },
    setNight: function() {
      this.tintAll(0xAAAA99);
    },
    setPitchBlack: function() {
      this.tintAll(0xAAAA44);
    },
    setSunset: function() {
      this.tintAll(0xCCBBBB);
    },
    setSunrise: function() {
      this.tintAll(0xCCAAAA);
    },
    setDay: function() {
      this.tintAll(0xFFFFFF);
    },

    getAverageHappiness: function() {
      var n = 0;
      var happy = 0;
      for (var i in this.moles) {
        happy += this.moles[i].happiness;
        n++;
      }
      return Math.floor(happy / n);
    },
    showMoleProfile: function(mole) {
      if (this.selectedProfile) {
        this.selectedProfile.destroy();
      }
      this.selectedMole = mole;
      mole.select();
      this.selectedProfile = new moletube.models.Profile({
        stage: this.stage,
        profiled: mole
      });
    },

    createTextKaiju: function() {

      this.kaiju = new moletube.models.Kaiju({
        stage: this.stage,
        block: this.blocks[0],
        city: this
      });
      this.stage.addEntity(this.kaiju);
    },
    getRandomRecreation: function() {
      return this.parks[Math.floor(Math.random() * this.parks.length)];
    },
    getRandomOpenRecreation: function() {
      var maxAttemps = 5;
      while (maxAttemps) {
        var recreation = this.parks[Math.floor(Math.random() * this.parks.length)];
        if (recreation && recreation.isOpen && recreation.isOpen()) {
          return recreation;
        }
        maxAttemps--;
      }

    },
    getRandomLocation: function() {
      var location = this.blocks[Math.floor(Math.random() * this.blocks.length)];
      if (location.type != 's') {
        return location;
      } else {
        return this.getRandomLocation();
      }
    },
    createUpperClassHouse: function(block) {
      if (!block) {
        block = this.getRandomLocation();
      }
      this.constructProject(block, moletube.models.UpperClassHousingBlock);

    },
    constructSelectedProject: function(block) {
      this.constructProject(block, this.selectedProject.data.blockType);
    },
    constructProject: function(block, type, buildingType) {
      block.buildingType = buildingType;
      block.changeType(type);
      block.addBuildings();
      block.drawBuilding();
      block.reorderView();
    },
    getPreviousBuildElement: function(block) {
      if (block.decoration.length) {
        return block;
      }
      var n = block.blockNumber.n - 1;
      for (n; n >= 0; n--) {
        if (this.blocks[n].building || this.blocks[n].decoration.length > 0) {
          return this.blocks[n];
        }
      }
    },
    getPropertiesOnSale: function() {
      var forSale = [];
      for (var i in this.blocks) {
        if (this.blocks[i].building && !this.blocks[i].building.owner) {
          forSale.push(this.blocks[i].building);
        }
      }
      return forSale;
    },
    getPath: function(blockA, blockB) {
      return this.pathFinder.getPath(blockA, blockB);
    },
    getBlockFromMap: function(point) {
      return this.pathFinder.getBlockFromMap(point);
    },
    doSelectedAction: function(block, action) {
      var actionType = action.data.name;
      var actions = {
        'road': {
          method: 'buildRoad',
          params: [block]
        },
        'upperClassHouse': {
          method: 'createUpperClassHouse',
          params: [block]
        },
        'workerClassHouse': {
          method: 'createWorkerClassHouse',
          params: [block]
        },
        'vinylFactory': {
          method: 'constructProject',
          params: [block, window.moletube.models.FactoryBlock, 'TiresFactory']
        },
        'vinylShop': {
          method: 'constructProject',
          params: [block, window.moletube.models.RecreationBlock, 'RecordStore']
        },
      };


      var actionMethod = actions[actionType];
      if (this[actionMethod.method]) {
        console.log(actionMethod.method, actionMethod.params);
        this[actionMethod.method].apply(this, actionMethod.params);
      }
    },
    createWorkerClassHouse: function(block) {
      this.constructProject(block, moletube.models.HousingBlock);
    },
    buildRoad: function(block) {
      this.cityMap[block.blockNumber.y][block.blockNumber.x] = 'r';
      block.type = 'r';
      block.tile.type = 'r';
      block.tile.getBorderingTiles();
      block.refreshTile();
      var neighbours = this.getAdjacentBlocks(block);
      for (var i in neighbours) {
        if (neighbours[i] && neighbours[i].type === 'r') {
          neighbours[i].tile.getBorderingTiles();
          neighbours[i].refreshTile();
        }
      }
      this.pathFinder.clearCache();
    },

    getAdjacentBlocks: function(block) {
      var x = block.blockNumber.x;
      var y = block.blockNumber.y;
      var n = this.getBlockFromMap({
        x: x,
        y: y - 1
      });
      var s = this.getBlockFromMap({
        x: x,
        y: y + 1
      });
      var e = this.getBlockFromMap({
        x: x + 1,
        y: y
      });
      var w = this.getBlockFromMap({
        x: x - 1,
        y: y
      });
      return [n, s, w, e];
    }
  };

  window.moletube.models.City = city;
})();