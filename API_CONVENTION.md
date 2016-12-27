## 调用示例

``` javascript

var oss = new ALY.OSS({
  "accessKeyId": "在阿里云OSS申请的 accessKeyId",
  "secretAccessKey": "在阿里云OSS申请的 secretAccessKey",
  // 根据你的 oss 实例所在地区选择填入
  // 杭州：http://oss-cn-hangzhou.aliyuncs.com
  // 北京：http://oss-cn-beijing.aliyuncs.com
  // 青岛：http://oss-cn-qingdao.aliyuncs.com
  // 深圳：http://oss-cn-shenzhen.aliyuncs.com
  // 香港：http://oss-cn-hongkong.aliyuncs.com
  // 注意：如果你是在 ECS 上连接 OSS，可以使用内网地址，速度快，没有带宽限制。
  // 杭州：http://oss-cn-hangzhou-internal.aliyuncs.com
  // 北京：http://oss-cn-beijing-internal.aliyuncs.com
  // 青岛：http://oss-cn-qingdao-internal.aliyuncs.com
  // 深圳：http://oss-cn-shenzhen-internal.aliyuncs.com
  // 香港：http://oss-cn-hongkong-internal.aliyuncs.com
  endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
  // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
  apiVersion: '2013-10-15'
});

oss.getObject({
    Bucket: 'chylvina',
    Key: '9.html'
    IfModifiedSince: 1234566778,
    IfMatch: 'abc',
    // ResponseCacheControl: '', // 可选参数
    Parts: [
      {
        PartNumber: 1,
        ETag: 'etag1'
      },
      {
        PartNumber: 2,
        ETag: 'etag2'
      }
    ],
    Dependencies: {
      D1: {},
      D2: {}
    }
  },
  function (err, data) {

    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);

  });
```

## 对应的 api 描述

