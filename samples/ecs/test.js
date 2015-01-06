var ALY = require('../../index.js');

var ecs = new ALY.ECS({
    accessKeyId: "在阿里云ECS申请的 accessKeyId",
    secretAccessKey: "在阿里云ECS申请的 secretAccessKey",
    endpoint: 'https://ecs.aliyuncs.com',
    apiVersion: '2014-05-26'
  }
);

ecs.describeDisks({
  RegionId: 'cn-beijing'
}, function(err, res) {
  console.log(err, res);
});

ecs.describeInstanceTypes({
}, function(err, res) {
  console.log(err, res);
});

ecs.describeZones({
  RegionId: 'cn-beijing'
}, function(err, res) {
  console.log(err, res);
});