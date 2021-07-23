<template>
  <section>
    <!-- Profile Cover -->
    <div>
      <div class="grid grid-cols-12">
        <div class="col-span-12 my-auto">
          <span v-if="$store.state.UserModule.userLoadingStatus">
            <img
              alt="cpver"
              :src="$store.state.UserModule.user.profileCover || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='"
              class="mx-auto object-cover h-64 lg:h-96 w-full pointer-events-none select-none"
            >
          </span>
          <span v-else>
            <!-- Loading -->
            <SkeletonLoader
              shape="rectangle"
              class="mx-auto object-cover h-72 w-full pointer-events-none select-none"
            />
          </span>
        </div>
      </div>
    </div>

    <!-- Profile Pic -->
    <div class=" -mt-36">
      <div class="grid grid-cols-12">
        <div class="md:col-start-2 lg:col-start-3 md:col-span-3 col-span-12 my-auto mt-8">
          <span v-if="$store.state.UserModule.userLoadingStatus">
            <img
              alt="avatar"
              :src="$store.state.UserModule.user.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
              class="mx-auto object-cover rounded-full h-44 w-44 md:h-56 md:w-56 pointer-events-none select-none shadow-sm md:shadow-2xl"
            >
          </span>
          <span v-else>
            <!-- Loading -->
            <SkeletonLoader
              shape="circle"
              class="mx-auto object-cover rounded-full h-44 w-44 md:h-56 md:w-56 pointer-events-none select-none"
            />
          </span>
        </div>

        <!-- User Info -->
        <div class="md:col-start-6 md:col-span-5 lg:col-span-4 col-span-12 my-auto pt-4 md:pt-8">
          <div class="md:w-full text-center md:text-left dark:text-gray-100 bg-gray-50 md:bg-white dark:bg-denim-900 md:bg-gray-50 md:dark:bg-gray-900 md:bg-opacity-95 backdrop-grayscale md:shadow-xl rounded-2xl md:pl-7 py-2 md:py-6">
            <span v-if="$store.state.UserModule.userLoadingStatus">
              <div class="font-bold text-5xl">
                <h1>
                  {{ $store.state.UserModule.user.nickname }}
                </h1>
              </div>
              <div class="py-2">
                <h2 class="text-brand font-semibold text-3xl">
                  @{{ $store.state.UserModule.user.username }}
                </h2>
                <div class="flex justify-center md:justify-start px-4 md:pl-0 pb-2 pt-1">
                  <div class="flex-none w-5">
                    <img
                      src="@/assets/brands/desmos/logo.svg"
                      class="object-cover w-5 inline-block"
                    >
                  </div>
                  <div class="flex-shrink font-mono text-md mt-1 truncate px-2 dark:text-gray-400">
                    {{ $store.state.UserModule.user.address }}
                  </div>
                  <div
                    v-if="canCopy"
                    class="flex-none w-5"
                    @click="copyAddress($store.state.UserModule.user.address)"
                  >
                    <i class="bi bi-clipboard text-blue-500 cursor-pointer" />
                  </div>
                </div>
              </div>
              <h4 class="dark:text-gray-300">
                {{ $store.state.UserModule.user.bio }}
              </h4>
            </span>
            <span v-else>
              <!-- Loading -->
              <SkeletonLoader
                shape="rectangle"
                class="py-1 text-left w-full md:w-1/2 h-12 px-4"
              />
              <SkeletonLoader
                shape="rectangle"
                class="py-1 text-left w-full md:w-2/5 h-10 px-4"
              />
              <SkeletonLoader
                shape="rectangle"
                class="py-1 text-left w-full md:w-5/6 h-10 px-4"
              />
              <SkeletonLoader
                shape="rectangle"
                class="py-1 text-left w-full md:w-4/6 h-24 px-4"
              />

            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script lang="ts" src="./ProfileHeading.ts"/>