var ALY = require('../core');
var inherit = ALY.util.inherit;

ALY.Signers.TOP = inherit(ALY.Signers.RequestSigner, {

  addAuthorization: function addAuthorization(credentials, date) {
    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());

    this.request.path += ('&Signature=' + encodeURIComponent(signature));
  },

  stringToSign: function stringToSign() {
    var r = this.request;

    var s = 'GET&%2F&' + ALY.util.topEscape(r.path);

    return s;
  },

  sign: function sign(secret, string) {
    if(process.env.DEBUG) {
      console.log('----------- sign string start -----------');
      console.log(string);
      console.log('----------- sign string end -----------');
    }

    //var s = 'GET&%2F&AccessKeyId%3Dtestid%26Action%3DDescribeRegions%26Format%3DXML%26RegionId%3Dregion1%26SignatureMethod%3DHMAC-SHA1%26SignatureNonce%3DNwDAxvLU6tFE0DVb%26SignatureVersion%3D1.0%26TimeStamp%3D2012-12-26T10%253A33%253A56Z%26Version%3D2014-05-26';
    //var s = 'GET&%2F&AccessKeyID%3Dtestid%26Action%3DDescribeLoadBalancerAttribute%26Format%3Dxml%26SignatureMethod%3DHmacSHA1%26SignatureNonce%3DNwDAxvLU6tFE0DVb%26SignatureVersion%3D1.0%26Timestamp%3D2014-05-19T10%253A33%253A56Z%26Version%3D2014-05-15%26loadBalancerId%3D139a00604ad-cn-east-hangzhou-01';

    console.log('*****************');
    console.log(ALY.util.crypto.hmac(secret + '&', string, 'base64', 'sha1'));
    console.log('*****************');

    return ALY.util.crypto.hmac(secret + '&', string, 'base64', 'sha1');
  }
});

module.exports = ALY.Signers.TOP;
