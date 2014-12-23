var ALY = require('./core');

ALY.Config = ALY.util.inherit({

  constructor: function Config(options) {
    if (options === undefined) options = {};

    ALY.util.each.call(this, this.keys, function (key, value) {
      this.set(key, options[key], value);
    });
  },

  update: function update(options, allowUnknownKeys) {
    allowUnknownKeys = allowUnknownKeys || false;
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

  // todo: improve this
  getCredentials: function getCredentials(callback) {
    callback(null, {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey
    });
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
    accessKeyId: null,
    secretAccessKey: null,
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
  }
});
