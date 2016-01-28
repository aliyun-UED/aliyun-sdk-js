var ots = require('./ots');

ots.updateRow({
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
      ],
      attribute_columns: [
        {
          name: "key2",
          type: "PUT",
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
