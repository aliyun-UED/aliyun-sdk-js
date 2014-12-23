var ALY = require('./core');

require('./services/oss');
require('./services/sls');

ALY.ECS = ALY.Service.defineService('ecs', ['2014-05-26']);