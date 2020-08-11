<template>
  <div class="chatroom">
    <ul id="chatlog">
      <li v-for="chat in chats" v-bind:key="chat.ts">
        <span class="timestamp">{{
          new Date(chat.ts).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })
        }}</span>
        <span class="user">{{ chat.user }}:</span>
        <span class="msg">{{ chat.msg }}</span>
      </li>
    </ul>
    <label id="username">
      Username:
      {{ user }}
    </label>
    <form v-on:submit.prevent="sendMessage">
      <input v-model="message" autocomplete="off" />
      <button>Send</button>
    </form>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "ChatRoom",
  data() {
    return {
      chats: [],
      message: "",
      user: window.username,
      handle: null,
    };
  },
  methods: {
    sendMessage() {
      const msg = this.message;
      this.$apollo.mutate({
        mutation: gql`
          mutation($user: String!, $msg: String!, $room: String!) {
            sendChat(user: $user, room: $room, message: $msg) {
              ts
            }
          }
        `,
        variables: {
          user: this.user,
          msg: msg,
          room: this.$route.params.roomId,
        },
      });
      this.message = "";
    },
  },
  apollo: {
    chats: {
      query: gql`
        query FetchChats($room: String!) {
          chats(room: $room) {
            msg
            user
            ts
          }
        }
      `,
      variables() {
        return {
          room: this.$route.params.roomId,
        };
      },
      subscribeToMore: {
        document: gql`
          subscription name($room: String!) {
            chatAdded(room: $room) {
              msg
              user
              ts
            }
          }
        `,
        variables() {
          return {
            room: this.$route.params.roomId,
          };
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          previousResult.chats.unshift(subscriptionData.data.chatAdded);
        },
      },
    },
  },
};
</script>

<style scoped lang="scss">
.chatroom {
  display: grid;
  height: 100%;
  max-width: 1200px;
  background-color: white;
  margin: 0 auto;
  grid-template-rows: auto 4em;
  grid-template-areas:
    "chatlog"
    "msgform";
  overflow: hidden;

  form {
    grid-area: msgform;
    border-top: 1px solid black;
    padding: 1em;
    display: flex;
    justify-content: space-between;
    background-color: lightskyblue;
    width: 100%;
    > * {
      margin: 0 5px;
    }
    input {
      flex-grow: 1;
      line-height: 2em;
      padding: 0.25em;
      border-radius: 5px;
    }
    button {
      padding: 0.25em 5em;
      font-weight: bold;
    }
  }

  #chatlog {
    grid-area: chatlog;
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column-reverse;
    overflow-y: auto;
    li {
      padding: 5px 10px;
      display: grid;
      grid-template-columns: 8em 5em auto;
      .timestamp {
        font-style: italic;
        color: #999;
      }
      .user {
        font-weight: bold;
      }
      &:nth-child(odd) {
        background-color: rgb(210, 225, 241);
      }
    }
  }

  #username {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    padding: 2em;
    background: white;
    border: 1px solid black;
  }
}
</style>
