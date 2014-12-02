var oss = require('./oss');

// -------------------------------
// 4.3
// -------------------------------

var url = oss.getSignedUrl('getObject', {
  Bucket: 'chylvina',
  Key: '9.html',
  Expires: 60
});
console.log(url);