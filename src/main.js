import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import apolloProvider from "./graphql";

Vue.config.productionTip = false;

// Initialize random username
window.username = Math.random()
  .toString(36)
  .substring(2, 8);

// Create and mount Vue app
new Vue({
  router,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
