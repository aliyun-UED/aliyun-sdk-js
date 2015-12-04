var batchcompute = require('./batchcompute');

/**
*
*/
var clusterId = 'cls-6kilcg94rdtk004d';

batchcompute.deleteCluster({ClusterId:clusterId},function(err, data) {
  if(err) {
    console.log(err);
    return;
  }
  console.log(data);
});
