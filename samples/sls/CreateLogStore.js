var sls = require('./sls');

// -------------------------------
// list logStores
// -------------------------------
var projectName = "your_project_name";

sls.createLogstore({
  //必选字段
    projectName: projectName ,
    logstoreDetail:{
        logstoreName:"your_logstore",
        ttl:3,
        shardCount:2
    }
},function(err,data)
{
    if (err) {
        console.log('error:', err);
        return;
    }

    console.log('success:', data);

    sls.updateLogstore(
        {
            projectName: projectName ,
            logstoreName : "your_logstore",
            logstoreDetail:{
                logstoreName:"your_logstore",
                ttl:4,
                shardCount:2
            }

        },
        function(err,data)
        {
        if (err) {
        console.log('error:', err);
        return;
        }

    console.log('success:', data);
    });

});

