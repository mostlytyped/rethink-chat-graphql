<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
@import url(//fonts.googleapis.com/css?family=Roboto:wght@300;400&display=swap);

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-size: 16px;
  font-family: Roboto, sans;
  background-color: #eee;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>
