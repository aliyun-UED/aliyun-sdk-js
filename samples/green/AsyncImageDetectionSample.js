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

var urls = ['http://img05.taobaocdn.com/bao/uploaded/TB2BVKlfFXXXXarXXXXXXXXXXXX_!!111708970-0-saturn_solar.jpg'];

/**
 * 同步图片检测支持多个场景, 但不建议一次设置太多场景:
 * porn:  黄图检测
 * ocr:  ocr文字识别
 * illegal: 暴恐敏感检测
 * qrcode: 二维码识别
 * ad: 牛皮藓广告识别结果
 * sensitiveFace: 敏感人脸识别
 */
var scenes =  ["porn","ad", "ocr", "illegal", "qrcode", "sensitiveFace"];


green.imageDetection({
        Async: true,
        ImageUrl: JSON.stringify(urls),
        Scene: JSON.stringify(scenes)
    },
    function(err, data){
        if(err) {
            console.log('error:', err);
            return;
        }
        console.log('success:', JSON.stringify(data));

        //获取taskId, 然后在调用取图片检测结果接口获取最终检测结果,参考AsyncImageDetectionResultSample.js

        var imageResults = data.ImageResults.ImageResult;

        var taskIds = [];
        for( var i = 0;i<imageResults.length;i++){
            taskIds.push(imageResults[i].TaskId);
        }
        console.log('taskIds:', JSON.stringify(taskIds));
    }
);
