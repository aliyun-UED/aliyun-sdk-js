# 阿里云 SDK for JavaScript

## 技术支持
请加旺旺群：1489391962

## 在浏览器端使用

现在 aliyun sdk 支持在浏览器端调用, 只需要引入 dist/aliyun-sdk.js 即可, 使用参考 sample/browser/browser.html

目前支持在浏览器端调用除了 sls 以外的所有服务, 不过目前只有 oss 支持 sts , 非 oss 服务只能使用 accessKey 和 accessSecret 进行初始化, 存在泄露风险.

使用 aliyun sdk js 将文件上传到 oss, 请点击 [oss-js-upload](https://github.com/aliyun-UED/oss-js-upload)

### 如何 build

考虑到文件大小, 目前 dist/aliyun-sdk.js 中仅包含 oss 服务, 如果需要 build 其他服务, 请按照以下步骤操作:

- git clone git@github.com:aliyun-UED/aliyun-sdk-js.git
- cd aliyun-sdk-js
- npm install
- bower install
- npm install -g browserify
- 构建仅包含 oss 的 aliyun-sdk.js

```sh
browserify -r oss-2013-10-15.json browser.js > dist/aliyun-sdk.js
```

- 如果需要编译多个服务, 如 oss, batchCompute

```sh
browserify -r oss-2013-10-15.json -r batchcompute-2015-06-30.json browser.js > dist/aliyun-sdk.js
```

目前在浏览器端运行的 sdk 还在测试阶段, 如果有问题请随时提出.

## 初始化

```javascript
var oss = new ALY.OSS({
  accessKeyId: "在阿里云OSS申请的 accessKeyId",
  secretAccessKey: "在阿里云OSS申请的 secretAccessKey",
  securityToken: "",
  endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
  apiVersion: '2013-10-15'
});
```

可以使用 STS token 初始化 OSS, 后续 sts 会支持其他服务

```javascript
var oss = new ALY.OSS({
  accessKeyId: "sts token 中的 accessKeyId",
  secretAccessKey: "sts token 中的 secretAccessKey",
  securityToken: "sts token 中的 securityToken",
  endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
  apiVersion: '2013-10-15'
});
```

## 安装

### Node.js 安装

```sh
npm install aliyun-sdk
```

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

### SLS
在 samples/sls 目录下的代码示例，使用方法：
 - 将 samples/sls/sls.js 中需要的参数修改
 - 打开需要执行的某个实例文件，如 ListLogStores.js，将其中的参数改成你自己的 sls 实例参数
 - 执行示例文件即可, 如:

 ```javascript
 cd samples/sls
 node ListLogStores.js
 ```

### ECS, RDS, SLB, CDN
在 samples 对应目录下的有代码示例，使用方法：
 - 将 samples/ecs/test.js 中需要的参数修改
 - 执行示例文件即可, 如:

 ```javascript
 cd samples/ecs
 node test.js
 ```

### OpenSearch
在 samples/opensearch 目录下的代码示例，使用方法：
 - 修改 samples/opensearch/opensearch.js，填入代码中所需参数
 - 执行示例文件即可

### MEMCACHED
在 samples/memcached 目录下的代码示例，使用方法：
 - 修改 samples/memcached/memcached.js，填入代码中所需参数
 - 执行示例文件即可

更多帮助参考 https://github.com/chylvina/node_memcached

## 目前支持的服务

SDK 目前支持下列服务:

| 服务名  | 类名  | API 版本 | API 文档
| :------------ |:---------------:| -----:| -----:|
| Aliyun ECS      | ALY.ECS | 2014-05-26 | [ECS API手册](http://aliyunecs.oss.aliyuncs.com/ECS-API-Reference%202014-05-26.pdf) |
| Aliyun RDS      | ALY.RDS | 2014-08-15 | [RDS API手册](http://imgs-storage.cdn.aliyuncs.com/help/rds/RDS-API-Reference.pdf) |
| Aliyun SLB      | ALY.SLB | 2014-05-15 | [SLB API手册](http://imgs-storage.cdn.aliyuncs.com/help/slb/SLB-API-Reference_2014-05-15.pdf) |
| Aliyun OSS      | ALY.OSS | 2013-10-15 | [OSS API手册](http://imgs-storage.cdn.aliyuncs.com/help/oss/oss%20api%2020140828.pdf) |
| Aliyun CDN      | ALY.CDN | 2014-11-11 | [CDN API手册](http://imgs-storage.cdn.aliyuncs.com/help/cdn/cdn%20open%20api%20v1.6.pdf) |
| Aliyun SLS      | ALY.SLS | 2014-11-18 | [SLS API手册](http://docs.aliyun.com/#/sls/api/overview) |
| Aliyun STS      | ALY.STS | 2015-04-01 | [STS API手册](http://docs.aliyun.com/#/pub/ram/sts-user-guide/intro) |
| Aliyun OpenSearch      | ALY.OpenSearch | 2015-01-01 | [OpenSearch API手册](http://docs.aliyun.com/#/opensearch/api-reference/terminology) |
| Aliyun BatchCompute      | ALY.BatchCompute | 2015-06-30 | [BatchCompute API手册](http://docs.aliyun.com/#/pub/batchcompute) |
| Aliyun OCS memcached      | ALY.MEMCACHED        | | [BinaryProtocolRevamped](https://code.google.com/p/memcached/wiki/BinaryProtocolRevamped) |

#### 我们在代码中参考了 AWS SDK，在此声明。

## License

This SDK is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
