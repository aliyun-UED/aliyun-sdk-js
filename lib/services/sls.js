var ALY = require('../core');
var parseURL = require('url').parse;
var po_protobuf = require('pomelo-protobuf');
var zlib = require('zlib');

var proto_json = {
    "LogGroup":
    {
        "message Log":
        {
            "required uInt32 time": 1,
            "message Content":
            {
                "required string key": 1,
                "required string value": 2
            },
            "repeated Content contents": 2
        },
        "repeated Log logs": 1,
        "optional string reserved": 2,
        "optional string topic": 3,
        "optional string source": 4
    }
};

var protos = po_protobuf.parse(proto_json);



ALY.SLS = ALY.Service.defineService('sls', ['2014-11-18'], {
    /**
     * @api private
     */
    initialize: function initialize(options) {
        ALY.Service.prototype.initialize.call(this, options);
    },

    setupRequestListeners: function setupRequestListeners(request) {

        request.addListener('build', this.addContentType);
        request.addAsyncListener('build', this.buildContent);
        request.addListener('build', this.populateURI);

        request.addListener('build', this.computeContentMd5);
        request.addListener('build', this.computeSha256);

        request.removeListener('validate',
            ALY.EventListeners.Core.VALIDATE_REGION);

        request.addListener('extractError', this.extractError);
        request.addListener('extractData', this.extractData);

        //request.addListener('afterBuild', function (req) {
        //    //Host in request.header
        //    console.log(req.httpRequest.headers['projectName'], req.params['projectName']);
        //
        //    req.httpRequest.headers['Host'] = req.params['projectName']
        //       +'.'+req.httpRequest.endpoint.hostname;
        //    //头中的 projectName 不需要
        //    delete req.httpRequest.headers['projectName'];
        //});

    },

    populateURI: function populateURI(req) {
        var hostname = req.httpRequest.endpoint.hostname;

        var projectName = req.params['projectName'];
        var host = projectName+'.'+ hostname;


        if(!/^[0-9.]+$/.test(hostname)){
            //不是ip,  是域名, 则需要拼接project名
            var protocol = req.httpRequest.endpoint.protocol;
            var port = req.httpRequest.endpoint.port;

            //real endpoint
            var endpointObj = parseURL(protocol+'//'+host+':'+port);

            ALY.util.update(req.httpRequest, {endpoint: endpointObj });
           // ALY.util.update(req.service, {endpoint: endpointObj });
        }

        //final host， 不管是ip还是域名，都要拼接project名
        req.httpRequest.headers['Host'] = host;

        //头中的 projectName 不需要
        delete req.httpRequest.headers['projectName'];
    },

    addContentType: function addContentType(req) {
        var httpRequest = req.httpRequest;
        var headers = httpRequest.headers;

        headers['x-sls-signaturemethod'] = 'hmac-sha1';
        headers['x-sls-apiversion'] = '0.4.0';
        headers['x-sls-bodyrawsize'] = 0;
    },

    buildContent: function addContentType(req, done) {
        var httpRequest = req.httpRequest;
        var headers = httpRequest.headers;

        if(req.operation === 'putLogs'){

            headers['Content-Type'] = 'application/x-protobuf';
            headers['x-sls-compresstype'] = 'deflate';

            var protoBufferEncode = function(name, json) {
                po_protobuf.init({
                    encoderProtos: protos,
                    decoderProtos: protos
                });
                return po_protobuf.encode(name, json);
            };

            var deflate = function(pb, fn){
                zlib.deflate(pb, function(err, buf) {
                    fn(err, buf);
                });
            };


            var logGroup = JSON.parse(req.httpRequest.body);


            if(!logGroup.logs){
                throw ALY.util.error(new Error(), {
                    code: 'ContentError', message: 'Logitems is empty.', retryable: false
                });
            }
            if(logGroup.logs.length>4096){
                throw ALY.util.error(new Error(), {
                    code: 'ContentError', message: 'Logitems length exceed 4096.', retryable: false
                });
            }


            var pb = protoBufferEncode('LogGroup', logGroup);

            if(pb.length>3*1024*1024){
                throw ALY.util.error(new Error(), {
                    code: 'ContentError', message: 'Logitems size exceed 5MB', retryable: false
                });
            }

            httpRequest.headers['x-sls-bodyrawsize'] = pb.length;

            deflate(pb, function(err, buf) {
                if(err){
                    throw ALY.util.error(new Error(), {
                        code: 'ContentError', message: err.message, retryable: false
                    });
                }
                else{
                    req.httpRequest.body = buf;
                    done();
                }
            });

        }else{
            done();
        }
    },

    willComputeChecksums: function willComputeChecksums(req) {

        // // TODO: compute checksums for Stream objects
        // if (!ALY.util.Buffer.isBuffer(req.httpRequest.body) &&
        //     typeof req.httpRequest.body !== 'string') {
        //     return false;
        // }

        var rules = req.service.api.operations[req.operation].input;

        // // V4 signer uses SHA256 signatures so only compute MD5 if it is required
        // if (req.service.getSignerClass(req) === ALY.Signers.V4) {
        //     if (rules.ContentMD5 && !rules.ContentMD5.required) return false;
        // }

        if (rules.ContentMD5) return true;
    },

    computeContentMd5: function computeContentMd5(req) {
        if (req.service.willComputeChecksums(req)) {
            var md5 = ALY.util.crypto.md5(req.httpRequest.body, 'hex').toUpperCase();
            req.httpRequest.headers['Content-MD5'] = md5;
        }
    },

    computeSha256: function computeSha256(req) {
        if (req.service.getSignerClass(req) === ALY.Signers.V4) {
            req.httpRequest.headers['X-Amz-Content-Sha256'] =
                ALY.util.crypto.sha256(req.httpRequest.body || '', 'hex');
        }
    },

    escapePathParam: function escapePathParam(value) {
        return ALY.util.uriEscapePath(String(value));
    },


    successfulResponse: function successfulResponse(resp) {
        //var req = resp.request;
        var httpResponse = resp.httpResponse;
        return httpResponse.statusCode < 300;
    },

    retryableError: function retryableError(error, request) {

        var _super = ALY.Service.prototype.retryableError;
        return _super.call(this, error, request);

    },

    extractData: function extractData(resp) {
        var reqId = resp.httpResponse.headers['x-sls-requestid'];
        if (reqId) {
            resp.data.request_id = reqId;
        }
        resp.data.headers = resp.httpResponse.headers;

        //去掉RequestId
        delete resp.data.RequestId;
    },

    extractError: function extractError(resp) {
        var headers = resp.httpResponse.headers;

        var body = resp.httpResponse.body;
        var error = body.toString();

        try{
            error = JSON.parse(error);
        }catch(e){
            error = {};
        }

        error = ALY.util.update(error, {
            request_id : headers['x-sls-requestid'] || null,
            code: resp.httpResponse.statusCode,
            message: body.toString(),
            headers: headers
        });

        resp.error = ALY.util.error(new Error(), error);
    }

});

module.exports = ALY.SLS;
