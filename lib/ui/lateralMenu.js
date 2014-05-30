window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var menu = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.city = options.stage.city;
    this.stage = options.stage;
    this.init();
  };
  menu.prototype = {
    height: moletube.config.height,
    width: 100,
    x: moletube.config.width - 100,
    y: 0,
    init: function() {
      this.currentOptions = [];

      this.background = new PIXI.Graphics();
      this.background.clear();
      this.background.beginFill(0xD2F47A);
      var x = this.x;
      var y = 0;
      this.background.moveTo(x, y);
      this.background.lineTo(this.x + this.width, y);
      this.background.lineTo(this.x + this.width, y + this.height);
      this.background.lineTo(x, y + this.height);
      this.background.lineTo(x, y);
      this.background.endFill();
      this.background.alpha = 0.6;
      this.background.viewType = 'text';

      this.stage.addVisualEntity(this.background);

      this.closeButton = new PIXI.Text('close', {
        font: "20px Verdana",
        fill: "#333333"
      });

      this.closeButton.x = this.x + 20;
      this.closeButton.y = this.y + this.height - 20;
      this.closeButton.viewType = 'text';
      this.stage.addVisualEntity(this.closeButton);
      this.closeButton.setInteractive(true);

      this.closeButton.click = this.mouseclick.bind(this);

      this.drawMenu();
    },
    drawMenu: function() {
      var projects = this.city.projects.getProjects();
      for (var i in projects) {
        var project = new PIXI.Sprite.fromImage(projects[i].building.prototype.assets[0]);
        project.imageUrl = projects[i].building.prototype.assets[0];
        project.data = projects[i];
        this.currentOptions.push(project);
        project.setInteractive(true);
        project.click = this.clickProject.bind(this, project);
        project.x = this.x + 10;
        project.y = 10 + i * 60;
        // project.view.scale.set(0.4, 0.4);
        project.viewType = 'text';

        project.mouseover = this.overProject.bind(this, project);
        project.mouseout = this.outProject.bind(this, project);

        this.stage.addVisualEntity(project);
      }
    },
    clickProject: function(project) {
      if (this.city.selectedProject) {
        this.city.selectedProject.tint = 0xFFFFFF;
      }
      this.city.selectedProject = project;
      project.tint = 0xFF0000;
    },
    overProject: function(project) {
      if (project !== this.city.selectedProject) {
        project.tint = (0xFFFF00);
      }
    },
    outProject: function(project) {
      if (project !== this.city.selectedProject) {
        project.tint = (0xFFFFFF);
      }
    },
    mouseclick: function() {
      this.destroy();
      this.trigger('clicked');
    },
    tick: function(counter) {},
    destroy: function() {
      try {
        this.city.selectedProject = null;
        if (this.background) this.stage.pixiStage.removeChild(this.background);
        if (this.closeButton) this.stage.pixiStage.removeChild(this.closeButton);
        for (var i in this.currentOptions) {
          this.stage.pixiStage.removeChild(this.currentOptions[i]);
        }
        this.stage.resaltTiles = false;
      } catch (err) {

      }
    }
  };
  window.moletube.models.LateralMenu = menu;
})();