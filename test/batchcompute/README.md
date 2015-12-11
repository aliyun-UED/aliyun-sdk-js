batchcompute test
-----------------------


### 1. 如何使用

#### (1) 配置 testConfig.js

```
cp testConfig.json testConfig.js
vim testConfig.js   #这里配置你的AK,  运行时会先找 testConfig.js , 如果不存在，再找 testConfig.json
```

#### (2) 运行

```bash
mocha 2015-11-11  # 使用mocha命令,请先安装到全局: npm i -g mocha

#DEBUG=aliyun  mocha 2015-11-11  #使用 DEBUG=aliyun, 可以得到更加详细的信息
```
