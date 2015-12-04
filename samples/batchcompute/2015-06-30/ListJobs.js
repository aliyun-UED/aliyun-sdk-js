var batchcompute = require('./batchcompute');

/**
*
*/
batchcompute.listJobs(function(err, data) {
    if(err) {
        console.log(err);
        return;
    }
    console.log(data);
});
