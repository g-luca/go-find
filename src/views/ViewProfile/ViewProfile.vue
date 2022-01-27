<template>
  <div>
    <Clipboard />
    <AppHeader />
    <!-- Link is present in the URL -->
    <span v-if="requestedLink.length>0">
      <div class="w-full bg-gradient-to-br to-purple-600 via-royalblue-800 from-royalblue-900 pt-14">
        <div class="min-h-screen h-screen">
          <img
            src="@/assets/illustrations/user/link-loading.svg"
            class="h-1/2 mx-auto"
          >
          <div class="pt-10">
            <h1 class="text-4xl md:text-7xl text-center text-white ">
              Skyrocketing to <span class="text-brand font-medium pr-3"> @{{ $route.params['dtag'] }} </span>
              <span class="text-transparent bg-clip-text bg-gradient-to-br from-royalblue-200 via-royalblue-300 to-royalblue-400 font-bold capitalize">{{ requestedLink }}
              </span>

              <div
                v-if="matchedLinks.length>1"
                class="pt-6"
              >
                <div
                  v-for="appLink of matchedLinks"
                  class="rounded-xl shadow-2xl my-6 py-4 bg-gradient-to-br hover:bg-gradient-to-tl from-black-900 via-royalblue-900 to-blue-900 text-white text-center text-2xl w-2/4 lg:w-1/4 mx-auto cursor-pointer"
                  @click="redirectTo(appLink)"
                >
                  @{{appLink.username}}
                </div>

              </div>

            </h1>
          </div>
        </div>
      </div>
    </span>
    <span v-else>
      <div class="w-full dark:bg-denim-900 bg-gray-50">
        <span v-if="$store.state.ProfileModule.profileLoadingStatus>=0">
          <!-- Profile Heading -->
          <ProfileHeading />

          <!-- Profile App Links -->
          <ProfileAppLinks />

        </span>
        <span v-else>
          <Error404 :message="'The user is not here'" />
        </span>
      </div>
    </span>

    <AppFooter />
  </div>
</template>

<script lang="ts" src="./ViewProfile.ts"/>