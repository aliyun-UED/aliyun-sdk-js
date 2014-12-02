var ALY = require('../../index.js');

ALY.config.loadFromPath(__dirname + '/config.json');

var oss = new ALY.OSS({
  endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
  apiVersion: '2013-10-15'
});

module.exports = oss;
