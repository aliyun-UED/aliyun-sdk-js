var batchcompute = require('./batchcompute');

/**
*
*/
batchcompute.listJobStatus(function(err, data) {
    if(err) {
        console.log(err);
        return;
    }
    console.log(data);
});
