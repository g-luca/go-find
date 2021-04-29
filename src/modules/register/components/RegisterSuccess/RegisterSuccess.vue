<template>
  <div>
    <div class="flex justify-center">
      <img
        class="max-h-44 xl:max-h-64"
        src="@/assets/illustrations/register/register-success.svg"
        alt="Success"
      >
    </div>
    <div class="text-center pt-10 xl:pt-20">
      <h1 class="text-4xl xl:text-6xl dark:text-white">
        Welcome aboard @<span class="text-brand">{{ $store.state.RegisterModule.username }}</span>!
      </h1>
    </div>
    <div class="pt-10 w-1/2 mx-auto pb-10">
      <button class="bg-brand text-3xl rounded-2xl focus:outline-none text-white py-2 w-full">
        Let's start!
      </button>
    </div>
  </div>
</template>

<script lang="ts" src="./RegisterSuccess.ts"/>