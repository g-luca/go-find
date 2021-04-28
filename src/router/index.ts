import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import ViewHome from "../views/ViewLanding.vue";
import ViewLanding from "../views/ViewLanding.vue";
import ViewRegister from "../views/ViewRegister/ViewRegister.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: ViewHome,
  },
  {
    path: "/login",
    name: "Log in",
    component: ViewLanding,
  },
  {
    path: "/register",
    name: "Sign up",
    component: ViewRegister,
  },
  /* {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () =>
    //  import( webpackChunkName: "about" "../views/ViewAbout.vue"),
  }, */
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
