var memcached = require('./memcached');

// -------------------------------
// https://code.google.com/p/memcached/wiki/MemcacheBinaryProtocol
// 4.3. Set
// -------------------------------

// set string
memcached.set('hello', 'world', function(err, data) {
  if(err) {
    console.log('set error:', err);
    return;
  }

  console.log('set success:', data);
});

// set expiration for 10 seconds
memcached.set('hello', 'world', 10, function(err, data) {
  if(err) {
    console.log('set error:', err);
    memcached.end();
    return;
  }

  console.log('set success:', data);

  // end connection
  memcached.end();
});
