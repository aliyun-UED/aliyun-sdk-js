/**
 * Created by hyliu on 16/12/16.
 */

var ALY = require("aliyun-sdk")

var green = new ALY.GREEN({
    accessKeyId: '你的accessKeyId',
    secretAccessKey: '你的accessKeySecret',
    endpoint: 'http://green.cn-hangzhou.aliyuncs.com',
    apiVersion: '2016-12-16',
})

var taskIds = ['55b1a3fe-7671-43a8-84b9-c7aa3438bff9-1486545144026'];


green.imageResults({
    TaskId: JSON.stringify(taskIds)
}, function(err, data){
    if(err) {
        console.log('error:', err);
        return;
    }
    console.log('success:', JSON.stringify(data));

    //判断是否成功
    if(data.Code === 'Success') {

        var imageDetectResults = data.ImageDetectResults.ImageDetectResult;

        for( var i = 0;i<imageDetectResults.length;i++){
            var imageResult = imageDetectResults[i].ImageResult;
            var status = imageDetectResults[i].Status;

            if("TaskProcessSuccess" == status) {
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
                if(!isEmpty(pornResult)){
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
                if(!isEmpty(ocrResult)){
                    console.log(ocrResult.Text);
                }

                /**
                 * 暴恐敏感识别结果
                 */
                if(!isEmpty(illegalResult)){
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
                if(!isEmpty(adResult)){
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
                if(!isEmpty(qrcodeResult)){
                    console.log(qrcodeResult.QrcodeList);
                }

                /**
                 * 人脸识别结果
                 */
                if(!isEmpty(sensitiveFaceResult)){
                    console.log(sensitiveFaceResult.Items.ImageSensitiveFaceHitItem);
                }
            }
        }
    }else{
        //出错情况下打印出结果
        console.log(data.Code);
        console.log(data.Msg);
    }
});


function isEmpty(obj)
{
    for (var name
        in obj)
    {
        return false;
    }
    return true;
};


