<template>
  <div>
    <AppHeader />
    <div class="min-h-screen justify-center bg-gray-100 dark:bg-gray-900 px-4 pb-2">
      <div class="pt-14 md:pt-44 w-full">
        <div class="lg:w-4/6 xl:w-1/2 mx-auto bg-gray-50 dark:bg-denim-900 p-4 rounded-3xl shadow-md">
          <div class="flex justify-center">
            <img
              class="max-h-28 w-auto"
              src="@/assets/brands/go-find/logo.svg"
              alt="Workflow"
            >
          </div>

          <div class="flex justify-center">
            <span
              v-if="$store.state.RegisterModule.currentState!=='StateRegistrationSuccess'"
              class="pl-4 my-auto text-5xl xl:text-7xl font-extrabold text-gray-900 dark:text-white"
            >
              Sign In
            </span>
          </div>
          <LoginFormUser v-if="$store.state.LoginModule.currentState==='StateELogin'" />
          <LoginFormMPassword v-if="$store.state.LoginModule.currentState==='StateMLogin'" />
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script lang="ts" src="./ViewLogin.ts"/>
