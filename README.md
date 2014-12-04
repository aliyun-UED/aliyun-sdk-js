# 阿里云 SDK for NodeJS

阿里云 SDK for NodeJS，基于 AWS SDK 开发

## 技术支持
请加旺旺群：1489391962

## 安装

### Node.js 安装

```sh
npm install aliyun-sdk
```

## 使用方法及代码示例

### OSS
在 samples/oss 目录下的代码示例，使用方法：
 - 将 sample/oss.js 中需要的参数修改
 - 打开需要执行的某个实例文件，如 GetBucket.js，将其中的参数改成你自己的 oss 实例参数
 - 执行示例文件即可, 如:
 ```javascript
 cd samples/oss
 node GetBucket.js
 ```

### MEMCACHED
在 samples/memcached 目录下的代码示例，使用方法：
 - 修改 sample/memcached/memcached.js，填入代码中所需参数
 - 执行示例文件即可

更多帮助参考 https://github.com/chylvina/node_memcached

## 目前支持的服务

SDK 目前支持下列服务:

<table>
  <thead>
    <th>服务名</th>
    <th>类名</th>
    <th>API 版本</th>
  </thead>
  <tbody>
    <tr><td>Aliyun OSS</td><td>ALY.OSS</td><td>2013-10-15</td></tr>
    <tr><td>MEMCACHED</td><td>ALY.MEMCACHED</td><td>[BinaryProtocolRevamped](https://code.google.com/p/memcached/wiki/BinaryProtocolRevamped)</td></tr>
  </tbody>
</table>

## License

This SDK is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).