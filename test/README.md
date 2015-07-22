aliyun-sdk test
-----------------------

### 1. require mocha & should

```bash
npm i mocha should --save-dev
```

### 2. how does it works?

#### (1) config

fill configurations in config.js

#### (2) run single module, for example: sls

```bash
cd aliyun-sdk-js/test/sls
mocha index  #you need to install mocha in global first: npm i -g mocha
```

#### (3) run all

```bash
cd aliyun-sdk-js
npm test
```
