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
    height: 150,
    width: 400,
    init: function() {
      this.background = new PIXI.Graphics();
      this.picture = new PIXI.Sprite.fromImage(this.profiled.imageView.big);
      this.name = new PIXI.Text(this.profiled.name, {font:"30px Verdana", fill:"#333333"});
      this.happy = new PIXI.Text(this.profiled.happiness +'% happy', {font:"20px Verdana", fill:"#333333"});
      this.rides = new PIXI.Text(this.profiled.rides +' underground rides', {font:"20px Verdana", fill:"#333333"});
      this.workHours = new PIXI.Text('Working hours: ' + this.profiled.workHours.init +' - ' + this.profiled.workHours.end + 'h.', {font:"20px Verdana", fill:"#333333"});

      this.background.hitArea = new PIXI.Rectangle(400,50,400,200);
      this.background.setInteractive(true);
      this.x = this.profiled.view.x;
      this.y = this.profiled.view.y;
      this.drawProfile();
      setTimeout(this.destroy.bind(this), 3000);
    },
    drawProfile: function() {
      this.background.clear();
      this.background.beginFill(0xF4D27A);
      this.background.lineStyle(5, 0x517281, 1);
      var x = this.x;
      var y = this.y;
      this.background.moveTo(x, y - 200);
      this.background.lineTo(x + 500, y - 200);
      this.background.lineTo(x + 500, y);
      this.background.lineTo(x, y);
      this.background.lineTo(x, y - 200);
      this.background.endFill();
      this.background.viewType = 'text';

      this.stage.addInvisibleEntity(this.background);
      this.picture.x = this.x - 20;
      this.picture.y = this.y - 180;
      this.picture.viewType = 'text';
      // this.picture.setTexture(this.profiled.textures.big);
      this.stage.addInvisibleEntity(this.picture);

      this.name.x = this.x + 150;
      this.name.y = this.y - 180;
      this.name.viewType = 'text';
      this.stage.addInvisibleEntity(this.name);

      this.happy.x = this.x + 150;
      this.happy.y = this.y - 120;
      this.happy.viewType = 'text';
      this.stage.addInvisibleEntity(this.happy);

      this.rides.x = this.x + 150;
      this.rides.y = this.y - 80;
      this.rides.viewType = 'text';
      this.stage.addInvisibleEntity(this.rides);

      this.workHours.x = this.x + 150;
      this.workHours.y = this.y - 50;
      this.workHours.viewType = 'text';
      this.stage.addInvisibleEntity(this.workHours);

      this.background.click = this.mouseclick.bind(this);

    },
    mouseclick: function() {
      this.destroy();
      this.trigger('clicked');
    },
    tick: function(counter) {
    },
    destroy: function() {
      console.log('destroy')
      try {
        this.stage.pixiStage.removeChild(this.workHours)
        this.stage.pixiStage.removeChild(this.rides)
        this.stage.pixiStage.removeChild(this.happy)
        this.stage.pixiStage.removeChild(this.name)
        this.stage.pixiStage.removeChild(this.picture)
        this.stage.pixiStage.removeChild(this.background);
      } catch(err) {

      }
    }
  }
  window.moletube.models.Profile = profile;
})()
