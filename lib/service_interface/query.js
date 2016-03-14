var ALY = require('../core');
var inherit = ALY.util.inherit;

// 目前 query 是针对 top 调用的
ALY.ServiceInterface.Query = {
  buildRequest: function buildRequest(req) {
    var operation = req.service.api.operations[req.operation];
    var httpRequest = req.httpRequest;
    httpRequest.method = 'GET';
    httpRequest.headers['Content-Type'] =
      'application/x-www-form-urlencoded; charset=utf-8';
    httpRequest.params = {
      Action: operation.name,
      Version: req.service.api.apiVersion,
      Timestamp: ALY.util.date.iso8601(ALY.util.date.getDate()),
      Format: 'json',
      AccessKeyId: req.service.config.accessKeyId,
      SignatureVersion: '1.0',
      SignatureMethod: 'HMAC-SHA1',
      SignatureNonce: ALY.util.uuid()
    };

    // convert the request parameters into a list of query params,
    // e.g. Deeply.NestedParam.0.Name=value
    var rules = operation.input;
    if (rules) rules = rules.members;
    var builder = new ALY.QueryParamSerializer(rules, req.service.api);
    builder.serialize(req.params, function(name, value) {
      httpRequest.params[name] = value;
    });
    httpRequest.path = '/?' + ALY.util.queryParamsToString(httpRequest.params);
  },

  extractError: function extractError(resp) {
    var data = JSON.parse(resp.httpResponse.body.toString());

    if (data.Code) {
      resp.error = ALY.util.error(new Error(), {
        code: data.Code,
        message: data.Message,
        RequestId: data.RequestId
      });
    } else {
      resp.error = ALY.util.error(new Error(), {
        code: resp.httpResponse.statusCode,
        message: null,
        RequestId: data.RequestId
      });
    }
  },

  extractData: function extractData(resp) {
    resp.data = resp.httpResponse.body.toString();
  }
};

/**
 * @api private
 */
ALY.QueryParamSerializer = inherit({

  constructor: function QueryParamSerializer(rules, options) {
    this.rules = rules;
    this.timestampFormat = options ? options.timestampFormat : 'iso8601';
  },

  serialize: function serialize(params, fn) {
    this.serializeStructure('', params, this.rules, fn);
  },

  serializeStructure: function serializeStructure(prefix, struct, rules, fn) {
    var that = this;
    ALY.util.each(struct, function (name, member) {
      var n = rules[name].name || name;
      var memberName = prefix ? prefix + '.' + n : n;
      that.serializeMember(memberName, member, rules[name], fn);
    });
  },

  serializeMap: function serialzeMap(name, map, rules, fn) {
    var i = 1;
    var that = this;
    ALY.util.each(map, function (key, value) {
      var prefix = rules.flattened ? '.' : '.entry.';
      var position = prefix + (i++) + '.';
      var keyName = position + (rules.keys.name || 'key');
      var valueName = position + (rules.members.name || 'value');
      that.serializeMember(name + keyName, key, rules.keys, fn);
      that.serializeMember(name + valueName, value, rules.members, fn);
    });
  },

  serializeList: function serializeList(name, list, rules, fn) {
    var that = this;
    var memberRules = rules.members || {};
    ALY.util.arrayEach(list, function (v, n) {
      var suffix = '.' + (n + 1);
      if (rules.flattened) {
        if (memberRules.name) {
          var parts = name.split('.');
          parts.pop();
          parts.push(memberRules.name);
          name = parts.join('.');
        }
      } else {
        suffix = '.member' + suffix;
      }
      that.serializeMember(name + suffix, v, memberRules, fn);
    });
  },

  serializeMember: function serializeMember(name, value, rules, fn) {
    if (value === null || value === undefined) return;
    if (rules.type === 'structure') {
      this.serializeStructure(name, value, rules.members, fn);
    } else if (rules.type === 'list') {
      this.serializeList(name, value, rules, fn);
    } else if (rules.type === 'map') {
      this.serializeMap(name, value, rules, fn);
    } else if (rules.type === 'timestamp') {
      var timestampFormat = rules.format || this.timestampFormat;
      fn.call(this, name, ALY.util.date.format(value, timestampFormat));
    } else {
      fn.call(this, name, String(value));
    }
  }

});
