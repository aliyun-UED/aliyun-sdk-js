var sls = require('./sls');

// -------------------------------
// list logStores
// -------------------------------

var projectName = "your_project_name";

var logStoreName="your_logstore";
var batchGetLogsCallback = function(shardId,cursor1)
{
        sls.batchGetLogs({
                projectName:projectName,
                logStoreName:logStoreName,
                ShardId:shardId,
                cursor:cursor1,
                count:10
            },function(err,res)
            {
                if(err)
                console.log(err);
                if(res == null)return;
                for(var i in res.body.logGroupList)
                {
                    var logGroup = res.body.logGroupList[i];
                    console.log(logGroup);
                }
                if(res.headers["x-log-cursor"]== cursor1)
                    return;
                batchGetLogsCallback(shardId,res.headers["x-log-cursor"]);
            });
}
function batchGetLogs(shardId)
{
    var param = {
                projectName:projectName,
                logStoreName:logStoreName,
                ShardId:shardId,
                FromTime: parseInt( (new Date()).getTime()/1000)-900
            };
    console.log(param);
    sls.getCursor(param,function(err,data)
    {
    if(err)
    console.log(err);
    if(data)
    batchGetLogsCallback(shardId,data.body.cursor);
});
};
sls.listShards({
projectName:projectName,
logStoreName:logStoreName
},function(err,data)
{
    for(var i in data.body)
    {
        batchGetLogs(data.body[i].shardID);
    }
});
