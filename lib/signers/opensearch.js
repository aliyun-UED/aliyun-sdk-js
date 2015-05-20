var ALY = require('../core');
var inherit = ALY.util.inherit;

function randomNumbers(count) {
  var num = '';
  for (var i = 0; i < count; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

/**
 * @api private
 */
ALY.Signers.OpenSearch = inherit(ALY.Signers.RequestSigner, {

  addAuthorization: function addAuthorization(credentials, date) {
    // if (!this.request.headers['presigned-expires']) {
    //   this.request.headers['Date'] = ALY.util.date.rfc822(date);
    // }

    // if (credentials.sessionToken) {
    //   // presigned URLs require this header to be lowercased
    //   this.request.headers['x-amz-security-token'] = credentials.sessionToken;
    // }
    var date = new Date();

    var globalQuery = {
      'Version': 'v2',
      'AccessKeyId': credentials.accessKeyId,
      'SignatureMethod': 'HMAC-SHA1',
      'SignatureVersion': '1.0',
      'SignatureNonce': String(date.getTime()) + randomNumbers(4),
      'Timestamp': date.toISOString().replace(/\.\d{3}/, '')
    };

    var parts = [];
    Object.keys(globalQuery).forEach(function(key) {
      parts.push(key + '=' + encodeURIComponent(globalQuery[key]));
    });
    this.request.path += (this.request.path.indexOf('?') == -1? '?' : '&') + parts.join('&');

    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());
    this.request.path += '&Signature=' + encodeURIComponent(signature);
    // var auth = 'OSS ' + credentials.accessKeyId + ':' + signature;

    // this.request.headers['Authorization'] = auth;
  },

  stringToSign: function stringToSign() {
    var r = this.request;

    var s = r.method + '&%2F&' + encodeURIComponent(this.canonicalizedQueryString());

    return s;
  },

  canonicalizedQueryString: function canonicalizedQueryString() {

    var r = this.request;
    var querystring = r.path.split('?')[1];
    var resource = '';
    if (r.body) {
      querystring += '&' + r.body;
    }

    if (querystring) {

      // collect a list of sub resources and query params that need to be signed
      var resources = [];

      ALY.util.arrayEach.call(this, querystring.split('&'), function (param) {
        var pos = param.indexOf('=');
        var name = param.slice(0, pos);
        var value = param.slice(pos + 1);

        var resource = { name: name };
        if (value !== undefined) {
          resource.value = decodeURIComponent(value);
        }

        resources.push(resource);
      });

      resources.sort(function (a, b) { return a.name < b.name ? -1 : 1; });

      if (resources.length) {

        querystring = [];
        ALY.util.arrayEach(resources, function (resource) {
          if (resource.value === undefined)
            querystring.push(ALY.util.opensearchEscape(resource.name));
          else
            querystring.push(ALY.util.opensearchEscape(resource.name) + '=' + ALY.util.opensearchEscape(resource.value));
        });

        resource += querystring.join('&');
      }
    }

    return resource;
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

module.exports = ALY.Signers.OpenSearch;