window.pixEngine = window.pixEngine || {};
window.pixEngine.utils = window.pixEngine.utils || {};

window.pixEngine.utils.extend = function(object, keepExisting) {
  object.call(this);
  for (var n in object.prototype) {
    if (!keepExisting) {
      this[n] = object.prototype[n];
    } else if (!this[n]) {
      this[n] = object.prototype[n];
    }
  }
};