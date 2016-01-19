var batchcompute = require('./batchcompute');

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
                //    "guest os path": "oss path"
                //},
                //"LogMapping": {
                //    "guest os path": "oss path"
                //},
                "Timeout": 21600,
                "InstanceCount": 1,
                "MaxRetryCount": 0,
                "ClusterId": "cls-6kilcg94rdtk004d" //没有请先创建 Cluster, 或者可以直接用autoCluster
                //"AutoCluster": {
                //   "InstanceType": 'ecs.s3.large',
                //   "ResourceType": "OnDemand",
                //   "ECSImageId": "m-xxxx"    //ecs image id
                //}
            }
        },
        "Dependencies": {
            "CountTask": []
        }
    }
};


batchcompute.createJob(jobDesc, function (err, result) {

    console.log(err || result);

    /**
     result.data:
     {
        "Id":"job-00000000564ECC3F0000A25D0000006A"
     }
     */
});
