/**
 * Created by hyliu on 16/12/16.
 */

var ALY = require("aliyun-sdk")

// 构建一个 Aliyun Client, 用于发起请求
// 构建Aliyun Client时需要设置AccessKeyId和AccessKeySevcret
// RAM是Global Service, API入口位于杭州, 这里使用RAM API的主地址
var green = new ALY.GREEN({
    accessKeyId: '你的accessKeyId',
    secretAccessKey: '你的accessKeySecret',
    endpoint: 'http://green.cn-hangzhou.aliyuncs.com',
    apiVersion: '2016-12-16'
});

green.textKeywordFilter({
        Text:'你好 我好 他好 法轮功'
    },
    function(err, data){
        if(err) {
            console.log('error:', err);
            return;
        }
        console.log('success:', JSON.stringify(data));

        //判断是否成功
        if(data.Code === 'Success') {
            var isHit = data.Hit;
            //判断是否命中关键词
            if(isHit == true) {
                var keywordResults = data.KeywordResults.KeywordResult;
                for( var i = 0;i<keywordResults.length;i++){
                    console.log(keywordResults[i]);
                    //命中的关键词上下文
                    console.log(keywordResults[i].KeywordCtx);
                    //命中的风险类型, 如果命中了用户自定义的关键词,则为用户词库的id, 命中系统关键词为对应系统关键词风险类型
                    console.log(keywordResults[i].KeywordType);
                }
            }
        }else{
            //出错情况下打印出结果
            console.log(data.Code);
            console.log(data.Msg);
        }
    }
);
