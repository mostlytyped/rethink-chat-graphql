// server/migrate.js

var r = require("rethinkdb");

r.connect(
  {
    host: process.env.RETHINKDB_HOST || "localhost",
    port: process.env.RETHINKDB_PORT || 28015,
    username: process.env.RETHINKDB_USERNAME || "admin",
    password: process.env.RETHINKDB_PASSWORD || "",
    db: process.env.RETHINKDB_NAME || "test",
  },
  function(err, conn) {
    if (err) throw err;

    r.tableList().run(conn, (err, cursor) => {
      if (err) throw err;
      cursor.toArray((err, tables) => {
        if (err) throw err;

        // Check if table exists
        if (!tables.includes("chats")) {
          // Table missing --> create
          console.log("Creating chats table");
          r.tableCreate("chats").run(conn, (err, _) => {
            if (err) throw err;
            console.log("Creating chats table -- done");
            conn.close();
          });
        } else {
          // Table exists --> exit
          conn.close();
        }
      });
    });
  }
);
