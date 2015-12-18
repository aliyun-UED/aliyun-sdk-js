var ALY = require('../../../');

var cms = new ALY.CMS({
    "accessKeyId": "在阿里云官网申请的 accessKeyId",
    "secretAccessKey": "在阿里云官网申请的 secretAccessKey",


    endpoint: 'http://metrics.aliyuncs.com',
    apiVersion: '2015-10-20'
});

module.exports = cms;