window.moletube = window.moletube || {};
window.moletube.directors = window.moletube.directors || {};

window.moletube.currentStage = new pixEngine.Stage({
  width: window.moletube.config.width,
  height: window.moletube.config.height,
  assets: [
    'assets/logo.png',
    'assets/tile.png',
    'assets/birdie.png',
    'assets/birdie1.png',
    'assets/birdie2.png',
    'assets/block.png',
    'assets/block2.png',
    'assets/block3.png',
    'assets/block4.png',
    'assets/block5.png',
    'assets/block6.png',
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
    'assets/mole5.png',
    'assets/mole5_1.png',
    'assets/mole5_2.png',
    'assets/mole5_1b.png',
    'assets/mole5_2b.png',
    'assets/mole6.png',
    'assets/mole6_1.png',
    'assets/mole6_2.png',
    'assets/mole6_1b.png',
    'assets/mole6_2b.png',
    'assets/mole7.png',
    'assets/mole7_1.png',
    'assets/mole7_2.png',
    'assets/mole7_1b.png',
    'assets/mole7_2b.png',
    'assets/mole8.png',
    'assets/mole8_1.png',
    'assets/mole8_2.png',
    'assets/mole8_1b.png',
    'assets/mole8_2b.png',
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
    'assets/factory8.png',
    'assets/parks1.png',
    'assets/parks2.png',
    'assets/parks3.png',
    'assets/parks4.png',
    'assets/stadium.png',
    'assets/farm.png',
    'assets/kaiju1.png',
    'assets/kaiju1_1.png',
    'assets/kaiju1_2.png',
    'assets/tiles/grass.png',
    'assets/tiles/road1111.png',
    'assets/tiles/road1110.png',
    'assets/tiles/road1100.png',
    'assets/tiles/road1101.png',
    'assets/tiles/road1000.png',
    'assets/tiles/road1001.png',
    'assets/tiles/road1001.png',
    'assets/tiles/road1011.png',
    'assets/tiles/road0111.png',
    'assets/tiles/road0110.png',
    'assets/tiles/road0100.png',
    'assets/tiles/road0101.png',
    'assets/tiles/road0000.png',
    'assets/tiles/road0001.png',
    'assets/tiles/road0001.png',
    'assets/tiles/road0011.png',
    'assets/tiles/beach1111.png',
    'assets/tiles/beach1110.png',
    'assets/tiles/beach1100.png',
    'assets/tiles/beach1101.png',
    'assets/tiles/beach1000.png',
    'assets/tiles/beach1001.png',
    'assets/tiles/beach1001.png',
    'assets/tiles/beach1011.png',
    'assets/tiles/beach0111.png',
    'assets/tiles/beach0110.png',
    'assets/tiles/beach0100.png',
    'assets/tiles/beach0101.png',
    'assets/tiles/beach0000.png',
    'assets/tiles/beach0001.png',
    'assets/tiles/beach0001.png',
    'assets/tiles/beach0011.png',
    'assets/tiles/beach0000-1100.png',
    'assets/tiles/beach0000-0110.png',
    'assets/tiles/beach0000-0011.png',
    'assets/tiles/beach0000-1001.png',
    'assets/tiles/factoryFloor.png',
  ],
  init: function(stage) {
    this.cityVisible = true;
    this.city = new moletube.models.City({
      x: 600,
      y: moletube.config.height / 2,
      stage: this
    });
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
      for (var i in this.lineButtons) {
        if (lineButton != this.lineButtons[i]) {
          this.lineButtons[i].deselect();
        }
      }
      this.city.selectLine(lineButton);
    }

    this.lineButtonUnselected = function() {
      this.city.unselectLine();
    }

    this.showLineButtons = function(lineButton) {
      for (var i in this.lineButtons) {
        this.lineButtons[i].show();
      }
    }

    this.hideLineButtons = function(lineButton) {
      for (var i in this.lineButtons) {
        this.lineButtons[i].hide();
      }
    }

    for (var i in this.city.lines) {
      this.lineButtons.push(new moletube.models.LineButton({
        line: this.city.lines[i].lineData.line,
        stage: this,
        color: this.city.lines[i].lineData.color
      }));
    };
    for (var i in this.lineButtons) {
      this.lineButtons[i].on('selected', this.lineButtonSelected.bind(this));
      this.lineButtons[i].on('unselected', this.lineButtonUnselected.bind(this));
    }
    this.hideLineButtons();

    this.toggleMetro = function() {
      if (this.cityVisible) {
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
      if (this.warningText) {
        this.removeWarning();
      }
      this.warningText = new PIXI.Text(text, {
        font: "20px Verdana",
        fill: "#FF5555",
        strokeThickness: 3,
        stroke: "#000000"
      });
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
    this.title = new moletube.models.Title({
      stage: moletube.currentStage,
      profiled: moletube.currentStage.city.moles[0]
    });

    document.getElementById('loader').remove();

  },

})

window.moletube.currentStage.init()