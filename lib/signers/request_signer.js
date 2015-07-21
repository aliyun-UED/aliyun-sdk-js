var ALY = require('../core');
var inherit = ALY.util.inherit;

/**
 * @api private
 */
ALY.Signers.RequestSigner = inherit({
  constructor: function RequestSigner(request) {
    this.request = request;
  }
});

ALY.Signers.RequestSigner.getVersion = function getVersion(version) {
  switch (version) {
    case 'oss': return ALY.Signers.OSS;
    case 'sls': return ALY.Signers.SLS;
    case 'top': return ALY.Signers.TOP;
    case 'pop': return ALY.Signers.POP;
    case 'opensearch': return ALY.Signers.OpenSearch;
    case 'batchcompute': return ALY.Signers.BatchCompute;
  }
  throw new Error('Unknown signing version ' + version);
};

require('./oss');
require('./sls');
require('./opensearch');
require('./top');
require('./pop');
require('./batchcompute');
