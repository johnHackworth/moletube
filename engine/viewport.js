window.pixEngine = window.pixEngine || {};
pixEngine.Viewport = function(options) {
  this.maxX = options.maxX;
  this.maxY = options.maxY;
  this.minX = options.minX;
  this.minY = options.minY;
  this.width = options.width;
  this.height = options.height;
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.target = [this.x, this.y]
}
pixEngine.Viewport.prototype = {
  getX: function(x) {
    return -1 * this.x + x + Math.floor(this.width / 2);
  },
  getY: function(y) {
    return -1 * this.y + y + Math.floor(this.height / 2);
  },
  getGraphicsX: function() {
    return -1 * (this.x) + this.width / 2;
  },
  getGraphicsY: function() {
    return -1 * (this.y) + this.height / 2;
  },
  panTo: function(x, y, panAmount) {
    this.panAmount = panAmount;
    this.target = [x, y];
  },
  isInsideViewPort: function(entity) {
    var x = (entity.x || entity.position.x || 1);
    var y = (entity.y || entity.position.y || 1);
    if (x + entity.width < 0 ||
      x > this.width ||
      y + entity.height < 0 ||
      y > this.height
    ) {
      return false;
    }
    return true;
  },
  hideIfNotInViewPort: function(entity) {
    if (this.isInsideViewPort(entity)) {
      entity.visible = true;
    } else {
      entity.visible = false;
    }
  },
  tick: function() {
    if (this.target[0] != this.x) {
      var orientationX = Math.abs(this.target[0] - this.x) / (this.target[0] - this.x);
      var difference = Math.abs(this.x - this.target[0]);
      if (difference > this.panAmount) {
        difference = this.panAmount;
      }
      this.x += orientationX * difference;
    }
    if (this.target[1] != this.y) {
      var orientationY = Math.abs(this.target[1] - this.y) / (this.target[1] - this.y);
      difference = Math.abs(this.y - this.target[1]);
      if (difference > this.panAmount) {
        difference = this.panAmount;
      }
      this.y += orientationY * difference;
    }
  }
}