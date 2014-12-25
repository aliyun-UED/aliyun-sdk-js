var ALY = require('../../index.js');

var oss = new ALY.OSS({
  "accessKeyId": "在阿里云OSS申请的 accessKeyId",
  "secretAccessKey": "在阿里云OSS申请的 secretAccessKey",
  // 根据你的 oss 实例所在地区选择填入
  // 杭州：http://oss-cn-hangzhou.aliyuncs.com
  // 北京：http://oss-cn-beijing.aliyuncs.com
  // 青岛：http://oss-cn-qingdao.aliyuncs.com
  // 深圳：http://oss-cn-shenzhen.aliyuncs.com
  // 香港：http://oss-cn-hongkong.aliyuncs.com
  endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
  // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
  apiVersion: '2013-10-15'
});

module.exports = oss;
