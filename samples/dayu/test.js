var ALY = require('../../index.js');

var dayu = new ALY.DAYU({
  accessKeyId: "在阿里云申请的 accessKeyId",
  secretAccessKey: "在阿里云申请的 secretAccessKey",
      endpoint: 'http://gw.api.taobao.com',
      apiVersion: '2015-12-16'
    }
);

dayu.sendSMS({
  sms_free_sign_name: "xxxx",
  rec_num: "12345678901",
  sms_template_code: "SMS_xxxxxx",
  sms_param: {
    code: "xxx",
    date: "xxx"
  }
}, function(err, res) {
  console.log(err, res);
});
