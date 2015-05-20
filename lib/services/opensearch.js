var ALY = require('../core');
var parseURL = require('url').parse;

ALY.OpenSearch = ALY.Service.defineService('opensearch', ['2015-01-01'], {
  /**
   * @api private
   */
  initialize: function initialize(options) {
    ALY.Service.prototype.initialize.call(this, options);
  },

  setupRequestListeners: function setupRequestListeners(request) {
    request.addListener('build', this.addContentType);
    request.addListener('build', this.buildContent);
    //request.addListener('build', this.populateURI);
    //
    //request.addListener('build', this.computeContentMd5);
    //request.addListener('build', this.computeSha256);

    request.removeListener('validate',
        ALY.EventListeners.Core.VALIDATE_REGION);

    request.addListener('extractError', this.extractError);
    request.addListener('extractData', this.extractData);

    //request.addListener('afterBuild', function (req) {
    //    //Host in request.header
    //    console.log(req.httpRequest.headers['projectName'], req.params['projectName']);
    //
    //    req.httpRequest.headers['Host'] = req.params['projectName']
    //       +'.'+req.httpRequest.endpoint.hostname;
    //    //头中的 projectName 不需要
    //    delete req.httpRequest.headers['projectName'];
    //});
  },

  populateURI: function populateURI(req) {
    var hostname = req.httpRequest.endpoint.hostname;

    var projectName = req.params['projectName'];
    var host = projectName + '.' + hostname;

    if (!/^[0-9.]+$/.test(hostname)) {
      //不是ip,  是域名, 则需要拼接project名
      var protocol = req.httpRequest.endpoint.protocol;
      var port = req.httpRequest.endpoint.port;

      //real endpoint
      var endpointObj = parseURL(protocol + '//' + host + ':' + port);

      ALY.util.update(req.httpRequest, {endpoint: endpointObj});
      // ALY.util.update(req.service, {endpoint: endpointObj });
    }

    //final host， 不管是ip还是域名，都要拼接project名
    req.httpRequest.headers['Host'] = host;

    //头中的 projectName 不需要
    delete req.httpRequest.headers['projectName'];
  },

  addContentType: function addContentType(req) {
    var httpRequest = req.httpRequest;

    httpRequest.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  },

  buildContent: function buildContent(req) {
    var input = req.service.api.operations[req.operation].input;
    var payload = input.payload;
    var params = {};

    // todo: payload 是否有可能为 string
    if (typeof payload === 'string') {

      var rules = input.members[payload];
      params = req.params[payload];

      if (params === undefined) return;

      if (rules.type === 'structure') {
        req.httpRequest.body = this.buildJSON(params, input, req.service.api);
      } else {
        // non-xml paylaod
        req.httpRequest.body = params;
      }

    } else if (payload) {
      var arr = [];

      ALY.util.arrayEach(payload, function (param) {
        if (req.params[param] !== undefined) {
          params[param] = req.params[param];
          if(param == 'items') {
            arr.push(param + '=' + encodeURIComponent(JSON.stringify(req.params[param])));
          }
          else {
            arr.push(param + '=' + req.params[param]);
          }
        }
      });

      req.httpRequest.body = arr.join('&');
    }

  },

  willComputeChecksums: function willComputeChecksums(req) {

    // // TODO: compute checksums for Stream objects
    // if (!ALY.util.Buffer.isBuffer(req.httpRequest.body) &&
    //     typeof req.httpRequest.body !== 'string') {
    //     return false;
    // }

    var rules = req.service.api.operations[req.operation].input;

    // // V4 signer uses SHA256 signatures so only compute MD5 if it is required
    // if (req.service.getSignerClass(req) === ALY.Signers.V4) {
    //     if (rules.ContentMD5 && !rules.ContentMD5.required) return false;
    // }

    if (rules.ContentMD5) return true;
  },

  computeContentMd5: function computeContentMd5(req) {
    if (req.service.willComputeChecksums(req)) {
      var md5 = ALY.util.crypto.md5(req.httpRequest.body, 'hex').toUpperCase();
      req.httpRequest.headers['Content-MD5'] = md5;
    }
  },

  computeSha256: function computeSha256(req) {
    if (req.service.getSignerClass(req) === ALY.Signers.V4) {
      req.httpRequest.headers['X-Amz-Content-Sha256'] =
          ALY.util.crypto.sha256(req.httpRequest.body || '', 'hex');
    }
  },

  escapePathParam: function escapePathParam(value) {
    return ALY.util.uriEscapePath(String(value));
  },


  successfulResponse: function successfulResponse(resp) {
    //var req = resp.request;
    var httpResponse = resp.httpResponse;
    return httpResponse.statusCode < 300;
  },

  retryableError: function retryableError(error, request) {

    var _super = ALY.Service.prototype.retryableError;
    return _super.call(this, error, request);

  },

  extractData: function extractData(resp) {
    ALY.ServiceInterface.Rest.extractData(resp);

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
  },

  extractError: function extractError(resp) {
    var error = {};
    var httpResponse = resp.httpResponse;

    if (httpResponse.body.length > 0) {
      var e = JSON.parse(httpResponse.body.toString());
      if (e.__type || e.code) {
        error.code = (e.__type || e.code).split('#').pop();
      } else {
        error.code = 'UnknownError';
      }
      if (error.code === 'RequestEntityTooLarge') {
        error.message = 'Request body must be less than 1 MB';
      } else {
        error.message = (e.message || e.Message || null);
      }
    } else {
      error.code = httpResponse.statusCode;
      error.message = null;
    }

    resp.error = ALY.util.error(new Error(), error);
  }

});

module.exports = ALY.OpenSearch;
