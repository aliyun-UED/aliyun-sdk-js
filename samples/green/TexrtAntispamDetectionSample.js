/**
 * Created by hyliu on 16/12/16.
 */

var ALY = require("aliyun-sdk")

// 构建一个 Aliyun Client, 用于发起请求
// 构建Aliyun Client时需要设置AccessKeyId和AccessKeySevcret
var green = new ALY.GREEN({
    accessKeyId: '你的accessKeyId',
    secretAccessKey: '你的accessKeySecret',
    endpoint: 'http://green.cn-hangzhou.aliyuncs.com',
    apiVersion: '2016-12-16'
});

var dataItem1 = {
       'content':'你好', //要检测的文本内容, 必填
       'dataId': 'BB85A15B-BF61-4023-80BE-1ACD1267D5ED', //数据id,请生成一个唯一数据id, 比如用uuid生成, 可选,不填服务端自动生成
       'postId': '1234567890', //发贴人的id, 可选, postId与postTime需同时填或者不填
       'postTime':Date.now() //发帖时间, 可选, postId与postTime需同时填后者不填
};
var dataItem2 = {
    'content':'我好', //要检测的文本内容, 必填
    'dataId': '485F5029-A0EE-4694-97F3-3596B14EF5CA', //数据id,请生成一个唯一数据id, 比如用uuid生成, 可选,不填服务端自动生成
    'postId': '1234567890',//发贴人的id, 可选, postId与postTime需同时填或者不填
    'postTime':Date.now() //发帖时间, 可选, postId与postTime需同时填后者不填
};
var dataItems = [dataItem1, dataItem2];

green.textAntispamDetection({
        DataItems:JSON.stringify(dataItems)
    },
    function(err, data){
        if(err) {
            console.log('error:', err);
            return;
        }
        console.log('success:', JSON.stringify(data));

        //判断是否成功
        if(data.Code === 'Success') {
            var textAntispamResults = data.TextAntispamResults.TextAntispamResult;
            for( var i = 0;i<textAntispamResults.length;i++){
                console.log(textAntispamResults[i]);
                //请求的原文本
                console.log(textAntispamResults[i].Text);
                //是否是垃圾
                console.log(textAntispamResults[i].IsSpam);
                //taskId, 如果用户填了dataId,则该字段只为您输入的dataId, 如果每天,系统自动生成一个唯一随机数
                console.log(textAntispamResults[i].TaskId);
            }
        }else{
            //出错情况下打印出结果
            console.log(data.Code);
            console.log(data.Msg);
        }
    }
);
