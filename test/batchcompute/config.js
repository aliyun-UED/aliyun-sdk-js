var conf = {
    accessKeyId: '',
    secretAccessKey: '',
    endpoint: 'http://batchcompute.cn-qingdao.aliyuncs.com'
};


try{
    module.exports = require('../configuration/batchcompute_config');
}catch(e){
    module.exports = conf;
}