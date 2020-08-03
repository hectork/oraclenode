var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
//console.log("ora---",oracledb, oracledb.DB_TYPE_TIMESTAMP_TZ);
oracledb.fetchAsString = [ 
  oracledb.DATE, 
  oracledb.NUMBER
];

try {
    oracledb.initOracleClient({libDir: 'instantclient_19_6'});
  } catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
  }
// SELECT SERIAL_NUM from SIEBEL.S_ASSET where rownum < 100;
// Get a non-pooled connection
oracledb.getConnection(
  {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  },
  function(err, connection)
  {
    if (err) {
      console.error(err.message);
      return;
    }
    try{
        connection.execute(
          // The statement to execute
          `SELECT * FROM DMS_MAS_ORDER_ENTRY WHERE ORD_NO='177'`,

          // The "bind value" 180 for the bind variable ":id"
           [],

          // execute() options argument.  Since the query only returns one
          // row, we can optimize memory usage by reducing the default
          // maxRows value.  For the complete list of other options see
          // the documentation.
          // { maxRows: 1
          //   //, outFormat: oracledb.OBJECT  // query result format
          //   //, extendedMetaData: true      // get extra metadata
          //   //, fetchArraySize: 100         // internal buffer allocation size for tuning
          // },

          // The callback function handles the SQL execution results
          function(err, result)
          {
            if (err) {
              console.error(err.message);
              doRelease(connection);
              return;
            }
            // console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
            console.log(JSON.stringify(result.rows));     // [ [ 180, 'Construction' ] ]
            doRelease(connection);
          });
     }
     catch(ex){
      console.log("Log: ex:",ex )
    }
  });

// Note: connections should always be released when not needed
function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}