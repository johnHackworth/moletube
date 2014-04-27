window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var title = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.init();
  }
  title.prototype = {
    height: 150,
    width: 400,
    init: function() {
      this.background = new PIXI.Graphics();
      this.picture = new PIXI.Sprite.fromImage('assets/logo.png');
      this.text = new PIXI.Text(
        'The former mining city of Moletown is slowly becoming the jewel\n of the northern Moleland. Moles from all over the world are \n arriving to the city thanks to its sprawling industry. The \n city has grow too much in the last years, and now is too \n large. \n Moletownies has to walk too to arrive from home to work, and \n their life is becoming less happy than it should.  \n \n Moletown needs you! \n \n Moletown needs a mass transist system! \n \n Moletown needs a monorail! \n \n Err, no, Moletown needs an efficient underground network ... \n Build a underground network to help moletownies to go from their  \n homes to their workplaces and back, and keep them happy! \n \n Click anywhere to begin.',
        {font:"16px Verdana", fill:"#333333"});

      this.background.hitArea = new PIXI.Rectangle(200,100,800,400);
      this.background.setInteractive(true);
      this.x = 200;
      this.y = 50;
      this.drawtitle();
    },
    drawtitle: function() {
      this.background.clear();
      this.background.beginFill(0xFFFFDD);
      this.background.alpha = 0.8;
      this.background.lineStyle(5, 0x999999, 1);
      var x = this.x;
      var y = this.y;
      this.background.moveTo(x, y + 500);
      this.background.lineTo(x + 800, y + 500);
      this.background.lineTo(x + 800, y);
      this.background.lineTo(x, y);
      this.background.lineTo(x, y + 500);
      this.background.endFill();
      this.background.viewType = 'text';

      this.stage.addInvisibleEntity(this.background);
      this.picture.x = this.x + 150;
      this.picture.y = this.y + 10;
      this.picture.viewType = 'text';
      this.stage.addInvisibleEntity(this.picture);

      this.text.x = this.x + 100;
      this.text.y = this.y + 130;
      this.text.viewType = 'text';
      this.stage.addInvisibleEntity(this.text);


      this.background.click = this.mouseclick.bind(this);

    },
    mouseclick: function() {
      this.destroy();
      this.trigger('clicked');
    },
    tick: function(counter) {
    },
    destroy: function() {
      try {
        this.stage.pixiStage.removeChild(this.text)
        this.stage.pixiStage.removeChild(this.picture)
        this.stage.pixiStage.removeChild(this.background);
      } catch(err) {

      }
      this.stage.engine.running = true;
    }
  }
  window.moletube.models.Title = title;
})()
