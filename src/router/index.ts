import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import 'vue-router';
import ViewHome from "../views/ViewLanding.vue";
import ViewLogin from "@/views/ViewLogin/ViewLogin.vue";
import ViewRegister from "../views/ViewRegister/ViewRegister.vue";
import ViewProfile from "../views/ViewProfile/ViewProfile.vue";
import ViewAccount from "../views/ViewAccount/ViewAccount.vue";
import ViewKeplr from "../views/ViewKeplr.vue";
import ViewWalletConnect from "../views/ViewWalletConnect.vue";

import ViewError404 from "../views/errors/ViewError404/ViewError404.vue";

import { getModule } from "vuex-module-decorators";
import AuthModule, { AuthLevel } from "@/store/modules/AuthModule";
import KeplrModule from "@/store/modules/KeplrModule";
const authModule = getModule(AuthModule);
const keplrModule = getModule(KeplrModule);

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
    meta: { requiresAuth: false, hiddenWithAuth: true }
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
    path: "/login/keplr",
    name: "Sign with Keplr",
    component: ViewKeplr,
    meta: { requiresAuth: false, hiddenWithAuth: true }
  },
  {
    path: "/login/walletconnect",
    name: "Sign with WalletConnect",
    component: ViewWalletConnect,
    meta: { requiresAuth: false, hiddenWithAuth: true }
  },
  {
    path: "/me",
    name: "My Profile",
    component: ViewAccount,
    meta: { requiresAuth: true, hiddenWithAuth: false }
  }, {
    path: "/:dtag/:link?",
    name: "Profile",
    component: ViewProfile,
    meta: { requiresAuth: false, hiddenWithAuth: false }
  },
  {
    path: "/:catchAll(.*)",
    component: ViewError404, // TODO: change to Error 404
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const hiddenWithAuth = to.meta.hiddenWithAuth;

  // check authentication
  authModule.authenticate();
  keplrModule.init();

  if (requiresAuth && authModule.authLevel === AuthLevel.None) {
    next('/login');
  } else if (hiddenWithAuth && authModule.authLevel > AuthLevel.None) {
    next('/me');
  } else {
    next();
  }
});

export default router;
