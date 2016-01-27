var sls = require('./sls');

// -------------------------------
// list logStores
// -------------------------------

var projectName = "your_project_name";

var logStoreName="your_logstore";
var param ={
    projectName:projectName,
    logstoreName : logStoreName,
    indexDetail:{
    line:{
    token: [";"],
    include_keys: ["key2", "key3"],
    caseSensitive:false
    },
    ttl:30
    }
};
sls.createIndex(param,function(err,data)
{
    console.log(err,data);
    sls.updateIndex(param,function(err,data)
        {
        console.log(err,data);
        delete param.indexDetail;
        sls.getIndex(param,function(err,data)
            {
            console.log(err,data);
            sls.deleteIndex(param,function(err,data1)
                {
                console.log(err,data1);
                });
            });
        });
}
);
