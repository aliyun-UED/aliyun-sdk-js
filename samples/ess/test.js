var ALY = require('../../index.js');

var ess = new ALY.ESS({
    accessKeyId: "在阿里云ECS申请的 accessKeyId",
    secretAccessKey: "在阿里云ECS申请的 secretAccessKey",
    endpoint: 'https://ess.aliyuncs.com',
    apiVersion: '2014-08-28',
  }
);

ess.describeScalingGroups({
  RegionId: 'cn-beijing'
}, function(err, res) {
  console.log(err, res);
});

