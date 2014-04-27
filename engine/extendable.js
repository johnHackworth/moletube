window.pixEngine = window.pixEngine || {};
window.pixEngine.utils = window.pixEngine.utils || {};

window.pixEngine.utils.extend = function(object) {
  object.call(this);
  for(var n in object.prototype) {
    this[n] = object.prototype[n]
  }
};

