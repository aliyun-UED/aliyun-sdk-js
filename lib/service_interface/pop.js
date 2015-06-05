var ALY = require('../core');
require('./rest');
require('./json');

/**
 * @api private
 */
ALY.ServiceInterface.Pop = {
  buildRequest: function buildRequest(req) {
    ALY.ServiceInterface.Rest.buildRequest(req);
    ALY.ServiceInterface.Pop.populateBody(req);
  },

  extractError: function extractError(resp) {
    console.log('+++++++++++++++++');
    console.log(resp.httpResponse.body.toString());
    console.log('+++++++++++++++++');
    ALY.ServiceInterface.Json.extractError(resp);
  },

  extractData: function extractData(resp) {
    var req = resp.request;
    var rules = req.service.api.operations[req.operation].output || {};
    if (rules.payload && rules.members[rules.payload]) {
      if (rules.members[rules.payload].streaming) {
        resp.data[rules.payload] = resp.httpResponse.body;
      } else {
        resp.data[rules.payload] = resp.httpResponse.body.toString();
      }
    } else {
      var data = resp.data;
      ALY.ServiceInterface.Json.extractData(resp);
      resp.data = ALY.util.merge(data, resp.data);
    }

    // extract request id
    resp.data.RequestId = resp.httpResponse.headers['x-oss-request-id'] ||
                          resp.httpResponse.headers['x-oss-requestid'];
  },

  populateBody: function populateBody(req) {
    req.httpRequest.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

    var body = req.params;

    body.Format = "JSON";
    body.Version = "2015-04-01";
    body.AccessKeyId = req.service.config.accessKeyId;
    body.SignatureVersion = "1.0";
    body.SignatureMethod = "HMAC-SHA1";
    body.SignatureNonce = Math.round(Math.random() * 1000000);
    body.Timestamp = ALY.util.date.iso8601(ALY.util.date.getDate());

    // sign
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

    var stringToSign = 'POST&%2F&' + ALY.util.topEscape(canonicalizedQueryString.substr(1));
    body.Signature = ALY.util.crypto.hmac(req.service.config.secretAccessKey + '&', stringToSign, 'base64', 'sha1');

    // body
    var bodyString = "";
    //ALY.util.each(body, function (name) {
    //  bodyString += "&" + name + "=" + encodeURI(body[name]);
    //});
    bodyString = ALY.util.queryParamsToString(body);
    console.log(bodyString);

    req.httpRequest.body = bodyString;
  },

  buildJSON: function buildJSON(params, rules, api) {
    var builder = new ALY.JSON.Builder(rules, api);
    return builder.build(params);
  }

};
