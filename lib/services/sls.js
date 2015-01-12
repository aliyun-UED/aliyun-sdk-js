var ALY = require('../core');

ALY.SLS = ALY.Service.defineService('sls', ['2014-11-18'], {
    /**
     * @api private
     */
    initialize: function initialize(options) {
        ALY.Service.prototype.initialize.call(this, options);
        // 在这里 update endpoint ，如果需要的话
    },

    setupRequestListeners: function setupRequestListeners(request) {
        request.addListener('build', this.addContentType);
        request.addListener('build', this.populateURI);
        request.addListener('build', this.computeContentMd5);
        request.addListener('build', this.computeSha256);
        request.removeListener('validate',
            ALY.EventListeners.Core.VALIDATE_REGION);
        request.addListener('extractError', this.extractError);
        request.addListener('extractData', this.extractData);

        request.addListener('afterBuild', function (req) {
            req.httpRequest.headers['Host'] = 'ali-sls-portal.10.101.172.22'; //req.httpRequest.endpoint.host;
        });
    },

    populateURI: function populateURI(req) {
    },

    addContentType: function addContentType(req) {
        var httpRequest = req.httpRequest;
        //httpRequest.headers['Content-Type'] = 'application/json';
        httpRequest.headers['x-sls-signaturemethod'] = 'hmac-sha1';
        httpRequest.headers['x-sls-apiversion'] = '0.4.0';
        httpRequest.headers['x-sls-bodyrawsize'] = 0;
    },

    computableChecksumOperations: {
        putBucketCors: true,
        putBucketLifecycle: true,
        putBucketTagging: true,
        deleteObjects: true
    },

    willComputeChecksums: function willComputeChecksums(req) {
        if (this.computableChecksumOperations[req.operation]) return true;
        if (!this.config.computeChecksums) return false;

        // TODO: compute checksums for Stream objects
        if (!ALY.util.Buffer.isBuffer(req.httpRequest.body) &&
            typeof req.httpRequest.body !== 'string') {
            return false;
        }

        var rules = req.service.api.operations[req.operation].input.members;

        // V4 signer uses SHA256 signatures so only compute MD5 if it is required
        if (req.service.getSignerClass(req) === ALY.Signers.V4) {
            if (rules.ContentMD5 && !rules.ContentMD5.required) return false;
        }

        if (rules.ContentMD5 && !req.params.ContentMD5) return true;
    },

    computeContentMd5: function computeContentMd5(req) {
        if (req.service.willComputeChecksums(req)) {
            var md5 = ALY.util.crypto.md5(req.httpRequest.body, 'base64');
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
        var req = resp.request;
        var httpResponse = resp.httpResponse;
        return httpResponse.statusCode < 300;
    },

    retryableError: function retryableError(error, request) {
        if (request.operation == 'completeMultipartUpload' &&
            error.statusCode === 200) {
            return true;
        } else {
            var _super = ALY.Service.prototype.retryableError;
            return _super.call(this, error, request);
        }
    },

    extractData: function extractData(resp) {
        var req = resp.request;
    },

    extractError: function extractError(resp) {
        var body = resp.httpResponse.body;
        resp.error = ALY.util.error(new Error(), {
            code: resp.httpResponse.statusCode,
            message: body.toString(),
            headers: resp.httpResponse.headers
        });
    }

});

module.exports = ALY.SLS;
