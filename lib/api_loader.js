var fs = require('fs');
var path = require('path');

var apiRoot = path.join(__dirname, '..', 'apis');
var serviceMap = {};
var serviceIdentifiers = [];
var serviceNames = [];

function buildServiceMap() {
  var prefixMap = {};
  Object.keys(serviceMap).forEach(function(identifier) {
    serviceMap[identifier].prefix = serviceMap[identifier].prefix || identifier;
    prefixMap[serviceMap[identifier].prefix] = identifier;
  });

  fs.readdirSync(apiRoot).forEach(function (file) {
    var match = file.match(/^(.+?)-(\d+-\d+-\d+)\.json$/);
    if (match) {
      var id = match[1], version = match[2];
      if (!serviceMap[id]) {
        serviceMap[id] = {};
      }

      //console.log("loading", file);
      serviceMap[id].name = require(apiRoot + "/" + file).serviceAbbreviation;

      serviceMap[id].versions = serviceMap[id].versions || [];
      if (serviceMap[id].versions.indexOf(version) < 0) {
        serviceMap[id].versions.push(version);
      }
    }
  });

  Object.keys(serviceMap).forEach(function(identifier) {
    serviceMap[identifier].versions = serviceMap[identifier].versions.sort();
    serviceIdentifiers.push(identifier);
    serviceNames.push(serviceMap[identifier].name);
  });
}

function getServices() {
  buildServiceMap();
  return serviceIdentifiers;
}

function getServiceNames() {
  buildServiceMap();
  return serviceNames;
}

function serviceVersions(svc) {
  buildServiceMap();
  svc = serviceIdentifier(svc);
  return serviceMap[svc] ? serviceMap[svc].versions : null;
}

function serviceName(svc) {
  buildServiceMap();
  svc = serviceIdentifier(svc);
  return serviceMap[svc] ? serviceMap[svc].name : null;
}

function serviceFile(svc, version) {
  buildServiceMap();
  svc = serviceIdentifier(svc);
  if (!serviceMap[svc]) return null;

  var prefix = serviceMap[svc].prefix || svc;
  var filePath;
  ['min', 'api', 'normal'].some(function(testSuffix) {
    filePath = apiRoot + '/' + prefix.toLowerCase() + '-' + version + '.' +
        testSuffix + '.json';

    return fs.existsSync(filePath);
  });
  return filePath;
}

function serviceIdentifier(svc) {
  return svc.toLowerCase();
}

module.exports = {
  serviceVersions: serviceVersions,
  serviceName: serviceName,
  serviceIdentifier: serviceIdentifier,
  serviceFile: serviceFile
};

Object.defineProperty(module.exports, 'services', {
  enumerable: true, get: getServices
});

Object.defineProperty(module.exports, 'serviceNames', {
  enumerable: true, get: getServiceNames
});
