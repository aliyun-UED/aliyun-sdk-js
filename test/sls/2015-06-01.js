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
var TOPIC = 'test/test2';


describe('SLS Function Test', function() {

  this.timeout(60000);

  // describe('PutLogs', function() {
  //
  //   it('should put logs success, loop 10 times', function(done) {
  //
  //     function loopPutLogs(fn) {
  //       var logs = [];
  //       var nowT = Math.floor(new Date().getTime() / 1000);
  //
  //       for (var i = 101; i > 0; i--) {
  //         logs.push({
  //           time: nowT - i,
  //           contents: [{
  //             key: 'a',
  //             value: '1'
  //           }, {
  //             key: 'b',
  //             value: '2'
  //           }, {
  //             key: 'c',
  //             value: '' + Math.random()
  //           }]
  //         });
  //       }
  //
  //       var logGroup = {
  //         logs: logs,
  //         topic: TOPIC,
  //         source: '127.0.0.1'
  //       };
  //
  //       sls.putLogs({
  //         projectName: projectName,
  //         logStoreName: logStoreName,
  //         logGroup: logGroup
  //       }, function(err, data) {
  //         if (err) {
  //           console.log(err);
  //         }
  //
  //         should(err === null).be.true;
  //         data.should.have.properties(['request_id', 'headers']);
  //
  //         fn();
  //       });
  //     };
  //
  //
  //     var len = 10;
  //     var _dig = function() {
  //       console.log('\tloop put logs,', len)
  //       loopPutLogs(function() {
  //         len--;
  //         if (len <= 0) {
  //           done();
  //           return;
  //         }
  //         setTimeout(function() {
  //           _dig();
  //         });
  //       });
  //     };
  //     _dig();
  //
  //   });
  //
  //
  //   it('should put logs failed with logstore does not exists ', function(done) {
  //
  //     var logGroup = {
  //       logs: [{
  //         time: Math.floor(new Date().getTime() / 1000),
  //         contents: [{
  //           key: 'a',
  //           value: '1'
  //         }, {
  //           key: 'a',
  //           value: '2'
  //         }, {
  //           key: 'a',
  //           value: '3'
  //         }]
  //       }],
  //       topic: TOPIC,
  //       source: '127.0.0.1'
  //     };
  //
  //     sls.putLogs({
  //       projectName: projectName,
  //       logStoreName: 'not_exists_logstore',
  //       logGroup: logGroup
  //     }, function(err, data) {
  //
  //       err.code.should.be.exactly(404);
  //       err.should.have.property('error_code', 'SLSLogStoreNotExist');
  //       err.should.have.properties(['request_id', 'headers', 'error_message']);
  //       done();
  //     });
  //   });
  //
  //
  //   afterEach(function(done) {
  //     setTimeout(done, 2000);
  //   });
  //
  // });
  //
  // describe('ListLogStores', function() {
  //
  //   it('should list logstores success', function(done) {
  //
  //     sls.listLogStores({
  //       projectName: projectName
  //     }, function(err, data) {
  //
  //       should(err === null).be.true;
  //       data.count.should.be.above(0);
  //       data.logstores.should.containEql(logStoreName);
  //       data.should.have.properties(['request_id', 'headers']);
  //
  //       done();
  //     });
  //   });
  // });
  //
  // describe('ListTopics', function() {
  //
  //   it('should list topics success', function(done) {
  //
  //     sls.listTopics({
  //       projectName: projectName,
  //       logStoreName: logStoreName
  //     }, function(err, data) {
  //
  //       should(err === null).be.true;
  //       data.count.should.be.above(0);
  //       data.topics.should.containEql(TOPIC);
  //       data.should.have.properties(['request_id', 'headers']);
  //
  //       done();
  //     });
  //   });
  // });
  //
  // describe('GetHistograms', function() {
  //
  //   it('should get histograms success', function(done) {
  //     var to = Math.floor(new Date().getTime() / 1000);
  //     var from = to - 1000;
  //
  //     sls.getHistograms({
  //       projectName: projectName,
  //       logStoreName: logStoreName,
  //       from: from,
  //       to: to,
  //       topic: TOPIC
  //     }, function(err, data) {
  //
  //       should(err === null).be.true;
  //       data.count.should.be.above(1);
  //       data.histograms.should.be.an.Array;
  //
  //       data.should.have.properties(['progress', 'request_id', 'headers']);
  //
  //       done();
  //     });
  //   });
  // });
  //
  //
  // describe('GetLogs', function() {
  //
  //   it('should get logs success', function(done) {
  //     var to = Math.floor(new Date().getTime() / 1000);
  //     var from = to - 1000;
  //
  //     sls.getLogs({
  //       projectName: projectName,
  //       logStoreName: logStoreName,
  //       from: from,
  //       to: to,
  //       topic: TOPIC,
  //       offset: 0,
  //       line: 2
  //     }, function(err, data) {
  //
  //       should(err === null).be.true;
  //       data.count.should.be.below(3);
  //
  //       data.should.have.properties(['logs', 'request_id', 'headers']);
  //
  //       done();
  //     });
  //   });
  //   it('should get logs failed with logstore does not exists ', function(done) {
  //     var to = Math.floor(new Date().getTime() / 1000);
  //     var from = to - 1000;
  //
  //     sls.getLogs({
  //       projectName: projectName,
  //       logStoreName: 'xxoo_not_exists_aslds',
  //       from: from,
  //       to: to,
  //       topic: TOPIC,
  //       offset: 0,
  //       line: 2
  //     }, function(err, data) {
  //
  //       err.code.should.be.exactly(404);
  //       err.should.have.property('error_code', 'SLSLogStoreNotExist');
  //       err.should.have.properties(['request_id', 'headers', 'error_message']);
  //       done();
  //     });
  //   });
  // });

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

  describe('DeleteConfig', function() {
    it('should remove config if exists', function(done) {
      var params = {
        projectName: projectName,
        configName: configName
      };
      sls.deleteConfig(params, function(err, data) {
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

});
