var ALY = require('../../index.js');
var config = require('./testConfig'); //会先找 testConfig.js , 如果不存在，再找 testConfig.json
var should = require('should');

var client = new ALY.BatchCompute({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    endpoint: config.endpoint,
    maxRetries: 1,
    apiVersion: '2015-06-30'
});
var jobId;

describe('BatchCompute Function Test', function(){

    this.timeout(60000);

    describe('/jobs', function() {

        it('should create success', function (done) {


            var jobDesc = {
                "JobName": "TestScene",
                "JobTag": "JobTag",
                "Priority": 0,
                "TaskDag": {
                    "TaskDescMap": {
                        "CountTask": {
                            "InstanceCount": 1,
                            "PackageUri": "oss://my-bucket/diku_simple_test/program_package.tar.gz",
                            "ProgramName": "count_all_num.py",
                            "ResourceDescription": {
                                "Cpu": 1200,
                                "Memory": 16000
                            },
                            "StderrRedirectPath": "oss://my-bucket/diku_simple_test/log",
                            "StdoutRedirectPath": "oss://my-bucket/diku_simple_test/log",
                            "ImageId": "img-00000000558D1D5A000079FA0000001F",
                            "EnvironmentVariables": {},
                            "Timeout": 21600,
                            "ProgramType": "python"
                        }
                    },
                    "Dependencies": {
                        "CountTask": []
                    }
                }
            };


            client.createJob(jobDesc, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId']);
                result.data.should.have.properties(['JobId']);

                jobId = result.data.JobId;
                console.log('Created:',jobId)

                done();
            });

        });


        it('should list jobs success', function (done) {

            client.listJobs(function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId']);
                result.data.length.should.above(1)

                result.data[0].should.have.properties(['JobId','OwnerId','State','StartTime','EndTime']);


                done();
            });

        });

        it('should get job success', function (done) {


            client.getJob({jobId:jobId},function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId']);
                result.data.should.have.properties(['JobId','OwnerId','State','StartTime','EndTime']);


                done();
            });

        });

        it('should get job description success', function (done) {


            client.getJobDescription({jobId:jobId},function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId']);
                result.data.should.have.properties(['JobName','JobTag','TaskDag']);

                result.data.TaskDag.TaskDescMap.should.have.property('CountTask')
                done();
            });

        });

        it('should list tasks success', function (done) {


            client.listTasks({jobId:jobId},function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;


                result.should.have.properties(['requestId']);

                var arr = result.data;
                arr.length.should.be.exactly(1);

                arr[0].should.have.property('TaskName','CountTask');
                arr[0].should.have.property('InstanceList')


                var insArr = arr[0]['InstanceList'];

                insArr.length.should.be.exactly(1);

                insArr[0].should.have.properties(['InstanceId','State','StartTime','EndTime']);
                done();
            });

        });



        it('should stop success', function (done) {

            client.stopJob({jobId:jobId},function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true; 

                result.should.have.properties(['requestId','code','message']);
                result.code.should.be.exactly(200);
                done();
            });

        });

        it('should update success', function (done) {

            client.updateJobPriority({jobId:jobId, priority:10},function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId','code','message']);


                client.getJob({jobId:jobId},function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;

                    console.log(result.data.Priority)
                    result.data.Priority.should.be.exactly(10);

                    done();
                });
            });

        });


        it('should start success', function (done) {

            client.startJob({jobId:jobId},function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId','code','message']);
                result.code.should.be.exactly(200);
                done();
            });

        });


        it('should stop and delete success', function (done) {

            client.stopJob({jobId:jobId},function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId','code','message']);
                result.code.should.be.exactly(200);


                client.deleteJob({jobId:jobId},function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;

                    result.should.have.properties(['requestId','code','message']);
                    //result.code.should.be.exactly(200);


                    client.getJob({jobId:jobId},function (err, result) {
                        err.should.have.property('code','ResourceNotFound');
                        done();
                    });

                });
            });

        });



    });

    describe('/images', function(){
        it('should list images success', function (done) {

            client.listImages( function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId','code','message']);
                result.code.should.be.exactly(200);

                if(result.data.length>0){
                    var imgs = result.data;

                    imgs[0].should.have.properties(['ImageId','ImageName','OwnerId','Platform','CreateTime','BlockDeviceMapping'])
                }
                done();
            });

        });
    });
});
