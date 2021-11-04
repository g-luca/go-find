<template>
  <div>
    <Clipboard />
    <AppHeader />
    <div class="w-full dark:bg-denim-900 bg-gray-50">
      <!-- Link is present in the URL -->
      <span v-if="link.length>0">
        <div class="min-h-screen h-screen">
          <img
            src="@/assets/illustrations/user/link-loading.svg"
            class="h-1/2 mx-auto"
          >
          <div class="pt-10">
            <h1 class="text-4xl md:text-7xl text-center dark:text-white ">
              Skyrocketing to
              <span class="text-brand font-semibold"> @{{ $route.params['dtag'] }} </span><br>
              <span class="text-transparent bg-clip-text bg-gradient-to-br from-royalblue-400 via-royalblue-500 to-royalblue-700 font-bold capitalize">{{ link }}
              </span>
            </h1>
          </div>
        </div>
      </span>
      <span v-else>
        <span v-if="$store.state.ProfileModule.profileLoadingStatus>=0">
          <!-- Profile Heading -->
          <ProfileHeading />

          <!-- Profile App Links -->
          <ProfileAppLinks />

        </span>
        <span v-else>
          <Error404 :message="'The user is not here'" />
        </span>
      </span>

      <AppFooter class="mt-16" />
    </div>
  </div>
</template>

<script lang="ts" src="./ViewProfile.ts"/>