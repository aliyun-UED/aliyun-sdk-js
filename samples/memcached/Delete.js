var memcached = require('./memcached');

// -------------------------------
// https://code.google.com/p/memcached/wiki/MemcacheBinaryProtocol
// 4.4. Delete
// -------------------------------

// delete string
memcached.delete('hello', function(err, data) {
  if(err) {
    console.log('delete error:', err);
    memcached.end();
    return;
  }

  console.log('delete success:', data);
  memcached.end();
});
