var oss = require('./oss');

// -------------------------------
// 5.3.3 Delete Bucket Website
// -------------------------------

// todo: not ready

oss.deleteBucketWebsite({
    Bucket: 'chylvina'
  },
  function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);
  });