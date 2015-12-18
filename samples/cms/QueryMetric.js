var client= require('./cms');

var opt= {
    Project:"",
    Metric:"",
    Period:"",
    Dimensions: "",
    StartTime:"",
    EndTime: "",
    Page: "",
    Length: '',
    Extend: ''
};


client.queryMetric(opt,function(err,result){
    console.log(err, result);
});