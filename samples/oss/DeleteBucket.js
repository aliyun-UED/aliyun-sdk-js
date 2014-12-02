var oss = require('./oss');

// -------------------------------
// 5.3.1 Delete Bucket
// -------------------------------

oss.deleteBucket({
    Bucket: 'chylvina2'
  },
  function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);
  });