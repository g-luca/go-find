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
          <SearchUser class="" />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" src="./AppHeader.ts"></script>