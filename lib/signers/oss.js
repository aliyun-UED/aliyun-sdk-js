var ALY = require('../core');
var inherit = ALY.util.inherit;

/**
 * @api private
 */
ALY.Signers.OSS = inherit(ALY.Signers.RequestSigner, {

  subResources: {
    "acl": 1,
    "uploads": 1,
    "location": 1,
    "cors": 1,
    "logging": 1,
    "website": 1,
    "referer": 1,
    "lifecycle": 1,
    "delete": 1,
    "append": 1,
    "tagging": 1,
    "objectMeta": 1,
    "uploadId": 1,
    "partNumber": 1,
    "security-token": 1,
    "position": 1,
    "img": 1,
    "style": 1,
    "styleName": 1,
    "replication": 1,
    "replicationProgress": 1,
    "replicationLocation": 1,
    'restore': 1,
    "cname": 1,
    "bucketInfo": 1,
    "comp": 1,
    "qos": 1,
    "live": 1,
    "status": 1,
    "vod": 1,
    "startTime": 1,
    "endTime": 1,
    "symlink": 1,
    "x-oss-process": 1,
    "response-content-type": 1,
    "response-content-language": 1,
    "response-expires": 1,
    "response-cache-control": 1,
    "response-content-disposition": 1,
    "response-content-encoding": 1
  },

  // when building the stringToSign, these querystring params should be
  // part of the canonical resource string with their NON-encoded values
  responseHeaders: {
    "security-token": 1,
    'response-content-type': 1,
    'response-content-language': 1,
    'response-expires': 1,
    'response-cache-control': 1,
    'response-content-disposition': 1,
    'response-content-encoding': 1
  },

  addAuthorization: function addAuthorization(credentials, date) {
    if (!this.request.headers['presigned-expires']) {
      // 在浏览器中不能设置 date header
      if (ALY.util.isBrowser()) {
        this.request.headers['x-oss-date'] = ALY.util.date.rfc822(date);
      }
      else {
        this.request.headers['Date'] = ALY.util.date.rfc822(date);
      }
    }

    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());
    var auth = 'OSS ' + credentials.accessKeyId + ':' + signature;

    this.request.headers['Authorization'] = auth;
  },

  stringToSign: function stringToSign() {
    var r = this.request;

    var parts = [];
    parts.push(r.method);
    parts.push(r.headers['Content-MD5'] || '');
    parts.push(r.headers['Content-Type'] || '');

    // This is the "Date" header, but we use X-Amz-Date.
    // The S3 signing mechanism requires us to pass an empty
    // string for this Date header regardless.
    // this works:
    // getSignedUrl use 'presigned-expires'
    // other request use 'Date'
    parts.push(r.headers['presigned-expires'] || r.headers['x-oss-date'] || r.headers['Date'] || '');

    var headers = this.canonicalizedHeaders();
    if (headers) parts.push(headers);
    parts.push(this.canonicalizedResource());

    return parts.join('\n');

  },

  canonicalizedHeaders: function canonicalizedHeaders() {

    var headers = [];

    ALY.util.each(this.request.headers, function (name) {
      if (name.match(/^x-oss-/i))
        headers.push(name);
    });

    headers.sort(function (a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    var parts = [];
    ALY.util.arrayEach.call(this, headers, function (name) {
      parts.push(name.toLowerCase() + ':' + String(this.request.headers[name]));
    });

    return parts.join('\n');

  },

  canonicalizedResource: function canonicalizedResource() {

    var r = this.request;

    var parts = r.path.split('?');
    var path = parts[0];
    var querystring = parts[1];

    var resource = '';

    if (r.virtualHostedBucket)
      resource += '/' + r.virtualHostedBucket;

    // OSS 遗留问题，header 中的 Key 不能 url encode
    resource += decodeURIComponent(path);

    if (querystring) {

      // collect a list of sub resources and query params that need to be signed
      var resources = [];

      ALY.util.arrayEach.call(this, querystring.split('&'), function (param) {
        var name = param.split('=')[0];
        var value = param.split('=')[1];
        if (this.subResources[name] || this.responseHeaders[name]) {
          var subresource = {name: name};
          if (value !== undefined) {
            if (this.subResources[name]) {
              subresource.value = value;
            } else {
              subresource.value = decodeURIComponent(value);
            }
          }
          resources.push(subresource);
        }
      });

      resources.sort(function (a, b) {
        return a.name < b.name ? -1 : 1;
      });

      if (resources.length) {

        querystring = [];
        ALY.util.arrayEach(resources, function (res) {
          if (res.value === undefined)
            querystring.push(res.name);
          else
            querystring.push(res.name + '=' + res.value);
        });

        resource += '?' + querystring.join('&');
      }

    }

    return resource;
  },

  sign: function sign(secret, string) {
    if (process.env.DEBUG == 'aliyun') {
      console.log('----------- sign string start -----------');
      console.log(string);
      console.log('----------- sign string end -----------');
    }
    return ALY.util.crypto.hmac(secret, string, 'base64', 'sha1');
  }
});

module.exports = ALY.Signers.OSS;
