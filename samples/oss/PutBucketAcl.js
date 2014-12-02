var oss = require('./oss');

// -------------------------------
// 5.3.10 Put Bucket Acl
// -------------------------------

oss.putBucketAcl({
  Bucket: 'chylvina',
  ACL: 'public-read-write'    // public-read-write || public-read || private
}, function (err, data) {
  if (err) {
    console.log('error:', err);
    return;
  }

  console.log('success:', data);
});