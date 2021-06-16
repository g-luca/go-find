<template>
  <div>
    <AppHeader />
    <div class="pt-3 w-full dark:bg-denim-900 bg-gray-50">
      <!-- Profile Heading -->
      <section>
        <div class="grid grid-cols-12 pt-8">
          <div class="md:col-start-2 md:col-span-3 col-span-12 my-auto">
            <img
              alt="avatar"
              :src="$store.state.UserModule.user.profilePic"
              class="mx-auto object-cover rounded-full h-36 md:h-48 pointer-events-none select-none"
            >
          </div>
          <div class="md:col-start-5 md:col-span-7 col-span-12 my-auto pt-8">
            <div class="w-full text-center md:text-left dark:text-white">
              <div class="font-bold text-4xl">
                <h1>
                  {{ $store.state.UserModule.user.nickname }}
                </h1>
              </div>
              <div class="py-1">
                <h2 class="text-brand font-semibold text-lg">
                  @{{ $store.state.UserModule.user.username }}
                </h2>
                <div class="flex justify-center md:justify-start px-4 md:pl-0">
                  <div class="flex-none w-4">
                    <img
                      src="@/assets/brands/desmos/logo.svg"
                      class="object-cover w-4 inline-block"
                    >
                  </div>
                  <div class="flex-shrink font-mono text-sm mt-1 truncate px-2 dark:text-gray-400">
                    {{ $store.state.UserModule.user.address }}
                  </div>
                  <div class="flex-none w-4">
                    <i class="bi bi-clipboard text-blue-500 cursor-pointer" />
                  </div>
                </div>
              </div>
              <h4 class="dark:text-gray-300">
                {{ $store.state.UserModule.user.bio }}
              </h4>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="px-2 md:px-16 lg:mx-40 pt-16">
          <div class="py-2 md:py-8 px-2 bg-gray-100 dark:bg-gray-700 rounded-3xl">
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 text-center">
              <div
                v-for="socialIntegration in $store.state.UserModule.user.socialIntegrations"
                :key="socialIntegration"
                class="m-auto cursor-pointer"
              >
                <div class="bg-gray-200 dark:bg-gray-800 rounded-3xl w-16 h-16 md:w-20 md:h-20 m-auto">
                  <img
                    class="p-4 pointer-events-none select-none"
                    :src="socialIntegration._logo"
                    alt=""
                  >
                </div>
                <h4 class="dark:text-white select-none">
                  {{ socialIntegration._displayName }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="px-2 md:px-16 lg:mx-40 pt-8">
          <div class="py-2 md:py-8 px-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
              <div
                v-for="postLink in $store.state.UserModule.user.postLinks"
                :key="postLink"
                class="col-span-1 bg-gray-100 dark:bg-gray-700 rounded-3xl cursor-pointer py-4 ring-brand dark:ring-offset-denim-900 ring-offset-2 hover:ring-2"
              >
                <div class="flex px-4">
                  <h4 class="flex-1 dark:text-white select-none focus:underline font-semibold text-lg">
                    {{ postLink._displayName }}
                  </h4>
                  <i class="flex-none bi bi-arrow-right dark:text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="pt-8" />
      </section>
    </div>
    <AppFooter />
  </div>
</template>

<script lang="ts" src="./ViewProfile.ts"/>