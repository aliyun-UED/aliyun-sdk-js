var ALY = require('./core');
require('./sequential_executor');
require('./service_interface/json');
require('./service_interface/query');
require('./service_interface/rest');
require('./service_interface/rest_json');
require('./service_interface/rest_xml');

/**
 * The namespace used to register global event listeners for request building
 * and sending.
 */
ALY.EventListeners = {
  /**
   * @!attribute VALIDATE_CREDENTIALS
   *   A request listener that validates whether the request is being
   *   sent with credentials.
   *   Handles the {ALY.Request~validate 'validate' Request event}
   *   @example Sending a request without validating credentials
   *     var listener = ALY.EventListeners.Core.VALIDATE_CREDENTIALS;
   *     request.removeListener('validate', listener);
   *   @readonly
   *   @return [Function]
   * @!attribute VALIDATE_REGION
   *   A request listener that validates whether the region is set
   *   for a request.
   *   Handles the {ALY.Request~validate 'validate' Request event}
   *   @example Sending a request without validating region configuration
   *     var listener = ALY.EventListeners.Core.VALIDATE_REGION;
   *     request.removeListener('validate', listener);
   *   @readonly
   *   @return [Function]
   * @!attribute VALIDATE_PARAMETERS
   *   A request listener that validates input parameters in a request.
   *   Handles the {ALY.Request~validate 'validate' Request event}
   *   @example Sending a request without validating parameters
   *     var listener = ALY.EventListeners.Core.VALIDATE_PARAMETERS;
   *     request.removeListener('validate', listener);
   *   @example Disable parameter validation globally
   *     ALY.EventListeners.Core.removeListener('validate',
   *       ALY.EventListeners.Core.VALIDATE_REGION);
   *   @readonly
   *   @return [Function]
   * @!attribute SEND
   *   A request listener that initiates the HTTP connection for a
   *   request being sent. Handles the {ALY.Request~send 'send' Request event}
   *   @example Replacing the HTTP handler
   *     var listener = ALY.EventListeners.Core.SEND;
   *     request.removeListener('send', listener);
   *     request.on('send', function(response) {
   *       customHandler.send(response);
   *     });
   *   @return [Function]
   *   @readonly
   * @!attribute HTTP_DATA
   *   A request listener that reads data from the HTTP connection in order
   *   to build the response data.
   *   Handles the {ALY.Request~httpData 'httpData' Request event}.
   *   Remove this handler if you are overriding the 'httpData' event and
   *   do not want extra data processing and buffering overhead.
   *   @example Disabling default data processing
   *     var listener = ALY.EventListeners.Core.HTTP_DATA;
   *     request.removeListener('httpData', listener);
   *   @return [Function]
   *   @readonly
   */
  Core: {} /* doc hack */
};

