var oss = require('./oss');

// -------------------------------
// 5.4.1 Copy Object
// -------------------------------

oss.copyObject({
    Bucket: 'chylvina',
    CopySource: '/chylvina/1.txt',
    Key: '1-copy.txt',
    //CopySourceIfMatch: '',
    //CopySourceIfNoneMatch: '',
    //CopySourceIfModifiedSince: '',
    //CopySourceIfUnmodifiedSince: '',
    //CopySourceIfModifiedSince: '',
    MetadataDirective: 'REPLACE',     // 'REPLACE' 表示覆盖 meta 信息，'COPY' 表示不覆盖，只拷贝
    //AccessControlAllowOrigin: '',
    ContentType: 'text/plain',
    CacheControl: 'no-cache',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
    ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
    ContentEncoding: 'utf-8',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
    ServerSideEncryption: 'AES256',
    Expires: ''                       // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
  },
  function (err, data) {

    if (err) {
      console.log('error:', err);
      return;
    }

    console.log('success:', data);

  });