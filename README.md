# 阿里云 SDK for NodeJS

## 技术支持
请加旺旺群：1489391962

## 1.1.0 之前版本升级请注意

1.1.0 之前实例化一个服务代码如下：

```javascript
ALY.config.update({
  accessKeyId: "在阿里云OSS申请的 accessKeyId",
  secretAccessKey: "在阿里云OSS申请的 secretAccessKey"
});

var oss = new ALY.OSS({
  endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
  apiVersion: '2013-10-15'
});
```
1.1.0 之后实例化一个服务代码如下：

```javascript
var oss = new ALY.OSS({
  accessKeyId: "在阿里云OSS申请的 accessKeyId",
  secretAccessKey: "在阿里云OSS申请的 secretAccessKey",
  endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
  apiVersion: '2013-10-15'
});
```

即不需要配置 ALY.config


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
 - 将 sample/sls/sls.js 中需要的参数修改
 - 打开需要执行的某个实例文件，如 ListLogStores.js，将其中的参数改成你自己的 sls 实例参数
 - 执行示例文件即可, 如:

 ```javascript
 cd samples/sls
 node ListLogStores.js
 ```

### ECS, RDS, SLB, CDN
在 samples 对应目录下的有代码示例，使用方法：
 - 将 sample/ecs/test.js 中需要的参数修改
 - 执行示例文件即可, 如:

 ```javascript
 cd samples/ecs
 node test.js
 ```

### MEMCACHED
在 samples/memcached 目录下的代码示例，使用方法：
 - 修改 sample/memcached/memcached.js，填入代码中所需参数
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
| Aliyun SLS      | ALY.SLS | 2014-11-18 | [SLS API手册](http://docs.aliyun.com/?spm=5176.383723.9.6.MBliNk#/sls/api/overview) |
| Aliyun OCS memcached      | ALY.MEMCACHED        | | [BinaryProtocolRevamped](https://code.google.com/p/memcached/wiki/BinaryProtocolRevamped) |

#### 我们在代码中参考了 AWS SDK，在此声明。

## License

This SDK is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
