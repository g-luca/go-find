<template>
  <div class="relative flex items-center lg:w-64 md:32 h-full group">
    <i class="bi bi-search absolute left-0 z-20 w-4 h-4 ml-4 mb-2 text-gray-400 pointer-events-none fill-current group-hover:text-gray-400" />
    <input
      ref="searchInput"
      v-model="searchUsername"
      type="text"
      class="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
      placeholder="Search"
      @input="search"
      @keyup.enter="directSearch"
    >
    <div class="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-lg sm:block">
      <span v-if="!showSearchResults">
        ⌘K
      </span>
      <span v-else>
        ⏎
      </span>
    </div>

    <div
      v-if="showSearchResults"
      class="relative inline-block text-left"
    >
      <div class="origin-top-right absolute right-0 mt-6 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
        <div
          class="py-1 "
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div
            class="block mx-2 px-2 py-2 text-md rounded-md cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
            role="menuitem"
          >
            <div
              v-if="$store.state.SearchModule.userSearchStatus && $store.state.SearchModule.user"
              class="flex-row gap-4 flex"
              @click="openProfile($store.state.SearchModule.user.username)"
            >
              <div class="flex-shrink-0">
                <a
                  href="#"
                  class="block relative"
                >
                  <span v-if="$store.state.SearchModule.user.profilePic">
                    <img
                      alt="profile pricture"
                      :src="$store.state.SearchModule.user.profilePic"
                      class="text-left object-cover rounded-full h-10 w-10 "
                    >
                  </span>
                </a>
              </div>
              <div class=" flex flex-col">
                <span class="text-gray-600 dark:text-white text-lg font-medium">
                  {{ $store.state.SearchModule.user.nickname }}
                </span>
                <span class="text-gray-400 text-xs">
                  @{{ $store.state.SearchModule.user.username }}
                </span>
              </div>
            </div>
            <div v-else-if="$store.state.SearchModule.userSearchStatus===0">
              Searching...
            </div>
            <div v-else>
              Nothing found
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" src="./SearchUser.ts"></script>