var batchcompute = require('./batchcompute');

/**
*
*/
var clusterId = 'cls-5F780000069A';


batchcompute.changeClusterDesiredVMCount({ClusterId:clusterId, Groups:{"group1":{DesiredVMCount:3}}},function(err, data) {
  console.log(err || data);
});
