var ALY = require('../core');
var inherit = ALY.util.inherit;

ALY.Signers.TOP = inherit(ALY.Signers.RequestSigner, {

  // sign 已经在 service_interface/top 中实现了
  addAuthorization: function addAuthorization(credentials, date) {

  }

});

module.exports = ALY.Signers.TOP;
