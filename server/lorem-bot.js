// server/lorem-bot.js

const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

// Run Lorem bot
const runBot = function(conn) {
  console.log("Lorem bot started");
  r.table("chats")
    .changes()
    .run(conn, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, row) => {
        const msg = row.new_val.msg.trim().split(/\s+/);
        if (msg[0] === "@lorem") {
          let num = 10;
          if (msg.length >= 1) {
            num = parseInt(msg[1]) || num;
          }
          r.table("chats")
            .insert({
              user: "lorem",
              msg: lorem.generateWords(num),
              roomId: row.new_val.roomId,
              ts: Date.now(),
            })
            .run(conn, function(err, res) {
              if (err) throw err;
            });
        }
      });
    });
};

// Connect to RethinkDB
const r = require("rethinkdb");
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
      setTimeout(rdbConnect, 10 * 1000); // reconnect in 10s
    });

    // Start the lorem bot
    runBot(conn);
  } catch (err) {
    throw err;
  }
};
rdbConnect();
