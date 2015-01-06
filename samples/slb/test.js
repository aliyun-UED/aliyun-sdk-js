var ALY = require('../../index.js');

var slb = new ALY.SLB({
    accessKeyId: "在阿里云SLB申请的 accessKeyId",
    secretAccessKey: "在阿里云SLB申请的 secretAccessKey",
    endpoint: 'https://slb.aliyuncs.com',
    apiVersion: '2014-05-15'
  }
);

slb.describeLoadBalancers({
  RegionId: 'cn-hangzhou'
}, function(err, res) {
  console.log(err, res);
});