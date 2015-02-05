aliyun-sdk test
-----------------------

### 1. require mocha & should

```bash
npm i mocha should --save-dev
```

### 2. how to run?

#### (1) config

fill configurations in config.js

#### (2) run single module, for example: sls

```bash
cd aliyun-sdk-js/test/sls
mocha index
```

#### (3) run all

```bash
cd aliyun-sdk-js
npm test  #or mocha test
```
