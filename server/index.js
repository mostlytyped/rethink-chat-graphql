// server/index.js

// Setup Express server
const express = require("express");
const app = express();
const http = require("http").createServer(app);

// Logging middleware
var morgan = require("morgan");
app.use(morgan("combined"));

// Serve frontend
app.use(express.static("dist"));

// Lazy RethinkDB connection
var r = require("rethinkdb");
let rdbConn = null;
const rdbConnect = async function() {
  try {
    const conn = await r.connect({
      host: process.env.RETHINKDB_HOST || "localhost",
      port: process.env.RETHINKDB_PORT || 28015,
      username: process.env.RETHINKDB_USERNAME || "admin",
      password: process.env.RETHINKDB_PASSWORD || "",
      db: process.env.RETHINKDB_NAME || "test",
    });

    // Handle close
    conn.on("close", function(e) {
      console.log("RDB connection closed: ", e);
      rdbConn = null;
    });

    console.log("Connected to RethinkDB");
    rdbConn = conn;
    return conn;
  } catch (err) {
    throw err;
  }
};
const getRethinkDB = async function() {
  if (rdbConn != null) {
    return rdbConn;
  }
  return await rdbConnect();
};

// Setup Apollo (GraphQL) server
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema.js");
const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (arg) => {
    const conn = await getRethinkDB();
    return {
      conn: conn,
    };
  },
});
graphqlServer.applyMiddleware({ app });
graphqlServer.installSubscriptionHandlers(http);

// HTTP server (start listening)
const listenPort = process.env.PORT || "3000";
http.listen(listenPort, () => {
  console.log("listening on *:" + listenPort);
});
