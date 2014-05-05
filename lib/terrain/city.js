window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var city = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);

    this.origX = options.x;
    this.origY = options.y;
    this.stage = options.stage;
    this.init();
  }
  city.prototype = {
    counter: 0,
    N_MOLES: 200,
    tileWidth: window.moletube.config.tileWidth,
    tileHeight: window.moletube.config.tileWidth,
    budget: 1000,
    CITY_WIDTH: 50,
    MAX_WALKING_DISTANCE: 8,
    init: function() {
      this.setHour();
      this.setHappiness();
      this.setMoney();
      this.setUndergroundHelp();
      this.moles = [];
      this.houses = [];
      this.factories = [];
      this.stations = [];
      this.parks = [];
      this.cityGenerator = new moletube.tools.CityGenerator({size: this.CITY_WIDTH});
      this.cityGenerator.generateCity();
      this.cityMap = this.cityGenerator.getCity();
    },
    initLines: function() {
      this.paths = {};
      this.metroPaths = {};
      this.lines = [];
      this.lineColors = [
        0x0050c8,
        0xba3c04,
        0x04ba51,
        0xaeaeae
      ]
      for(var i = 0; i <4; i++) {
        this.lines.push(
          new moletube.models.Line({
            stations: this.lines[i],
            stage: this.stage,
            lineData: {
              line: i+1,
              color: this.lineColors[i]
            }
          })
        );
      }
    },
    tick: function(counter) {
      this.counter = counter;
      var hour = this.getHour();
      if(hour != this.currentHour) {
        if(hour === 22) {
          this.setNight();
        } else if(hour === 20) {
          this.setSunset();
        } else if(hour == 8) {
          this.setDay();
        } else if(hour == 6) {
          this.setSunrise();
        } else if(hour == 4) {
          this.setNight();
        } else if(hour == 0) {
          this.setPitchBlack();
        }
        this.currentHour = hour;
        this.hourDisplay.setText(this.currentHour + ':00')
        this.trigger('hourChange', hour);
      }
      if(this.isDirty && counter % 2 === 0) {
        this.resetCityDraw();
        this.isDirty = false;
      }
      if(counter % 60 === 0) {
        this.happinessDisplay.setText(this.getAverageHappiness() + '%')
      }
      if(counter % 20 === 0) {
        this.moneyDisplay.setText(this.budget + '$');
      }
    },
    drawCity: function() {
      this.createCityLayout();
      this.initLines();
      this.createCityBuildings();
      this.createMoles();
      this.drawCityBuildings();
    },
    getHour: function() {
      return Math.floor((8 + this.counter / 50) % 24);
    },
    setHour: function() {
      this.hourDisplay = new PIXI.Text('0:00', {font:"50px Verdana", fill:"#FFFFDD"});
      this.stage.addInvisibleEntity(this.hourDisplay);
    },
    setMoney: function() {
      this.moneyDisplay = new PIXI.Text('1000$', {font:"30px Verdana", fill:"#FFFFAA", strokeThickness: 2, stroke:"#333333"});
      this.moneyDisplay.x = 1000;
      this.moneyDisplay.y = 10;
      this.stage.addInvisibleEntity(this.moneyDisplay);
    },
    setUndergroundHelp: function() {
      this.undergroundDisplay = new PIXI.Text('Click on empty spaces to add a station (200$) \n'+
        'Select a line and click on stations to create a link', {font:"10px Verdana", fill:"#FFFFAA", strokeThickness: 2, stroke:"#333333"});
      this.undergroundDisplay.x = 900;
      this.undergroundDisplay.y = 550;
      this.undergroundDisplay.alpha = 0;
      this.undergroundDisplay.viewType = 'text'
      this.stage.addInvisibleEntity(this.undergroundDisplay);
    },

    setHappiness: function() {
      this.happinessDisplay = new PIXI.Text('50%', {font:"40px Verdana", fill:"#FFFFDD"});
      this.happinessDisplay.y = 60;
      this.happinessDisplay.x = 50;
      this.happinessDisplayDecor = new PIXI.Sprite.fromFrame('assets/happymole.png');
      this.happinessDisplayDecor.y = 65;
      this.happinessDisplayDecor.x = 5;
      this.happinessDisplayDecor2 = new PIXI.Text('mole happiness', {font:"15px Verdana", fill:"#FFFFDD"});
      this.happinessDisplayDecor2.y = 110;
      this.happinessDisplayDecor2.x = 5;

      this.stage.addInvisibleEntity(this.happinessDisplay);
      this.stage.addInvisibleEntity(this.happinessDisplayDecor);
      this.stage.addInvisibleEntity(this.happinessDisplayDecor2);
    },
    createCityLayout: function() {
      this.blocks = [];
      for(var y in this.cityMap) {
        for(var x in this.cityMap[y]) {
          var type = this.cityMap[y][x];
          var xPos = this.tileWidth * x;
          var yPos = this.tileHeight * y;
          var isoX = this.origX + xPos - yPos;
          var isoY = this.origY + (xPos + yPos) / 2;
          var tile = new moletube.models.CityBlock({
            x: isoX,
            y: isoY,
            type: type,
            stage: this.stage
          })
          tile.on('click', this.mouseclick.bind(this));
          tile.blockNumber = {x: 1*x, y: 1*y};
          this.blocks.push(tile);
          // this.stage.addNotVisualEntity(tile);

          tile.drawTile();
          // tile.drawBuilding();
        }
      }
      for(var i in this.blocks) {
        this.blocks[i].addBuildings();
        this.blocks[i].drawBuilding();
      }
    },
    resetCityDraw: function() {
      // this.stage.resetPixiView('viewType', 'mole');
      // this.stage.resetPixiView('viewType', 'building');
      // this.drawCityBuildings();
      // this.stage.toFrontPixiView('viewType', 'text');
    },
    createCityBuildings: function() {
      for(var i in this.blocks) {
        // this.blocks[i].addBuildings();
      }
    },
    drawCityBuildings: function() {
      for(var i in this.blocks) {
        // this.blocks[i].drawBuilding();
        this.blocks[i].drawMoles();
      }
    },
    setTransparentBuildings: function() {
      this.underground = true;
      this.undergroundDisplay.alpha = 1;
      this.showLines();
      for(var i in this.blocks) {
        this.blocks[i].setTransparentBuilding();
      }
    },
    setOpaqueBuildings: function() {
      this.underground = false;
      this.undergroundDisplay.alpha = 0;
      this.hideLines();
      for(var i in this.blocks) {
        this.blocks[i].setOpaqueBuilding();
      }
    },
    createMoles: function() {
      for(var i = 0; i < this.N_MOLES; i++) {
        var block = this.blocks[Math.floor(Math.random() * this.blocks.length)];
        var home = this.houses[Math.floor(Math.random() * this.houses.length)];
        var work = this.factories[Math.floor(Math.random() * this.factories.length)];

        var mole =  new moletube.models.JohnMole({
          block: block,
          home: home,
          work: work,
          city: this,
          stage: this.stage
        });
        this.moles.push(mole);
        mole.on('moleChange', this.markAsDirty.bind(this));
        mole.on('click', this.showMoleProfile.bind(this));
      }
    },
    markAsDirty: function() {
      this.isDirty = true;
    },
    findNearestStreet: function(block) {
      if(block.type === 'r') {
        return block;
      }
      else {
        var x = block.blockNumber.x;
        var y = block.blockNumber.y;
        for(var distance = 1; distance < this.CITY_WIDTH; distance++) {
          var road = this.checkBoundariesForType('r', x, y, distance);
          if(road) {
            return road;
          }
        }
      }
    },
    checkBoundariesForType: function(type, xPos, yPos, distance) {
      var combinations = [];
      for(var y = -1 * distance; y <= distance; y++) {
        for(var x = -1 * distance; x <= distance; x++) {
          if(Math.abs(x) === distance || Math.abs(y) === distance) {
            combinations.push({x:1*xPos + x, y:1*yPos + y});
          }
        }
      }
      for(var i in combinations) {
        if(this.isARoad(combinations[i])) {
          return this.getBlockFromMap(combinations[i]);
        }
      }
    },
    getBlockFromMap: function(point) {
      for(var i in this.blocks) {
        if(
          this.blocks[i].blockNumber.x == point.x &&
          this.blocks[i].blockNumber.y == point.y
        ) {
          return this.blocks[i];
        }
      }
    },
    isARoad: function(point) {
      var x = point.x;
      var y = point.y;
      if(this.cityMap[y]) {
        if(this.cityMap[y][x] &&
          this.cityMap[y][x] === 'r'
        ) {
          return true;
        }
      }
      return false;
    },
    isPathCached: function(blockA, blockB) {
      var idBlockA = blockA.blockNumber.x + '_' + blockA.blockNumber.y;
      var idBlockB = blockB.blockNumber.x + '_' + blockB.blockNumber.y;
      if(this.paths[idBlockA]) {
        if(this.paths[idBlockA][idBlockB]) {
          if(this.counter - this.paths[idBlockA][idBlockB].counter < 100000) {
            var path = [];
            for(var i in this.paths[idBlockA][idBlockB].path) {
              path.push(this.paths[idBlockA][idBlockB].path[i])
            }
            return path;
          }
        }
      }
    },
    isMetroPathCached: function(blockA, blockB) {
      var idBlockA = blockA.blockNumber.x + '_' + blockA.blockNumber.y;
      var idBlockB = blockB.blockNumber.x + '_' + blockB.blockNumber.y;
      if(this.metroPaths[idBlockA]) {
        if(this.metroPaths[idBlockA][idBlockB]) {
          if(this.counter - this.metroPaths[idBlockA][idBlockB].counter < 10000) {
            var path = [];
            for(var i in this.metroPaths[idBlockA][idBlockB].path) {
              path.push(this.metroPaths[idBlockA][idBlockB].path[i])
            }
            return path;
          }
        }
      }
    },
    savePathCache: function(blockA, blockB, path) {
      var idBlockA = blockA.blockNumber.x + '_' + blockA.blockNumber.y;
      var idBlockB = blockB.blockNumber.x + '_' + blockB.blockNumber.y;
      this.paths[idBlockA] = this.paths[idBlockA] || {};
      var newPath = [];
      for(var i in path) {
        newPath.push(path[i])
      }
      this.paths[idBlockA][idBlockB] = {
        counter: this.counter,
        path: newPath
      }
    },
    saveMetroPathCache: function(blockA, blockB, path) {
      var idBlockA = blockA.blockNumber.x + '_' + blockA.blockNumber.y;
      var idBlockB = blockB.blockNumber.x + '_' + blockB.blockNumber.y;
      this.metroPaths[idBlockA] = this.metroPaths[idBlockA] || {};
      var newPath = [];
      for(var i in path) {
        newPath.push(path[i])
      }
      this.metroPaths[idBlockA][idBlockB] = {
        counter: this.counter,
        path: newPath
      }
    },
    pathBetweenBlocks: function(blockA, blockB) {
      var catchedPath = this.isPathCached(blockA, blockB);
      if(catchedPath) {
        return catchedPath;
      }
      var path = [];
      var origin = this.findNearestStreet(blockA);
      path.push(blockA);
      var target = this.findNearestStreet(blockB);
      var pathAsCoordinates = this.pathBetweenBlocksAsCoordinates(origin, target);
      for(var i in pathAsCoordinates) {
        var block = this.getBlockFromMap({
          x: pathAsCoordinates[i][0],
          y: pathAsCoordinates[i][1]
        });
        path.push(block);
      }
      path.push(blockB);
      this.savePathCache(blockA, blockB, path);
      return path;
    },
    pathBetweenBlocksAsCoordinates: function(pointA, pointB) {
      var self = this;
// world is a 2d array of integers (eg world[10][15] = 0)
// pointA and pointB are arrays like [5,10]
      var abs = Math.abs;
      var max = Math.max;
      var pow = Math.pow;
      var sqrt = Math.sqrt;

  // the world data are integers:
  // anything higher than this number is considered blocked
  // this is handy is you use numbered sprites, more than one
  // of which is walkable road, grass, mud, etc
      var walkableTile = 'r';

  // keep track of the world dimensions
  // Note that this A-star implementation expects the world array to be square:
  // it must have equal height and width. If your game world is rectangular,
  // just fill the array with dummy values to pad the empty space.
      var worldWidth = this.cityMap[0].length;
      var worldHeight = this.cityMap.length;
      var worldSize = worldWidth * worldHeight;

      function ManhattanDistance(Point, Goal) {
      // linear movement - no diagonals - just cardinal directions (NSEW)
        return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
      }

      function Neighbours(x, y) {
        var N = y - 1;
        var S = y + 1;
        var E = x + 1;
        var W = x - 1;
        var myN = N > -1 && canWalkHere(x, N);
        var myS = S < worldHeight && canWalkHere(x, S);
        var myE = E < worldWidth && canWalkHere(E, y);
        var myW = W > -1 && canWalkHere(W, y);
        var result = [];
        if(myN)
        result.push({x:x, y:N});
        if(myE)
        result.push({x:E, y:y});
        if(myS)
        result.push({x:x, y:S});
        if(myW)
        result.push({x:W, y:y});
        findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
        return result;
      }

      function canWalkHere(x, y) {
        return self.isARoad({x:x, y:y});
      };

      function Node(Parent, Point) {
        var newNode = {
          // pointer to another Node object
          Parent:Parent,
          // array index of this Node in the world linear array
          value:Point.x + (Point.y * worldWidth),
          // the location coordinates of this Node
          x:Point.x,
          y:Point.y,
          // the distanceFunction cost to get
          // TO this Node from the START
          f:0,
          // the distanceFunction cost to get
          // from this Node to the GOAL
          g:0
        };

        return newNode;
      }

      // which heuristic should we use?
      // default: no diagonals (Manhattan)
      var distanceFunction = ManhattanDistance;
      var findNeighbours = function(){}; // empty
      function calculatePath() {
        // create Nodes from the Start and End x,y coordinates
        var mypointA = Node(null, {x:pointA.blockNumber.x, y:pointA.blockNumber.y});
        var mypointB = Node(null, {x:pointB.blockNumber.x, y:pointB.blockNumber.y});
        // create an array that will contain all world cells
        var AStar = new Array(worldSize);
        // list of currently open Nodes
        var Open = [mypointA];
        // list of closed Nodes
        var Closed = [];
        // list of the final output array
        var result = [];
        // reference to a Node (that is nearby)
        var myNeighbours;
        // reference to a Node (that we are considering now)
        var myNode;
        // reference to a Node (that starts a path in question)
        var myPath;
        // temp integer variables used in the calculations
        var length, max, min, i, j;
        // iterate through the open list until none are left
        while(length = Open.length)
        {
          max = worldSize;
          min = -1;
          for(i = 0; i < length; i++)
          {
            if(Open[i].f < max)
            {
              max = Open[i].f;
              min = i;
            }
          }
          // grab the next node and remove it from Open array
          myNode = Open.splice(min, 1)[0];
          // is it the destination node?
          if(myNode.value === mypointB.value)
          {
            myPath = Closed[Closed.push(myNode) - 1];
            do
            {
              result.push([myPath.x, myPath.y]);
            }
            while (myPath = myPath.Parent);
            // clear the working arrays
            AStar = Closed = Open = [];
            // we want to return start to finish
            result.reverse();
          }
          else // not the destination
          {
            // find which nearby nodes are walkable
            myNeighbours = Neighbours(myNode.x, myNode.y);
            // test each one that hasn't been tried already
            for(i = 0, j = myNeighbours.length; i < j; i++)
            {
              myPath = Node(myNode, myNeighbours[i]);
              if (!AStar[myPath.value])
              {
                // estimated cost of this particular route so far
                myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
                // estimated cost of entire guessed route to the destination
                myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypointB);
                // remember this new path for testing above
                Open.push(myPath);
                // mark this node in the world graph as visited
                AStar[myPath.value] = true;
              }
            }
            // remember this route as having no more untested options
            Closed.push(myNode);
          }
        } // keep iterating until until the Open list is empty
        return result;
      }

      return calculatePath();

    },

    mouseclick: function(block) {
      if(this.underground) {

      } else {
        // alert(block.building.type);
      }

    },

    selectLine: function(lineButton) {
      this.selectedLine = lineButton;
      if(this.selectedStation) {
        this.selectedStation.assignToLine(lineButton);
      }
    },
    unselectLine: function() {
      this.selectedLine = null;
      if(this.selectedStation) {
        this.selectedStation.unassignToLine();
        this.selectedStation = null;
      }
    },
    selectStation: function(station) {
      if(this.selectedLine && this.selectedStation) {
        this.addStation(station);
        this.selectedStation.selected = false;
        this.selectedStation.unassignToLine();
      }
      this.selectedStation = station;
      this.selectedStation.selected = true;
    },
    addStation: function(station) {
      if(station == this.selectedStation) {
        return;
      }
      if(station.lines.length >= 2 ||
        (
          this.selectedStation.lines.indexOf(this.selectedLine.line) <= 0 &&
          this.selectedStation.lines.length >= 2)
        ) {
        this.trigger('warning', 'A station can only belong to 2 lines')
        return;
      }
      var l = this.selectedLine.line - 1;
      if(this.lines[l].stations.length >= 6) {
        this.trigger('warning', 'Max line size reached');
        return;
      }
      var length = this.lines[l].stations.length;
      if(this.lines[l].stations[length - 1] != this.selectedStation &&
        this.lines[l].stations.indexOf(this.selectedStation) <= 0
        ) {
        this.selectedStation.lines.push(this.selectedLine.line)
        this.lines[l].stations.push(this.selectedStation);
      }
      if(this.lines[l].stations.indexOf(station) <= 0) {
        this.lines[l].stations.push(station);
        station.lines.push(this.selectedLine.line);
        this.lines[l].drawView();
      }
    },
    tintAll: function(color) {
      for(var i in this.blocks) {
        if(this.blocks[i].building) {
          this.blocks[i].building.view.tint = color;
        }
        this.blocks[i].tile.view.tint = color;
        for(var j in this.blocks[i].moles) {
          this.blocks[i].moles[j].view.tint = color;
        }
      }
    },
    setNight: function() {
      this.tintAll(0x999999);
    },
    setPitchBlack: function() {
      this.tintAll(0x444444);
    },
    setSunset: function() {
      this.tintAll(0xCCBBBB)
    },
    setSunrise: function() {
      this.tintAll(0xCCAAAA);
    },
    setDay: function() {
      this.tintAll(0xFFFFFF);
    },
    hideLines: function() {
      for(var i in this.lines) {
        this.lines[i].hideLines();
      }
    },
    showLines: function() {
      for(var i in this.lines) {
        this.lines[i].showLines();
      }
    },
    getMetroPath: function(blockA, blockB) {
      var path = [];
      var cachedPath = this.isMetroPathCached(blockA, blockB);
      if(cachedPath) {
        return cachedPath;
      }
      if(!window.m) window.m = [];
      var origin = this.findNearestStreet(blockA);
      path.push(blockA);
      var target = this.findNearestStreet(blockB);

      var metroStationB = this.getNearestMetro(target.blockNumber);
      if(!metroStationB) {
        return null;
      }
      var metroStationA = this.getNearestMetro(origin.blockNumber, metroStationB.lines);
      if(!metroStationA) {
        return null;
      }

      var pathToMetroAsCoordinates = this.pathBetweenBlocksAsCoordinates(origin, metroStationA);
      for(var i in pathToMetroAsCoordinates) {
        var block = this.getBlockFromMap({
          x: pathToMetroAsCoordinates[i][0],
          y: pathToMetroAsCoordinates[i][1]
        });
        path.push(block);
      }
      path.push("metro");
      var pathFromMetroAsCoordinates = this.pathBetweenBlocksAsCoordinates(metroStationB, target);
      for(var i in pathFromMetroAsCoordinates) {
        var block = this.getBlockFromMap({
          x: pathFromMetroAsCoordinates[i][0],
          y: pathFromMetroAsCoordinates[i][1]
        });
        path.push(block);
      }
      path.push(blockB);

      this.saveMetroPathCache(blockA, blockB, path);

      return path;
    },

    getNearestMetro: function(point, line) {
      var maxWalkingDistance = this.MAX_WALKING_DISTANCE;
      for(var i = 0; i < maxWalkingDistance; i++) {
        var block = this.checkBoundariesForStation(point.x, point.y, i, line);
        if(block) {
          return block;
        }
      }
    },
    checkBoundariesForStation: function(xPos, yPos, distance, lines) {
      if(this.stations.length < 1) {
        return null;
      }
      var combinations = [];
      for(var y = -1 * distance; y <= distance; y++) {
        for(var x = -1 * distance; x <= distance; x++) {
          if(Math.abs(x) === distance || Math.abs(y) === distance) {
            combinations.push({x:1*xPos + x, y:1*yPos + y});
          }
        }
      }

      for(var i in combinations) {
        if(this.hasStation(combinations[i])) {
          var block = this.getBlockFromMap(combinations[i]);
          if(!lines) {
            return block;
          } else {
            var hasLine = false;
            for(var j in lines) {
              if(block.building.lines.indexOf(lines[j]) >= 0) {
                return block;
              }
            }
          }

        }
      }
    },
    hasStation: function(point) {
      var x = point.x;
      var y = point.y;
      var n = y * this.CITY_WIDTH;
      n += x;
      if(this.blocks[n] &&
        this.blocks[n].building &&
        this.blocks[n].building.type == 'metroStation' &&
        this.blocks[n].building.lines.length >= 0
        ) {
        return true;
      }
      return false;
    },
    getAverageHappiness: function() {
      var n = 0;
      var happy = 0;
      for(var i in this.moles) {
        happy += this.moles[i].happiness;
        n++;
      }
      return Math.floor(happy / n);
    },
    showMoleProfile: function(mole) {
      if(this.moleProfile) {
        this.moleProfile.destroy();
      }
      this.moleProfile = new moletube.models.Profile({
        stage: this.stage,
        profiled: mole
      })
    }

  }

  window.moletube.models.City = city;
})()
