<template>
  <section>
    <div class="px-2 md:px-16 lg:mx-40 pt-8 md:py-12">
      <span v-if="$store.state.ProfileModule.profileLoadingStatus">
        <h1 class="pb-4 pl-4 text-4xl md:text-6xl text-brand font-extrabold">
          Social Networks
        </h1>
        <div class="py-2 md:py-z px-2 bg-gray-100 dark:bg-gray-700 rounded-3xl shadow-xl">
          <span v-if="$store.state.ProfileModule.profile.applicationLinks.length>0&&validApplicationLinks.length>0">
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 text-center">
              <div
                v-for="applicationLink in validApplicationLinks"
                :key="applicationLink"
                class="m-auto cursor-pointer"
                @click="openApplicationLink(applicationLink)"
              >
                <div class="bg-gray-200 dark:bg-gray-800 rounded-3xl w-16 h-16 md:w-20 md:h-20 m-auto hover:bg-gray-300 dark:hover:bg-gray-900 shadow-md">
                  <img
                    class="p-4 pointer-events-none select-none"
                    :src="applicationLink.logo"
                    alt=""
                  >
                </div>
                <h4 class="dark:text-white select-none pt-1 text-xl font-medium has-tooltip">
                  {{ applicationLink.displayName }}
                  <span
                    class="text-sm font-light text-white tooltip ml-0.5 py-0.5 text-left dark:bg-gray-800 bg-gray-500 px-2 rounded-xl"
                    v-if="applicationLink.name!=='domain'"
                  >
                    {{applicationLink.username}}
                  </span>
                </h4>
              </div>
            </div>
          </span>
          <span v-else>
            <div class="px-2 py-2 w-full ">
              <h4 class="text-3xl text-center dark:text-white font-bold">
                Wow, such empty
              </h4>
              <h5 class="text-lg text-gray-700 dark:text-gray-300 text-center">
                <span class="font-bold">
                  {{ $store.state.ProfileModule.profile.dtag }}
                </span> has not connected any Social Network
              </h5>
            </div>
          </span>
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