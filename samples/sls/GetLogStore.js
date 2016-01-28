var sls = require('./sls');

// -------------------------------
// list logStores
// -------------------------------
var projectName = "your_project_name";

sls.getLogstore({
  //必选字段
    projectName: projectName ,
    LogStoreName : "your_logstore"
        },function(err,data)
{

    if (err) {
        console.log('error:', err);
        return;
    }

    console.log('success:', data);

});
