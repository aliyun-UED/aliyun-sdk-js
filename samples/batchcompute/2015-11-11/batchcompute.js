var ALY = require('../../../');

var batchCompute = new ALY.BatchCompute({
    "accessKeyId": "在阿里云官网申请的 accessKeyId",
    "secretAccessKey": "在阿里云官网申请的 secretAccessKey",


    endpoint: 'http://batchcompute.cn-qingdao.aliyuncs.com',

    // 这是batchcompute sdk 目前支持最新的 api 版本
    apiVersion: '2015-11-11'

    //以下是可选配置
    //,httpOptions: {
    //    timeout: 1000  //1sec, 默认没有timeout
    //}
});

module.exports = batchCompute;

