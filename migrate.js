var rethink = require("rethinkdb");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const rdbHost = process.env.RETHINKDB_HOST;
const rdbPort = process.env.RETHINKDB_PORT;
const rdbName = process.env.RETHINKDB_NAME;
const rdbUser = process.env.RETHINKDB_USERNAME;
const rdbPass = process.env.RETHINKDB_PASSWORD;

rethink.connect(
  {
    host: rdbHost,
    port: rdbPort,
    username: rdbUser,
    password: rdbPass,
    db: rdbName,
  },
  function (err, conn) {
    if (err) throw err;

    rethink.tableDrop("chats").run(conn, () => {
      rethink.tableCreate("chats").run(conn, (err, result) => {
        console.log(err, result);
        conn.close();
      });
    });
  }
);
