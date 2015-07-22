var ALY = require('../../index.js');

var cdn = new ALY.CDN({
    accessKeyId: "在阿里云OSS申请的 accessKeyId",
    secretAccessKey: "在阿里云OSS申请的 secretAccessKey",
    endpoint: 'https://cdn.aliyuncs.com',
    apiVersion: '2014-11-11'
  }
);

cdn.refreshObjectCaches({
  ObjectType: 'File',
  ObjectPath: 'http://cdn.test.com/test.jpg'
}, function(err, res) {
  console.log(err, res);
});

cdn.describeCdnMonitorData({
  DomainName: "cdn.test.com",
  StartTime: new Date("2014-12-10T00:00:00Z"),
  EndTime: new Date("2014-12-10T00:10:00Z")
}, function(err, res) {
  console.log(err, res);
});