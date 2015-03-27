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

  // when building the stringToSign, these querystring params should be
  // part of the canonical resource string with their NON-encoded values
  responseHeaders: {
    'response-content-type': 1,
    'response-content-language': 1,
    'response-expires': 1,
    'response-cache-control': 1,
    'response-content-disposition': 1,
    'response-content-encoding': 1
  },

  addAuthorization: function addAuthorization(credentials, date) {
    // if (!this.request.headers['presigned-expires']) {
    //   this.request.headers['Date'] = ALY.util.date.rfc822(date);
    // }

    // if (credentials.sessionToken) {
    //   // presigned URLs require this header to be lowercased
    //   this.request.headers['x-amz-security-token'] = credentials.sessionToken;
    // }

    var globalQuery = {
      'Version': 'v2',
      'AccessKeyId': credentials.accessKeyId,
      'SignatureMethod': 'HMAC-SHA1',
      'Timestamp': new Date().toISOString().replace(/\.\d{3}/, ''),
      'SignatureVersion': '1.0',
      'SignatureNonce': String(new Date().getTime()) + randomNumbers(4)
    };

    var parts = [];
    Object.keys(globalQuery).forEach(function(key) {
      parts.push(key + '=' + encodeURIComponent(globalQuery[key]));
    });
    this.request.path += '?' + parts.join('&');

    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());
    this.request.path += '&Signature=' + signature;
    // var auth = 'OSS ' + credentials.accessKeyId + ':' + signature;

    // this.request.headers['Authorization'] = auth;
  },

  stringToSign: function stringToSign() {
    var r = this.request;

    var parts = [];
    parts.push(r.method);
    // parts.push(r.headers['Content-MD5'] || '');
    // parts.push(r.headers['Content-Type'] || '');

    // This is the "Date" header, but we use X-Amz-Date.
    // The S3 signing mechanism requires us to pass an empty
    // string for this Date header regardless.
    // this works:
    // getSignedUrl use 'presigned-expires'
    // other request use 'Date'
    // parts.push(r.headers['presigned-expires'] || r.headers['Date'] || '');

    parts.push(encodeURIComponent('/'));
    // var headers = this.canonicalizedAmzHeaders();
    // if (headers) parts.push(headers);
    parts.push(encodeURIComponent(this.canonicalizedQueryString()));

    return parts.join('&');

  },

  canonicalizedQueryString: function canonicalizedQueryString() {

    var r = this.request;
    var querystring = r.path.split('?')[1];
    var resource = '';

    if (querystring) {

      // collect a list of sub resources and query params that need to be signed
      var resources = [];

      ALY.util.arrayEach.call(this, querystring.split('&'), function (param) {
        var name = param.split('=')[0];
        var value = param.split('=')[1];
        /*jshint undef:false */

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
            querystring.push(resource.name);
          else
            querystring.push(resource.name + '=' + encodeURIComponent(resource.value));
        });

        resource += querystring.join('&');
      }

    }

    return resource;

  },

  sign: function sign(secret, string) {
    console.log('----------- sign string start -----------');
    console.log(string);
    console.log('----------- sign string end -----------');
    return ALY.util.crypto.hmac(secret + '&', string, 'base64', 'sha1');
  }
});

module.exports = ALY.Signers.OpenSearch;