var ALY = require('./index.js');

var opensearch = new ALY.OpenSearch({
    accessKeyId: 'CgJ9zTi6HmvcZdqt',
    secretAccessKey: 'WVCyvLQ92cnkz5WwYmdgKmrdDYRs58',
    endpoint: 'http://opensearch.aliyuncs.com',
    apiVersion: '2015-01-01'
  }
);

opensearch.listApp({
}, function(err, res) {
  console.log(err, res);
});
