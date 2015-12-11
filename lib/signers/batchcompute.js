var ALY = require('../core');
var inherit = ALY.util.inherit;
//var API_VERSION = '2015-11-11';
//var API_VERSION = '2015-06-30';

/**
 * @api private
 */
ALY.Signers.BatchCompute = inherit(ALY.Signers.RequestSigner, {

  //entry
  addAuthorization: function addAuthorization(credentials, date) {
    var headers = this.request.headers;

    //headers['Date'] = ALY.util.date.rfc822(date);
    headers['x-acs-date'] = ALY.util.date.rfc822(date);
    //headers['Date'] = new Date().toGMTString();


    //var bodyStr;
    //var body = this.request.body;
    //if(body){
    //  bodyStr = typeof(body)=='object'? JSON.stringify(body):body;
    //  headers['Content-MD5'] = ALY.util.crypto.md5(bodyStr,'hex').toUpperCase();
    //}

    headers['x-acs-signature-method'] = 'HMAC-SHA1';
    headers['x-acs-signature-version'] = '1.0';
    //headers['x-acs-version'] = API_VERSION;
    headers['x-sdk-client'] = 'node.js/1.0.0';
    headers['Accept'] = 'application/json';

    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());
    var auth = 'acs ' + credentials.accessKeyId + ':' + signature;

    headers['Authorization'] = auth;
  },

  stringToSign: function stringToSign() {
    var r = this.request;

    //fix signature not match in browser
    if(r.method!='GET' && r.method!='HEAD'){
       r.headers['Content-Type'] = r.headers['Content-Type'] || 'text/plain;charset=UTF-8';
    }

    var parts = [];
    parts.push(r.method);
    parts.push(r.headers['Accept'] || '');
    parts.push(r.headers['Content-MD5'] || '');
    parts.push(r.headers['Content-Type'] || '');
    parts.push(r.headers['x-acs-date'] || r.headers['Date'] ||'');

    var headers = this.canonicalizedAmzHeaders();
    if (headers) parts.push(headers);
    parts.push(this.canonicalizedResource());

    return parts.join('\n');
  },

  canonicalizedAmzHeaders: function canonicalizedAmzHeaders() {

    var acsHeaders = [];

    ALY.util.each(this.request.headers, function (name) {
      if (name.match(/^x-acs-/i))
        acsHeaders.push(name);
    });

    acsHeaders.sort(function (a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    var parts = [];
    ALY.util.arrayEach.call(this, acsHeaders, function (name) {
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


    resource += decodeURIComponent(path);


    if (querystring) {

      // collect a list of sub resources and query params that need to be signed
      var resources = [];

      var arr = querystring.replace(/(^&*)|(&*$)/g,'').split('&');


      ALY.util.arrayEach.call(this, arr, function (param) {
        var kv = param.split('=');

        var name = kv[0];

        var value = (kv.length>1)? decodeURIComponent(kv[1]):'';
        /*jshint undef:false */

        var resource = { name: name };
        if (value !== undefined) {
          resource.value = value;
        }
        resources.push(resource);

      });

      resources.sort(function (a, b) { return a.name < b.name ? -1 : 1; });

      if (resources.length) {

        querystring = [];
        ALY.util.arrayEach(resources, function (resource) {
          if (resource.value === undefined)
            querystring.push(resource.name);
          else {

            if(resource.value!=null && resource.value!=''){
              querystring.push(resource.name + '=' + resource.value);
            }else{
              querystring.push(resource.name);
            }
          }
        });

        resource += '?' + querystring.join('&');
      }

    }

    return resource;

  },

  sign: function sign(secret, string) {
    if(process.env.DEBUG == 'aliyun') {
      console.log('----------- sign string start -----------');
      console.log(string);
      console.log('----------- sign string end -----------');
    }
    return ALY.util.crypto.hmac(secret, string, 'base64', 'sha1');
  }
});

module.exports = ALY.Signers.BatchCompute;
