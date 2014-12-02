var oss = require('./oss');

// -------------------------------
// 5.3.7 Get Bucket Logging
// -------------------------------

// todo: not ready

oss.getBucketLogging({
    Bucket: 'chylvina'
  },
  function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);
  });