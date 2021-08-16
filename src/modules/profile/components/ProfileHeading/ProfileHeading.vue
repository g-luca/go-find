<template>
  <section>
    <!-- Profile Cover -->
    <div>
      <div class="grid grid-cols-12">
        <div class="col-span-12 my-auto">
          <span v-if="$store.state.ProfileModule.profileLoadingStatus">
            <img
              alt="cover"
              :src="$store.state.ProfileModule.profile.profileCover || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='"
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
          <span v-if="$store.state.ProfileModule.profileLoadingStatus">
            <img
              alt="avatar"
              :src="$store.state.ProfileModule.profile.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
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
          <div class="md:w-full text-center md:text-left dark:text-gray-100 bg-gray-50 md:bg-white dark:bg-denim-900 md:bg-gray-50 md:dark:bg-gray-900 md:bg-opacity-95 backdrop-grayscale md:shadow-2xl rounded-2xl md:pl-7 py-2 md:py-6">
            <span v-if="$store.state.ProfileModule.profileLoadingStatus">
              <div class="font-bold text-5xl">
                <h1>
                  {{ $store.state.ProfileModule.profile.nickname }}
                </h1>
              </div>
              <div class="py-2">
                <h2 class="text-brand font-semibold text-3xl">
                  @{{ $store.state.ProfileModule.profile.dtag }}
                </h2>
                <div class="flex justify-center md:justify-start px-4 md:pl-0 pb-2 pt-1">
                  <div class="flex-none w-5">
                    <img
                      src="@/assets/brands/desmos/logo.svg"
                      class="object-cover w-5 inline-block"
                    >
                  </div>
                  <div class="flex-shrink font-mono text-md mt-1 truncate px-2 dark:text-gray-400">
                    {{ $store.state.ProfileModule.profile.address }}
                  </div>
                  <div
                    v-if="canCopy"
                    class="flex-none w-5"
                    @click="copyAddress($store.state.ProfileModule.profile.address)"
                  >
                    <i class="bi bi-clipboard text-blue-500 cursor-pointer" />
                  </div>
                </div>
              </div>
              <h4 class="dark:text-gray-300">
                {{ $store.state.ProfileModule.profile.bio }}
              </h4>

              <div
                v-if="$store.state.ProfileModule.profile.chainLinks.length>0"
                class="pt-2"
              >
                <h3 class="text-xl font-bold text-indigo-700">
                  Connected Blockchains
                </h3>
                <div class="grid grid-cols-12 gap-3 text-center">
                  <div
                    v-for="chainLink in $store.state.ProfileModule.profile.chainLinks"
                    class="col-span-12 lg:col-span-6 bg-indigo-50 dark:bg-indigo-900 rounded-2xl mx-4 md:mx-0 md:mr-4 py-1"
                  >
                    <div class="grid grid-cols-12">
                      <div class="col-span-2 my-auto">
                        <div class="rounded-full w-10 h-10 md:w-10 md:h-10 m-auto">
                          <img
                            class="p-2 pointer-events-none select-none"
                            :src="getChainLogo(chainLink.chain)"
                            alt=""
                          >
                        </div>
                      </div>
                      <div class="col-span-10">
                        <h4 class="dark:text-white select-none text-lg font-medium capitalize text-left">
                          {{ chainLink._chain }}
                        </h4>
                        <!-- 
                        <h4 class="dark:text-white select-none text-sm font-light text-left truncate">
                        </h4> -->
                        <h4 class="flex dark:text-white select-none text-sm font-light text-left">
                          <span class="flex-1 truncate">
                            {{ chainLink._address }}
                          </span>
                          <span
                            v-if="canCopy"
                            class="flex-none mr-4 w-5"
                            @click="copyAddress(chainLink._address)"
                          >
                            <i class="bi bi-clipboard text-blue-500 cursor-pointer" />
                          </span>
                        </h4>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
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