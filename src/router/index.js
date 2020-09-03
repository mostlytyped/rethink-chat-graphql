import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home";
import ChatRoom from "@/views/ChatRoom";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", name: "Home", component: Home },
    { path: "/:roomId", name: "Room", component: ChatRoom },
  ],
});
