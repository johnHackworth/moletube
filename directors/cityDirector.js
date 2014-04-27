window.moletube = window.moletube || {};
window.moletube.directors = window.moletube.directors || {};
window.moletube.config = window.moletube.config || {};
window.moletube.config.width = 1200;
window.moletube.config.height = 600;

window.moletube.currentStage = new pixEngine.Stage({
  width: window.moletube.config.width,
  height: window.moletube.config.height,
  assets: [
      'assets/logo.png',
      'assets/block.png',
      'assets/block2.png',
      'assets/block3.png',
      'assets/block4.png',
      'assets/block5.png',
      'assets/blueDot.png',
      'assets/happymole.png',
      'assets/mole1.png',
      'assets/mole1big.png',
      'assets/mole1_1.png',
      'assets/mole1_2.png',
      'assets/mole1_1b.png',
      'assets/mole1_2b.png',
      'assets/mole2.png',
      'assets/mole2big.png',
      'assets/mole2_1.png',
      'assets/mole2_2.png',
      'assets/mole2_1b.png',
      'assets/mole2_2b.png',
      'assets/mole3.png',
      'assets/mole3big.png',
      'assets/mole3_1.png',
      'assets/mole3_2.png',
      'assets/mole3_1b.png',
      'assets/mole3_2b.png',
      'assets/mole4.png',
      'assets/mole4big.png',
      'assets/mole4_1.png',
      'assets/mole4_2.png',
      'assets/mole4_1b.png',
      'assets/mole4_2b.png',
      'assets/metroButton.png',
      'assets/metroButtonHover.png',
      'assets/metroStation.png',
      'assets/L1.png',
      'assets/L1on.png',
      'assets/L2.png',
      'assets/L2on.png',
      'assets/L3.png',
      'assets/L3on.png',
      'assets/L4.png',
      'assets/L4on.png',
      'assets/factory1.png',
      'assets/factory2.png',
      'assets/factory3.png',
      'assets/factory4.png',
      'assets/factory5.png',
      'assets/factory6.png',
      'assets/factory7.png',
      'assets/factory8.png'
  ],
  init: function(stage) {
    this.cityVisible = true;
    this.city = new moletube.models.City({
      x: 600,
      y: -85,
      stage: this
    })
    this.engine.addEntity(this.city);
    this.city.drawCity();
    this.metroButton = new moletube.models.MetroButton({
      stage: this,
      x: 1000,
      y: 0
    });

    this.lineButtons = [];

    this.lineButtonSelected = function(lineButton) {
      this.city.unselectLine();
      for(var i in this.lineButtons) {
        if(lineButton != this.lineButtons[i]) {
          this.lineButtons[i].deselect();
        }
      }
      this.city.selectLine(lineButton);
    }

    this.lineButtonUnselected = function() {
      this.city.unselectLine();
    }

    this.showLineButtons = function(lineButton) {
      for(var i in this.lineButtons) {
        this.lineButtons[i].show();
      }
    }

    this.hideLineButtons = function(lineButton) {
      for(var i in this.lineButtons) {
        this.lineButtons[i].hide();
      }
    }

    for(var i in this.city.lines) {
      this.lineButtons.push(new moletube.models.LineButton({
        line: this.city.lines[i].lineData.line,
        stage: this,
        color: this.city.lines[i].lineData.color
      }));
    };
    for(var i in this.lineButtons) {
      this.lineButtons[i].on('selected', this.lineButtonSelected.bind(this));
      this.lineButtons[i].on('unselected', this.lineButtonUnselected.bind(this));
    }
    this.hideLineButtons();

    this.toggleMetro = function() {
      if(this.cityVisible) {
        this.showMetro();
      } else {
        this.hideMetro();
      }
    },
    this.showMetro = function() {
      this.cityVisible = false;
      this.showLineButtons();
      this.city.setTransparentBuildings();
    },
    this.hideMetro = function() {
      this.cityVisible = true;
      this.hideLineButtons();
      this.city.setOpaqueBuildings();
    }

    this.showWarning = function(text, time) {
      time = time || 2000;
      if(this.warningText) {
        this.removeWarning();
      }
      this.warningText = new PIXI.Text(text,
        {font:"20px Verdana", fill:"#FF5555", strokeThickness: 3, stroke:"#000000"}
      );
      this.warningText.viewType = "text"
      this.warningText.y = 10;
      this.warningText.x = 500;
      this.addInvisibleEntity(this.warningText);
      this.warningText.interval = setTimeout(this.removeWarning.bind(this), time);
    }
    this.removeWarning = function() {
      clearTimeout(this.warningText.interval);
      this.pixiStage.removeChild(this.warningText);
      this.warningText = null;
    }
    this.metroButton.on('clicked', this.toggleMetro.bind(this));
    this.city.on('warning', this.showWarning.bind(this));
    this.title = new moletube.models.Title({stage: moletube.currentStage, profiled: moletube.currentStage.city.moles[0]})

    document.getElementById('loader').remove();

  },

})

window.moletube.currentStage.init()
