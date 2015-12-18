var ALY = require('../../index.js');
var should = require('should');

var config = require('./testConfig');

var client = new ALY.CMS({
        accessKeyId: config.id,
        secretAccessKey: config.key,
        endpoint: "http://metrics.aliyuncs.com",
        apiVersion: '2015-10-20'
    }
);


describe('test cms', function(){
    this.timeout(60000); //10sec
    describe('test cms', function(){

        it('should queryMetric success', function(done){

            var userId="1625715599237776";
            var slsProject = "ali-cn-hangzhou-corp-sls-admin";
            var logStore = "sls_operation_log";

            var startTime = new Date(new Date().getTime()-16*3600*1000 + 8*3600*1000);
            startTime = startTime.toISOString().replace(/T/,' ').substring(0,19);



            var dim = {
                userId: userId,
                project: slsProject,
                logStore: logStore
            };

            var opt= {
                Project:"aliyun_sls",
                Metric:"LogInflow",
                Period:"60",
                Dimensions: JSON.stringify(dim),
                StartTime:startTime

                //EndTime: endtime,
                //Page: "",
                //Length: '',
            };


            client.queryMetric(opt,function(err,result){
                result.code.should.be.exactly(200);
                result.data.should.have.properties('Datapoints',"TraceId","Success","Code");

                done();
            });
        });


        it('should getMetricStatistics success', function(done){

            var userId="1625715599237776";
            var slsProject = "ali-cn-hangzhou-corp-sls-admin";
            var logStore = "sls_operation_log";

            var startTime = new Date(new Date().getTime()-3600*1000 + 8*3600*1000);
            startTime = startTime.toISOString().replace(/T/,' ').substring(0,19);

            var dim = {
                userId: userId,
                project: slsProject,
                logStore: logStore
            };

            var opt= {
                Dimensions: '[]',
                StartTime:startTime

                //EndTime: "",
                //MetricName: "",
                //Namespace: "",
                //Interval: "",
                //NextToken: "",
                //Length: ""
            };

            client.getMetricStatistics(opt,function(err,result){
                result.code.should.be.exactly(200);
                //result.data.should.have.properties('Datapoints',"TraceId","Success","Code");
                done();
            });
        });


        it('should batchQueryMetric success', function(done){

            var startTime = new Date(new Date().getTime()-3600*1000 + 8*3600*1000);
            startTime = startTime.toISOString().replace(/T/,' ').substring(0,19);


            var opt= {
                Dimensions: '[]',

                Project: "aliyun_sls",
                Metric: "LogInflow",
                Period:"60",
                StartTime: startTime,

                //EndTime: "",
            };

            client.batchQueryMetric(opt,function(err,result){
                result.code.should.be.exactly(200);
                //result.data.should.have.properties('Datapoints',"TraceId","Success","Code");
                done();
            });
        });


        it('should describeMetricDatum success', function(done){

            var userId="1625715599237776";
            var slsProject = "ali-cn-hangzhou-corp-sls-admin";
            var logStore = "sls_operation_log";

            var startTime = new Date(new Date().getTime()-3600*1000 + 8*3600*1000);
            startTime = startTime.toISOString().replace(/T/,' ').substring(0,19);

            var dim = {
                userId: userId,
                project: slsProject,
                logStore: logStore
            };

            var opt= {
                Dimensions: JSON.stringify(dim),

                Project: "aliyun_sls",
                Metric: "LogInflow",
                Period:"60",
                StartTime: startTime

                //EndTime: "",
                //Length: "",
                //Page: ""
            };


            client.describeMetricDatum(opt,function(err,result){
                result.code.should.be.exactly(200);
                result.data.should.have.properties('Datapoints',"TraceId","Success","Code");
                done();
            });
        });

    });

});
