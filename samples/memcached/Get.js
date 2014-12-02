var memcached = require('./memcached');

// -------------------------------
// https://code.google.com/p/memcached/wiki/MemcacheBinaryProtocol
// 4.2. Get, Get Quietly, Get Key, Get Key Quietly
// -------------------------------

memcached.get('hello', function(err, data) {
  if(err) {
    console.log('get error:', err);
    memcached.end();
    return;
  }

  console.log('get success:', data);

  memcached.end();
});
