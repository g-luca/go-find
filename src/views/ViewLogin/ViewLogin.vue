<template>
  <div>
    <AppHeader />
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
            Sign In
          </span>
        </div>
      </div>
      <div class="pt-3 w-full">
        <div class="lg:w-4/6 mx-auto ">
          <LoginFormUser v-if="$store.state.LoginModule.currentState==='StateELogin'" />
          <LoginFormMPassword v-if="$store.state.LoginModule.currentState==='StateMLogin'" />
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script lang="ts" src="./ViewLogin.ts"/>
