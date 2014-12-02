var oss = require('./oss');

// -------------------------------
// 5.3.6 Get Bucket Location
// -------------------------------

oss.getBucketLocation({
    Bucket: 'chylvina'
  },
  function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);
  });