import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ViewHome from "../views/ViewLanding.vue";
import ViewLogin from "@/views/ViewLogin/ViewLogin.vue";
import ViewRegister from "../views/ViewRegister/ViewRegister.vue";
import ViewProfile from "../views/ViewProfile/ViewProfile.vue";
import 'vue-router';
import { getModule } from "vuex-module-decorators";
import AuthModule, { AuthLevel } from "@/store/modules/AuthModule";
const authModule = getModule(AuthModule);

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean,
    hiddenWithAuth: boolean,
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: ViewHome,
    meta: { requiresAuth: false, hiddenWithAuth: false }
  },
  {
    path: "/login",
    name: "Log in",
    component: ViewLogin,
    meta: { requiresAuth: false, hiddenWithAuth: true }
  },
  {
    path: "/register",
    name: "Sign up",
    component: ViewRegister,
    meta: { requiresAuth: false, hiddenWithAuth: true }
  },
  {
    path: "/me",
    name: "Profile",
    component: ViewProfile,
    meta: { requiresAuth: true, hiddenWithAuth: false }
  },
  { // must be the last one
    path: "/:username([A-Za-z0-9_]{3,45}$)",
    name: "Profile",
    component: ViewProfile,
    meta: { requiresAuth: false, hiddenWithAuth: false }
  }, {
    path: "/:catchAll(.*)",
    component: ViewRegister, // TODO: change to Error 404
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
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const hiddenWithAuth = to.meta.hiddenWithAuth;

  console.log(requiresAuth);
  console.log(authModule.authLevel)
  // check authentication
  authModule.authenticate()
  if (requiresAuth && authModule.authLevel === AuthLevel.None) {
    next('/login');
  } else if (hiddenWithAuth && authModule.authLevel > AuthLevel.None) {
    next('/me');
  } else {
    next();
  }
});

export default router;
