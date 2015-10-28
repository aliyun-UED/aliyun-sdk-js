var oss = require('./oss');

// -------------------------------
// 5.3.9 Put Bucket
// -------------------------------

oss.createBucket({
  Bucket: 'chylvina1'
}, function (err, data) {
  if (err) {
    console.log('error:', err);
    return;
  }

  console.log('success:', data);
});