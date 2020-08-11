const rdbHost = process.env.RETHINKDB_HOST;
const rdbPort = process.env.RETHINKDB_PORT;
const rdbName = process.env.RETHINKDB_NAME;
const rdbUser = process.env.RETHINKDB_USERNAME;
const rdbPass = process.env.RETHINKDB_PASSWORD;

const rethink = require("rethinkdb");
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
    console.log("Lorem bot started");
    rethink
      .table("chats")
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
            rethink
              .table("chats")
              .insert({
                user: "lorem",
                msg: lorem.generateWords(num),
                roomId: row.new_val.roomId,
                ts: Date.now(),
              })
              .run(conn, function (err, res) {
                if (err) throw err;
              });
          }
        });
      });
  }
);
