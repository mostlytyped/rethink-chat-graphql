import Vue from "vue";
import Router from "vue-router";
import Main from "@/components/Main";
import ChatRoom from "@/components/ChatRoom";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main,
    },
    { path: "/:roomId", name: "room", component: ChatRoom },
  ],
});
