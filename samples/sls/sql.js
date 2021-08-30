var sls = require('./sls');

// -------------------------------
// get Logs
// -------------------------------
var projectName = 'ali-cn-yunlei-sls-admin';
var logStoreName = 'sls_operation_log';
var to = Math.floor(new Date().getTime() / 1000);
var from = to - 900; //15min

new Promise((resolve, reject) => {

    sls.executeLogStoreSql({
        projectName: projectName,
        logStoreName: logStoreName,
        from: from,
        to: to,
        query: '*|select count(method)',
        powerSql:true
    }, function(err, data) {
        if (err) {
            console.log('error:', err);
            reject(err);
            return;
        }
        console.log(data);
        // console.log('success:', data);
        resolve(data);
    });
});
sls.createSqlInstance({
    projectName:projectName,
    sqlinstanceDetail:
    {
        cu:5
    }
}, function(err, data){
    console.log("createSqlInstance", err,data);
    sls.updateSqlInstance({
        projectName:projectName,
        sqlinstanceDetail:
        {
            cu:1000
        }
    }, function(err, data){
        console.log("updateSqlInstance", err,data);
        sls.getSqlInstance({
            projectName:projectName
        }, function(err, data){
            console.log("listSqlInstance", err,data);
        });
    });
});
return new Promise((resolve, reject) => {

    sls.executeProjectSql({
        projectName: projectName,
        query: 'select count(method) from sls_operation_log where __time__ > to_unixtime(now()) - 300 and __time__ < to_unixtime(now())',
        powerSql:true
    }, function(err, data) {
        if (err) {
            console.log('error:', err);
            reject(err);
            return;
        }
        console.log(data);
        // console.log('success:', data);
        resolve(data);
    });
});

