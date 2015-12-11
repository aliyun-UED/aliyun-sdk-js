var batchcompute = require('./batchcompute');

/**
*
*/

var opt= {
    JobId:'job-00000000559638EC00005F780000069A',
    TaskName: 'taskName1',
    Marker: "", //本页起始资源标识符。默认为空字符串。
    MaxItemCount: 100  //实际返回最大资源数量。默认值50，最大值100。
};


batchcompute.listInstances(opt,function(err, result) {

  console.log(err || result);

  /**
   result.data:
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
});
