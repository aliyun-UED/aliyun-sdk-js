var conf = {
    accessKeyId: '',
    secretAccessKey: '',
    endpoint: 'http://cn-hangzhou.sls.aliyuncs.com',
    projectName: '',
    logStoreName: ''
};

try{
    module.exports = require('../configuration/sls_config');
}catch(e){
    //if '../configuration/config' does not exists
    module.exports = conf;
}