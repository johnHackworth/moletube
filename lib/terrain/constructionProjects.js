window.moletube = window.moletube || {};
window.moletube.models = window.moletube.models || {};

(function() {
  var projects = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.city = options.city;
    this.init();
  };
  projects.prototype = {
    counter: 0,
    init: function() {
      this.projects = [];
    },
    tick: function(counter) {

    },
    addProject: function(project) {
      this.projects.push(project);
    },
    get: function(n) {
      if (!n) n = 0;
      return this.projects[n];
    },
    getProjects: function() {
      return this.projects;
    }

  };

  window.moletube.models.ConstructionProjects = projects;
})();