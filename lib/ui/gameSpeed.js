window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var menu = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.x = options.x;
    this.init();
  };
  menu.prototype = {
    height: moletube.config.height,
    y: 0,
    init: function() {
      this.initButtons();
    },
    initButtons: function() {
      this.buttons = [];
      this.speed0 = this.speedButton(0, 'x0', 0);
      this.speed0 = this.speedButton(6, 'x0.5', 25);
      this.speed0 = this.speedButton(3, 'x1', 60);
      this.speed0 = this.speedButton(2, 'x2', 85);
      this.speed0 = this.speedButton(1, 'x3', 115);
    },
    speedButton: function(speed, text, x) {

      this['speed' + speed] = this.stage.addText(text, {
        x: this.x + x,
        y: this.y + 60,
        fontSize: '14px',
        color: '#FAFAFA'
      }, []);
      this['speed' + speed].setInteractive(true);
      this['speed' + speed].click = this.setSpeed.bind(this, speed);
      this.buttons.push(this['speed' + speed]);
    },
    setSpeed: function(speed) {
      this.stage.engine.speed = speed;
      for (var i = 0, l = this.buttons.length; i < l; i++) {
        this.buttons[i].style.fill = '#FAFAFA';
        this.buttons[i].dirty = true;
      }
      this['speed' + speed].style.fill = '#FFFF00';
      this['speed' + speed].dirty = true;
    }
  };
  window.moletube.models.GameSpeedMenu = menu;
})();