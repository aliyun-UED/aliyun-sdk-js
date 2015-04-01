var ALY = require('../core');
require('./rest');
require('./json');

/**
 * @api private
 */
ALY.ServiceInterface.RestJson = {
  buildRequest: function buildRequest(req) {
    ALY.ServiceInterface.Rest.buildRequest(req);
    ALY.ServiceInterface.RestJson.populateBody(req);
  },

  extractError: function extractError(resp) {
    ALY.ServiceInterface.Json.extractError(resp);
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

    // extract request id
    resp.data.RequestId = resp.httpResponse.headers['x-oss-request-id'] ||
                          resp.httpResponse.headers['x-oss-requestid'];
  },

  populateBody: function populateBody(req) {
    var input = req.service.api.operations[req.operation].input;
    var payload = input.payload;
    var params = {};

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

      //ALY.util.arrayEach(payload, function (param) {
      //  if (req.params[param] !== undefined) {
      //    params[param] = req.params[param];
      //  }
      //});
      //req.httpRequest.body = this.buildJSON(params, input, req.service.api);

      //var s = 'action=push&items=[{"cmd":"add","timestamp":1427785924,"fields":{"id":"12113313131","title":"This is the title","body":"This is the body"}},{"cmd":"add","timestamp":1427785924,"fields":{"id":"12113933132","title":"This is the title","body":"This is the body"}}]&table_name=main';
      var s = 'action=push&items=%5B%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A%2212113313131%22%2C%22title%22%3A%22This%20is%20the%20title%22%2C%22body%22%3A%22This%20is%20the%20body%22%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A%2212113933132%22%2C%22title%22%3A%22This%20is%20the%20title%22%2C%22body%22%3A%22This%20is%20the%20body%22%7D%7D%5D&table_name=main';

      //req.httpRequest.body = 'action=push&items=%5B%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313132%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313133%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313134%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313135%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313136%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313137%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313138%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313139%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313140%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%2C%7B%22cmd%22%3A%22add%22%2C%22timestamp%22%3A1427785924%2C%22fields%22%3A%7B%22id%22%3A12113313141%2C%22title%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684%5Cu6807%5Cu9898%22%2C%22body%22%3A%22%5Cu6211%5Cu662f%5Cu4e00%5Cu6761%5Cu65b0%5Cu6587%5Cu6863%5Cu7684body%22%2C%22url%22%3A%22http%3A%5C%2F%5C%2Fopensearch.aliyuncs.com%22%2C%22create_timestamp%22%3A1427805459%7D%7D%5D&table_name=main';
      req.httpRequest.body = s;

    }
  },

  buildJSON: function buildJSON(params, rules, api) {
    var builder = new ALY.JSON.Builder(rules, api);
    return builder.build(params);
  }

};
