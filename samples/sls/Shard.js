var sls = require('./sls');

// -------------------------------
// list logStores
// -------------------------------
var projectName = "your_project_name";
var getMiddleHash = function(b,e)
{   
    var mid = ""; 
    var parse16 = function(st){
        if(st == "g")
            return 15; 
        else
            return parseInt(st,16);
    }   
    var sumArr = new Array(32);
    var rem = 0;
    for(var index = 31;index >=0;--index)
    {   
        sumArr [index] = parseInt(b[index],16)+ parse16(e[index])+rem;
        rem = parseInt(sumArr [index]/16);
        if(index >0) 
            sumArr[index] = sumArr[index] % 16; 
    }   
    rem = 0;
    for(var index in sumArr)
    {   
        var value = sumArr[index] + rem*16;
        mid += (parseInt((value)/2)).toString(16);
        rem = value %2; 
    }   
    return mid;
};  

sls.listShards({
projectName:projectName,
logStoreName:"your_logstore"
},function(err,data)
{
    if (err) {
        console.log('error:', err);
        return;
    }

    console.log('success:', data);
    var mergeshard = function(shardID,fn)
    {
    console.log("merge:"+shardID);
            sls.mergeShards({
        projectName:projectName,
        logStoreName:"your_logstore",
        ShardId : shardID
        },function(err1,data1)
        {
        console.log(err1,data1);
        fn(data1.body);
        }
        );
    }
    var deleteshard = function(shardID,fn)
    {
    console.log("delete:"+shardID);
        sls.deleteShard({
        projectName:projectName,
        logStoreName:"your_logstore",
        ShardId : shardID
        },function(err1,data1)
        {
        console.log(err1,data1);
        if(fn != null)
            fn(data1.body);
        }
        );
    }

    var shard = data.body[0];
    sls.splitShard(
        {
            projectName:projectName,
            logStoreName:"your_logstore",
            ShardId : ""+shard.shardID,
            HashKey : getMiddleHash(shard.inclusiveBeginKey,shard.exclusiveEndKey)
        },function(err1,data1)
        {
            console.log(err1,data1);
            mergeshard(data.body[1].shardID,function(mergeResult){
                for(var i in mergeResult)
                {
                    if(mergeResult[i].status == "readonly")
                    {
                        deleteshard(mergeResult[i].shardID);
                    }
                }
                });
        }
        );

});

