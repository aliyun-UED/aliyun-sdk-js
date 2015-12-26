var ALY = require('../core');
require('./rest');
require('./json');

/**
 * @api private
 */
ALY.ServiceInterface.Top = {
  buildRequest: function buildRequest(req) {
    ALY.ServiceInterface.Top.populateMethod(req);
    ALY.ServiceInterface.Top.populateBodyAndURI(req);
  },

  extractError: function extractError(resp) {
    ALY.ServiceInterface.Json.extractError(resp);
  },

  extractData: function extractData(resp) {
    resp.data = JSON.parse(resp.httpResponse.body.toString());
  },

  populateMethod: function populateBodyAndURI(req) {
    req.httpRequest.method = req.service.api.operations[req.operation].http.method;
  },

  populateBodyAndURI: function populateBody(req) {
    req.httpRequest.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    req.httpRequest.headers['Cache-Control'] = "no-cache";
    req.httpRequest.headers['Connection'] = "Keep-Alive";

    var application_parameter = req.params;

    // convert json object to json string
    ALY.util.each(application_parameter, function (name) {
      var value = application_parameter[name];
      if(value !== null && typeof value === 'object') {
        application_parameter[name] = JSON.stringify(value);
      }
    });

    var sys_parameters = {
      format: "json",
      app_key: req.service.config.accessKeyId,
      sign_method: "md5",
      v: "2.0",
      timestamp: ALY.util.date.unixMilliseconds(ALY.util.date.getDate()),
      partner_id: "taobao-sdk-python-20151223",
      method: application_parameter.method
    };

    delete application_parameter.method;

    // sign
    var sign_parameter = [];

    ALY.util.each(sys_parameters, function (name) {
      sign_parameter.push(name);
    });

    ALY.util.each(application_parameter, function (name) {
      sign_parameter.push(name);
    });

    sign_parameter.sort(function (a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    var canonicalizedQueryString = "";
    ALY.util.arrayEach.call(this, sign_parameter, function (name) {
      canonicalizedQueryString += name + (sys_parameters[name] || application_parameter[name]);
    });

    var stringToSign = req.service.config.secretAccessKey + canonicalizedQueryString + req.service.config.secretAccessKey;

    sys_parameters.sign = ALY.util.crypto.md5(stringToSign, 'hex').toUpperCase();

    req.httpRequest.body = ALY.util.queryParamsToString(application_parameter);

    req.httpRequest.path = "/router/rest?" + ALY.util.queryParamsToString(sys_parameters);
  },

  buildJSON: function buildJSON(params, rules, api) {
    var builder = new ALY.JSON.Builder(rules, api);
    return builder.build(params);
  }

};
