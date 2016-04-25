var ALY = require('../../index.js');

var ots = new ALY.OTS({
  "accessKeyId": "在阿里云OSS申请的 accessKeyId",
  "secretAccessKey": "在阿里云OSS申请的 secretAccessKey",
  // 根据你的 oss 实例所在地区选择填入
  endpoint: 'http://cn-hangzhou.ots.aliyuncs.com',
  // 这是 ots sdk 目前支持最新的 api 版本, 不需要修改
  apiVersion: '2014-08-08'
});

module.exports = ots;
