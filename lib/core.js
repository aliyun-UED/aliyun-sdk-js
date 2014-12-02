/**
 * The main ALY namespace
 *
 * @!macro [new] nobrowser
 *   @note This feature is not supported in the browser environment of the SDK.
 */
var ALY = {};
module.exports = ALY;
require('./util');

ALY.util.update(ALY, {

  VERSION: '1.0.0',

  ServiceInterface: {},

  Signers: {},

  XML: {}

});

require('./service');

require('./config');
require('./http');
require('./sequential_executor');
require('./event_listeners');
require('./request');
require('./signers/request_signer');
require('./param_validator');

ALY.events = new ALY.SequentialExecutor();
