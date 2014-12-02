var oss = require('./oss');

// -------------------------------
// 5.3.4 Get Bucket (List Object)
// -------------------------------

oss.listObjects({
    Bucket: 'chylvina',
    MaxKeys: '10',
    Prefix: '',
    Marker: '',
    Delimiter: ''
  },
  function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);
  });