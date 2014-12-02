var ALY = require('./core');
require('./credentials');

ALY.Config = ALY.util.inherit({

  constructor: function Config(options) {
    if (options === undefined) options = {};
    options = this.extractCredentials(options);

    ALY.util.each.call(this, this.keys, function (key, value) {
      this.set(key, options[key], value);
    });
  },

  update: function update(options, allowUnknownKeys) {
    allowUnknownKeys = allowUnknownKeys || false;
    options = this.extractCredentials(options);
    ALY.util.each.call(this, options, function (key, value) {
      if (allowUnknownKeys || this.keys.hasOwnProperty(key)) this[key] = value;
    });
  },

  clear: function clear() {
    /*jshint forin:false */
    ALY.util.each.call(this, this.keys, function (key) {
      delete this[key];
    });

    // reset credential provider
    this.set('credentials', undefined);
    this.set('credentialProvider', undefined);
  },

  getCredentials: function getCredentials(callback) {
    var self = this;

    function finish(err) {
      callback(err, err ? null : self.credentials);
    }

    function credError(msg, err) {
      return new ALY.util.error(err || new Error(), {
        code: 'CredentialsError', message: msg
      });
    }

    function getStaticCredentials() {
      var err = null;
      if (!self.credentials.accessKeyId || !self.credentials.secretAccessKey) {
        err = credError('Missing credentials');
      }
      finish(err);
    }

    if (self.credentials) {
      getStaticCredentials();
    }
    else {
      finish(credError('No credentials to load'));
    }
  },

  /**
   * Sets a property on the configuration object, allowing for a
   * default value
   * @api private
   */
  set: function set(property, value, defaultValue) {
    if (value === undefined) {
      if (defaultValue === undefined) {
        defaultValue = this.keys[property];
      }
      if (typeof defaultValue === 'function') {
        this[property] = defaultValue.call(this);
      } else {
        this[property] = defaultValue;
      }
    } else {
      this[property] = value;
    }
  },

  keys: {
    credentials: null,
    credentialProvider: null,
    region: null,
    logger: null,
    apiVersions: {},
    apiVersion: null,
    endpoint: undefined,
    httpOptions: {},
    maxRetries: undefined,
    maxRedirects: 10,
    paramValidation: true,
    sslEnabled: true,
    s3ForcePathStyle: false,
    computeChecksums: true,
    dynamoDbCrc32: true
  },

  extractCredentials: function extractCredentials(options) {
    if (options.accessKeyId && options.secretAccessKey) {
      options = ALY.util.copy(options);
      options.credentials = new ALY.Credentials(options);
    }
    return options;
  }
});

ALY.config = new ALY.Config();
