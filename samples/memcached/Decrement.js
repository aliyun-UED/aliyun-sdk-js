var memcached = require('./memcached');

// -------------------------------
// https://code.google.com/p/memcached/wiki/MemcacheBinaryProtocol
// 4.5. Decrement
// -------------------------------

// set value
memcached.set('hello', 10, function(err, data) {
  if(err) {
    console.log('set error:', err);
    return;
  }

  console.log('set success:', data);
});

// decrease value
memcached.decrement('hello', 6, function(err, data) {
  if(err) {
    console.log('decrement error:', err);
    return;
  }

  console.log('decrement success:', data);
});

// get value
memcached.get('hello', function(err, data) {
  if(err) {
    console.log('get error:', err);
    return;
  }

  console.log('get success:', data);

  memcached.end();
});
