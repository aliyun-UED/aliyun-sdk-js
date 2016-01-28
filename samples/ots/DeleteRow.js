var ots = require('./ots');

ots.deleteRow({
      instance_name: 'chylvina',
      table_name: "table1",
      condition: {
        row_existence: "IGNORE"
      },
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
