var oss = require('./oss');

// -------------------------------
// 5.3.9 Put Bucket
// -------------------------------

oss.createBucket({
  Bucket: 'chylvina1',
  CreateBucketConfiguration: {
    LocationConstraint: 'oss-cn-hangzhou-a'   // oss-cn-hangzhou-a 或者 oss-cn-qingdao-a
  }
}, function (err, data) {
  if (err) {
    console.log('error:', err);
    return;
  }

  console.log('success:', data);
});