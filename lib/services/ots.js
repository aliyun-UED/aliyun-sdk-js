var ALY = require('../core');
var ProtoBuf = require("protobufjs");

var protos = {};

var capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

ALY.OTS = ALY.Service.defineService('ots', ['2014-08-08'], {
  /**
   * @api private
   */
  initialize: function initialize(options) {
    var builder = ProtoBuf.newBuilder();
    builder.define("ots2");
    builder.create(
        [
          {
            "name": "Error",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "code",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "message",
                "id": 2
              }
            ]
          },
          {
            "name": "ColumnType",
            "values": [
              {
                "name": "INF_MIN",
                "id": 0
              },
              {
                "name": "INF_MAX",
                "id": 1
              },
              {
                "name": "INTEGER",
                "id": 2
              },
              {
                "name": "STRING",
                "id": 3
              },
              {
                "name": "BOOLEAN",
                "id": 4
              },
              {
                "name": "DOUBLE",
                "id": 5
              },
              {
                "name": "BINARY",
                "id": 6
              }
            ]
          },
          {
            "name": "ColumnSchema",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "name",
                "id": 1
              },
              {
                "rule": "required",
                "type": "ColumnType",
                "name": "type",
                "id": 2
              }
            ]
          },
          {
            "name": "ColumnValue",
            "fields": [
              {
                "rule": "required",
                "type": "ColumnType",
                "name": "type",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "int64",
                "name": "v_int",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "v_string",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "v_bool",
                "id": 4
              },
              {
                "rule": "optional",
                "type": "double",
                "name": "v_double",
                "id": 5
              },
              {
                "rule": "optional",
                "type": "bytes",
                "name": "v_binary",
                "id": 6
              }
            ]
          },
          {
            "name": "Column",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "name",
                "id": 1
              },
              {
                "rule": "required",
                "type": "ColumnValue",
                "name": "value",
                "id": 2
              }
            ]
          },
          {
            "name": "Row",
            "fields": [
              {
                "rule": "repeated",
                "type": "Column",
                "name": "primary_key_columns",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "attribute_columns",
                "id": 2
              }
            ]
          },
          {
            "name": "TableMeta",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "ColumnSchema",
                "name": "primary_key",
                "id": 2
              }
            ]
          },
          {
            "name": "RowExistenceExpectation",
            "values": [
              {
                "name": "IGNORE",
                "id": 0
              },
              {
                "name": "EXPECT_EXIST",
                "id": 1
              },
              {
                "name": "EXPECT_NOT_EXIST",
                "id": 2
              }
            ]
          },
          {
            "name": "Condition",
            "fields": [
              {
                "rule": "required",
                "type": "RowExistenceExpectation",
                "name": "row_existence",
                "id": 1
              }
            ]
          },
          {
            "name": "CapacityUnit",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "read",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "write",
                "id": 2
              }
            ]
          },
          {
            "name": "ReservedThroughputDetails",
            "fields": [
              {
                "rule": "required",
                "type": "CapacityUnit",
                "name": "capacity_unit",
                "id": 1
              },
              {
                "rule": "required",
                "type": "int64",
                "name": "last_increase_time",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "int64",
                "name": "last_decrease_time",
                "id": 3
              },
              {
                "rule": "required",
                "type": "int32",
                "name": "number_of_decreases_today",
                "id": 4
              }
            ]
          },
          {
            "name": "ReservedThroughput",
            "fields": [
              {
                "rule": "required",
                "type": "CapacityUnit",
                "name": "capacity_unit",
                "id": 1
              }
            ]
          },
          {
            "name": "ConsumedCapacity",
            "fields": [
              {
                "rule": "required",
                "type": "CapacityUnit",
                "name": "capacity_unit",
                "id": 1
              }
            ]
          },
          {
            "name": "CreateTableRequest",
            "fields": [
              {
                "rule": "required",
                "type": "TableMeta",
                "name": "table_meta",
                "id": 1
              },
              {
                "rule": "required",
                "type": "ReservedThroughput",
                "name": "reserved_throughput",
                "id": 2
              }
            ]
          },
          {
            "name": "CreateTableResponse",
            "fields": []
          },
          {
            "name": "UpdateTableRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "required",
                "type": "ReservedThroughput",
                "name": "reserved_throughput",
                "id": 2
              }
            ]
          },
          {
            "name": "UpdateTableResponse",
            "fields": [
              {
                "rule": "required",
                "type": "ReservedThroughputDetails",
                "name": "reserved_throughput_details",
                "id": 1
              }
            ]
          },
          {
            "name": "DescribeTableRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              }
            ]
          },
          {
            "name": "DescribeTableResponse",
            "fields": [
              {
                "rule": "required",
                "type": "TableMeta",
                "name": "table_meta",
                "id": 1
              },
              {
                "rule": "required",
                "type": "ReservedThroughputDetails",
                "name": "reserved_throughput_details",
                "id": 2
              }
            ]
          },
          {
            "name": "ListTableRequest",
            "fields": []
          },
          {
            "name": "ListTableResponse",
            "fields": [
              {
                "rule": "repeated",
                "type": "string",
                "name": "table_names",
                "id": 1
              }
            ]
          },
          {
            "name": "DeleteTableRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              }
            ]
          },
          {
            "name": "DeleteTableResponse",
            "fields": []
          },
          {
            "name": "GetRowRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "primary_key",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "columns_to_get",
                "id": 3
              }
            ]
          },
          {
            "name": "GetRowResponse",
            "fields": [
              {
                "rule": "required",
                "type": "ConsumedCapacity",
                "name": "consumed",
                "id": 1
              },
              {
                "rule": "required",
                "type": "Row",
                "name": "row",
                "id": 2
              }
            ]
          },
          {
            "name": "OperationType",
            "values": [
              {
                "name": "PUT",
                "id": 1
              },
              {
                "name": "DELETE",
                "id": 2
              }
            ]
          },
          {
            "name": "ColumnUpdate",
            "fields": [
              {
                "rule": "required",
                "type": "OperationType",
                "name": "type",
                "id": 1
              },
              {
                "rule": "required",
                "type": "string",
                "name": "name",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "ColumnValue",
                "name": "value",
                "id": 3
              }
            ]
          },
          {
            "name": "UpdateRowRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "required",
                "type": "Condition",
                "name": "condition",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "primary_key",
                "id": 3
              },
              {
                "rule": "repeated",
                "type": "ColumnUpdate",
                "name": "attribute_columns",
                "id": 4
              }
            ]
          },
          {
            "name": "UpdateRowResponse",
            "fields": [
              {
                "rule": "required",
                "type": "ConsumedCapacity",
                "name": "consumed",
                "id": 1
              }
            ]
          },
          {
            "name": "PutRowRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "required",
                "type": "Condition",
                "name": "condition",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "primary_key",
                "id": 3
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "attribute_columns",
                "id": 4
              }
            ]
          },
          {
            "name": "PutRowResponse",
            "fields": [
              {
                "rule": "required",
                "type": "ConsumedCapacity",
                "name": "consumed",
                "id": 1
              }
            ]
          },
          {
            "name": "DeleteRowRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "required",
                "type": "Condition",
                "name": "condition",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "primary_key",
                "id": 3
              }
            ]
          },
          {
            "name": "DeleteRowResponse",
            "fields": [
              {
                "rule": "required",
                "type": "ConsumedCapacity",
                "name": "consumed",
                "id": 1
              }
            ]
          },
          {
            "name": "RowInBatchGetRowRequest",
            "fields": [
              {
                "rule": "repeated",
                "type": "Column",
                "name": "primary_key",
                "id": 1
              }
            ]
          },
          {
            "name": "TableInBatchGetRowRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "RowInBatchGetRowRequest",
                "name": "rows",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "columns_to_get",
                "id": 3
              }
            ]
          },
          {
            "name": "BatchGetRowRequest",
            "fields": [
              {
                "rule": "repeated",
                "type": "TableInBatchGetRowRequest",
                "name": "tables",
                "id": 1
              }
            ]
          },
          {
            "name": "RowInBatchGetRowResponse",
            "fields": [
              {
                "rule": "required",
                "type": "bool",
                "name": "is_ok",
                "id": 1,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "optional",
                "type": "Error",
                "name": "error",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "ConsumedCapacity",
                "name": "consumed",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "Row",
                "name": "row",
                "id": 4
              }
            ]
          },
          {
            "name": "TableInBatchGetRowResponse",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "RowInBatchGetRowResponse",
                "name": "rows",
                "id": 2
              }
            ]
          },
          {
            "name": "BatchGetRowResponse",
            "fields": [
              {
                "rule": "repeated",
                "type": "TableInBatchGetRowResponse",
                "name": "tables",
                "id": 1
              }
            ]
          },
          {
            "name": "PutRowInBatchWriteRowRequest",
            "fields": [
              {
                "rule": "required",
                "type": "Condition",
                "name": "condition",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "primary_key",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "attribute_columns",
                "id": 3
              }
            ]
          },
          {
            "name": "UpdateRowInBatchWriteRowRequest",
            "fields": [
              {
                "rule": "required",
                "type": "Condition",
                "name": "condition",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "primary_key",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "ColumnUpdate",
                "name": "attribute_columns",
                "id": 3
              }
            ]
          },
          {
            "name": "DeleteRowInBatchWriteRowRequest",
            "fields": [
              {
                "rule": "required",
                "type": "Condition",
                "name": "condition",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "primary_key",
                "id": 2
              }
            ]
          },
          {
            "name": "TableInBatchWriteRowRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "PutRowInBatchWriteRowRequest",
                "name": "put_rows",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "UpdateRowInBatchWriteRowRequest",
                "name": "update_rows",
                "id": 3
              },
              {
                "rule": "repeated",
                "type": "DeleteRowInBatchWriteRowRequest",
                "name": "delete_rows",
                "id": 4
              }
            ]
          },
          {
            "name": "BatchWriteRowRequest",
            "fields": [
              {
                "rule": "repeated",
                "type": "TableInBatchWriteRowRequest",
                "name": "tables",
                "id": 1
              }
            ]
          },
          {
            "name": "RowInBatchWriteRowResponse",
            "fields": [
              {
                "rule": "required",
                "type": "bool",
                "name": "is_ok",
                "id": 1,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "optional",
                "type": "Error",
                "name": "error",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "ConsumedCapacity",
                "name": "consumed",
                "id": 3
              }
            ]
          },
          {
            "name": "TableInBatchWriteRowResponse",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "RowInBatchWriteRowResponse",
                "name": "put_rows",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "RowInBatchWriteRowResponse",
                "name": "update_rows",
                "id": 3
              },
              {
                "rule": "repeated",
                "type": "RowInBatchWriteRowResponse",
                "name": "delete_rows",
                "id": 4
              }
            ]
          },
          {
            "name": "BatchWriteRowResponse",
            "fields": [
              {
                "rule": "repeated",
                "type": "TableInBatchWriteRowResponse",
                "name": "tables",
                "id": 1
              }
            ]
          },
          {
            "name": "Direction",
            "values": [
              {
                "name": "FORWARD",
                "id": 0
              },
              {
                "name": "BACKWARD",
                "id": 1
              }
            ]
          },
          {
            "name": "GetRangeRequest",
            "fields": [
              {
                "rule": "required",
                "type": "string",
                "name": "table_name",
                "id": 1
              },
              {
                "rule": "required",
                "type": "Direction",
                "name": "direction",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "columns_to_get",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "limit",
                "id": 4
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "inclusive_start_primary_key",
                "id": 5
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "exclusive_end_primary_key",
                "id": 6
              }
            ]
          },
          {
            "name": "GetRangeResponse",
            "fields": [
              {
                "rule": "required",
                "type": "ConsumedCapacity",
                "name": "consumed",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "Column",
                "name": "next_start_primary_key",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "Row",
                "name": "rows",
                "id": 3
              }
            ]
          }
        ]
    );
    // Resets the pointer to the root namespace:
    builder.reset();

    protos = builder.build("ots2");

    ALY.Service.prototype.initialize.call(this, options);
  },

  setupRequestListeners: function setupRequestListeners(request) {
    request.addListener('build', this.addContentType);
    request.addListener('build', this.populateURI);
    request.addListener('build', this.buildContent);
    request.addListener('build', this.computeContentMd5);
    request.addListener('extractError', this.extractError);
    request.addListener('extractData', this.extractData);
  },

  populateURI: function populateURI(req) {
    var httpRequest = req.httpRequest;
    var b = req.params.instance_name;

    if (b) {
      // 确保 host 只被 set 一次，因为 endpoint 只在 service 唯一
      httpRequest.endpoint.host = httpRequest.endpoint.hostname = b + '.' + httpRequest.endpoint.hostname;

      httpRequest.virtualHostedBucket = b;
      httpRequest.path = httpRequest.path.replace(new RegExp('^/' + b), '');
      if (httpRequest.path[0] !== '/') {
        httpRequest.path = '/' + httpRequest.path;
      }
    }
  },

  addContentType: function addContentType(req) {
    var httpRequest = req.httpRequest;
    //httpRequest.headers['x-ots-contenttype'] = 'protocol buffer';
    httpRequest.headers['x-ots-apiversion'] = '2014-08-08';
    httpRequest.headers['x-ots-instancename'] = req.params.instance_name;
  },

  buildContent: function buildContent(req) {
    var request;

    switch(req.operation) {
      case 'createTable':
        request = new protos.CreateTableRequest({
          table_meta: req.params.table_meta,
          reserved_throughput: req.params.reserved_throughput
        });
        break;
      case 'listTable':
        request = new protos.ListTableRequest({});
        break;
      case 'deleteTable':
        request = new protos.DeleteTableRequest({
          table_name: req.params.table_name
        });
        break;
      case 'updateTable':
        request = new protos.UpdateTableRequest({
          table_name: req.params.table_name
        });
        break;
      case 'describeTable':
        request = new protos.DescribeTableRequest({
          table_name: req.params.table_name,
          reserved_throughput: req.params.reserved_throughput
        });
        break;
      case 'getRow':
        request = new protos.GetRowRequest({
          table_name: req.params.table_name,
          primary_key: req.params.primary_key,
          columns_to_get: req.params.columns_to_get
        });
        break;
      case 'putRow':
        request = new protos.PutRowRequest({
          table_name: req.params.table_name,
          condition: req.params.condition,
          primary_key: req.params.primary_key,
          attribute_columns: req.params.attribute_columns
        });
        break;
      case 'updateRow':
        request = new protos.UpdateRowRequest({
          table_name: req.params.table_name,
          condition: req.params.condition,
          primary_key: req.params.primary_key,
          attribute_columns: req.params.attribute_columns
        });
        break;
      case 'deleteRow':
        request = new protos.DeleteRowRequest({
          table_name: req.params.table_name,
          condition: req.params.condition,
          primary_key: req.params.primary_key
        });
        break;
      case 'getRange':
        request = new protos.GetRangeRequest({
          table_name: req.params.table_name,
          direction: req.params.direction,
          columns_to_get: req.params.columns_to_get,
          limit: req.params.limit,
          inclusive_start_primary_key: req.params.inclusive_start_primary_key,
          exclusive_end_primary_key: req.params.exclusive_end_primary_key,
        });
        break;
      case 'batchGetRow':
        request = new protos.BatchGetRowRequest({
          table_name: req.params.table_name,
          direction: req.params.direction,
          columns_to_get: req.params.columns_to_get,
          limit: req.params.limit,
          inclusive_start_primary_key: req.params.inclusive_start_primary_key,
          exclusive_end_primary_key: req.params.exclusive_end_primary_key,
        });
        break;
    }

    var buffer = request.encode();

    req.httpRequest.body = buffer.toBuffer();
  },

  computeContentMd5: function computeContentMd5(req) {
    var md5 = ALY.util.crypto.md5(req.httpRequest.body, 'base64');
    req.httpRequest.headers['x-ots-contentmd5'] = md5;
  },

  /**
   * OSS requires that path params not escape forward slashes.
   *
   * @api private
   */
  escapePathParam: function escapePathParam(value) {
    return ALY.util.uriEscapePath(String(value));
  },

  /**
   * @return [Boolean] whether response contains an error
   * @api private
   */
  successfulResponse: function successfulResponse(resp) {
    var req = resp.request;
    var httpResponse = resp.httpResponse;
    if (req.operation === 'completeMultipartUpload' &&
        httpResponse.body.toString().match('<Error>'))
      return false;
    else
      return httpResponse.statusCode < 300;
  },

  /**
   * @return [Boolean] whether the error can be retried
   * @api private
   */
  retryableError: function retryableError(error, request) {
    if (request.operation == 'completeMultipartUpload' &&
        error.statusCode === 200) {
      return true;
    } else {
      var _super = ALY.Service.prototype.retryableError;
      return _super.call(this, error, request);
    }
  },

  /**
   * Provides a specialized parser for getBucketLocation -- all other
   * operations are parsed by the super class.
   *
   * @api private
   */
  extractData: function extractData(resp) {
    resp.data = protos[capitalizeFirstLetter(resp.request.operation) + "Response"].decode(resp.httpResponse.body);

    // extract request id
    resp.data.RequestId = resp.httpResponse.headers['x-ots-request-id'] ||
        resp.httpResponse.headers['x-ots-requestid'];
  },

  /**
   * Extracts an error object from the http response.
   *
   * @api private
   */
  extractError: function extractError(resp) {
    var codes = {
      304: 'NotModified',
      403: 'Forbidden',
      400: 'BadRequest',
      404: 'NotFound'
    };

    var code = resp.httpResponse.statusCode;
    var body = resp.httpResponse.body;
    if (codes[code] && body.length === 0) {
      resp.error = ALY.util.error(new Error(), {
        code: codes[resp.httpResponse.statusCode],
        message: null,
        headers: resp.httpResponse.headers
      });
    } else {
      var data;
      try {
        data = new ALY.XML.Parser({}).parse(body.toString());
        resp.error = ALY.util.error(new Error(), {
          code: data.Code || code,
          message: data.Message || null,
          headers: resp.httpResponse.headers
        });
      }
      catch (e) {
        data = body.toString();
        resp.error = ALY.util.error(new Error(), {
          code: code,
          message: data,
          headers: resp.httpResponse.headers
        });
      }
    }
  }

});

module.exports = ALY.OSS;
