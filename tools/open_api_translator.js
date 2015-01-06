var XLS = require('xlsjs');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var util = require('util');
var co = require('co');

var process_wb = function (wb) {

  var sheet;
  sheet = to_json(wb);

  var list = [];

  co(function *() {
    for(var i = 0; i < sheet.sqlResult.length; i++) {
      var node = sheet.sqlResult[i];
      var name = parseName(node.name);
      var define = yield function(cb) {
        if(!node.api_define) {
          console.log('error:', node);
          cb(null);
          return;
        }

        parseApiDefine(node.api_define, cb);
      };

      if(name && define) {
        list.push({
          name: name,
          define: define
        });
      }
    }

    //
    var result = {};
    for(var i = 0; i < list.length; i++) {
      var node = list[i];
      var name = node.name.category + '-' + node.name.version;
      if(!result[name]) {
        result[name] = {
          "format": "query",
          "apiVersion": node.name.version,
          "checksumFormat": "md5",
          "endpointPrefix": node.name.category,
          "serviceAbbreviation": node.name.category.toUpperCase(),
          "serviceFullName": getServiceFullName(node.name.category),
          "signatureVersion": "top",
          "timestampFormat": "top",
          "xmlnamespace": "",
          "operations": {}
        };
      }
      var op = {};
      op.name = node.name.action;
      op.http = {
        method: "GET",
        uri: "/"
      };
      op.input = {
        type: "structure",
        members: {}
      };

      // must
      for(var j = 0; j < node.define.must.length; j++) {
        var n = node.define.must[j];
        var obj = {};
        obj.required = true;
        switch(n.type) {
          case 'string':
            obj.type = 'string';
            break;
          case 'number':
            obj.type = 'integer';
            break;
          case 'boolean':
            obj.type = 'boolean';
            break;
          default:
            obj.type = 'string';
        }
        op.input.members[n.name] = obj;
      }

      // optional
      for(var k = 0; k < node.define.optional.length; k++) {
        var n = node.define.optional[k];
        var obj = {};
        switch(n.type) {
          case 'string':
            obj.type = 'string';
            break;
          case 'number':
            obj.type = 'integer';
            break;
          case 'boolean':
            obj.type = 'boolean';
            break;
          default:
            obj.type = 'string';
        }
        op.input.members[n.name] = obj;
      }

      // done
      result[name].operations[lowerFirstLetter(node.name.action)] = op;
    }

    yield function(cb) {
      fs.writeFile('./output/json', JSON.stringify(result, 2, 2), cb);
    };

    for(var i in result) {
      yield function(cb) {
        fs.writeFile('./output/' + i + '.json', JSON.stringify(result[i], 2, 2), cb);
      }
    }

  })(function(err, res) {
    console.log(err, res);
  });
};

var lowerFirstLetter = function (string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

var to_json = function (workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  return result;
};

var parseName = function (name) {
  var arr = name.split('.');
  return {
    category: arr[0],
    action: arr[arr.length - 2],
    version: arr[arr.length - 1]
  };
};

var parseApiDefine = function (define, cb) {
  parseString(define, function (err, result) {
    //console.log(util.inspect(result, false, null));

    var must = [];
    if(result.api.params[0].application[0].must[0].param) {
      for(var i = 0; i < result.api.params[0].application[0].must[0].param.length; i++) {
        must.push(result.api.params[0].application[0].must[0].param[i]['$']);
      }
    }

    var optional = [];
    if(result.api.params[0].application[0].optional[0].param) {
      for(var i = 0; i < result.api.params[0].application[0].optional[0].param.length; i++) {
        optional.push(result.api.params[0].application[0].optional[0].param[i]['$']);
      }
    }

    cb(null, {
      must: must,
      optional: optional
    });
  });
};

var getServiceFullName = function(name) {
  switch(name) {
    case 'ecs':
      return 'Aliyun Elastic Compute Service';
    case 'rds':
      return 'Aliyun Relational Database Service';
    case 'slb':
      return 'Aliyun Server Load Balancer';
    default:
      return '';
  }
};

var workbook = XLS.readFile('./open_api/full.xls');
process_wb(workbook);
