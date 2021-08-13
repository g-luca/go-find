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
        <AccountAppLinks />

      </span>
      <AppFooter class="mt-8" />
    </div>
    <ModalTransaction />
  </div>
</template>

<script lang="ts" src="./ViewAccount.ts"/>