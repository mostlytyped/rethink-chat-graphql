// server/schema.js

// GraphQL type definitions
const { gql } = require("apollo-server-express");
exports.typeDefs = gql`
  type Chat {
    user: String
    msg: String
    roomId: String
    ts: Float
  }

  type Subscription {
    chatAdded(room: String!): Chat
  }

  type Query {
    chats(room: String!): [Chat]
  }

  type Mutation {
    sendChat(user: String!, message: String!, room: String!): Chat
  }
`;

// GraphQL resolvers
const r = require("rethinkdb");
exports.resolvers = {
  Subscription: {
    chatAdded: {
      async subscribe(parent, args, context, info) {
        return new RethinkIterator(
          r.table("chats").filter({ roomId: args.room }),
          context.conn
        );
      },
    },
  },
  Mutation: {
    async sendChat(root, args, context) {
      const chatMsg = {
        user: args.user,
        roomId: args.room,
        msg: args.message,
        ts: Date.now(),
      };
      await r
        .table("chats")
        .insert(chatMsg)
        .run(context.conn);
      return chatMsg;
    },
  },
  Query: {
    async chats(parent, args, context, info) {
      const cursor = await r
        .table("chats")
        .filter({ roomId: args.room })
        .orderBy(r.desc("ts"))
        .run(context.conn);
      return await cursor.toArray();
    },
  },
};

// Async iterator to access the RethinkDB change feed
const { $$asyncIterator } = require("iterall");
class RethinkIterator {
  constructor(query, conn) {
    this.cursor = query.changes().run(conn);
  }

  async next() {
    const val = await (await this.cursor).next();
    return { value: { chatAdded: val.new_val }, done: false };
  }

  async return() {
    await (await this.cursor).close();
    return { value: undefined, done: true };
  }

  async throw(error) {
    return Promise.reject(error);
  }

  [$$asyncIterator]() {
    return this;
  }
}
