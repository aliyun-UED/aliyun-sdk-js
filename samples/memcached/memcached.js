var ALY = require('../../index.js');
var PORT = 11211;
var HOST = '127.0.0.1';
var username = 'memcached';
var password = '123456';

var memcached = ALY.MEMCACHED.createClient(PORT, HOST, {
  username: username,
  password: password
});

memcached.on('error', function(err) {
  console.log('memached error', err);
});

module.exports = memcached;
