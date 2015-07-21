var batchcompute = require('./batchcompute');

/**
*
*/
batchcompute.listImages(function(err, data) {
  if(err) {
    console.log(err);
    return;
  }
  console.log(data);
});
