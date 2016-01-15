var batchcompute = require('./batchcompute');

var clusterDesc = {
    "Name": "node-sdk-test-cluster",
    "Description": "node-sdk test",
    "ImageId": "",  //ecs image id
    "Groups": {
        "group1": {
            "DesiredVMCount": 3,
            "InstanceType": 'ecs.s3.large',
            "ResourceType": "OnDemand"
        }
    }
};

batchcompute.createCluster(clusterDesc, function (err, result) {

    console.log(err || result);

    /**
     result.data:
     {
        "Id":"cls-6kilcg94rdtk004d"
     }
     */
});
