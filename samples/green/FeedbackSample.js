/**
 * Created by hyliu on 16/12/16.
 * 反馈结果
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

green.sampleFeedback({
        //必填，调用文本和图片检测接口时会返回taskId
        TaskId: JSON.stringify(["16083e3c-a1a9-4061-9aef-8c3aad972199-1482389524045"]),
        // 必填: 0: 审核通过(正常)，1：审核删除(审核违规)
        Marking: "0",
        // 样本分类: 色情:porn, 广告:ad, 政治:politics, 暴恐:violence
        Category: "porn"
    },
    function(err, data){
        if(err) {
            console.log('error:', err);
            return;
        }
        //返回结果格式: {"Msg":"调用成功。","Code":"Success"}
        console.log('success:', JSON.stringify(data));
    }
);
