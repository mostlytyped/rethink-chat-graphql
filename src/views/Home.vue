<template>
  <div class="main">
    <form v-on:submit.prevent="gotoRoom">
      <label>
        Username:
        <input v-model="user" type="text" />
      </label>
      <label>
        Room:
        <input v-model="room" type="text" />
      </label>
      <button>Join</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      user: window.username,
      room: "lobby",
    };
  },
  methods: {
    gotoRoom() {
      window.username = this.user;
      this.$router.push({
        name: "Room",
        params: { roomId: this.room },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  form {
    background-color: white;
    height: 20em;
    width: 40em;
    padding: 5em;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    label {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 1.5em;
    }
    button {
      font-size: 1.5em;
      width: 5em;
      margin: 0 0 0 auto;
    }
    input {
      line-height: 1.5em;
      width: 25em;
    }
  }
}
</style>
