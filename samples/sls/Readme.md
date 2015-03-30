aliyun-sdk/sls
------------------------

## 1. 如何使用

```js
var sls = new ALY.SLS({
    "accessKeyId": "在阿里云sls申请的 accessKeyId",
    "secretAccessKey": "在阿里云sls申请的 secretAccessKey",

    // 根据你的 sls project所在地区选择填入
  	// 北京：http://cn-beijing.sls.aliyuncs.com
  	// 杭州：http://cn-hangzhou.sls.aliyuncs.com
  	// 青岛：http://cn-qingdao.sls.aliyuncs.com
    // 深圳：http://cn-shenzhen.sls.aliyuncs.com

    // 注意：如果你是在 ECS 上连接 SLS，可以使用内网地址，速度快，没有带宽限制。
  	// 北京：cn-hangzhou-intranet.sls.aliyuncs.com
  	// 杭州：cn-beijing-intranet.sls.aliyuncs.com
  	// 青岛：cn-qingdao-intranet.sls.aliyuncs.com
    // 深圳：cn-shenzhen-intranet.sls.aliyuncs.com
    endpoint: 'http://cn-hangzhou.sls.aliyuncs.com',

    // 这是 sls sdk 目前支持最新的 api 版本, 不需要修改
    apiVersion: '2014-11-18'

    //以下是可选配置
    //,httpOptions: {
    //    timeout: 10000  //10秒, 默认没有timeout
    //}
});


var opt= {
   //请看下面的参数详解
};


/**
* @param opt 请看下面的参数详解
*/
sls.getLogs(opt, function(error, data){
    console.log(error, data);
});
```
## 2. sls的方法

| 方法名 | 描述 |
| ------| ----|
| listLogStores | 列出Project下的所有Logstore名称。|
| putLogs | 向指定的Logstore写入日志。|
| listTopics | 列出Logstore中的日志主题。|
| getHistograms | 查询Logstore中的日志在时间轴上的分布。|
| getLogs | 查询Logstore中的日志数据。|

