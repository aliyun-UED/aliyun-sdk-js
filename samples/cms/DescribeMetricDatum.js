var client= require('./cms');

var opt= {
    Dimensions: "",
    Project: "",
    Metric: "",
    Period:"",
    StartTime: "",
    EndTime: "",
    Length: "",
    Page: ""
};

client.describeMetricDatum(opt,function(err,result){
    console.log(err, result);
});
