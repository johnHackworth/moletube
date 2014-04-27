window.pixEngine = window.pixEngine || {};

(function() {
  var mouse = function(w, h, stage) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    var self = this;
    this.element = new PIXI.Graphics();
    this.element.hitArea = new PIXI.Rectangle(0, 0, w, h);
    this.element.setInteractive(true)
    stage.addInvisibleEntity(this.element);

    this.element.click = function(mousedata)  {
      self.trigger('click', mousedata)
    }
  }

  window.pixEngine.Mouse = mouse;
})()
