<template>
  <div>
    <AppHeader />
    <div class="w-full dark:bg-denim-900 bg-gray-50">
      <span>
        <!-- Profile Heading -->
        <section>
          <div class="grid grid-cols-12">
            <div class="col-span-12 my-auto">
              <span v-if="$store.state.AccountModule.profileLoadingStatus">
                <img
                  alt="cover"
                  :src="$store.state.AccountModule.profile.profileCover || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='"
                  class="mx-auto object-cover w-full max-h-80 pointer-events-none select-none"
                >
                <img
                  alt="pic"
                  :src="$store.state.AccountModule.profile.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
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

        <section v-if="$store.state.AccountModule.isNewProfile">
          <div class="w-full px-4 pt-4">
            <div class="py-6 border-2 border-red-700 rounded-3xl dark:text-white text-center bg-gray-100 shadow-lg dark:bg-gray-800">
              <h1 class="text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold text-5xl"> <i class="bi bi-exclamation-circle-fill text-red-600" /> Your Profile is not saved on chain</h1>
              <p class="text-lg pt-2 text-gray-600 dark:text-gray-400">
                To save your profile you need to edit and save at least one field of your profile details (nickname, pictures, bio)
              </p>
            </div>
          </div>
        </section>

        <span v-if="$store.state.AccountModule.profile">
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
              <AccountChainLinks v-if="!$store.state.AccountModule.isNewProfile" />
            </div>
          </div>

          <!-- Application Links -->
          <AccountAppLinks v-if="!$store.state.AccountModule.isNewProfile" />
        </span>

      </span>
      <AppFooter class="mt-8" />
    </div>
    <ModalTransaction />
  </div>
</template>

<script lang="ts" src="./ViewAccount.ts"/>