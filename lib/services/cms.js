var ALY = require('../core');
var parseURL = require('url').parse;

ALY.CMS = ALY.Service.defineService('cms', ['2015-10-20'], {
    /**
     * @api private
     */
    initialize: function initialize(options) {
        ALY.Service.prototype.initialize.call(this, options);
    },
    setupRequestListeners: function setupRequestListeners(request) {

        //request.addListener('build', this.addContentType);
        request.addListener('extractError', this.extractError);
        request.addListener('extractData', this.extractData);
    },


    //addContentType: function(req){
    //    var httpRequest = req.httpRequest;
    //    var headers = httpRequest.headers;
    //    headers['x-acs-version'] = req.service.config.apiVersion;
    //},

    extractData: function extractData(resp) {

        if(process.env.DEBUG == 'aliyun') {
            console.log("-------response status-------");
            console.log(resp.httpResponse.statusCode);

            console.log("-------response header-------");
            console.log(resp.httpResponse.headers);

            console.log("-------response body-------");
            console.log(resp.httpResponse.body.toString());
            console.log("-------response end-------");
        }


        resp.data = JSON.parse(resp.httpResponse.body.toString().trim() || '{}');

        var result = resp.data;
        //delete result['RequestId'];

        //var reqId = resp.httpResponse.headers['request-id'];

        resp.data = {
            code: resp.httpResponse.statusCode,
            //message: resp.httpResponse.headers.status,
            headers: resp.httpResponse.headers
        };

        resp.data.data = result;
    },



    extractError: function extractError(resp) {
        if(process.env.DEBUG == 'aliyun') {
            console.log("-------response status-------");
            console.log(resp.httpResponse.statusCode);

            console.log("-------response header-------");
            console.log(resp.httpResponse.headers);

            console.log("-------response error-------");
            console.log(resp.httpResponse.body.toString());
            console.log("-------response end-------");
        }

        var headers = resp.httpResponse.headers;

        var error = resp.httpResponse.body.toString();

        try {
            error = JSON.parse(error);
        } catch (e) {
            error = {};
        }


        resp.error = ALY.util.error(new Error(), {
            code: error.Code,
            headers: headers
            //requestId: headers['request-id']
        });
    }
});

module.exports = ALY.CMS;
