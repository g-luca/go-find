<template>
  <div>
    <AppHeader />
    <div class="w-full dark:bg-denim-900 bg-gray-50">
      <span v-if="$store.state.UserModule.userLoadingStatus>=0">
        <!-- Profile Heading -->
        <ProfileHeading />

        <!-- Profile App Links -->
        <ProfileAppLinks />

        <!-- <section>
          <div class="px-2 md:px-16 lg:mx-40 pt-8">
            <div class="py-2 md:py-8 px-2">
              <span v-if="$store.state.UserModule.userLoadingStatus">
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
              </span>
              <span v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
                  <div
                    v-for="loadingItem in [1,2,3,4,5]"
                    class="col-span-1"
                  >
                    <SkeletonLoader
                      shape="rectangle"
                      class="py-0 w-full h-14"
                    >{{ loadingItem }}</SkeletonLoader>
                  </div>
                </div>

              </span>
            </div>
          </div>
        </section> -->

        <section>
          <div class="pt-8" />
        </section>
      </span>
      <span v-else>
        <Error404 :message="'The user is not here'" />
      </span>
      <AppFooter />
    </div>
  </div>
</template>

<script lang="ts" src="./ViewProfile.ts"/>