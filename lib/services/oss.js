var ALY = require('../core');

ALY.OSS = ALY.Service.defineService('oss', ['2013-10-15'], {
  /**
   * @api private
   */
  initialize: function initialize(options) {
    ALY.Service.prototype.initialize.call(this, options);
    this.setEndpoint((options || {}).endpoint, options);
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
  },

  /**
   * S3 prefers dns-compatible bucket names to be moved from the uri path
   * to the hostname as a sub-domain.  This is not possible, even for dns-compat
   * buckets when using SSL and the bucket name contains a dot ('.').  The
   * ssl wildcard certificate is only 1-level deep.
   *
   * @api private
   */
  populateURI: function populateURI(req) {
    var httpRequest = req.httpRequest;
    var b = req.params.Bucket;

    if (b) {
      if (!req.service.pathStyleBucketName(b)) {
        httpRequest.endpoint.host = httpRequest.endpoint.hostname = b + '.' +
          httpRequest.endpoint.hostname;

        httpRequest.virtualHostedBucket = b; // needed for signing the request
        httpRequest.path = httpRequest.path.replace(new RegExp('^/' + b), '');
        if (httpRequest.path[0] !== '/') {
          httpRequest.path = '/' + httpRequest.path;
        }
      }
    }
  },

  /**
   * Adds a default content type if none is supplied.
   *
   * @api private
   */
  addContentType: function addContentType(req) {
    var httpRequest = req.httpRequest;
    if (!httpRequest.headers['Content-Type']) { // always have a Content-Type
      httpRequest.headers['Content-Type'] = 'application/octet-stream';
    }
    if (ALY.util.isBrowser() && navigator.userAgent.match(/Firefox/)) {
      if (!httpRequest.headers['Content-Type'].match(/;/)) {
        var charset = '; charset=UTF-8';
        httpRequest.headers['Content-Type'] += charset;
      }
    }
  },

  /**
   * @api private
   */
  computableChecksumOperations: {
    putBucketCors: true,
    putBucketLifecycle: true,
    putBucketTagging: true,
    deleteObjects: true
  },

  /**
   * Checks whether checksums should be computed for the request.
   * If the request requires checksums to be computed, this will always
   * return true, otherwise it depends on whether {ALY.Config.computeChecksums}
   * is set.
   *
   * @param req [ALY.Request] the request to check against
   * @return [Boolean] whether to compute checksums for a request.
   * @api private
   */
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

  /**
   * A listener that computes the Content-MD5 and sets it in the header.
   * @see ALY.S3.willComputeChecksums
   * @api private
   */
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

  /**
   * Returns true if the bucket name should be left in the URI path for
   * a request to S3.  This function takes into account the current
   * endpoint protocol (e.g. http or https).
   *
   * @api private
   */
  pathStyleBucketName: function pathStyleBucketName(bucketName) {
    // user can force path style requests via the configuration
    if (this.config.s3ForcePathStyle) return true;

    if (this.dnsCompatibleBucketName(bucketName)) {
      return (this.config.sslEnabled && bucketName.match(/\./)) ? true : false;
    } else {
      return true; // not dns compatible names must always use path style
    }
  },

  /**
   * Returns true if the bucket name is DNS compatible.  Buckets created
   * outside of the classic region MUST be DNS compatible.
   *
   * @api private
   */
  dnsCompatibleBucketName: function dnsCompatibleBucketName(bucketName) {
    var b = bucketName;
    var domain = new RegExp(/^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/);
    var ipAddress = new RegExp(/(\d+\.){3}\d+/);
    var dots = new RegExp(/\.\./);
    return (b.match(domain) && !b.match(ipAddress) && !b.match(dots)) ? true : false;
  },

  /**
   * OSS requires that path params not escape forward slashes.
   *
   * @api private
   */
  escapePathParam: function escapePathParam(value) {
    return ALY.util.uriEscapePath(String(value));
  },

  /**
   * @return [Boolean] whether response contains an error
   * @api private
   */
  successfulResponse: function successfulResponse(resp) {
    var req = resp.request;
    var httpResponse = resp.httpResponse;
    if (req.operation === 'completeMultipartUpload' &&
      httpResponse.body.toString().match('<Error>'))
      return false;
    else
      return httpResponse.statusCode < 300;
  },

  /**
   * @return [Boolean] whether the error can be retried
   * @api private
   */
  retryableError: function retryableError(error, request) {
    if (request.operation == 'completeMultipartUpload' &&
      error.statusCode === 200) {
      return true;
    } else {
      var _super = ALY.Service.prototype.retryableError;
      return _super.call(this, error, request);
    }
  },

  /**
   * Provides a specialized parser for getBucketLocation -- all other
   * operations are parsed by the super class.
   *
   * @api private
   */
  extractData: function extractData(resp) {
    var req = resp.request;
    if (req.operation === 'getBucketLocation') {
      /*jshint regexp:false*/
      var match = resp.httpResponse.body.toString().match(/>(.+)<\/Location/);
      if (match) {
        delete resp.data['_'];
        resp.data.LocationConstraint = match[1];
      }
    }
  },

  /**
   * Extracts an error object from the http response.
   *
   * @api private
   */
  extractError: function extractError(resp) {
    var codes = {
      304: 'NotModified',
      403: 'Forbidden',
      400: 'BadRequest',
      404: 'NotFound'
    };

    var code = resp.httpResponse.statusCode;
    var body = resp.httpResponse.body;
    if (codes[code] && body.length === 0) {
      resp.error = ALY.util.error(new Error(), {
        code: codes[resp.httpResponse.statusCode],
        message: null,
        headers: resp.httpResponse.headers
      });
    } else {
      var data = new ALY.XML.Parser({}).parse(body.toString());
      resp.error = ALY.util.error(new Error(), {
        code: data.Code || code,
        message: data.Message || null,
        headers: resp.httpResponse.headers
      });
    }
  },

  /**
   * @api private
   */
  setEndpoint: function setEndpoint(endpoint) {
    if (endpoint) {
      this.endpoint = new ALY.Endpoint(endpoint, this.config);
    } else if (this.config.region && this.config.region !== 'us-east-1') {
      var sep = '-';
      if (this.isRegionV4()) sep = '.';
      var hostname = 's3' + sep + this.config.region + this.endpointSuffix();
      this.endpoint = new ALY.Endpoint(hostname);
    } else {
      this.endpoint = new ALY.Endpoint(this.api.globalEndpoint, this.config);
    }
  },

  getSignedUrl: function getSignedUrl(operation, params, callback) {
    params = ALY.util.copy(params || {});
    var expires = params.Expires || 900;
    delete params.Expires; // we can't validate this
    var request = this.makeRequest(operation, params);

    var expiresHeader = 'presigned-expires';

    function signedUrlBuilder() {
      delete request.httpRequest.headers['User-Agent'];
      delete request.httpRequest.headers['X-Amz-User-Agent'];

      if (request.service.getSignerClass() === ALY.Signers.V4) {
        if (expires > 604800) { // one week expiry is invalid
          var message = 'getSignedUrl() does not support expiry time greater ' +
            'than a week with SigV4 signing.';
          throw ALY.util.error(new Error(), {
            code: 'InvalidExpiryTime', message: message, retryable: false
          });
        }
        request.httpRequest.headers[expiresHeader] = expires;
      } else {
        request.httpRequest.headers[expiresHeader] = parseInt(
          ALY.util.date.unixTimestamp() + expires, 10).toString();
      }
    }

    function signedUrlSigner() {
      var queryParams = {};

      ALY.util.each(request.httpRequest.headers, function (key, value) {
        if (key === expiresHeader) key = 'Expires';
        queryParams[key] = value;
      });
      delete request.httpRequest.headers[expiresHeader];

      var auth = queryParams['Authorization'].split(' ');
      if (auth[0] === 'OSS') {
        auth = auth[1].split(':');
        queryParams['OSSAccessKeyId'] = auth[0];
        queryParams['Signature'] = auth[1];
      }
      delete queryParams['Authorization'];
      delete queryParams['Host'];

      // build URL
      var endpoint = request.httpRequest.endpoint;
      var parsedUrl = ALY.util.urlParse(request.httpRequest.path);
      var querystring = ALY.util.queryParamsToString(queryParams);
      endpoint.pathname = parsedUrl.pathname;
      endpoint.search = !parsedUrl.search ? querystring :
        parsedUrl.search + '&' + querystring;
    }

    request.on('build', signedUrlBuilder);
    request.on('sign', signedUrlSigner);
    request.removeListener('build', this.addContentType);
    request.removeAllListeners('afterBuild');
    if (!params.Body) { // no Content-MD5/SHA-256 if body is not provided
      request.removeListener('build', this.computeContentMd5);
      request.removeListener('build', this.computeSha256);
    }

    if (callback) {
      request.build(function() {
        if (request.response.error) callback(request.response.error, null);
        else callback(null, ALY.util.urlFormat(request.httpRequest.endpoint));
      });
    } else {
      request.build();
      return ALY.util.urlFormat(request.httpRequest.endpoint);
    }
  }
});

ALY.OSS.prototype.createBucket = function createBucket(params, callback) {
  // When creating a bucket *outside* the classic region, the location
  // constraint must be set for the bucket and it must match the endpoint.
  // This chunk of code will set the location constraint param based
  // on the region (when possible), but it will not override a passed-in
  // location constraint.
  if (!params) params = {};
  var hostname = this.endpoint.hostname;
  if (hostname != this.api.globalEndpoint && !params.CreateBucketConfiguration) {
    params.CreateBucketConfiguration = { LocationConstraint: this.config.region };
  }
  return this.makeRequest('createBucket', params, callback);
};

module.exports = ALY.OSS;
