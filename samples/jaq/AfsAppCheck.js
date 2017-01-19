var ALY = require("aliyun-sdk");

var jaq = new ALY.JAQ({
    accessKeyId: 'YOUR ACCESS_KEY',
    secretAccessKey: 'YOUR ACCESS_SECRET',
    endpoint: 'http://jaq.aliyuncs.com',
    apiVersion: '2016-11-23',
});


jaq.afsAppCheck({
    Session: "d61d0a50-79e1-4375-bf3e-cdbc9c1de843-1480079336235"
}, function (err, data) {
    if (err) {
        //异常
        console.log('error:', err);
        return;
    }
    //此处无异常，但也可能调用失败
    console.log('result:', JSON.stringify(data));
});
