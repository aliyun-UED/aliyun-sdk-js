var oss = require('./oss');

// -------------------------------
// 5.3.8 Get Bucket Website
// -------------------------------

// todo: not ready

oss.getBucketWebsite({
    Bucket: 'chylvina'
  },
  function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);
  });