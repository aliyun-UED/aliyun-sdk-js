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

/**
 *
 * 同步调用只支持单张图片
 */
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
        Async: false,
        ImageUrl: JSON.stringify(urls),
        Scene: JSON.stringify(scenes)
    },
    function(err, data){
        if(err) {
            console.log('error:', err);
            return;
        }
        console.log('success:', JSON.stringify(data));

        //判断是否成功
        if(data.Code === 'Success' && data.ImageResults.ImageResult.length > 0) {
            var imageResult = data.ImageResults.ImageResult[0];
            var imageUrl = imageResult.ImageName;
            var taskId = imageResult.TaskId;

            //获取结果
            var pornResult = imageResult.PornResult;
            var ocrResult = imageResult.OcrResult;
            var illegalResult = imageResult.IllegalResult;
            var sensitiveFaceResult = imageResult.SensitiveFaceResult;
            var adResult = imageResult.AdResult;
            var qrcodeResult = imageResult.QrcodeResult;

            /**
             * 黄图检测结果
             */
            if(contains(scenes, "porn")){
                /**
                 * 黄图分值, 0-100
                 */
                console.log(pornResult.Rate);
                /**
                 * 绿网给出的建议值, 0表示正常，1表示色情，2表示需要review
                 */
                console.log(pornResult.Label);
            }

            /**
             * ocr识别结果
             */
            if(contains(scenes, "ocr")){
                console.log(ocrResult.Text);
            }

            /**
             * 暴恐敏感识别结果
             */
            if(contains(scenes, "illegal")){
                /**
                 * 分值, 0-100
                 */
                console.log(illegalResult.Rate);
                /**
                 * 绿网给出的建议值, 0表示正常，1表示命中暴恐渉政，2表示需要review
                 */
                console.log(illegalResult.Label);
            }

            /**
             * 牛皮藓广告识别结果
             */
            if(contains(scenes, "ad")){
                /**
                 * 分值, 0-100
                 */
                console.log(adResult.Rate);
                /**
                 * 绿网给出的建议值, 0表示正常，1表示广告，2表示需要review
                 */
                console.log(adResult.Label);
                /**
                 * 风险: 0:正常, 1:图片带文字, 2:二维码, 3: 图片有文字且有二维码
                 */
                console.log(adResult.RiskType);

                //如果是二维码, 可获取到二维码内容
                console.log(adResult.RiskDetails);
            }

            /**
             * 二维码识别结果
             */
            if(contains(scenes, "qrcode")){
                console.log(qrcodeResult.QrcodeList);
            }

            /**
             * 人脸识别结果
             */
            if(contains(scenes, "sensitiveFace")){
                console.log(sensitiveFaceResult.Items.ImageSensitiveFaceHitItem);
            }
        }else{
            //出错情况下打印出结果
            console.log(data.Code);
            console.log(data.Msg);
        }

    }
);


function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}