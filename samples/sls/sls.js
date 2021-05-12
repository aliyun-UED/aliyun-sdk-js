var ALY = require('../../index.js');

var sls = new ALY.SLS({
	"accessKeyId": "",
	"secretAccessKey": "=",
    "securityToken" :"tokens",

	// 根据你的 sls project所在地区选择填入,更多地域请参考https://help.aliyun.com/document_detail/29008.html?spm=a2c4g.11186623.6.1369.40e448242wou9i
	// 北京：http://cn-beijing.log.aliyuncs.com
	// 杭州：http://cn-hangzhou.log.aliyuncs.com
	// 青岛：http://cn-qingdao.log.aliyuncs.com
	// 深圳：http://cn-shenzhen.log.aliyuncs.com

	// 注意：如果你是在 ECS 上连接 SLS，可以使用内网地址，速度快，没有带宽限制。
	// 杭州：cn-hangzhou-intranet.log.aliyuncs.com
	// 北京：cn-beijing-intranet.log.aliyuncs.com
	// 青岛：cn-qingdao-intranet.log.aliyuncs.com
	// 深圳：cn-shenzhen-intranet.log.aliyuncs.com
	endpoint: 'http://cn-hangzhou.log.aliyuncs.com',

	// 这是 sls sdk 目前支持最新的 api 版本, 不需要修改
	apiVersion: '2015-06-01'

	//以下是可选配置
	//,httpOptions: {
	//    timeout: 1000  //1sec, 默认没有timeout
	//}
});

module.exports = sls;