其他细节请看 [SLS API](http://docs.aliyun.com/#/sls/api/overview)

## 3. 参数详解

### (1) sls.listLogStores(opt, fn)

#### 参数:

| 参数 | 类型 | 描述 |
| ------ | ---- | ----- |
| opt | object | 必选参数 |
| opt.projectName | string | 必选参数, project名称 |
| fn | function | 回调方法,有2个参数(err, data), 详情请看下面的返回格式 |

#### 返回data格式
| 参数 | 类型 | 描述 |
| ------ | ---- | ----- |
| request_id | string | request id |
| count | int | 返回logstores总数 |
| logstores | array | 字符串数组 |
| headers | object | 返回响应头，map |

#### 返回data样例:
```js
{
  request_id: '54D46D27250A9F81061F5725',
  count: 1,
  logstores: [ 'logStoreName1' ],
  headers: { ... }
}
```

### (2) sls.putLogs(opt, fn)
#### 参数
| 参数 | 类型 | 描述 |
| ------ | ---- | ----- |
| opt | object | 必选参数 |
| opt.projectName | string | 必选参数,project名称 |
| opt.logStoreName | string | 必选参数,logStore名称 |
| opt.logGroup | object | 必选参数,写入日志的JSON格式 |
| fn | function | 回调方法,有2个参数(err, data), 详情请看下面的返回格式 |

#### logGroup样例:
```js
var logGroup = {
    logs : [{
        time:  Math.floor(new Date().getTime()/1000), //单位秒
        contents: [{    //key-value对
            key: 'a',
            value: '1'
        },{
            key: 'b',
            value: '2'
        },{
            key: 'c',
            value: '3'
        }]
    }],
    topic: 'topicName', //optional
    source: '127.0.0.1' //optional
};
```
注意限制:
* 1. logGroup.logs.length 不能大于4096行。
* 2. 每个logGroup通过protobuf方法压缩后，大小不超过3MB。


#### 返回data格式
| 参数 | 类型 | 描述 |
| ------ | ---- | ----- |
| request_id | string | request id |
| headers | object | 返回响应头，map |

#### 返回data样例:
```js
{
  request_id: '54D46D2766F2C420111F398A',
  headers: {...}
}
```


### (3) sls.listTopics(opt, fn)
#### 参数
| 参数 | 类型 | 描述 |
| ------ | ---- | ----- |
| opt | object | 必选参数 |
| opt.projectName | string | 必选参数,project名称 |
| opt.logStoreName | string | 必选参数,logStore名称 |
| opt.token | string | 可选参数，从某个 topic开始列出,按照字典序,默认为空 |
| opt.line | int | 可选参数，读取的行数,默认值为 100;范围 0-100 |
| fn | function | 回调方法,有2个参数(err, data), 详情请看下面的返回格式 |


#### 返回data格式
| 参数 | 类型 | 描述 |
| ------ | ---- | ----- |
| request_id | string | request id |
| count | int | 返回topic总数 |
| topics | array | 字符串数组 |
| headers | object | 返回响应头，map |

#### 返回data样例:
```js
{
  request_id: '54D46D27410323AE311F5A2E',
  count: 2,
  topics: [ 'topic1', 'topic2' ],
  headers: { ... }
}
```

### (4) sls.getHistograms(opt, fn)
#### 参数
| 参数 | 类型 | 描述 |
| ------ | ---- | ----- |
| opt | object | 必选参数 |
| opt.progress|string|必选参数,project名称|
| opt.logStoreName|string|必选参数,logStore名称|
| opt.from | int | 必选参数, 开始时间(精度为秒,从 1970-1-1 00:00:00 UTC 计算起的秒数)|
| opt.to|int | 必选参数,结束时间(精度为秒,从 1970-1-1 00:00:00 UTC 计算起的秒数)|
| opt.topic | string|可选参数,指定日志主题(用户所有主题可以通过listTopics获得)|
| opt.query | string|查询的关键词,不输入关键词,则查询全部日志数据|
| fn | function|回调方法,有2个参数(err, data), 详情请看下面的返回格式|

#### 返回data格式
|名称|类型|描述|
| ------ | ---- | ----- |
|request_id|string|请求ID, 样例: "54D44ABAD458BB6A011F183C" |
|headers|object|返回响应头，是一个map|
|progress|string|查询结果的状态。可以有Incomplete和Complete两个选值，表示结果是否完整。|
|count|int|当前查询结果中所有日志总数。|
|histograms|array|	当前查询结果在划分的子时间区间上的分布状况，具体结构见:[GetHistograms API的描述](http://docs.aliyun.com/#/sls/api/apilist&GetHistograms)|

#### 返回data样例：
```js
{
  request_id: '54D46D273A9D57A61E1F219F',
  count: 0,
  histograms:
   [ { count: 0,
       from: 1423204127,
       progress: 'Complete',
       to: 1423204140 },
     { count: 0,
       from: 1423204140,
       progress: 'Complete',
       to: 1423204200 },
      ......
       ],
  progress: 'Complete',
  headers: { ... }
}
```


### (5) sls.getLogs(opt, fn)
#### 参数
|参数|类型|描述|
| ------ | ---- | ----- |
|opt|object|必选参数|
|opt.progress|string|必选参数,project名称|
|opt.logStoreName|string|必选参数,logStore名称|
|opt.from|int|必选参数, 开始时间(精度为秒,从 1970-1-1 00:00:00 UTC 计算起的秒数)|
|opt.to|int|必选参数,结束时间(精度为秒,从 1970-1-1 00:00:00 UTC 计算起的秒数)|
|opt.topic|string|可选参数,指定日志主题(用户所有主题可以通过listTopics获得)|
|opt.query|string|查询的关键词,不输入关键词,则查询全部日志数据|
|opt.line|int|读取的行数,默认值为 100,取值范围为 0-100|
|opt.offset|int|读取起始位置,默认值为 0,取值范围>0|
|fn|function|回调方法,有2个参数(err, data), 详情请看下面的返回格式|

#### 返回data格式
|名称|类型|描述|
| ------ | ---- | ----- |
|request_id|string|请求ID, 样例: "54D44ABAD458BB6A011F183C" |
|headers|object|返回响应头，是一个map|
|progress|string|查询结果的状态。可以有Incomplete和Complete两个选值，表示结果是否完整。|
|count|int|当前查询结果中所有日志总数。|
|logs|array|	当前查询结果在划分的子时间区间上的分布状况，具体结构见:[GetHistograms API的描述](http://docs.aliyun.com/#/sls/api/apilist&GetHistograms)|

#### 返回data样例：
```js
{
  request_id: '54D48F58410323A9311FBE2C',
  count: 2,
  logs:
   [ { __source__: '127.0.0.1',
       __time__: '1423216219',
       a: '1',
       b: '2',
       c: '0.9276626002974808' },
     { __source__: '127.0.0.1',
       __time__: '1423216220',
       a: '1',
       b: '2',
       c: '0.4854024585802108' } ],
  progress: 'Complete',
  headers: {}
}
```


## 4. 错误返回格式

#### 返回的error格式
|名称|类型|描述|
| ------ | ---- | ----- |
|request_id|string|请求ID, 样例: "54D44ABAD458BB6A011F183C" |
|headers|object|返回响应头，是一个map|
|code|int|返回响应的statusCode，如：404。|
|message|int|返回响应的body部分。|
|error_code|string|API返回的错误码|
|error_message|string|API返回的错误信息|

#### error 格式样例：
```js
{
    request_id: '54D33044AB9AC49D2E1D2274',
    error_code: 'SLSLogStoreNotExist',
    error_message: 'logstore logstorename1 not exist',
    code: 404,
    message: '{"error_code":"SLSLogStoreNotExist","error_message":"logstore logstorename1 not exist"}\n',
    headers: { ... }
}
```
