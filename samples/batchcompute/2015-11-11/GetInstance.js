var batchcompute = require('./batchcompute');

var opt = {
    JobId: 'job-00000000559638EC00005F780000069A',
    TaskName: 'TaskName1',
    InstanceId: '0'
};

batchcompute.getInstance(opt, function (err, result) {

    console.log(err || result);

    /**
     result.data:
     { EndTime: '',
        InstanceId: 0,
        Progress: 0,
        Result: { Detail: '', ErrorCode: '', ErrorMessage: '', ExitCode: 0 },
        RetryCount: 0,
        StartTime: '',
        State: 'Waiting',
        StderrRedirectPath: 'oss://my-bucket/diku_simple_test/log/0.stderr',
        StdoutRedirectPath: 'oss://my-bucket/diku_simple_test/log/0.stdout' }
     */
});
