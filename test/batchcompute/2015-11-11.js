var ALY = require('../../index.js');
var config = require('./testConfig'); //会先找 testConfig.js , 如果不存在，再找 testConfig.json
var should = require('should');

var client = new ALY.BatchCompute({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    endpoint: config.endpoint,
    maxRetries: 0,
    apiVersion: '2015-11-11'
});

var IMAGE_ID =  config.ecsImageId;
var INSTANCE_TYPE = 'ecs.s3.large';

var jobId;
var clusterId;
var jobId_autoCluster;

describe('BatchCompute-2015-11-11 Function Test', function () {

    this.timeout(60000);


    describe('/clusters', function () {
        it('should create a cluster success', function (done) {

            var clusterDesc = {
                "Name": "node-sdk-test-cluster",
                "Description": "node-sdk test",
                "ImageId": IMAGE_ID,
                "Groups": {
                    "group1": {
                        "DesiredVMCount": 3,
                        "InstanceType": INSTANCE_TYPE,
                        "ResourceType": "OnDemand"
                    }
                },
                "UserData": {"a":"b"}
            };

            client.createCluster(clusterDesc, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId', 'code', 'message']);
                result.code.should.be.exactly(201);


                clusterId = result.data.Id;

                console.log('-------------------------------------------');
                console.log('------cluster-id:',clusterId);
                console.log('-------------------------------------------');

                done();
            });

        });



        it('should update cluster success', function (done) {


            client.changeClusterDesiredVMCount({ClusterId: clusterId,Groups:{"group1":{DesiredVMCount:4}}}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId', 'code', 'message']);
                result.code.should.be.exactly(200);

                client.getCluster({ClusterId: clusterId}, function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;

                    result.should.have.properties(['requestId', 'code', 'message']);
                    result.code.should.be.exactly(200);

                    result.data.Id.should.equal(clusterId);

                    result.data.Groups['group1']['DesiredVMCount'].should.be.exactly(4);

                    done();
                });

 
            });

        });

        it('should get cluster success', function (done) {


            client.getCluster({ClusterId: clusterId}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId', 'code', 'message']);
                result.code.should.be.exactly(200);

                result.data.Id.should.equal(clusterId);
                result.data.UserData['a'].should.equal('b');

                done();
            });

        });

        it('should list clusters success', function (done) {


            client.listClusters( function (err, result) {

                if (err) {
                    console.log(err);
                }


                should(err == null).be.true;

                result.should.have.properties(['requestId', 'code', 'message']);
                result.code.should.be.exactly(200);

                result.data.Items.length.should.above(0);

                //console.log("total clusters:",result.data.Items.length);

                done();
            });

        });


        it('should delete cluster success', function (done) {


            client.deleteCluster({ClusterId: clusterId}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                should(result.code < 300).be.true;

                done();
            });

        });
    });


    describe('/jobs', function () {


        before(function(done){

            var clusterDesc = {
                "Name": "node-sdk-test-cluster",
                "Description": "node-sdk test",
                "ImageId": IMAGE_ID,
                "Groups": {
                    "group1": {
                        "DesiredVMCount": 3,
                        "InstanceType": INSTANCE_TYPE,
                        "ResourceType": "OnDemand"
                    }
                }
            };

            client.createCluster(clusterDesc, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId', 'code', 'message']);
                result.code.should.be.exactly(201);


                clusterId = result.data.Id;

                console.log('-------------------------------------------');
                console.log('------cluster-id:',clusterId);
                console.log('-------------------------------------------');

                done();
            });

        });

        it('should create job success', function (done) {

            var jobDesc = {
                "Name": "node-sdk-test-job",
                "Description": "test job",
                "Priority": 0,
                "JobFailOnInstanceFail": true,
                "Type": "DAG",
                "DAG": {
                    "Tasks": {
                        "CountTask": {
                            "Parameters": {
                                "Command": {
                                    "CommandLine": "python count_all_num.py",
                                    "PackagePath": "oss://my-bucket/diku_simple_test/program_package.tar.gz",
                                    "EnvVars":{}
                                },
                                //"InputMappingConfig": {
                                //    "Locale": "GBK",
                                //    "Lock": false
                                //},
                                "StdoutRedirectPath": "oss://my-bucket/diku_simple_test/log/",
                                "StderrRedirectPath": "oss://my-bucket/diku_simple_test/log/"
                            },
                            //"InputMapping": {
                            //    "oss path": "guest os path"
                            //},
                            //"OutputMapping": {
                            //    "guest os path": "oss://my-bucket/diku_simple_test/log"
                            //},
                            //"LogMapping": {
                            //    "guest os path": "oss://my-bucket/diku_simple_test/log"
                            //},
                            "Timeout": 21600,
                            "InstanceCount": 1,
                            "MaxRetryCount": 0,
                            "ClusterId": clusterId ,
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
                result.data.should.have.properties(['Id']);

                jobId = result.data.Id;
                console.log('======> Created:', jobId)

                done();
            });

        });

        it('should create auto-cluster job success', function (done) {

            var jobDesc = {
                "Name": "node-sdk-test-job-auto-cluster",
                "Description": "test job",
                "Priority": 0,
                "JobFailOnInstanceFail": true,
                "Type": "DAG",
                "DAG": {
                    "Tasks": {
                        "CountTask": {
                            "Parameters": {
                                "Command": {
                                    "CommandLine": "python count_all_num.py",
                                    "PackagePath": "oss://my-bucket/diku_simple_test/program_package.tar.gz",
                                    "EnvVars":{}
                                },
                                //"InputMappingConfig": {
                                //    "Locale": "GBK",
                                //    "Lock": false
                                //},
                                "StdoutRedirectPath": "oss://my-bucket/diku_simple_test/log/",
                                "StderrRedirectPath": "oss://my-bucket/diku_simple_test/log/"
                            },
                            //"InputMapping": {
                            //    "oss path": "guest os path"
                            //},
                            //"OutputMapping": {
                            //    "guest os path": "oss://my-bucket/diku_simple_test/log"
                            //},
                            //"LogMapping": {
                            //    "guest os path": "oss://my-bucket/diku_simple_test/log"
                            //},
                            "Timeout": 21600,
                            "InstanceCount": 1,
                            "MaxRetryCount": 0,
                            "AutoCluster": {
                                "ECSImageId": IMAGE_ID,
                                "InstanceType": INSTANCE_TYPE
                            }
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
                result.data.should.have.properties(['Id']);

                jobId_autoCluster = result.data.Id;
                console.log('======> Created:', jobId_autoCluster)

                done();
            });

        });


        it('should list jobs success', function (done) {

            client.listJobs(function (err, result) {

                //if (err) {
                //    console.log(err);
                //}
                //
                //should(err == null).be.true;
                //
                //result.should.have.properties(['requestId']);
                //result.data.Items.length.should.above(1)
                //
                //result.data.Items[0].should.have.properties(['Id', 'OwnerId', 'State','CreationTime', 'StartTime', 'EndTime','InstanceMetrics','TaskMetrics']);

                //console.log(result.data.Items)
                done();
            });

        });

        it('should get job success', function (done) {


            client.getJob({JobId: jobId}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId']);

                result.data.should.have.properties(['Id', 'OwnerId', 'State','CreationTime', 'StartTime', 'EndTime','InstanceMetrics','TaskMetrics']);
                result.data.Name.should.eql('node-sdk-test-job');


                done();
            });

        });

        it('should get job description success', function (done) {


            client.getJobDescription({JobId: jobId}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId']);
                result.data.should.have.properties(['Name', 'DAG', 'JobFailOnInstanceFail','Description','Priority','Type']);

                result.data.DAG.Tasks.should.have.property('CountTask')
                done();
            });

        });

        /*******************************************************/
        /*********************** tasks **************************/
        /*******************************************************/


            it('should list tasks success', function (done) {

                client.listTasks({JobId: jobId}, function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;


                    result.should.have.properties(['requestId']);

                    var arr = result.data.Items;
                    arr.length.should.be.exactly(1);

                    //console.log(arr)


                    /*[ { EndTime: '',
                     InstanceMetrics:
                     { FailedCount: 0,
                     FinishedCount: 0,
                     RunningCount: 0,
                     StoppedCount: 0,
                     WaitingCount: 1 },
                     StartTime: '',
                     State: 'Waiting',
                     TaskName: 'CountTask' } ]
                     */


                    arr[0].should.have.property('TaskName', 'CountTask');
                    arr[0].should.have.properties(['State', 'StartTime','InstanceMetrics','EndTime']);

                    done();
                });
            });

            it('should get task success', function (done) {

                client.getTask({JobId: jobId,TaskName:'CountTask'}, function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;


                    result.should.have.properties(['requestId','data']);


                    /*result.data ={ EndTime: '',
                     InstanceMetrics:
                     { FailedCount: 0,
                     FinishedCount: 0,
                     RunningCount: 0,
                     StoppedCount: 0,
                     WaitingCount: 1 },
                     StartTime: '',
                     State: 'Waiting',
                     TaskName: 'CountTask' }
                     */


                    result.data.should.have.property('TaskName', 'CountTask');
                    result.data.should.have.properties(['State', 'StartTime','InstanceMetrics','EndTime']);

                    done();
                });
            });

            it('should list instances success', function (done) {

                client.listInstances({JobId: jobId, TaskName: 'CountTask'}, function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;


                    result.should.have.properties(['requestId']);

                    var arr = result.data.Items;

                    /*
                    [ { EndTime: '',
                     InstanceId: 0,
                     Progress: 0,
                     Result: { Detail: '', ErrorCode: '', ErrorMessage: '', ExitCode: 0 },
                     RetryCount: 0,
                     StartTime: '',
                     State: 'Waiting',
                     StderrRedirectPath: 'oss://my-bucket/diku_simple_test/log/0.stderr',
                     StdoutRedirectPath: 'oss://my-bucket/diku_simple_test/log/0.stdout' } ]
                     */

                    arr[0].should.have.properties(['InstanceId','State', 'StartTime','Progress','EndTime','RetryCount','StderrRedirectPath','StdoutRedirectPath']);

                    done();
                });
            });

            it('should get instance success', function (done) {

                client.getInstance({JobId: jobId, TaskName:'CountTask',InstanceId: '0'}, function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;


                    result.should.have.properties(['requestId','data']);

                    result.data.should.have.properties(['InstanceId','State', 'StartTime','Progress','EndTime','RetryCount','StderrRedirectPath','StdoutRedirectPath']);


                    done();
                });
            });


        /*******************************************************/
        /********************* tasks end ***********************/
        /*******************************************************/

        it('should stop job success', function (done) {

            client.stopJob({JobId: jobId}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId', 'code', 'message']);
                result.code.should.be.exactly(201);
                done();
            });

        });

        it('should update job success', function (done) {

            client.changeJobPriority({JobId: jobId, Priority: 10}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err == null).be.true;

                result.should.have.properties(['requestId', 'code', 'message','data']);


                client.getJobDescription({JobId: jobId}, function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;

                    result.data.Priority.should.be.exactly(10);

                    done();
                });
            });

        });


        it('should start job success', function (done) {

            client.startJob({JobId: jobId}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId', 'code', 'message']);
                result.code.should.be.exactly(201);
                done();
            });

        });


        it('should stop and delete job success', function (done) {

            client.stopJob({JobId: jobId}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId', 'code', 'message']);
                result.code.should.be.exactly(201);


                client.deleteJob({JobId: jobId}, function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;

                    result.should.have.properties(['requestId', 'code', 'message']);
                    //result.code.should.be.exactly(200);


                    client.getJob({JobId: jobId}, function (err, result) {
                        err.code.should.eql('InvalidResource.NotFound');
                        done();
                    });

                });
            });

        });

        it('should stop and delete autoClusterJob success', function (done) {

            client.stopJob({JobId: jobId_autoCluster}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                result.should.have.properties(['requestId', 'code', 'message']);
                result.code.should.be.exactly(201);


                client.deleteJob({JobId: jobId_autoCluster}, function (err, result) {

                    if (err) {
                        console.log(err);
                    }

                    should(err === null).be.true;

                    result.should.have.properties(['requestId', 'code', 'message']);
                    //result.code.should.be.exactly(200);


                    client.getJob({JobId: jobId_autoCluster}, function (err, result) {
                        err.code.should.eql('InvalidResource.NotFound');
                        done();
                    });

                });
            });

        });


        it('after all should delete cluster success', function (done) {


            client.deleteCluster({ClusterId: clusterId}, function (err, result) {

                if (err) {
                    console.log(err);
                }

                should(err === null).be.true;

                should(result.code < 300).be.true;

                done();
            });

        });


    });


});
