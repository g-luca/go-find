<template>
  <span>
    <header class="w-full shadow-lg bg-white dark:bg-gray-900 items-center h-16">
      <div class="relative z-40 flex flex-col justify-center h-full px-3 mx-auto flex-center">
        <div class="relative items-center pl-1 flex w-full lg:max-w-68 sm:pr-2 sm:ml-0">
          <!-- Logo -->
          <div class="relative p-1 flex items-center justify-start mr-4 sm:mr-0 sm:left-auto">
            <router-link
              class="block relative w-10"
              to="/"
            >
              <div class="flex">
                <img
                  src="@/assets/brands/go-find/logo.svg"
                  class="mx-auto object-cover h-10 w-10 rounded-full"
                >
                <span class=" hidden md:block my-auto ml-1 px-2 md:px-4 py-0.5 text-white font-medium text-lg rounded-xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700">
                  Beta
                </span>
              </div>
            </router-link>
          </div>

          <div class="container relative z-0 flex h-full justify-end">
            <!-- <ToggleTheme class="ml-4 my-auto" /> -->

            <!-- Search bar -->
            <SearchUser class="" />

            <span v-if="$store.state.AuthModule._authLevel>0">
              <Menu
                as="div"
                class="block relative pl-2 pt-1 inline-block text-left"
              >
                <div>
                  <MenuButton class="">
                    <img
                      :src="$store.state.AccountModule.profile._profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
                      class="mx-auto object-cover h-10 w-10 rounded-full"
                    >
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems class="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white dark:bg-gray-900  ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="py-1 text-lg font-medium">

                      <MenuItem
                        v-slot="{ active }"
                        class="mx-2 my-1 rounded-xl"
                      >
                      <router-link
                        to="/me"
                        :class="[active ? 'bg-gray-100 dark:bg-denim-900 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-100', 'block px-4 py-2 text-md']"
                      >
                        <i class="bi bi-person-circle mr-2" /> Your Profile
                      </router-link>
                      </MenuItem>

                      <MenuItem v-slot="{ active }">
                      <ToggleTheme :active="active" />
                      </MenuItem>

                      <MenuItem
                        v-slot="{ active }"
                        class="mx-2 my-1 rounded-xl"
                      >
                      <a
                        href="#"
                        :class="[active ? 'bg-gray-100 dark:bg-denim-900 text-red-500' : 'text-gray-700 dark:text-gray-100', 'block px-4 py-2 text-md']"
                        @click="logout()"
                      ><i class="bi bi-arrow-left-circle-fill mr-2" /> Logout</a>
                      </MenuItem>

                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </span>
          </div>
        </div>
      </div>
    </header>
    <div
      v-if="isTestnet"
      class="w-full shadow-lg bg-red-500 dark:bg-red-500 text-white text-center"
    >
      <h1 class="py-2">
        <i class=" font-semibold">morpheus-apollo-2</i> testnet environment
      </h1>
    </div>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ToggleTheme from "@/ui/components/ToggleTheme/ToggleTheme.vue";
import SearchUser from "../SearchUser/SearchUser.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
import router from "@/router";
import WalletConnectModule from "@/store/modules/WalletConnectModule";
const authModule = getModule(AuthModule);
const walletConnectModule = getModule(WalletConnectModule);

export default defineComponent({
  components: {
    ToggleTheme,
    SearchUser,

    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
  },
  data() {
    const isTestnet = process.env.VUE_APP_IS_TESTNET === "true";
    return {
      isTestnet,
    };
  },
  methods: {
    logout() {
      if (authModule.account?.isUsingWalletConnect) {
        walletConnectModule.logout();
      }
      authModule.logout();
      router.push("/");
    },
  },
});
</script>