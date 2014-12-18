var ALY = require('../core');
var Stream = require('stream').Stream;
var WritableStream = require('stream').Writable;
var ReadableStream = require('stream').Readable;
require('../http');

/**
 * @api private
 */
ALY.NodeHttpClient = ALY.util.inherit({
  handleRequest: function handleRequest(httpRequest, httpOptions, callback, errCallback) {
    var endpoint = httpRequest.endpoint;
    var pathPrefix = '';
    if (!httpOptions) httpOptions = {};

    var useSSL = endpoint.protocol === 'https:';
    var http = useSSL ? require('https') : require('http');
    var options = {
      host: endpoint.hostname,
      port: endpoint.port,
      method: httpRequest.method,
      headers: httpRequest.headers,
      path: pathPrefix + httpRequest.path
    };

    if (useSSL && !httpOptions.agent) {
      options.agent = this.sslAgent();
    }

    ALY.util.update(options, httpOptions);
    delete options.proxy; // proxy isn't an HTTP option
    delete options.timeout; // timeout isn't an HTTP option

    var stream = http.request(options, function (httpResp) {
      callback(httpResp);
      httpResp.emit('headers', httpResp.statusCode, httpResp.headers);
    });
    httpRequest.stream = stream; // attach stream to httpRequest

    // timeout support
    stream.setTimeout(httpOptions.timeout || 0);
    stream.once('timeout', function() {
      var msg = 'Connection timed out after ' + httpOptions.timeout + 'ms';
      errCallback(ALY.util.error(new Error(msg), {code: 'TimeoutError'}));

      // HACK - abort the connection without tripping our error handler
      // since we already raised our TimeoutError. Otherwise the connection
      // comes back with ECONNRESET, which is not a helpful error message
      stream.removeListener('error', errCallback);
      stream.on('error', function() { });
      stream.abort();
    });

    stream.on('error', errCallback);
    this.writeBody(stream, httpRequest);
    return stream;
  },

  writeBody: function writeBody(stream, httpRequest) {
    var body = httpRequest.body;

    if (body && WritableStream && ReadableStream) { // progress support
      if (!(body instanceof Stream)) body = this.bufferToStream(body);
      body.pipe(this.progressStream(stream, httpRequest));
    }

    if (body instanceof Stream) {
      body.pipe(stream);
    } else if (body) {
      stream.end(body);
    } else {
      stream.end();
    }
  },

  sslAgent: function sslAgent() {
    var https = require('https');

    if (!ALY.NodeHttpClient.sslAgent) {
      ALY.NodeHttpClient.sslAgent = new https.Agent({rejectUnauthorized: true});
      ALY.NodeHttpClient.sslAgent.setMaxListeners(0);

      // delegate maxSockets to globalAgent
      Object.defineProperty(ALY.NodeHttpClient.sslAgent, 'maxSockets', {
        enumerable: true,
        get: function() { return https.globalAgent.maxSockets; }
      });
    }
    return ALY.NodeHttpClient.sslAgent;
  },

  progressStream: function progressStream(stream, httpRequest) {
    var numBytes = 0;
    var totalBytes = httpRequest.headers['Content-Length'];
    var writer = new WritableStream();
    writer._write = function(chunk, encoding, callback) {
      if (chunk) {
        numBytes += chunk.length;
        stream.emit('sendProgress', {
          loaded: numBytes, total: totalBytes
        });
      }
      callback();
    };
    return writer;
  },

  bufferToStream: function bufferToStream(buffer) {
    if (!ALY.util.Buffer.isBuffer(buffer)) buffer = new ALY.util.Buffer(buffer);

    var readable = new ReadableStream();
    var pos = 0;
    readable._read = function(size) {
      if (pos >= buffer.length) return readable.push(null);

      var end = pos + size;
      if (end > buffer.length) end = buffer.length;
      readable.push(buffer.slice(pos, end));
      pos = end;
    };

    return readable;
  },

  emitter: null
});

/**
 * @!ignore
 */

/**
 * @api private
 */
ALY.HttpClient.prototype = ALY.NodeHttpClient.prototype;

/**
 * @api private
 */
ALY.HttpClient.streamsApiVersion = ReadableStream ? 2 : 1;
