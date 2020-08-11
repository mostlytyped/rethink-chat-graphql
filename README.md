# Rethink Chat

A NodeJS+Vue chat app using RethinkDB and GraphQL.
It features a bot for your entertainment, address it with `@lorem`.

Find it running at https://rethink-chat-graphql.herokuapp.com/

## Build frontend

```
npm run build
```

## Run migrations

```
node server/migrate.js
```

## Run lorem bot

```
node server/lorem-bot.js
```

## Run app

```
node server/index.js
```

## Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

_Note: deploy button seems to currently not work (probably because addon is in alpha)._

```
heroku create
heroku addons:add rethinkdb
git push heroku master
```

_Note: the lorem bot needs to be enabled manually on the apps resources dashboard_
