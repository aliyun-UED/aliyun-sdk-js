var ALY = require('../../index.js');

var cdn = new ALY.DNS({
    accessKeyId: "在阿里云OSS申请的 accessKeyId",
    secretAccessKey: "在阿里云OSS申请的 secretAccessKey",
    endpoint: 'http://alidns.aliyuncs.com',
    apiVersion: '2015-01-09'
  }
);

cdn.describeDomains({}, function(err, res) {
  console.log(err, res);
});