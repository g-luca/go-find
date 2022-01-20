<template>
  <div>
    <Clipboard />
    <AppHeader />
    <div class="w-full bg-gradient-to-br to-purple-600 via-royalblue-800 from-royalblue-900 pt-14">
      <!-- Link is present in the URL -->
      <span v-if="link.length>0">
        <div class="min-h-screen h-screen">
          <img
            src="@/assets/illustrations/user/link-loading.svg"
            class="h-1/2 mx-auto"
          >
          <div class="pt-10">
            <h1 class="text-4xl md:text-7xl text-center text-white ">
              Skyrocketing to
              <span class="text-transparent bg-clip-text bg-gradient-to-br from-royalblue-200 via-royalblue-300 to-royalblue-400 font-bold capitalize">{{ link }}
              </span><br>
              <span class="text-brand font-medium"> @{{ $route.params['dtag'] }} </span>

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