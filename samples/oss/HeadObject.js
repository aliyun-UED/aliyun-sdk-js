var oss = require('./oss');

// -------------------------------
// 5.4.5 Head Object
// -------------------------------

oss.headObject({
    Bucket: 'chylvina',
    Key: '9.html'
    //IfModifiedSince: '',
    //IfUnmodifiedSince: '',
    //IfMatch: '',
    //IfNoneMatch: ''
  },
  function (err, data) {

    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);

  });