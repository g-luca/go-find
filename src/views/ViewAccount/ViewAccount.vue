<template>
  <div>
    <AppHeader />
    <div class="w-full dark:bg-denim-900 bg-gray-50">
      <span>
        <!-- Profile Heading -->
        <section>
          <div class="grid grid-cols-12">
            <div class="col-span-12 my-auto">
              <span v-if="$store.state.AccountModule.userLoadingStatus">
                <img
                  alt="cover"
                  :src="$store.state.AccountModule._user.profileCover || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='"
                  class="mx-auto object-cover w-full max-h-80 pointer-events-none select-none"
                >
                <img
                  alt="pic"
                  :src="$store.state.AccountModule._user.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
                  class="mx-auto object-cover rounded-full h-44 w-44 md:h-56 md:w-56 pointer-events-none select-none -mt-32"
                >
              </span>

              <span v-else>
                <SkeletonLoader
                  shape="circle"
                  class="mx-auto object-cover rounded-full h-36 md:h-48 w-36 md:w-48 pointer-events-none select-none"
                />
              </span>
            </div>
          </div>
        </section>

        <!-- Content -->
        <div class="grid grid-cols-12 pt-8 mx-4">

          <!-- Profile Edit -->
          <div class="col-span-12 lg:col-span-6 px-4 md:px-10 bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl">
            <AccountProfileEdit />
          </div>

          <!-- Account  -->
          <div class="col-span-12 lg:col-span-6 lg:mx-4">

            <!-- Balance -->
            <AccountBalance />

            <!-- Chain Links -->
            <AccountChainLinks />
          </div>
        </div>

        <!-- Application Links -->
        <div class="grid grid-cols-12 pt-8">
          <div class="col-span-12 mx-4">
            <section v-if="$store.state.AccountModule.userLoadingStatus==0||$store.state.AccountModule.userLoadingStatus">
              <span v-if="$store.state.AccountModule.userLoadingStatus">
                <div class="pt-2 pb-3 md:pt-6 px-2 bg-white dark:bg-gray-700 rounded-3xl shadow-xl hover:shadow-2xl">
                  <h1 class="pb-8 pl-4 text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold">
                    Social Networks
                  </h1>
                  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 text-center">
                    <div
                      v-for="applicationLink in $store.state.AccountModule._user.applicationLinks"
                      :key="applicationLink"
                      class="m-auto cursor-pointer"
                    >
                      <div class="bg-gray-200 dark:bg-gray-800 rounded-3xl w-16 h-16 md:w-20 md:h-20 m-auto hover:bg-gray-300 dark:hover:bg-gray-900 shadow-md">
                        <img
                          class="p-4 pointer-events-none select-none"
                          :src="applicationLink.logo"
                          alt=""
                        >
                      </div>
                      <h4 class="dark:text-white select-none pt-1 text-xl font-medium">
                        {{ applicationLink.displayName }}
                      </h4>
                    </div>
                  </div>
                  <div class="w-full pt-5 px-2">
                    <button class="bg-brand hover:bg-yellow-600 w-full rounded-xl py-3 text-xl font-bold text-white">Add Social</button>
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
            </section>
          </div>
        </div>

      </span>
      <AppFooter class="mt-8" />
    </div>
    <ModalTransaction />
  </div>
</template>

<script lang="ts" src="./ViewAccount.ts"/>