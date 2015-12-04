var batchcompute = require('./batchcompute');

/**
 *
 */

var opt = {
    JobId: 'job-00000000559638EC00005F780000069A',
    TaskName: 'TaskName1'
};

batchcompute.getTask(opt, function (err, result) {

    console.log(err || result);

    /**
     result.data:
     { EndTime: '',
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
});
