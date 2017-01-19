var ALY = require("aliyun-sdk");

var jaq = new ALY.JAQ({
    accessKeyId: 'fXWEfij4bQwucKqM',
    secretAccessKey: '1Lf7E6MZ26OrTuRLtwIbeUosWnidoK',
    endpoint: 'http://jaq.aliyuncs.com',
    apiVersion: '2016-11-23',
});

jaq.afsCheck({

    Platform: 3,//必填参数，请求来源： 1：Android端； 2：iOS端； 3：PC端及其他
    Session: "01AqEQ_l_Bp6BNx3_UKxprAxCmrm30bQ9UIB3kZE9Lu2EysYbERNA6RqM__Fq_4ea6AxzFN20W2_p6ozUq3VRLsZ1ZIl0sSEllMLpu-ZUYsM8",// 必填参数，从前端获取，不可更改
    Sig: "057QNlYcd5ddGU3SoIknc0SRwlfT3Elxtp-fnwvQHmoakpCz5GwHl7pEWerqDZkvDlZgglsqqaEJiKiAuCNgmZBwxemC79O04C5U6QO3ub91Ekoj93kogcbg4Yj2c3EbCsh4bWdyXWscIG5IhcaMakGGqmpmm4z21-Mr1TU3_1-90gbvPPIzCOZHEu1NRI_nK53AWKbvWV0tNTU_8XYu_9vijmqQMXQOzNmgkjeGi3TPCtwlJ0fcXtq6_HcGcoKcePG4jCPYx2ZIigLbuhY9oXoIHE_o4Bm0QV2vg4jLiVK6I",// 必填参数，从前端获取，不可更改
    Token: "0004:1484738502730:0.7524721427710181",// 必填参数，从前端获取，不可更改
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