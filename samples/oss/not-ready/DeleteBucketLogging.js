var oss = require('./oss');

// -------------------------------
// 5.3.2 Delete Bucket Logging
// -------------------------------

// todo: not ready

oss.deleteBucketLogging({
    Bucket: 'chylvina'
  },
  function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);
  });