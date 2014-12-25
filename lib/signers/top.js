var ALY = require('../core');
var inherit = ALY.util.inherit;

ALY.Signers.TOP = inherit(ALY.Signers.RequestSigner, {

  addAuthorization: function addAuthorization(credentials, date) {
    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());

    this.request.path += ('&Signature=' + encodeURIComponent(signature));
  },

  stringToSign: function stringToSign() {
    var r = this.request;

    var s = 'GET&%2F&' + ALY.util.topEscape(r.path.substr(2));

    return s;
  },

  sign: function sign(secret, string) {
    if(process.env.DEBUG) {
      console.log('----------- sign string start -----------');
      console.log(string);
      console.log('----------- sign string end -----------');
    }

    return ALY.util.crypto.hmac(secret + '&', string, 'base64', 'sha1');
  }
});

module.exports = ALY.Signers.TOP;
