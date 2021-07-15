<template>
  <div>
    <div class="min-w-screen flex items-center md:p-20 overflow-hidden relative">
      <div class="flex-1 min-h-full min-w-full md:rounded-3xl bg-gray-50 dark:bg-gray-900 shadow-2xl p-0 md:pl-20 text-gray-800 relative md:flex items-center text-center md:text-left">
        <div class="w-full md:w-1/2 pt-20 lg:pt-0">
          <div class=" text-gray-600 font-light p-1 md:p-0">
            <h1 class="font-extrabold uppercase text-6xl lg:text-8xl text-brand md:mb-5">
              don't panic
            </h1>
            <h2 class="text-2xl lg:text-4xl dark:text-white font-bold ">
              {{ message }}
            </h2>
          </div>
          <div class="mb-20 pt-10 md:mb-0">
            <router-link
              to="/"
              class="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-150 text-brand hover:text-yellow-600"
            >
              <i class="bi bi-arrow-left" /> Back to Earth
            </router-link>
          </div>
        </div>
        <div class="w-full text-center">
          <img
            class="text-center mx-auto my-auto align-middle rounded-r-3xl"
            src="@/assets/illustrations/user/user-not-found.svg"
            alt=""
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./Error404.ts"/>