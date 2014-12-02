var oss = require('./oss');

// -------------------------------
// 5.4.6 Put Object
// -------------------------------

var fs = require('fs');

fs.readFile('test.json', function (err, data) {
  if (err) {
    console.log('error:', err);
    return;
  }

  oss.putObject({
      Bucket: 'chylvina',
      Key: 'test.json',
      Body: data,
      AccessControlAllowOrigin: '',
      ContentType: 'text/plain',
      CacheControl: 'no-cache',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
      ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
      ContentEncoding: 'utf-8',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
      ServerSideEncryption: 'AES256',
      Expires: 60
    },
    function (err, data) {

      if (err) {
        console.log('error:', err);
        return;
      }

      console.log('success:', data);

    });
});