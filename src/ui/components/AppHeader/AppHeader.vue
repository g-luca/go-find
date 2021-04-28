<template>
  <header class="w-full shadow-lg bg-white dark:bg-gray-900 items-center h-16 z-40">
    <div class="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
      <div class="relative items-center pl-1 flex w-full lg:max-w-68 sm:pr-2 sm:ml-0">
        <!-- Logo -->
        <div class="relative p-1 flex items-center justify-start mr-4 sm:mr-0 sm:left-auto">
          <router-link
            class="block relative w-10"
            to="/"
          >
            <img
              src="@/assets/brands/go-find/logo.svg"
              class="mx-auto object-cover h-10 w-10 rounded-full"
            >
          </router-link>
        </div>

        <div class="container relative z-50 flex h-full justify-end">
          <ToggleTheme class="ml-4 my-auto" />

          <!-- Search bar -->
          <div class="relative flex items-center lg:w-64 md:32 h-full group">
            <i class="bi bi-search absolute left-0 z-20 w-4 h-4 ml-4 mb-2 text-gray-400 pointer-events-none fill-current group-hover:text-gray-400" />
            <input
              type="text"
              class="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
              placeholder="Search"
            >
            <div class="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-lg sm:block">
              ⌘K
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" src="./AppHeader.ts"></script>