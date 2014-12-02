var oss = require('./oss');

// -------------------------------
// 5.4.4 Get Object
// -------------------------------

oss.getObject({
    Bucket: 'chylvina',
    Key: '9.html'
    //Range: '',
    //IfModifiedSince: '',
    //IfUnmodifiedSince: '',
    //IfMatch: '',
    //IfNoneMatch: '',
    //ResponseContentType: '',
    //ResponseContentLanguage: '',
    //ResponseExpires: '60',
    //ResponseCacheControl: '',
    //ResponseContentDisposition: '',
    //ResponseContentEncoding: ''
  },
  function (err, data) {

    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);

  });