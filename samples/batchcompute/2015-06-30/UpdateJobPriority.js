var batchcompute = require('./batchcompute');

/**
*
*/
var jobId = 'job-00000000559638EC00005F780000069A';

batchcompute.updateJobPriority({jobId:jobId,priority:10},function(err, data) {
  if(err) {
    console.log(err);
    return;
  }
  console.log(data);
});
