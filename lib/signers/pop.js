var ALY = require('../core');
var inherit = ALY.util.inherit;

ALY.Signers.POP = inherit(ALY.Signers.RequestSigner, {

  addAuthorization: function addAuthorization(credentials, date) {
    return;
    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());

    //this.request.body.Signature = encodeURIComponent(signature);
    //this.request.body = JSON.stringify(this.request.body);
    this.request.headers['Signature'] = signature;
  },

  stringToSign: function stringToSign() {
    // ["StsVersion", "Action", "Name", "Policy", "DurationSeconds"]

    var r = this.request;

    var body = JSON.parse(r.body);

    var headers = [];

    ALY.util.each(body, function (name) {
      headers.push(name);
    });

    headers.sort(function (a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    var canonicalizedQueryString = "";
    ALY.util.arrayEach.call(this, headers, function (name) {
      canonicalizedQueryString += "&" + name + "=" + ALY.util.topEscape(body[name]);
    });

    return 'POST&%2F&' + ALY.util.topEscape(canonicalizedQueryString.substr(1));
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
