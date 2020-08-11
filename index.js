const rethink = require("rethinkdb");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema.js");

const rdbHost = process.env.RETHINKDB_HOST;
const rdbPort = process.env.RETHINKDB_PORT;
const rdbName = process.env.RETHINKDB_NAME;
const rdbUser = process.env.RETHINKDB_USERNAME;
const rdbPass = process.env.RETHINKDB_PASSWORD;
const listenPort = process.env.PORT || "5000";

(async function () {
  const conn = await rethink.connect({
    host: rdbHost,
    port: rdbPort,
    username: rdbUser,
    password: rdbPass,
    db: rdbName,
  });

  const app = express();
  //   app.use(express.static("node_modules/chatapp/dist"));
  app.use(express.static("frontend/dist"));
  const http = require("http").createServer(app);

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: (arg) => {
      return {
        conn: conn,
      };
    },
  });
  graphqlServer.applyMiddleware({ app });
  graphqlServer.installSubscriptionHandlers(http);

  http.listen(listenPort, () => {
    console.log("listening on *:" + listenPort);
  });
})();
