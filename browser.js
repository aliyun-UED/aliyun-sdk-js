window.ALY = module.exports = require('./lib/core');
require('./lib/http/xhr');

require('./lib/services/oss');
require('./lib/services/opensearch');
require('./lib/services/batchcompute');

ALY.ECS = ALY.Service.defineService('ecs', ['2014-05-26']);
ALY.RDS = ALY.Service.defineService('rds', ['2014-08-15']);
ALY.SLB = ALY.Service.defineService('slb', ['2014-05-15']);
ALY.CDN = ALY.Service.defineService('cdn', ['2014-11-11']);
ALY.STS = ALY.Service.defineService('sts', ['2015-04-01']);
