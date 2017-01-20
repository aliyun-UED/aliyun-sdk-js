var ALY = require("aliyun-sdk");

var jaq = new ALY.JAQ({
    accessKeyId: 'YOUR ACCESS_KEY',
    secretAccessKey: 'YOUR ACCESS_SECRET',
    endpoint: 'http://jaq.aliyuncs.com',
    apiVersion: '2016-11-23',
});

jaq.afsCheck({

    Platform: 3,//必填参数，请求来源： 1：Android端； 2：iOS端； 3：PC端及其他
    Session: "xxx",// 必填参数，从前端获取，不可更改
    Sig: "xxx",// 必填参数，从前端获取，不可更改
    Token: "xxx",// 必填参数，从前端获取，不可更改
    Scene: "register"// 必填参数，从前端获取，不可更改

}, function (err, data) {
    if (err) {
        //异常
        console.log('error:', err);
        return;
    }
    //此处无异常，但也可能调用失败
    console.log('result:', JSON.stringify(data));
});