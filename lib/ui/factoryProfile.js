window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var profile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.profiled = options.profiled;
    this.init();
  };
  profile.prototype = {
    height: moletube.config.height - 100,
    width: moletube.config.width - 100,
    x: 50,
    y: 50,
    init: function() {
      window.w = this;
      this.destroyables = [];
      this.stage.overlayManager.clean();
      this.stage.overlayManager.addLayer(this);
      this.background = this.stage.addBackground(this.x, this.y, this.width, this.height, 0xD2F47A, 0.6, this.destroyables);

      this.closeButton = this.stage.addText('close', {
        x: this.x + this.width - 100,
        y: this.y + 20,
        fontSize: '20px',
        color: '#333333'
      }, this.destroyables);
      this.centerButton = this.stage.addText('center', {
        x: this.x + this.width - 100,
        y: this.y + 50,
        fontSize: '20px',
        color: '#333333'
      }, this.destroyables);
      this.closeButton.setInteractive(true);
      this.centerButton.setInteractive(true);
      this.closeButton.click = this.mouseclick.bind(this);
      this.centerButton.click = this.clickCenter.bind(this);
      this.drawProfile();
      this.showLocation();
    },
    showLocation: function() {
      var location = this.stage.addText(this.profiled.block.blockNumber.x + '-' + this.profiled.block.blockNumber.y, {
        x: this.x + this.width - 200,
        y: this.y + 20,
        fontSize: '30px',
        color: '#555533',
        centered: true
      }, this.destroyables);
    },
    showOwner: function() {
      this.titleOwner = this.stage.addText('Owner', {
        x: this.x + 270,
        y: this.y + 10,
        fontSize: '10px',
        color: '#333333',
        centered: true
      }, this.destroyables);
      this.pictureOwner = this.stage.addImage(this.profiled.owner.imageView.standing, {
          x: this.x + 270,
          y: this.y + 25,
          scale: 0.5,
          centered: true
        },
        this.destroyables);
      this.nameOwner = this.stage.addText(this.profiled.owner.name, {
        x: this.x + 270,
        y: this.y + 90,
        fontSize: '10px',
        color: '#555533',
        centered: true
      }, this.destroyables);
    },
    drawProfile: function() {
      this.pictureBuilding = this.stage.addImage(this.profiled.imageView, {
          x: this.x + 40,
          y: this.y + 20,
          scale: 1.2
        },
        this.destroyables);

      if (this.profiled.owner) {
        this.showOwner();
      }
      this.drawProduct();
      this.drawWorkers();
      this.drawCosts();
      this.drawRevenue();
    },
    mouseclick: function() {
      this.destroy();
      this.trigger('clicked');
    },
    drawWorkers: function() {
      if (this.profiled.pops) {
        this.titleWorkers = this.stage.addText('Workers', {
          x: this.x + 400,
          y: this.y + 10,
          fontSize: '10px',
          color: '#333333',
          centered: true
        }, this.destroyables);
        var n = 0;
        for (var i in this.profiled.pops) {
          var molesPicture = this.stage.addImage(this.profiled.pops[i].imageView.standing, {
              x: this.x + 400 + n * 50,
              y: this.y + 30,
              scale: 0.5,
              centered: true
            },
            this.destroyables);
          molesPicture.setInteractive(true);
          var molesName = this.stage.addText(this.profiled.pops[i].name, {
            x: this.x + 400 + n * 50,
            y: this.y + 90,
            fontSize: '10px',
            color: '#333333',
            centered: true
          }, this.destroyables);
          molesName.alpha = 0.2;
          molesPicture.molesName = molesName;
          molesPicture.mouseover = function() {
            this.molesName.alpha = 1;
          };

          molesPicture.mouseout = function() {
            this.molesName.alpha = 0.2;
          };

          n++;
        }
      }
    },
    clickCenter: function() {
      this.profiled.centerView();
    },
    drawProduct: function() {
      this.titleProduct = this.stage.addText('Production:', {
        x: this.x + 50,
        y: this.y + 130,
        fontSize: '10px',
        color: '#333333',
        centered: true
      }, this.destroyables);
      this.nameProduct = this.stage.addText(this.profiled.productName, {
        x: this.x + 50,
        y: this.y + 150,
        fontSize: '15px',
        color: '#555555',
        centered: true
      }, this.destroyables);
    },
    drawCosts: function() {
      var total = this.stage.addText('Total Costs', {
        x: this.x + 150,
        y: this.y + 130,
        fontSize: '10px',
        color: '#333333',
        centered: true
      }, this.destroyables);
      var totalValue = this.stage.addText(this.profiled.totalCosts, {
        x: this.x + 150,
        y: this.y + 150,
        fontSize: '15px',
        color: '#995555',
        centered: true
      }, this.destroyables);
      var product = this.stage.addText('Product Costs', {
        x: this.x + 250,
        y: this.y + 130,
        fontSize: '10px',
        color: '#333333',
        centered: true
      }, this.destroyables);
      var productValue = this.stage.addText(this.profiled.productCosts, {
        x: this.x + 250,
        y: this.y + 150,
        fontSize: '15px',
        color: '#995555',
        centered: true
      }, this.destroyables);
      var wages = this.stage.addText('Wages Costs', {
        x: this.x + 350,
        y: this.y + 130,
        fontSize: '10px',
        color: '#333333',
        centered: true
      }, this.destroyables);
      var wagesValue = this.stage.addText(this.profiled.wagesCosts, {
        x: this.x + 350,
        y: this.y + 150,
        fontSize: '15px',
        color: '#995555',
        centered: true
      }, this.destroyables);
    },
    drawRevenue: function() {
      var total = this.stage.addText('Total Revenues', {
        x: this.x + 450,
        y: this.y + 130,
        fontSize: '10px',
        color: '#333333',
        centered: true
      }, this.destroyables);
      var totalValue = this.stage.addText(this.profiled.totalRevenue, {
        x: this.x + 450,
        y: this.y + 150,
        fontSize: '15px',
        color: '#559955',
        centered: true
      }, this.destroyables);
    },
    tick: function(counter) {},
    destroy: function() {
      try {
        while (this.destroyables.length) {
          var destroyable = this.destroyables.shift();
          this.stage.pixiStage.removeChild(destroyable);
        }
      } catch (err) {

      }
    }
  };
  window.moletube.models.FactoryProfile = profile;
})();