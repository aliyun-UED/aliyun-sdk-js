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

green.imageDetection({
        Async: false,
        ImageUrl: JSON.stringify(['http://img05.taobaocdn.com/bao/uploaded/TB2BVKlfFXXXXarXXXXXXXXXXXX_!!111708970-0-saturn_solar.jpg']),
        Scene: JSON.stringify(['porn', 'ocr', 'illegal', 'qrcode', 'sensitiveFace'])
    },
    function(err, data){
        if(err) {
            console.log('error:', err);
            return;
        }
        console.log('success:', JSON.stringify(data));
    }
);
