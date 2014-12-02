var oss = require('./oss');

// -------------------------------
// 5.3.10 Put Bucket Acl
// -------------------------------

// todo: not ready, 文档没有给出正确的请求示例

oss.putBucketWebsite({
  Bucket: 'chylvina',
  BucketLoggingStatus: {
    WebsiteConfiguration: {
      Bucket: 'chylvina',
      WebsiteConfiguration: {
        ErrorDocument: {
          Key: ''
        }
      }
    }
  }
}, function (err, data) {
  if (err) {
    console.log('error:', err);
    return;
  }

  console.log('success:', data);
});