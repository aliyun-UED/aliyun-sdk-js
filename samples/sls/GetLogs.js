var sls = require('./sls');

// -------------------------------
// get Logs
// -------------------------------
var projectName = "your_project_name";
var logStoreName="your_logstore";
var to = Math.floor(new Date().getTime() / 1000);
var from = to - 900; //15min
sls.getLogs({

    //必选字段 
    projectName: projectName,
    logStoreName: logStoreName,
    from: from, //开始时间(精度为秒,从 1970-1-1 00:00:00 UTC 计算起的秒数)
    to: to,    //结束时间(精度为秒,从 1970-1-1 00:00:00 UTC 计算起的秒数)

    //以下为可选字段
    topic: '',      //指定日志主题(用户所有主题可以通过listTopics获得)
    reverse: false,//是否反向读取,只能为 true 或者 false,不区分大小写(默认 false,为正向读取,即从 from 开始到 to 之间读取 Line 条)
    query: '',    //查询的关键词,不输入关键词,则查询全部日志数据
    line: 10,   //读取的行数,默认值为 100,取值范围为 0-100
    offset: 0   //读取起始位置,默认值为 0,取值范围>0
},function (err, data) {

    if (err) {
        console.log('error:', err);
        return;
    }

    console.log('success:', data);

});
