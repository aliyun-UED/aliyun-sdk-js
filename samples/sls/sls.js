var ALY = require('../../index.js');

var sls = new ALY.SLS({
    "accessKeyId": "在阿里云sls申请的 accessKeyId",
    "secretAccessKey": "在阿里云sls申请的 secretAccessKey",

    // 根据你的 sls project所在地区选择填入
    // 杭州：http://cn-hangzhou.sls.aliyuncs.com
    // 青岛：http://cn-qingdao.sls.aliyuncs.com
    endpoint: 'http://cn-hangzhou.sls.aliyuncs.com',
    // 这是 sls sdk 目前支持最新的 api 版本, 不需要修改
    apiVersion: '0.4.0'
});

module.exports = sls;