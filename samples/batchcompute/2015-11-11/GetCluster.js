var batchcompute = require('./batchcompute');


batchcompute.getCluster({ClusterId: "cls-6kilcg94rdtk004d"}, function(err, result) {
    console.log(err || result);
});