ALY.EventListeners = {
  Core: new ALY.SequentialExecutor().addNamedListeners(function(add, addAsync) {

    add('VALIDATE_REGION', 'validate', function VALIDATE_REGION(req) {
      if (!req.service.config.region && !req.service.hasGlobalEndpoint()) {
        req.response.error = ALY.util.error(new Error(),
          {code: 'SigningError', message: 'Missing region in config'});
      }
    });

    add('VALIDATE_PARAMETERS', 'validate', function VALIDATE_PARAMETERS(req) {
      var rules = req.service.api.operations[req.operation].input;
      new ALY.ParamValidator().validate(rules, req.params);
    });

    add('SET_CONTENT_LENGTH', 'afterBuild', function SET_CONTENT_LENGTH(req) {
      if (req.httpRequest.headers['Content-Length'] === undefined) {
        var length = ALY.util.string.byteLength(req.httpRequest.body);
        req.httpRequest.headers['Content-Length'] = length;
      }
    });

    add('SET_HTTP_HOST', 'afterBuild', function SET_HTTP_HOST(req) {
      req.httpRequest.headers['Host'] = req.httpRequest.endpoint.host;
    });

    addAsync('SIGN', 'sign', function SIGN(req, done) {
      if (!req.service.api.signatureVersion) return done(); // none

      req.service.config.getCredentials(function (err, credentials) {
        if (err) {
          req.response.error = err;
          return done();
        }

        try {
          var date = ALY.util.date.getDate();
          var SignerClass = req.service.getSignerClass(req);
          var signer = new SignerClass(req.httpRequest,
            req.service.api.signingName || req.service.api.endpointPrefix);

          // clear old authorization headers
          delete req.httpRequest.headers['Authorization'];
          delete req.httpRequest.headers['Date'];
          delete req.httpRequest.headers['X-Amz-Date'];

          // add new authorization
          signer.addAuthorization(credentials, date);
        } catch (e) {
          req.response.error = e;
        }
        done();
      });
    });

    add('VALIDATE_RESPONSE', 'validateResponse', function VALIDATE_RESPONSE(resp) {
      if (this.service.successfulResponse(resp, this)) {
        resp.data = {};
        resp.error = null;
      } else {
        resp.data = null;
        resp.error = ALY.util.error(new Error(),
          {code: 'UnknownError', message: 'An unknown error occurred.'});
      }
    });

    addAsync('SEND', 'send', function SEND(resp, done) {
      function callback(httpResp) {
        resp.httpResponse.stream = httpResp;
        resp.httpResponse._abortCallback = done;

        httpResp.on('headers', function onHeaders(statusCode, headers) {
          resp.request.emit('httpHeaders', [statusCode, headers, resp]);

          if (!resp.request.httpRequest._streaming) {
            if (ALY.HttpClient.streamsApiVersion === 2) { // streams2 API check
              httpResp.on('readable', function onReadable() {
                var data = httpResp.read();
                if (data !== null) {
                  resp.request.emit('httpData', [data, resp]);
                }
              });
            } else { // legacy streams API
              httpResp.on('data', function onData(data) {
                resp.request.emit('httpData', [data, resp]);
              });
            }
          }
        });

        httpResp.on('end', function onEnd() {
          resp.request.emit('httpDone');
          done();
        });
      }

      function progress(httpResp) {
        httpResp.on('sendProgress', function onSendProgress(progress) {
          resp.request.emit('httpUploadProgress', [progress, resp]);
        });

        httpResp.on('receiveProgress', function onReceiveProgress(progress) {
          resp.request.emit('httpDownloadProgress', [progress, resp]);
        });
      }

      function error(err) {
        resp.error = ALY.util.error(err, {
          code: 'NetworkingError',
          region: resp.request.httpRequest.region,
          hostname: resp.request.httpRequest.endpoint.hostname,
          retryable: true
        });
        resp.request.emit('httpError', [resp.error, resp], function() {
          done();
        });
      }

      resp.error = null;
      resp.data = null;

      var http = ALY.HttpClient.getInstance();
      var httpOptions = resp.request.service.config.httpOptions || {};
      this.httpRequest.debug();
      var s = http.handleRequest(this.httpRequest, httpOptions, callback, error);
      progress(s);
    });

    add('HTTP_HEADERS', 'httpHeaders',
        function HTTP_HEADERS(statusCode, headers, resp) {
      resp.httpResponse.statusCode = statusCode;
      resp.httpResponse.headers = headers;
      resp.httpResponse.body = new ALY.util.Buffer('');
      resp.httpResponse.buffers = [];
      resp.httpResponse.numBytes = 0;
    });

    add('HTTP_DATA', 'httpData', function HTTP_DATA(chunk, resp) {
      if (chunk) {
        if (ALY.util.isNode()) {
          resp.httpResponse.numBytes += chunk.length;

          var total = resp.httpResponse.headers['content-length'];
          var progress = { loaded: resp.httpResponse.numBytes, total: total };
          resp.request.emit('httpDownloadProgress', [progress, resp]);
        }

        resp.httpResponse.buffers.push(new ALY.util.Buffer(chunk));
      }
    });

    add('HTTP_DONE', 'httpDone', function HTTP_DONE(resp) {
      // convert buffers array into single buffer
      if (resp.httpResponse.buffers && resp.httpResponse.buffers.length > 0) {
        var body = ALY.util.buffer.concat(resp.httpResponse.buffers);
        resp.httpResponse.body = body;
      }
      delete resp.httpResponse.numBytes;
      delete resp.httpResponse.buffers;
    });

    add('FINALIZE_ERROR', 'retry', function FINALIZE_ERROR(resp) {
      if (resp.httpResponse.statusCode) {
        resp.error.statusCode = resp.httpResponse.statusCode;
        if (resp.error.retryable === undefined) {
          resp.error.retryable = this.service.retryableError(resp.error, this);
        }
      }
    });

    add('INVALIDATE_CREDENTIALS', 'retry', function INVALIDATE_CREDENTIALS(resp) {
      switch (resp.error.code) {
        case 'RequestExpired':
        case 'ExpiredTokenException':
        case 'ExpiredToken':
          resp.error.retryable = true;
          resp.request.service.config.credentials.expired = true;
      }
    });

    add('REDIRECT', 'retry', function REDIRECT(resp) {
      if (resp.error && resp.error.statusCode >= 300 &&
          resp.error.statusCode < 400 && resp.httpResponse.headers['location']) {
        this.httpRequest.endpoint =
          new ALY.Endpoint(resp.httpResponse.headers['location']);
        resp.error.redirect = true;
        resp.error.retryable = true;
      }
    });

    add('RETRY_CHECK', 'retry', function RETRY_CHECK(resp) {
      if (resp.error) {
        if (resp.error.redirect && resp.redirectCount < this.service.config.maxRedirects) {
          resp.redirectCount++;
        } else if (resp.error.retryable && resp.retryCount < this.service.numRetries()) {
          resp.retryCount++;
        } else {
          resp._doneRetry = true;
        }
      }
    });

    addAsync('RESET_RETRY_STATE', 'afterRetry', function RESET_RETRY_STATE(resp, done) {
      if (!resp._doneRetry && resp.error) {
        var delay = 0;
        if (!resp.error.redirect) {
          delay = this.service.retryDelays()[resp.retryCount-1] || 0;
        }

        resp.error = null;
        delete resp._doneRetry;
        setTimeout(done, delay);
      } else {
        done();
      }
    });

  }),

  Logger: new ALY.SequentialExecutor().addNamedListeners(function(add) {
    add('LOG_REQUEST', 'complete', function LOG_REQUEST(resp) {
      var req = resp.request;
      var logger = req.service.config.logger;
      if (!logger) return;

      function buildMessage() {
        var time = ALY.util.date.getDate().getTime();
        var delta = (time - req.startTime.getTime()) / 1000;
        var ansi = logger.isTTY ? true : false;
        var status = resp.httpResponse.statusCode;
        var params = require('util').inspect(req.params, true, true);

        var message = '';
        if (ansi) message += '\x1B[33m';
        message += '[ALY ' + req.service.serviceIdentifier + ' ' + status;
        message += ' ' + delta.toString() + 's ' + resp.retryCount + ' retries]';
        if (ansi) message += '\x1B[0;1m';
        message += ' ' + req.operation + '(' + params + ')';
        if (ansi) message += '\x1B[0m';
        return message;
      }

      var message = buildMessage();
      if (typeof logger.log === 'function') {
        logger.log(message);
      } else if (typeof logger.write === 'function') {
        logger.write(message + '\n');
      }
    });
  }),

  Json: new ALY.SequentialExecutor().addNamedListeners(function(add) {
    var svc = ALY.ServiceInterface.Json;
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  Rest: new ALY.SequentialExecutor().addNamedListeners(function(add) {
    var svc = ALY.ServiceInterface.Rest;
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  RestJson: new ALY.SequentialExecutor().addNamedListeners(function(add) {
    var svc = ALY.ServiceInterface.RestJson;
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  RestXml: new ALY.SequentialExecutor().addNamedListeners(function(add) {
    var svc = ALY.ServiceInterface.RestXml;
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  Query: new ALY.SequentialExecutor().addNamedListeners(function(add) {
    var svc = ALY.ServiceInterface.Query;
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  })
};
