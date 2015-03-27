var ALY = require('./index.js');

var opensearch = new ALY.OpenSearch({
    accessKeyId: '7yOP1OXtt6QeGfVn',
    secretAccessKey: 'Q7k6qLtmcEfyOmwFtXVfxtzg2Vd1kA',
    endpoint: 'https://cdn.aliyuncs.com',
    apiVersion: '2014-11-11'
  }
);

opensearch.listApp({
}, function(err, res) {
  console.log(err, res);
});
