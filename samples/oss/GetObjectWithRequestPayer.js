var oss = require('./oss');

// -------------------------------
/*Get Object with requestPayer ,如果bucket已经开通reqeustPayer功能，其他用户想要通过SDK进行访问的时候必须在实例化oss client的时候传入
isRequestPayer：true选项 如下：
var oss = new ALY.OSS({
  ....
  isRequestPayer: true
});**/

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