window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var mole = function(options) {
    this.options = options;
    this.stage = options.stage;
    pixEngine.utils.extend.call(this, window.moletube.models.JohnMole, true, options);
    this.initScrooge();
  };
  mole.prototype = {
    money: 1000000,
    currentProjects: [],
    properties: [],
    assets: [{
      standing: 'assets/mole6.png',
      big: 'assets/mole6.png',
      moving: [
        'assets/mole6_2.png',
        'assets/mole6_1.png'
      ],
      movingBack: [
        'assets/mole6_2b.png',
        'assets/mole6_1b.png'
      ]
    }],
    initScrooge: function() {
      this.currentProjects = [];
      this.properties = [];
    },
    onTick: function() {
      if (this.counter % 60 === 0) {
        this.updateHappiness();
      }
      if (!this.home && this.counter % 200 === 0 && Math.random() > 0.75) {
        this.getAHome();
      }
      if (this.counter % 1000 === 0 && Math.random() > 0.1) {
        this.checkProjects();
      }
      if (this.counter + 100 % 5000 && Math.random() > 0.25) {
        this.checkInversions();
      }
    },
    getAHome: function() {
      var home = this.city.houses.getFreeUpperClassHouse();
      console.log('a');
      if (home) {
        console.log(home)
        home.building.buy(this);
      }
    },
    checkProjects: function() {
      if (this.currentProjects.length === 0 && this.money > 20000) {
        this.createProject({
          name: "Workers houses",
          building: moletube.models.WorkersHousing1,
          blockType: moletube.models.HousingBlock,
          owner: this
        });
      }
    },
    createProject: function(project) {
      this.currentProjects.push(project);
      this.city.projects.addProject(project);
    },
    createProperty: function(property) {
      this.properties.push(property);
    },
    checkInversions: function() {
      var props = this.city.getPropertiesOnSale();
      if (props.length > 0) {
        var n = Math.floor(Math.random() * props.length);
        if (props[n].cost < this.money) {
          props[n].buy(this);
        }
      }
    }
  };

  window.moletube.models.ScroogeMcMole = mole;
})();