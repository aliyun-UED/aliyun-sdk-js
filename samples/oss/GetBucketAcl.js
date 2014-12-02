var oss = require('./oss');

// -------------------------------
// 5.3.5 Get Bucket Acl
// -------------------------------

oss.getBucketAcl({
    Bucket: 'chylvina'
  },
  function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);
  });