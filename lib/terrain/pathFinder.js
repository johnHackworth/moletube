window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var pathFinder = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.city = options.city;
    this.paths = {};
  };
  pathFinder.prototype = {
    CITY_WIDTH: moletube.config.tileWidth,
    clearCache: function() {
      this.paths = {};
    },
    pathBetweenBlocksAsCoordinates: function(pointA, pointB, pathType) {
      if (!pointA || !pointB) {
        return null;
      }
      var self = this;
      var findPathType = pathType;
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
      var worldWidth = this.city.cityMap[0].length;
      var worldHeight = this.city.cityMap.length;
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
        if (myN)
          result.push({
            x: x,
            y: N
          });
        if (myE)
          result.push({
            x: E,
            y: y
          });
        if (myS)
          result.push({
            x: x,
            y: S
          });
        if (myW)
          result.push({
            x: W,
            y: y
          });
        findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
        return result;
      }

      function canWalkHere(x, y) {
        if (findPathType === 'road') {
          return canWalkByRoadHere(x, y);
        }
        return self.isWalkable({
          x: x,
          y: y
        });
      }

      function canWalkByRoadHere(x, y) {
        return self.isARoad({
          x: x,
          y: y
        });
      }


      function Node(Parent, Point) {
        var newNode = {
          // pointer to another Node object
          Parent: Parent,
          // array index of this Node in the world linear array
          value: Point.x + (Point.y * worldWidth),
          // the location coordinates of this Node
          x: Point.x,
          y: Point.y,
          // the distanceFunction cost to get
          // TO this Node from the START
          f: 0,
          // the distanceFunction cost to get
          // from this Node to the GOAL
          g: 0
        };

        return newNode;
      }

      // which heuristic should we use?
      // default: no diagonals (Manhattan)
      var distanceFunction = ManhattanDistance;
      var findNeighbours = function() {}; // empty
      function calculatePath() {
        // create Nodes from the Start and End x,y coordinates
        var mypointA = Node(null, {
          x: pointA.blockNumber.x,
          y: pointA.blockNumber.y
        });
        var mypointB = Node(null, {
          x: pointB.blockNumber.x,
          y: pointB.blockNumber.y
        });
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
        while (length = Open.length) {
          max = worldSize;
          min = -1;
          for (i = 0; i < length; i++) {
            if (Open[i].f < max) {
              max = Open[i].f;
              min = i;
            }
          }
          // grab the next node and remove it from Open array
          myNode = Open.splice(min, 1)[0];
          // is it the destination node?
          if (myNode.value === mypointB.value) {
            myPath = Closed[Closed.push(myNode) - 1];
            do {
              result.push([myPath.x, myPath.y]);
            }
            while (myPath = myPath.Parent);
            // clear the working arrays
            AStar = Closed = Open = [];
            // we want to return start to finish
            result.reverse();
          } else // not the destination
          {
            // find which nearby nodes are walkable
            myNeighbours = Neighbours(myNode.x, myNode.y);
            // test each one that hasn't been tried already
            for (i = 0, j = myNeighbours.length; i < j; i++) {
              myPath = Node(myNode, myNeighbours[i]);
              if (!AStar[myPath.value]) {
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

      var resultPath = calculatePath();
      // resultPath.push([pointB.blockNumber.x, pointB.blockNumber.y]);
      return resultPath;
    },
    getPath: function(blockA, blockB) {
      var catchedPath = this.isPathCached(blockA, blockB);
      if (catchedPath) {
        return catchedPath;
      }
      var pathBetweenBlocks = this.pathBetweenBlocksByRoad(blockA, blockB);
      if (pathBetweenBlocks.length <= 0) {
        var pathBetweenBlocksAsCoords = this.pathBetweenBlocks(blockA, blockB);
        this.addToPath(pathBetweenBlocks, pathBetweenBlocksAsCoords);
        this.debugPath('nearest path not road', pathBetweenBlocks);
      }

      this.debugPath('nearest path road', pathBetweenBlocks);

      this.savePathCache(blockA, blockB, pathBetweenBlocks);
      return pathBetweenBlocks;
    },
    pathBetweenBlocks: function(blockA, blockB) {
      var path = this.pathBetweenBlocksAsCoordinates(blockA, blockB, 'any');
      return path;
    },

    addToPath: function(path, newPath) {
      for (var i in newPath) {
        var block = newPath[i];
        if (block.length > 0) {
          block = this.getBlockFromMap({
            x: block[0],
            y: block[1]
          });
        }
        path.push(block);
      }
    },
    debugPath: function(title, path) {
      if (!path) {
        console.log(title, 'not defined path');
        return;
      }
      console.log(title, path.map(function(e) {
        return JSON.stringify(e.blockNumber);
      }));
    },
    pathBetweenBlocksByRoad: function(blockA, blockB) {

      var path = [];
      var origin = this.findNearestStreet(blockA);
      var block;

      // find path between point A and the nearest Street

      var pathToOriginAsCoordinates = this.pathBetweenBlocks(blockA, origin);
      if (!pathToOriginAsCoordinates || !pathToOriginAsCoordinates.length) {
        return [];
      }
      this.addToPath(path, pathToOriginAsCoordinates);
      this.debugPath('nearest street', path);

      // find path between origin and destination (by road)
      var target = this.findNearestStreet(blockB);
      var pathAsCoordinates = this.pathBetweenBlocksAsCoordinates(origin, target, 'road');
      if (!pathAsCoordinates || !pathAsCoordinates.length) {
        console.log('NO ROAD CONNECTION');
        return []; // no road connection;
      }
      console.log(pathAsCoordinates);
      this.addToPath(path, pathAsCoordinates);

      var pathToDestinationAsCoordinates = this.pathBetweenBlocks(target, blockB);
      if (!pathToDestinationAsCoordinates || !pathToDestinationAsCoordinates.length) {
        return [];
      }
      this.addToPath(path, pathToDestinationAsCoordinates);
      return path;
    },
    isPathCached: function(blockA, blockB) {
      if (!blockA || !blockA.blockNumber || !blockB || !blockB.blockNumber) {
        return null;
      }
      var idBlockA = blockA.blockNumber.x + '_' + blockA.blockNumber.y;
      var idBlockB = blockB.blockNumber.x + '_' + blockB.blockNumber.y;
      if (this.paths[idBlockA]) {
        if (this.paths[idBlockA][idBlockB]) {
          if (this.counter - this.paths[idBlockA][idBlockB].counter < 100000) {
            var path = [];
            for (var i in this.paths[idBlockA][idBlockB].path) {
              path.push(this.paths[idBlockA][idBlockB].path[i]);
            }
            return path;
          }
        }
      }
    },
    savePathCache: function(blockA, blockB, path) {
      if (!blockA || !blockB) {
        return null;
      }
      var idBlockA = blockA.blockNumber.x + '_' + blockA.blockNumber.y;
      var idBlockB = blockB.blockNumber.x + '_' + blockB.blockNumber.y;
      this.paths[idBlockA] = this.paths[idBlockA] || {};
      var newPath = [];
      for (var i in path) {
        newPath.push(path[i]);
      }
      this.paths[idBlockA][idBlockB] = {
        counter: this.counter,
        path: newPath
      };
    },
    findNearestStreet: function(block) {
      if (!block) return null;
      if (block.type === 'r') {
        return block;
      } else {
        var x = block.blockNumber.x;
        var y = block.blockNumber.y;
        for (var distance = 1; distance < this.CITY_WIDTH; distance++) {
          var road = this.checkBoundariesForType('r', x, y, distance);
          if (road) {
            return road;
          }
        }
      }
    },
    checkBoundariesForType: function(type, xPos, yPos, distance) {
      var combinations = [];
      for (var y = -1 * distance; y <= distance; y++) {
        for (var x = -1 * distance; x <= distance; x++) {
          if (Math.abs(x) === distance || Math.abs(y) === distance) {
            combinations.push({
              x: 1 * xPos + x,
              y: 1 * yPos + y
            });
          }
        }
      }
      for (var i in combinations) {
        if (this.isARoad(combinations[i])) {
          return this.getBlockFromMap(combinations[i]);
        }
      }
    },
    getBlockFromMap: function(point) {
      for (var i in this.city.blocks) {
        if (
          this.city.blocks[i].blockNumber.x == point.x &&
          this.city.blocks[i].blockNumber.y == point.y
        ) {
          return this.city.blocks[i];
        }
      }
    },
    isARoad: function(point) {
      var x = point.x;
      var y = point.y;
      if (this.city.cityMap[y]) {
        if (this.city.cityMap[y][x] &&
          this.city.cityMap[y][x] === 'r'
        ) {
          return true;
        }
      }
      return false;
    },
    isWalkable: function(point) {
      var x = point.x;
      var y = point.y;
      if (this.city.cityMap[y]) {
        if (this.city.cityMap[y][x] && (
          this.city.cityMap[y][x] !== 's'
        )) {
          return true;
        }
      }
      return false;
    },
  };




  window.moletube.models.PathFinder = pathFinder;
})();