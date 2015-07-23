var batchcompute = require('./batchcompute');

/**
*
*/

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

batchcompute.createJob(jobDesc,function(err, data) {
    if(err) {
        console.log(err);
        return;
    }
    console.log(data);
});
