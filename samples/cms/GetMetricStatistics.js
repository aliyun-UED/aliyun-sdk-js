var client= require('./cms');

var opt= {
    Dimensions: '',
    StartTime: "",
    MetricName: "",
    EndTime: "",
    Namespace: "",
    Interval: "",
    NextToken: "",
    Length: ""
};

client.getMetricStatistics(opt, function(err,result){
    console.log(err,result);
});
