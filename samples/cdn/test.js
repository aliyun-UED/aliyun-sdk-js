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
  // 注意, 之前是传入 Date 对象, 现在改为一个 ISO 时间字符串, 而且时间精确到秒而不是毫秒
  StartTime: "2014-12-10T00:00:00Z",
  EndTime: "2014-13-10T00:10:00Z"
}, function(err, res) {
  console.log(err, res);
});