var ots = require('./ots');

ots.putRow({
      instance_name: 'chylvina',
      table_name: "table1",
      primary_key: [
        {
          name: "key1"
        }
      ]
    },
    function (err, data) {
      if (err) {
        console.log('error:', err);
        return;
      }

      console.log('success:', data);
    });
