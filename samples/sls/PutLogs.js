var sls = require('./sls');

// -------------------------------
// put logs
// -------------------------------
var projectName = "your_project_name";
var logStoreName = "your_logstore";

var logGroup = {
    logs : [{
        time:  Math.floor(new Date().getTime()/1000),
        contents: [{
            key: 'a',
            value: '1'
        },{
            key: 'a',
            value: '2'
        },{
            key: 'a',
            value: '3'
        }]
    }],
    topic: 'vv',
    source: '127.0.0.1'
};

sls.putLogs({
    //必选字段
    projectName: projectName,
    logStoreName: logStoreName,
    logGroup: logGroup
}, function (err, data) {

    if (err) {
        console.log('error:', err);
        return;
    }

    console.log('success:', data);

});
