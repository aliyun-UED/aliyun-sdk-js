## 在浏览器端使用

现在 aliyun sdk 支持在浏览器端调用, 只需要引入 dist/aliyun-sdk.js 即可, 使用参考 sample/browser/browser.html

目前支持在浏览器端调用除了 sls, ocs 以外的所有服务, 不过目前只有 oss 支持 sts 和 cors , 非 oss 服务只能使用根 accessKey 和 accessSecret 进行初始化, 存在泄露风险.

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

