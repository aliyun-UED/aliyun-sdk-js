var ALY = require('../../index.js');

var rds = new ALY.RDS({
    accessKeyId: "在阿里云RDS申请的 accessKeyId",
    secretAccessKey: "在阿里云RDS申请的 secretAccessKey",
    endpoint: 'https://rds.aliyuncs.com',
    apiVersion: '2014-08-15'
  }
);

rds.describeResourceUsage({
  DBInstanceId: '对应的DBInstanceId'
}, function(err, res) {
  console.log(err, res);
});

rds.describeSlowLogs({
  DBInstanceId: '对应的DBInstanceId',
  StartTime: '2014-11-11Z',
  EndTime: '2014-11-12Z'
}, function(err, res) {
  console.log(err, res);
});

rds.describeDatabases({
  DBInstanceId: '对应的rdsfef2izjqnemv'
}, function(err, res) {
  console.log(err, res);
});