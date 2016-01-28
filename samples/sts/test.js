var ALY = require('../../index.js');

var sts = new ALY.STS({
      accessKeyId: "在阿里云申请的 accessKeyId",
      secretAccessKey: "在阿里云申请的 secretAccessKey",
      endpoint: 'https://sts.aliyuncs.com',
      apiVersion: '2015-04-01'
    }
);

// 构造AssumeRole请求
sts.assumeRole({
  Action: 'AssumeRole',
  // 指定角色Arn
  RoleArn: '<role-arn>',
  //设置Token的附加Policy，可以在获取Token时，通过额外设置一个Policy进一步减小Token的权限；
  //Policy: '{"Version":"1","Statement":[{"Effect":"Allow", "Action":"*", "Resource":"*"}]}',
  //设置Token有效期，可选参数，默认3600秒；
  //DurationSeconds: 3600,
  RoleSessionName: 'RoleSessionName'
}, function (err, res) {
  console.log(err, res);
});
