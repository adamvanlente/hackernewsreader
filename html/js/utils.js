var utils = {

  get: function(id) {
   return document.getElementById(id);
  },

  make: function(type) {
   return document.createElement(type);
  },

  fill: function(div, content) {
   div.innerHTML = content;
  },

  empty: function(div) {
   div.innerHTML = '';
  },

  show: function(id) {
    utils.get(id).style.display = 'block';
  },

  hide: function(id) {
    utils.get(id).style.display = 'none';
  },

  classify: function(id, className) {
    utils.get(id).className = className;
  },

};