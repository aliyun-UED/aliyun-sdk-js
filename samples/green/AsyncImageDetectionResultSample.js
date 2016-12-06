/**
 * Created by hyliu on 16/2/23.
 */

var ALY = require("aliyun-sdk")

var green = new ALY.GREEN({
    accessKeyId: '你的accessKeyId',
    secretAccessKey: '你的secretAccessKey',
    endpoint: 'http://green.cn-hangzhou.aliyuncs.com',
    apiVersion: '2016-11-24',
})


green.imageResults({
    TaskId: JSON.stringify(["d61d0a50-79e1-4375-bf3e-cdbc9c1de843-1480079336235"])
}, function(err, data){
    if(err) {
        console.log('error:', err);
        return;
    }
    console.log('success:', JSON.stringify(data));
})


