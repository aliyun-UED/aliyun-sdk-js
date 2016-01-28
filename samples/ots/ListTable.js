var ots = require('./ots');

ots.listTable({
      instance_name: 'chylvina'
    },
    function (err, data) {
      if (err) {
        console.log('error:', err);
        return;
      }

      console.log('success:', data);
    });
