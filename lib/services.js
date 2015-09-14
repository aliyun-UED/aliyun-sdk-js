var path = require('path');
var fs = require('fs');
var ALY = require('./core');

//require('./services/oss');
//require('./services/sls');
//require('./services/opensearch');
//require('./services/batchcompute');

//ALY.ECS = ALY.Service.defineService('ecs', ['2014-05-26']);
//ALY.RDS = ALY.Service.defineService('rds', ['2014-08-15']);
//ALY.SLB = ALY.Service.defineService('slb', ['2014-05-15']);
//ALY.CDN = ALY.Service.defineService('cdn', ['2014-11-11']);
//ALY.STS = ALY.Service.defineService('sts', ['2015-04-01']);

var apis = require('./api_loader');

// define services using map
apis.services.forEach(function(identifier) {
  var name = apis.serviceName(identifier);
  var versions = apis.serviceVersions(identifier);
  ALY[name] = ALY.Service.defineService(identifier, versions);

  // load any customizations from lib/services/<svcidentifier>.js
  var svcFile = path.join(__dirname, 'services', identifier + '.js');
  if (fs.existsSync(svcFile)) require('./services/' + identifier);
});
