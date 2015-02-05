var sls = require('./sls');

// -------------------------------
// list topics
// -------------------------------
var projectName = "project_name1";
var logStoreName = "logstore_name1";

sls.listTopics({
    //必选字段
    projectName: projectName,
    logStoreName: logStoreName,
    
    //token: '', //可选参数，从某个 topic 开始列出,按照字典序,默认为空 6
    line: 100    //可选参数，读取的行数,默认值为 100;范围 0-100
},function (err, data) {

    if (err) {
        console.log('error:', err);
        return;
    }

    console.log('success:', data);

});