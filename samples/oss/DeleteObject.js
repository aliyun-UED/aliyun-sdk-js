var oss = require('./oss');

// -------------------------------
// 5.4.2 Delete Object
// -------------------------------

oss.deleteObject({
    Bucket: 'chylvina',
    Key: '3.html'
  },
  function (err, data) {

    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);

  });