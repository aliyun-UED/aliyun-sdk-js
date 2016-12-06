/**
 * Created by hyliu on 16/2/23.
 */

var ALY = require("aliyun-sdk")

// 构建一个 Aliyun Client, 用于发起请求
// 构建Aliyun Client时需要设置AccessKeyId和AccessKeySevcret
var green = new ALY.GREEN({
    accessKeyId: '你的accessKeyId',
    secretAccessKey: '你的secretAccessKey',
    endpoint: 'http://green.cn-hangzhou.aliyuncs.com',
    apiVersion: '2016-11-24'
});

var dataItem1 = {'dataId': "aaaa", 'content':'你好', 'postId': '111', 'postTime': Date.now()}
var dataItem2 = {'dataId': 'bbb', 'content':'你真好玩', 'postId': '111', 'postTime': Date.now()}

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
    }
);
