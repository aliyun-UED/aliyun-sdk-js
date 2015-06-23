var ALY = require('../../index.js');

var sts = new ALY.STS({
      accessKeyId: "在阿里云申请的 accessKeyId",
      secretAccessKey: "在阿里云申请的 secretAccessKey",
      endpoint: 'https://sts.aliyuncs.com',
      apiVersion: '2015-04-01'
    }
);

sts.getFederationToken({
  StsVersion: '1',
  Action: 'GetFederationToken',
  Name: 'username',
  Policy: '{"Version":"1","Statement":[{"Effect":"Allow", "Action":"*", "Resource":"*"}]}',
  DurationSeconds: 1000
}, function (err, res) {
  console.log(err, res);
});