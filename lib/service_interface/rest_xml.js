var ALY = require('../core');
require('../xml/builder');
require('../xml/parser');
require('./rest');

/**
 * @api private
 */
ALY.ServiceInterface.RestXml = {
  buildRequest: function buildRequest(req) {
    ALY.ServiceInterface.Rest.buildRequest(req);
    ALY.ServiceInterface.RestXml.populateBody(req);
  },

  extractError: function extractError(resp) {
    try {
      var data = new ALY.XML.Parser({}).parse(resp.httpResponse.body.toString());
      if (data.Errors) data = data.Errors;
      if (data.Error) data = data.Error;
      if (data.Code) {
        resp.error = ALY.util.error(new Error(), {
          code: data.Code,
          message: data.Message
        });
      } else {
        resp.error = ALY.util.error(new Error(), {
          code: resp.httpResponse.statusCode,
          message: null
        });
      }
    }
    catch(err) {
      resp.error = ALY.util.error(new Error(), {
        code: resp.httpResponse.statusCode,
        message: resp.httpResponse.body.toString()
      });
    }
  },

  extractData: function extractData(resp) {
    ALY.ServiceInterface.Rest.extractData(resp);

    var req = resp.request;
    var httpResponse = resp.httpResponse;
    var operation = req.service.api.operations[req.operation];
    var rules = operation.output.members;

    var output = operation.output;
    var payload = output.payload;

    if (payload) {
      if (rules[payload].streaming) {
        resp.data[payload] = httpResponse.body;
      } else {
        resp.data[payload] = httpResponse.body.toString();
      }
    } else if (httpResponse.body.length > 0) {
      try {
        var parser = new ALY.XML.Parser(operation.output || {});
        ALY.util.update(resp.data, parser.parse(httpResponse.body.toString()));
      }
      catch(err) {
        // ignore parse error
      }
    }

    // extract request id
    resp.data.RequestId = httpResponse.headers['x-oss-request-id'] ||
                          httpResponse.headers['x-oss-requestid'];
  },

  populateBody: function populateBody(req) {
    var input = req.service.api.operations[req.operation].input;
    var payload = input.payload;
    var rules = {};
    var builder = null;
    var params = req.params;

    if (typeof payload === 'string') {

      rules = input.members[payload];
      params = params[payload];

      if (params === undefined) return;

      if (rules.type === 'structure') {
        builder = new ALY.XML.Builder(payload, rules.members, req.service.api);
        req.httpRequest.body = builder.toXML(params);
      } else {
        // non-xml paylaod
        req.httpRequest.body = params;
      }

    } else if (payload) {

      ALY.util.arrayEach(payload, function (member) {
        rules[member] = input.members[member];
      });

      builder = new ALY.XML.Builder(input.wrapper, rules, req.service.api);
      req.httpRequest.body = builder.toXML(params);

    }

  }
};
