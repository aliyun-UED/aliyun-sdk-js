var client= require('./cms');

var opt= {
    Dimensions: '',
    Project: "",
    Metric: "",
    Period:"",
    StartTime: "",
    EndTime: "",
    Extend: "",
    Filter: ""
};

client.batchQueryMetric(opt,function(err,result){
    console.log(err, result);
});