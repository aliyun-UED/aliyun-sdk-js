var ots = require('./ots');

ots.getRow({
      instance_name: 'chylvina',
      table_name: "table1",
      primary_key: [
        {
          name: "key1",
          value: {
            type: 'STRING',
            v_string: 'value string'
          }
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
