var ALY = require('../../index.js');

var push = new ALY.PUSH({
      accessKeyId: "在阿里云申请的 accessKeyId",
      secretAccessKey: "在阿里云申请的 secretAccessKey",
      endpoint: 'http://cloudpush.aliyuncs.com',
      apiVersion: '2015-08-27'
    }
);

push.pushNoticeToiOS({
  AppKey: '在移动推送申请的 appKey',
  Target: 'all',
  TargetValue: '',
  Env: 'DEV',
  Ext: '{}',
  Summary: 'message' + i
}, function (err, res) {
  console.log(err, res);
});