``` json
getObject": {         // sdk 中真正暴露的方法名称, 是服务定义名称的拷贝，并且第一个字母小写
 "name": "GetObject", // 服务定义的名称，不会被调用
 "http": {            // http 调用内容
   "method": "GET",   // 方法名
   "uri": "/{Bucket}/{Key}?&response-cache-control={ResponseCacheControl}"   // 最终生成请求的 uri 的模板，其中花括号部分的内容会被替换
 },
 "input": {                             // 描述输入参数部分。一共有10中类型，structure, list, map, string, base64, binary, integer, float, boolean, timestamp。后面会一一说明。
   "type": "structure",                 // 所有 input 下面第一层都是 structure，表示 members 是一个 hashmap，key 表示参数名称，value 描述参数的属性。 
   "members": {                         // structure, list, map 这三种类型会有 members 属性
     "Bucket": {                        // 参数名称, 对应调用示例中的 Bucket 参数
       "required": true,                // 表示该参数必选, 这个属性仅在 structure 中有效
       "location": "uri"                // 表示该参数的 value 出现在 uri 中，因此，会替换上面 http.uri 的 Bucket 部分
     },
     "IfMatch": {                       // 如果没有定义 type，则默认是 string 类型, 如果没有定义 required，则默认是 required: false
       "location": "header",            // 表示该参数的 value 出现在 open api 请求的 header 中, header 的 value 就是输入参数的值
       "name": "If-Match"               // 这是 header 的名称
     },
     "IfModifiedSince": {
       "type": "timestamp",             // timestamp 类型必须匹配以下类型之一 [Date, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/, 'number'], 'Date object, ISO-8601 string, or a UNIX timestamp')
       "location": "header",
       "name": "If-Modified-Since",
       "default": "1970-01-01"          // structure 下的 member 可以有默认值, list 和 map 下的 memeber 没有
     },
     "Key": {
       "required": true,
       "location": "uri"
     },
     "ResponseCacheControl": {
       "location": "uri"                // 出现在 uri 中，但可以不是必选的
     },
     "Parts": {                         // 实际的 oss.getObject 接口中没有这个方法，这里只是做一个示例
       "type": "list",                  // 代表一个 list(数组) 类型, 注意 list 中的每个元素类型必须是一致的
       "members": {
         "type": "structure",           // 代表数组元素是一个 hashmap
         "members": {
           "PartNumber": {
             "type": "integer"          // 整数类型, 还有一个 float 表示浮点数类型
           },
           "ETag": {}                   // 这个表示一个参数名称为 ETag，type: string, required: false
         }
       },
     },
     "Dependencies": {
       "type": "map",                   // map 类型传入的也是一个 hashmap 对象，但不会对 hashmap 第一级对象做任何检查，仅仅是将规则传递到下一个级别做检查, 这样做的好处是，这个接口要求传入的 Dependencies 对象的子对象名称和数目可以是不确定的。
       "required": false,
       "members": {
         "type": "structure"           // 只要求传入参数 Dependencies 的每一个子对象都是 structure, 对于子对象的数目和名称没有要求
       }
     }
 },
 "output": {                            // 待完善
   "type": "structure",
   "members": {
     "AcceptRanges": {
       "location": "header",
       "name": "accept-ranges"
     },
     "Body": {
       "type": "binary",
       "streaming": true
     },
     "CacheControl": {
       "location": "header",
       "name": "Cache-Control"
     },
     "ContentDisposition": {
       "location": "header",
       "name": "Content-Disposition"
     },
     "ContentEncoding": {
       "location": "header",
       "name": "Content-Encoding"
     },
     "ContentLanguage": {
       "location": "header",
       "name": "Content-Language"
     },
     "ContentLength": {
       "type": "integer",
       "location": "header",
       "name": "Content-Length"
     },
     "ContentType": {
       "location": "header",
       "name": "Content-Type"
     },
     "DeleteMarker": {
       "type": "boolean",
       "location": "header",
       "name": "x-oss-delete-marker"
     },
     "ETag": {
       "location": "header",
       "name": "ETag"
     },
     "Expiration": {
       "location": "header",
       "name": "x-oss-expiration"
     },
     "Expires": {
       "type": "timestamp",
       "location": "header",
       "name": "Expires"
     },
     "LastModified": {
       "type": "timestamp",
       "location": "header",
       "name": "Last-Modified"
     },
     "Metadata": {
       "type": "map",
       "location": "header",
       "name": "x-oss-meta-",
       "members": {},
       "keys": {}
     },
     "MissingMeta": {
       "type": "integer",
       "location": "header",
       "name": "x-oss-missing-meta"
     },
     "Restore": {
       "location": "header",
       "name": "x-oss-restore"
     },
     "ServerSideEncryption": {
       "location": "header",
       "name": "x-oss-server-side-encryption"
     },
     "VersionId": {
       "location": "header",
       "name": "x-oss-version-id"
     },
     "WebsiteRedirectLocation": {
       "location": "header",
       "name": "x-oss-website-redirect-location"
     }
   },
 }
```

```javascript
"createQueue": {
   "name": "CreateQueue",
   "http": {
     "method": "PUT",
     "uri": "/queues/{QueueName}"
   },
   "input": {
     "payload": ["DelaySeconds", "MaximumMessageSize"],    // 在做 http put 请求时，如果需要将某些用户输入放在 http body 中，在 payload 中进行指定。payload 可以是数组，用来指定多个参数，也可以是单一的字符串，用来指定一个参数。
     "wrapper": "Queue", // 如果 payload 是一个数组，并且 open api 的格式为 rest_xml，则需要定义 wrapper，作为 xml 根元素的值。
     "type": "structure",
     "members": {
       "QueueName": {
         "required": true,
         "location": "uri"
       },
       "DelaySeconds": {
         "type": "integer",
         "required": false
       },
       "MaximumMessageSize": {
         "type": "integer",
         "required": false
       }
     }
   },
   "output": {
     "type": "structure",
     "members": {
     }
   }
 }
```
