var ALY = require('../../index.js');
var config = require('./config');
var should = require('should');

var sls = new ALY.SLS({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    endpoint: config.endpoint,
    apiVersion: '2014-11-18'
});

var projectName = config.projectName;
var logStoreName = config.logStoreName;
var TOPIC = 'test/test2';


describe('SLS Function Test', function(){

    this.timeout(60000);

    describe('PutLogs', function(){

        it('should put logs success, loop 10 times', function(done){

            function loopPutLogs(fn){
                var logs = [];
                var nowT = Math.floor(new Date().getTime()/1000);

                for(var i=101;i>0;i--){
                    logs.push({
                        time:  nowT-i,
                        contents: [{
                            key: 'a',
                            value: '1'
                        },{
                            key: 'b',
                            value: '2'
                        },{
                            key: 'c',
                            value: ''+Math.random()
                        }]
                    });
                }

                var logGroup = {
                    logs : logs,
                    topic: TOPIC,
                    source: '127.0.0.1'
                };

                sls.putLogs({
                    projectName: projectName,
                    logStoreName: logStoreName,
                    logGroup: logGroup
                }, function (err, data) {
                    if(err){
                        console.log(err);
                    }

                    should(err === null).be.true;
                    data.should.have.properties(['request_id','headers']);

                    fn();
                });
            };


            var len = 10;
            var _dig = function(){
                console.log('\tloop put logs,',len)
                loopPutLogs(function(){
                    len--;
                    if(len<=0){
                        done();
                        return;
                    }
                    setTimeout(function(){
                        _dig();
                    });
                });
            };
            _dig();

        });


        it('should put logs failed with logstore does not exists ', function(done){

            var logGroup = {
                logs : [{
                    time:  Math.floor(new Date().getTime()/1000),
                    contents: [{
                        key: 'a',
                        value: '1'
                    },{
                        key: 'a',
                        value: '2'
                    },{
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
            }, function (err, data) {

                err.code.should.be.exactly(404);
                err.should.have.property('error_code','SLSLogStoreNotExist');
                err.should.have.properties(['request_id','headers','error_message']);
                done();
            });
        });


        afterEach(function(done){
            setTimeout(done, 2000);
        });

    });

    describe('ListLogStores', function(){

        it('should list logstores success', function(done){

            sls.listLogStores({
                projectName: projectName
            }, function(err, data){

                should(err===null).be.true;
                data.count.should.be.above(0);
                data.logstores.should.containEql(logStoreName);
                data.should.have.properties(['request_id','headers']);

                done();
            });
        });
    });

    describe('ListTopics', function(){

        it('should list topics success', function(done){

            sls.listTopics({
                projectName: projectName,
                logStoreName: logStoreName
            }, function(err, data){

                should(err===null).be.true;
                data.count.should.be.above(0);
                data.topics.should.containEql(TOPIC);
                data.should.have.properties(['request_id','headers']);

                done();
            });
        });
    });

    describe('GetHistograms', function(){

        it('should get histograms success', function(done){
            var to =Math.floor(new Date().getTime()/1000);
            var from = to-1000;

            sls.getHistograms({
                projectName: projectName,
                logStoreName: logStoreName,
                from: from,
                to: to,
                topic: TOPIC
            }, function(err, data){

                should(err===null).be.true;
                data.count.should.be.above(1);
                data.histograms.should.be.an.Array;

                data.should.have.properties(['progress','request_id','headers']);

                done();
            });
        });
    });


    describe('GetLogs', function(){

        it('should get logs success', function(done){
            var to =Math.floor(new Date().getTime()/1000);
            var from = to-1000;

            sls.getLogs({
                projectName: projectName,
                logStoreName: logStoreName,
                from: from,
                to: to,
                topic: TOPIC,
                offset: 0,
                line: 2
            }, function(err, data){

                should(err===null).be.true;
                data.count.should.be.below(3);

                data.should.have.properties(['logs','request_id','headers']);

                done();
            });
        });
        it('should get logs failed with logstore does not exists ', function(done){
            var to =Math.floor(new Date().getTime()/1000);
            var from = to-1000;

            sls.getLogs({
                projectName: projectName,
                logStoreName: 'xxoo_not_exists_aslds',
                from: from,
                to: to,
                topic: TOPIC,
                offset: 0,
                line: 2
            }, function(err, data){

                err.code.should.be.exactly(404);
                err.should.have.property('error_code','SLSLogStoreNotExist');
                err.should.have.properties(['request_id','headers','error_message']);
                done();
            });
        });
    });
});
