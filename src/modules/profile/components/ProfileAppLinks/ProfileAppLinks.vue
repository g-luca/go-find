<template>
  <section>
    <div class="px-2 md:px-16 lg:mx-40 pt-8 md:pt-16">
      <span v-if="$store.state.UserModule.userLoadingStatus">
        <div class="py-2 md:py-8 px-2 bg-gray-100 dark:bg-gray-700 rounded-3xl">
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 text-center">
            <div
              v-for="applicationLink in $store.state.UserModule.user.applicationLinks"
              :key="applicationLink"
              class="m-auto cursor-pointer"
            >
              <div class="bg-gray-200 dark:bg-gray-800 rounded-3xl w-16 h-16 md:w-20 md:h-20 m-auto">
                <img
                  class="p-4 pointer-events-none select-none"
                  :src="applicationLink.logo"
                  alt=""
                >
              </div>
              <h4 class="dark:text-white select-none pt-1  text-xl">
                {{ applicationLink.displayName }}
              </h4>
            </div>
          </div>
        </div>
      </span>
      <span v-else>
        <!-- Loading -->
        <SkeletonLoader
          shape="rectangle"
          class="py-1 text-left w-full h-32 px-2"
        />

      </span>
    </div>
  </section>
</template>


<script lang="ts" src="./ProfileAppLinks.ts"/>