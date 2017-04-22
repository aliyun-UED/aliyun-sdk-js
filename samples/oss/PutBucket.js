var oss = require('./oss');

// -------------------------------
// 5.3.9 Put Bucket
// -------------------------------

oss.createBucket({
  Bucket: 'chylvina1',
  
  // CreateBucketConfiguration: {
  // 	StorageClass: 'Archive' //归档bucket
  // }
}, function (err, data) {
  if (err) {
    console.log('error:', err);
    return;
  }

  console.log('success:', data);
});