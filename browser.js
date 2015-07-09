window.ALY = module.exports = require('./lib/core');
require('./lib/http/xhr');

// services
require('./apis/cdn-2014-11-11');
require('./apis/ecs-2014-05-26');
require('./apis/opensearch-2015-01-01');
require('./apis/oss-2013-10-15');
require('./apis/rds-2014-08-15');
require('./apis/slb-2014-05-15');
require('./apis/sts-2015-04-01');

require('./lib/services/oss');
require('./lib/services/opensearch');

ALY.ECS = ALY.Service.defineService('ecs', ['2014-05-26']);
ALY.RDS = ALY.Service.defineService('rds', ['2014-08-15']);
ALY.SLB = ALY.Service.defineService('slb', ['2014-05-15']);
ALY.CDN = ALY.Service.defineService('cdn', ['2014-11-11']);
ALY.STS = ALY.Service.defineService('sts', ['2015-04-01']);
