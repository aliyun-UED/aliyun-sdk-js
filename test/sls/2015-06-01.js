var ALY = require('../../index.js');
var config = require('./config');
var should = require('should');

var sls = new ALY.SLS({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  endpoint: config.endpoint,
  apiVersion: '2015-06-01'
});

var projectName = config.projectName;
var logStoreName = config.logStoreName;
var configName = 'testcategory1';
var groupName = 'testgroup';
var TOPIC = 'test/test2';

function debugLog(err) {
  if (err && err.message) {
    var msg = err.message;
    try {
      msg = JSON.parse(msg);
    } catch (e) {
      msg = null;
    }
    if (msg) {
      console.log(msg);
    }
  }
}

describe('SLS Function Test', function() {

  this.timeout(1000 * 60 * 30);

  beforeEach(function(done) {
    setTimeout(done, 15000);
  });

  describe('CreateLogStore', function() {
    it('should return success', function(done) {
      sls.createLogstore({
        projectName: projectName,
        logstoreDetail: {
          logstoreName: logStoreName,
          ttl: 1,
          shardCount: 1
        }
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });

    it('should return error if logstore exists', function(done) {
      sls.createLogstore({
        projectName: projectName,
        logstoreDetail: {
          logstoreName: logStoreName,
          ttl: 1,
          shardCount: 1
        }
      }, function(err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'LogStoreAlreadyExist');
        done();
      });
    });
  });

  describe('UpdateLogstore', function() {
    it('should return success', function(done) {
      sls.updateLogstore({
        projectName: projectName,
        logstoreName: logStoreName,
        logstoreDetail: {
          logstoreName: logStoreName,
          ttl: 2,
          shardCount: 1
        }
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });

    it('should return error if logstore not exists', function(done) {
      sls.updateLogstore({
        projectName: projectName,
        logstoreName: 'sdfsdfsdfasfdsafsdf',
        logstoreDetail: {
          logstoreName: 'sdfsdfsdfasfdsafsdf',
          ttl: 1,
          shardCount: 1
        }
      }, function(err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'LogStoreNotExist');
        done();
      });
    });
  });

  describe('GetLogstore', function() {
    it('should return log store detail when found', function(done) {
      sls.getLogstore({
        projectName: projectName,
        LogStoreName: logStoreName,
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        data.body.logstoreName.should.equal(logStoreName);
        done();
      });
    });
  });

  describe('ListLogStores', function() {

    it('should list logstores success', function(done) {

      sls.listLogStores({
        projectName: projectName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.body.count.should.be.above(0);
        data.body.logstores.should.containEql(logStoreName);
        data.should.have.properties(['request_id', 'headers']);

        done();
      });
    });
  });

  describe('ListShards', function() {
    it('should return success if logstore exists', function(done) {
      sls.listShards({
        projectName: projectName,
        logStoreName: logStoreName,
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('SplitShard', function() {
    it('should return success if logstore exists', function(done) {
      sls.splitShard({
        projectName: projectName,
        logStoreName: logStoreName,
        ShardId: 0,
        HashKey: 'ef000000000000000000000000000000'
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('MergeShard', function() {
    it('should return success if logstore exists', function(done) {
      sls.mergeShards({
        projectName: projectName,
        logStoreName: logStoreName,
        ShardId: 1,
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('GetCursor', function() {
    it('should return success if logstore exists', function(done) {
      sls.getCursor({
        projectName: projectName,
        logStoreName: logStoreName,
        ShardId: 1,
        FromTime: Math.floor(new Date().getTime() / 1000)
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.body.should.have.property('cursor');
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('BatchGetLogs', function() {
    it('should return error if cursor is invalid', function(done) {
      sls.batchGetLogs({
        projectName: projectName,
        logStoreName: logStoreName,
        ShardId: 0,
        cursor: 'xxxxxx',
        count: 10
      }, function(err, data) {
        err.code.should.be.exactly(400);
        err.should.have.property('errorCode', 'InvalidCursor');
        done();
      });
    });
  });

  describe('CreateIndex', function() {
    it('should return success if logstore exists', function(done) {
      sls.createIndex({
        projectName: projectName,
        logstoreName: logStoreName,
        indexDetail: {
          ttl: 30,
          line: {
            token: [';'],
            include_keys: ['key2', 'key3'],
            caseSensitive: false
          }
        }
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('UpdateIndex', function() {
    it('should return success if logstore exists', function(done) {
      sls.updateIndex({
        projectName: projectName,
        logstoreName: logStoreName,
        indexDetail: {
          ttl: 20,
          line: {
            token: [';'],
            include_keys: ['key2', 'key3'],
            caseSensitive: false
          }
        }
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('GetIndex', function() {
    it('should return success if logstore exists', function(done) {
      sls.getIndex({
        projectName: projectName,
        logstoreName: logStoreName,
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        data.body.should.have.properties(['ttl']);
        done();
      });
    });
  });

  describe('ListTopics', function() {
    it('should list topics success', function(done) {
      sls.listTopics({
        projectName: projectName,
        logStoreName: logStoreName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('CreateConfig', function() {
    var params = {
      projectName: projectName,
      configDetail: {
        "configName": configName,
        "inputType": "file",
        "inputDetail": {
          "logType": "common_reg_log",
          "logPath": "/var/log/httpd/",
          "filePattern": "access*.log",
          "localStorage": true,
          "timeFormat": "%Y/%m/%d %H:%M:%S",
          "logBeginRegex": ".*",
          "regex": "(\w+)(\s+)",
          "key" :["key1", "key2"],
          "filterKey":["key1"],
          "filterRegex":["regex1"],
          "fileEncoding":"utf8",
          "topicFormat": "none"
        },
        "outputType": "LogService",
        "outputDetail":
          {
            "logstoreName": logStoreName
          }
      }
    };
    it('should create config successfully', function(done) {
      sls.createConfig(params, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);

        done();
      });
    });

    it('should fail when create the same config again', function (done) {
      sls.createConfig(params, function(err, data) {
        err.code.should.be.exactly(400);
        err.should.have.property('errorCode', 'ConfigAlreadyExist');
        err.should.have.properties(['request_id', 'headers', 'errorMessage']);
        done();
      });
    });
  });

  describe('ListConfig', function () {
    it('should return config list', function (done) {
      sls.listConfig({
        projectName: projectName,
        offset: 0,
        size: 10
      }, function (err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.body.configs.should.containEql(configName);
        done();
      });
    });
  });

  describe('GetConfig', function () {
    it('should return config details when config exists', function (done) {
      sls.getConfig({
        projectName: projectName,
        configName: configName
      }, function (err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.body.configName.should.equal(configName);
        done();
      });
    });

    it('should return error when config not exist', function (done) {
      sls.getConfig({
        projectName: projectName,
        configName: 'xvsdfsdfsdfasfasfsdafsdf'
      }, function (err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'ConfigNotExist');
        err.should.have.properties(['request_id', 'headers', 'errorMessage']);
        done();
      });
    });
  });

  describe('UpdateConfig', function () {
    it('should update successfully', function (done) {
      sls.updateConfig({
        projectName: projectName,
        configName: configName,
        configDetail: {
          "configName": configName,
          "inputType": "file",
          "inputDetail": {
            "logType": "common_reg_log",
            "logPath": "/var/log/httpd/",
            "filePattern": "access.log",
            "localStorage": true,
            "timeFormat": "%Y/%m/%d %H:%M:%S",
            "logBeginRegex": ".*",
            "regex": "(\w+)(\s+)",
            "key" :["key1", "key2"],
            "filterKey":["key1"],
            "filterRegex":["regex1"],
            "topicFormat": "none"
          },
          "outputType": "LogService",
          "outputDetail":
            {
              "logstoreName": logStoreName
            }
        }
      }, function (err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });

    it('should return error when config not exists', function (done) {
      sls.updateConfig({
        projectName: projectName,
        configName: 'sfsfsdfsafsaf',
        configDetail: {
          "configName": 'sfsfsdfsafsaf',
          "inputType": "file",
          "inputDetail": {
            "logType": "common_reg_log",
            "logPath": "/var/log/httpd/",
            "filePattern": "access.log",
            "localStorage": true,
            "timeFormat": "%Y/%m/%d %H:%M:%S",
            "logBeginRegex": ".*",
            "regex": "(\w+)(\s+)",
            "key" :["key1", "key2"],
            "filterKey":["key1"],
            "filterRegex":["regex1"],
            "topicFormat": "none"
          },
          "outputType": "LogService",
          "outputDetail":
            {
              "logstoreName": logStoreName
            }
        }
      }, function (err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'ConfigNotExist');
        err.should.have.properties(['request_id', 'headers', 'errorMessage']);
        done();
      });
    });
  });

  describe('GetAppliedMachineGroups', function() {
    it('should return empty', function(done) {
      sls.getAppliedMachineGroups({
        projectName: projectName,
        configName: configName,
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.body.count.should.equal(0);
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });

    it('should return error when group not exists', function(done) {
      sls.getAppliedMachineGroups({
        projectName: projectName,
        configName: 'sfsdfsdfsdfsdfsdf'
      }, function(err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'ConfigNotExist');
        done();
      });
    });
  });

  describe('CreateMachineGroup', function() {
    var params = {
      projectName: projectName,
      machineGroupDetail: {
        "groupName" : groupName,
        "groupType" : "",
        "groupAttribute" : {
          "externalName" : groupName,
          "groupTopic": "testgrouptopic"
        },
        "machineIdentifyType" : "userdefined",
        "machineList" : [
          "test-ip1",
          "test-ip2"
        ]
      }
    };
    it('should return success', function(done) {
      sls.createMachineGroup(params, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });

    it('should return error when group exists', function(done) {
      sls.createMachineGroup(params, function(err, data) {
        err.code.should.be.exactly(400);
        err.should.have.property('errorCode', 'MachineGroupAlreadyExist');
        done();
      });
    });
  });

  describe('UpdateMachineGroup', function() {
    it('should return success', function(done) {
      sls.updateMachineGroup({
        projectName: projectName,
        groupName: groupName,
        machineGroupDetail: {
          "groupName" : groupName,
          "groupType" : "",
          "groupAttribute" : {
            "externalName" : groupName,
            "groupTopic": "testgrouptopic"
          },
          "machineIdentifyType" : "userdefined",
          "machineList" : [
            "test-ip1",
            "test-ip2",
            "test-ip3"
          ]
        }
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });

    it('should return error when group not exist', function(done) {
      sls.updateMachineGroup({
        projectName: projectName,
        groupName: 'dsfsdsdfsdfsdfsdf',
        machineGroupDetail: {
          "groupName" : 'dsfsdsdfsdfsdfsdf',
          "groupType" : "",
          "groupAttribute" : {
            "externalName" : 'dsfsdsdfsdfsdfsdf',
            "groupTopic": "testgrouptopic"
          },
          "machineIdentifyType" : "userdefined",
          "machineList" : [
            "test-ip1",
            "test-ip2",
            "test-ip3"
          ]
        }
      }, function(err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'MachineGroupNotExist');
        done();
      });
    });
  });

  describe('ListMachineGroup', function() {
    it('should return the group we just created', function(done) {
      sls.listMachineGroup({
        projectName: projectName,
        offset: 0,
        size: 10
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        data.body.machinegroups.should.containEql(groupName);
        done();
      });
    });
    it('should return empty result when groupName not match', function(done) {
      sls.listMachineGroup({
        projectName: projectName,
        offset: 0,
        size: 10,
        groupName: 'sdfsdfsdfsdfsdfsdfsdfaaf'
      }, function(err, data) {
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        data.body.count.should.equal(0);
        done();
      });
    });
  });

  describe('GetMachineGroup', function() {
    it('should return machine group detail when found', function(done) {
      sls.getMachineGroup({
        projectName: projectName,
        groupName: groupName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        data.body.groupName.should.equal(groupName);
        done();
      });
    });

    it('should return error when group not found', function(done) {
      sls.getMachineGroup({
        projectName: projectName,
        groupName: 'sfsdfsdfasfdsafsafasdfsadfasdf'
      }, function(err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'MachineGroupNotExist');
        done();
      });
    });
  });

  describe('ApplyConfigToMachineGroup', function() {

    it('should return success when group and config exist', function(done) {
      sls.applyConfigToMachineGroup({
        projectName: projectName,
        groupName: groupName,
        configName: configName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });

    it('should return error when group not found', function() {
      sls.applyConfigToMachineGroup({
        projectName: projectName,
        groupName: 'sdfsdfsdfsdfadsdfsdf',
        configName: configName
      }, function(err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'MachineGroupNotExist');
        done();
      });
    });

    it('should return error when config not found', function() {
      sls.applyConfigToMachineGroup({
        projectName: projectName,
        groupName: groupName,
        configName: 'sdfsdfsdfsdfsdfsdfsdsdf'
      }, function(err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'ConfigNotExist');
        done();
      });
    });

  });

  describe('RemoveConfigFromMachineGroup', function() {
    it('should return success', function(done) {
      sls.removeConfigFromMachineGroup({
        projectName: projectName,
        groupName: groupName,
        configName: configName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('ListMachines', function() {
    it('should return success', function(done) {
      sls.listMachines({
        projectName: projectName,
        offset: 0,
        size: 10,
        groupName: groupName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        data.body.count.should.equal(0);
        done();
      });
    });
  });

  describe('GetAppliedConfigs', function() {
    it('should return success', function(done) {
      sls.getAppliedConfigs({
        projectName: projectName,
        groupName: groupName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        data.body.count.should.equal(0);
        done();
      });
    });
  });

  describe('GetShipperStatus', function() {
    it('should return error when shipper not exists', function(done) {
      var to = +new Date();
      sls.getShipperStatus({
        projectName: projectName,
        logstoreName: logStoreName,
        shipperName: 'test',
        from: to - 900,
        to: to
      }, function(err, data) {
        err.code.should.be.exactly(400);
        err.should.have.property('errorCode', 'ParameterInvalid');
        done();
      });
    });
  });

  describe('RetryShipperTask', function() {
    it('should return error when shipper not exist', function(done) {
      sls.retryShipperTask({
        projectName: projectName,
        logstoreName: logStoreName,
        shipperName: 'test',
        tasks: '["task-id-1", "task-id-2", "task-id-2"]'
      }, function(err, data) {
        err.code.should.be.exactly(400);
        err.should.have.property('errorCode', 'ParameterInvalid');
        done();
      });
    });
  });

  describe('GetHistograms', function() {

    it('should get histograms success', function(done) {
      var to = Math.floor(new Date().getTime() / 1000);
      var from = to - 1000;

      sls.getHistograms({
        projectName: projectName,
        logStoreName: logStoreName,
        from: from,
        to: to,
        topic: TOPIC
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.body.should.be.an.Object;

        data.should.have.properties(['request_id', 'headers']);

        done();
      });
    });
  });

  describe('PutLogs', function() {

    it('should put logs success, loop 10 times', function(done) {

      function loopPutLogs(fn) {
        var logs = [];
        var nowT = Math.floor(new Date().getTime() / 1000);

        for (var i = 101; i > 0; i--) {
          logs.push({
            time: nowT - i,
            contents: [{
              key: 'a',
              value: '1'
            }, {
              key: 'b',
              value: '2'
            }, {
              key: 'c',
              value: '' + Math.random()
            }]
          });
        }

        var logGroup = {
          logs: logs,
          topic: TOPIC,
          source: '127.0.0.1'
        };

        sls.putLogs({
          projectName: projectName,
          logStoreName: logStoreName,
          logGroup: logGroup
        }, function(err, data) {
          if (err) {
            debugLog(err);
          }

          should(err === null).be.true;
          data.should.have.properties(['request_id', 'headers']);

          fn();
        });
      };


      var len = 10;
      var _dig = function() {
        debugLog('\tloop put logs,', len)
        loopPutLogs(function() {
          len--;
          if (len <= 0) {
            done();
            return;
          }
          setTimeout(function() {
            _dig();
          });
        });
      };
      _dig();

    });


    it('should put logs failed with logstore does not exists ', function(done) {

      var logGroup = {
        logs: [{
          time: Math.floor(new Date().getTime() / 1000),
          contents: [{
            key: 'a',
            value: '1'
          }, {
            key: 'a',
            value: '2'
          }, {
            key: 'a',
            value: '3'
          }]
        }],
        topic: TOPIC,
        source: '127.0.0.1'
      };

      sls.putLogs({
        projectName: projectName,
        logStoreName: 'not_exists_logstore',
        logGroup: logGroup
      }, function(err, data) {

        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'LogStoreNotExist');
        err.should.have.properties(['request_id', 'headers', 'errorMessage']);
        done();
      });
    });
  });

  describe('GetLogs', function() {

    it('should get logs success', function(done) {
      var to = Math.floor(new Date().getTime() / 1000);
      var from = to - 1000;

      sls.getLogs({
        projectName: projectName,
        logStoreName: logStoreName,
        from: from,
        to: to,
        topic: TOPIC,
        offset: 0,
        line: 2
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);

        done();
      });
    });
    it('should get logs failed with logstore does not exists ', function(done) {
      var to = Math.floor(new Date().getTime() / 1000);
      var from = to - 1000;

      sls.getLogs({
        projectName: projectName,
        logStoreName: 'xxoo_not_exists_aslds',
        from: from,
        to: to,
        topic: TOPIC,
        offset: 0,
        line: 2
      }, function(err, data) {

        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'LogStoreNotExist');
        err.should.have.properties(['request_id', 'headers', 'errorMessage']);
        done();
      });
    });
  });

  describe('DeleteConfig', function() {
    it('should remove config if exists', function(done) {
      var params = {
        projectName: projectName,
        configName: configName
      };
      sls.deleteConfig(params, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);

        sls.getConfig(params, function(err2, data2) {
          err2.code.should.be.exactly(404);
          err2.should.have.property('errorCode', 'ConfigNotExist');
          done();
        });
      });
    });

    it('should return error when config not exist', function(done) {
      sls.deleteConfig({
        projectName: projectName,
        configName: 'testsdfsdfsdfsdf'
      }, function(err, data) {
        err.code.should.be.exactly(404);
        err.should.have.property('errorCode', 'ConfigNotExist');
        done();
      });
    });
  });

  describe('DeleteMachineGroup', function() {
    it('should return success', function(done) {
      sls.deleteMachineGroup({
        projectName: projectName,
        groupName: groupName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('DeleteIndex', function() {
    it('should list topics success', function(done) {
      sls.deleteIndex({
        projectName: projectName,
        logstoreName: logStoreName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

  describe('DeleteLogstore', function() {
    it('should list topics success', function(done) {
      sls.deleteLogstore({
        projectName: projectName,
        LogStoreName: logStoreName
      }, function(err, data) {
        if (err) {
          debugLog(err);
        }
        should(err === null).be.true;
        data.should.have.properties(['request_id', 'headers']);
        done();
      });
    });
  });

});
