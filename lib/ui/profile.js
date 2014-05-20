window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var profile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.profiled = options.profiled;
    this.init();
  }
  profile.prototype = {
    height: 100,
    width: moletube.config.width,
    x: 0,
    y: moletube.config.height - 100,
    init: function() {
      this.background = new PIXI.Graphics();
      this.picture = new PIXI.Sprite.fromImage(this.profiled.imageView.big);
      this.name = new PIXI.Text(this.profiled.name, {
        font: "30px Verdana",
        fill: "#333333"
      });
      this.happy = new PIXI.Text(this.profiled.happiness + '% happy', {
        font: "20px Verdana",
        fill: "#333333"
      });
      this.rides = new PIXI.Text(this.profiled.rides + ' underground rides', {
        font: "20px Verdana",
        fill: "#333333"
      });
      this.currentStatus = new PIXI.Text(this.profiled.whatAmIDoing(), {
        font: "20px Verdana",
        fill: "#333333"
      });
      this.workHours = new PIXI.Text('Working hours: ' + this.profiled.workHours.init + ' - ' + this.profiled.workHours.end + 'h.', {
        font: "20px Verdana",
        fill: "#333333"
      });

      this.background.hitArea = new PIXI.Rectangle(this.x, this.y, this.width, this.height);
      this.background.setInteractive(true);
      this.drawProfile();
      // setTimeout(this.destroy.bind(this), 3000);
    },
    drawProfile: function() {
      this.background.clear();
      this.background.beginFill(0xD2F47A);
      var x = this.x;
      var y = this.y;
      this.background.moveTo(x, y);
      this.background.lineTo(this.width, y);
      this.background.lineTo(this.width, y + 100);
      this.background.lineTo(x, y + 100);
      this.background.lineTo(x, y);
      this.background.endFill();
      this.background.alpha = 0.6;
      this.background.viewType = 'text';

      this.stage.addVisualEntity(this.background);
      this.picture.x = this.x + 40;
      this.picture.y = this.y - 40;
      this.picture.viewType = 'text';
      // this.picture.setTexture(this.profiled.textures.big);
      this.stage.addVisualEntity(this.picture);

      this.name.x = this.x + 150;
      this.name.y = this.y + 30;
      this.name.viewType = 'text';
      this.stage.addVisualEntity(this.name);

      this.happy.x = this.x + 450;
      this.happy.y = this.y + 40;
      this.happy.viewType = 'text';
      this.stage.addVisualEntity(this.happy);

      this.workHours.x = this.x + 650;
      this.workHours.y = this.y + 60;
      this.workHours.viewType = 'text';
      this.stage.addVisualEntity(this.workHours);

      this.currentStatus.x = this.x + 650;
      this.currentStatus.y = this.y + 40;
      this.currentStatus.viewType = 'text';
      this.stage.addVisualEntity(this.currentStatus);


      this.background.click = this.mouseclick.bind(this);

    },
    mouseclick: function() {
      this.destroy();
      this.trigger('clicked');
    },
    tick: function(counter) {},
    destroy: function() {
      try {
        this.profiled.unselect();
        this.stage.pixiStage.removeChild(this.workHours)
        this.stage.pixiStage.removeChild(this.happy)
        this.stage.pixiStage.removeChild(this.name)
        this.stage.pixiStage.removeChild(this.picture)
        this.stage.pixiStage.removeChild(this.background);
      } catch (err) {

      }
    }
  }
  window.moletube.models.Profile = profile;
})()
