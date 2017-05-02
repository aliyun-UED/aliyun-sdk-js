## 原来 阿里云 js sdk 还能这么用

OSS Browser - 提供类似windows资源管理器功能 https://github.com/aliyun/oss-browser

Open5 - 基于阿里云 Open API 的开源 H5 生成工具　https://github.com/aliyun-UED/open5

## 安装

### Node.js 安装

```sh
npm install aliyun-sdk
```

### 浏览器端安装

https://github.com/aliyun-UED/aliyun-sdk-js/blob/master/browser.md

## 使用方法及代码示例

### OSS
在 samples/oss 目录下的代码示例，使用方法：
 - 将 sample/oss/oss.js 中需要的参数修改
 - 打开需要执行的某个实例文件，如 GetBucket.js，将其中的参数改成你自己的 oss 实例参数
 - 执行示例文件即可, 如:

 ```javascript
 cd samples/oss
 node GetBucket.js
 ```

***oss 支持 stream 请使用 https://github.com/berwin/aliyun-oss-upload-stream***

## 目前支持的服务

SDK 目前支持下列服务:

| 服务名  | 类名  | API 版本 | API 文档
| :------------ |:---------------:| -----:| -----:|
| Aliyun ECS      | ALY.ECS | 2014-05-26 | [ECS API手册](http://aliyunecs.oss.aliyuncs.com/ECS-API-Reference%202014-05-26.pdf) |
| Aliyun RDS      | ALY.RDS | 2014-08-15 | [RDS API手册](http://imgs-storage.cdn.aliyuncs.com/help/rds/RDS-API-Reference.pdf) |
| Aliyun SLB      | ALY.SLB | 2014-05-15 | [SLB API手册](http://imgs-storage.cdn.aliyuncs.com/help/slb/SLB-API-Reference_2014-05-15.pdf) |
| Aliyun ESS      | ALY.SLB | 2014-08-28 | [ESS API手册](https://help.aliyun.com/product/25855.html) |
| Aliyun OSS      | ALY.OSS | 2013-10-15 | [OSS API手册](http://imgs-storage.cdn.aliyuncs.com/help/oss/oss%20api%2020140828.pdf) |
| Aliyun OTS      | ALY.OTS | 2014-08-08 | [OTS API手册](https://help.aliyun.com/document_detail/ots/APIReference) |
| Aliyun CDN      | ALY.CDN | 2014-11-11 | [CDN API手册](http://imgs-storage.cdn.aliyuncs.com/help/cdn/cdn%20open%20api%20v1.6.pdf) |
| Aliyun CMS      | ALY.CMS | 2015-10-20 | [CMS API手册](https://help.aliyun.com/document_detail/cms/API_References/New_Metric_OpenAPI_Reference.html?spm=5176.product8314972_cms.6.89.O1ENDP) |
| Aliyun SLS      | ALY.SLS | 2014-11-18 | [SLS API手册](http://docs.aliyun.com/#/sls/api/overview) |
| Aliyun RAM      | ALY.RAM | 2015-05-15 | [RAM API手册](https://docs.aliyun.com/#/pub/ram) |
| Aliyun STS      | ALY.STS | 2015-04-01 | [STS API手册](http://docs.aliyun.com/#/pub/ram/sts-user-guide/intro) |
| Aliyun MTS      | ALY.MTS | 2014-06-18 | [MTS API手册](https://help.aliyun.com/document_detail/29212.html) |
| Aliyun PUSH      | ALY.PUSH | 2015-08-27 | [PUSH API手册](https://help.aliyun.com/document_detail/mobilepush/api-reference/openapi.html) |
| Alidayu      | ALY.DAYU | 2015-12-16 | [阿里大于 API手册](https://api.alidayu.com/doc2/apiList.htm) |
| Alyun GREEN      | ALY.GREEN | 2016-11-24 | [阿里绿网 API手册](https://help.aliyun.com/document_detail/28427.html) |
| Aliyun OpenSearch      | ALY.OpenSearch | 2015-01-01 | [OpenSearch API手册](http://docs.aliyun.com/#/opensearch/api-reference/terminology) |
| Aliyun BatchCompute      | ALY.BatchCompute | 2015-06-30 | [BatchCompute API手册](http://docs.aliyun.com/#/pub/batchcompute) |
| Aliyun OCS memcached      | ALY.MEMCACHED        | | [BinaryProtocolRevamped](https://code.google.com/p/memcached/wiki/BinaryProtocolRevamped) |
| Aliyun JAQ      | ALY.JAQ        | | [数控风险](https://help.aliyun.com/product/28308.html) |

#### 我们在代码中参考了 AWS SDK，在此声明。

## License

This SDK is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
