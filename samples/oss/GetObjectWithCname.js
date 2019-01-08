var oss = require('./oss');

// -------------------------------
// Get Object with cname ,如果bucket已经开通cname同域名已经绑定，用户想要通过SDK用自定义域名进行访问的时候必须在实例化oss client的时候传入
// isRequestPayer：true选项 如下：，需要在oss.js中添加cname配置选项,endpoint的值就是绑定的域名

/**var oss = new ALY.OSS({
  ....
  endpoint: 'http://yourdoamin.com',
  cname: true
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