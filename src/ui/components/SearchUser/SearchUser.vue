<template>
  <div class="relative flex items-center lg:w-64 md:32 h-full group">
    <i class="bi bi-search absolute left-0 z-20 w-4 h-4 ml-4 mb-2 text-gray-400 pointer-events-none fill-current group-hover:text-gray-400" />
    <input
      ref="searchInput"
      v-model="searchUsername"
      type="text"
      class="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
      placeholder="Search"
      @keyup.enter="search"
    >
    <div class="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-lg sm:block">
      ⌘K
    </div>
  </div>
</template>


<script lang="ts" src="./SearchUser.ts"></script>