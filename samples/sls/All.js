
var sls = require('./sls');

var projectName = "project_name1";


var listLogStores = function(fn) {
    sls.listLogStores({
        projectName: projectName
    }, function (err, data) {
        console.log('----listLogStores----');
        if(err) console.error('error:',err);
        else{
            console.log(data);
            fn(data);
        }
    });
};

var putLogs = function(logStoreName,fn){

    var logGroup = {
        logs : [{
            time:  Math.floor(new Date().getTime()/1000),
            contents: [{
                key: 'a',
                value: '1'
            },{
                key: 'a',
                value: '2'
            },{
                key: 'a',
                value: '3'
            }]
        }],
        topic: 'vv',
        source: '127.0.0.1'
    };

    sls.putLogs({
        projectName: projectName,
        logStoreName: logStoreName,
        logGroup: logGroup
    }, function (err, data) {
        console.log('----putLogs----');
        if(err) console.error('error:',err);
        else{
            console.log(data);
            fn(data);
        }
    });
};

var listTopics = function(logStoreName, fn) {

    sls.listTopics({
        projectName: projectName,
        logStoreName: logStoreName,
        line: 10
    }, function (err, data) {
        console.log('----listTopics----');
        if(err) console.error('error:',err);
        else{
            console.log(data);
            fn(data);
        }
    });
};
var getHistograms = function(logStoreName, topic, fn){
    sls.getHistograms({
        projectName: projectName,
        logStoreName: logStoreName,
        topic: topic,
        from: from,
        to: to
    }, function (err, data) {
        console.log('----getHistograms----');
        if(err) console.error('error:',err);
        else{
            console.log(data);
            fn(data);
        }
    });
};

var getLogs = function(logStoreName, topic, fn){
    sls.getLogs({
        projectName: projectName,
        logStoreName: logStoreName,
        topic: topic,
        from: from,
        to: to
    }, function (err, data) {
        console.log('----getLogs----');
        if(err) console.error('error:',err);
        else{
            console.log(data);
            fn(data);
        }
    });
};


var to =  Math.floor(new Date().getTime()/1000)+10;
var from = to-3600;

listLogStores(function(result1){
    var logStoreName = result1.logstores[0];

    putLogs(logStoreName, function(result2){

        listTopics(logStoreName,function(result3){
            var topic = result3.topics[0];
            getHistograms(logStoreName,topic, function(result4){
                getLogs(logStoreName,topic, function(result5){

                });
            });
        });
    });
});