var oss = require('./oss');

// -------------------------------
// 5.4.3 Delete Multiple Objects
// -------------------------------

oss.deleteObjects({
    Bucket: 'chylvina',
    Delete: {
      Objects: [
        {
          Key: 'test.json'
        },
        {
          Key: '1-copy.txt'
        }
      ],
      Quiet: true
    }
  },
  function (err, data) {

    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);

  });