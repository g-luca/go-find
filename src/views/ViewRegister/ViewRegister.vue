<template>
  <div>
    <div class="min-h-screen justify-center bg-gray-50 dark:bg-denim-900 px-4 pb-2">
      <div class="w-full space-y-8 pt-20 pb-10 ">
        <div class="flex justify-center">
          <img
            class="max-h-28 w-auto"
            src="@/assets/brands/go-find/logo.svg"
            alt="Workflow"
          >
          <span
            v-if="$store.state.RegisterModule.currentState!=='StateRegistrationSuccess'"
            class="pl-4 my-auto text-5xl xl:text-7xl font-extrabold text-gray-900 dark:text-white"
          >
            Sign Up
          </span>
        </div>
      </div>
      <div class="pt-3 w-full">
        <div class="lg:w-4/6 mx-auto ">
          <RegisterFormUser v-if="$store.state.RegisterModule.currentState==='StateUserInput'" />
          <RegisterNewWallet v-if="$store.state.RegisterModule.currentState==='StateWalletGeneration'" />
          <RegisterSuccess v-if="$store.state.RegisterModule.currentState==='StateRegistrationSuccess'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ViewRegister.ts"/>
