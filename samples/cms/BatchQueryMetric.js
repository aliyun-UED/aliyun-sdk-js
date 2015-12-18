var client= require('./cms');

var opt= {
    Dimensions: '',
    Project: "",
    Metric: "",
    Period:"",
    StartTime: "",
    EndTime: ""
};

client.batchQueryMetric(opt,function(err,result){
    console.log(err, result);
});
