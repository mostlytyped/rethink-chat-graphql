const { PubSub, gql, withFilter } = require("apollo-server-express");
const pubsub = new PubSub();
const rethink = require("rethinkdb");
const { $$asyncIterator } = require("iterall");

exports.pubsub = pubsub;

exports.typeDefs = gql`
  type Chat {
    user: String
    msg: String
    roomId: String
    ts: Float
  }

  type Room {
    id: String
  }

  type Subscription {
    chatAdded(room: String!): Chat
  }

  type Query {
    chats(room: String!): [Chat]
    rooms: [Room]
  }

  type Mutation {
    sendChat(user: String!, message: String!, room: String!): Chat
  }
`;

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

exports.resolvers = {
  Subscription: {
    chatAdded: {
      async subscribe(parent, args, context, info) {
        return new RethinkIterator(
          rethink.table("chats").filter({ roomId: args.room }),
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
      await rethink.table("chats").insert(chatMsg).run(context.conn);
      return chatMsg;
    },
  },
  Query: {
    async chats(parent, args, context, info) {
      const cursor = await rethink
        .table("chats")
        .filter({ roomId: args.room })
        .orderBy(rethink.desc("ts"))
        .run(context.conn);
      return await cursor.toArray();
    },

    async rooms(parent, args, context, info) {
      const cursor = await rethink
        .table("chats")("roomId")
        .distinct()
        .run(context.conn);
      return await cursor.toArray();
    },
  },
};
