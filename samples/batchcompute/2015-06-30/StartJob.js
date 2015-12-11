var batchcompute = require('./batchcompute');

/**
*
*/
var jobId = 'job-00000000559638EC00005F780000069A';

batchcompute.startJob({jobId:jobId},function(err, data) {
  if(err) {
    console.log(err);
    return;
  }
  console.log(data);
});
