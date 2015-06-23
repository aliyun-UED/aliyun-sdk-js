var ALY = require('../core');
var inherit = ALY.util.inherit;

ALY.Signers.POP = inherit(ALY.Signers.RequestSigner, {

  addAuthorization: function addAuthorization(credentials, date) {
  },

});

module.exports = ALY.Signers.POP;
