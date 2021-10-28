<template>
  <div class="p-4 pr-8">
    <section v-if="$store.state.AccountModule.profileLoadingStatus==0||$store.state.AccountModule.profileLoadingStatus">
      <span v-if="$store.state.AccountModule.profileLoadingStatus">
        <div class="pt-2 pb-3 md:pt-6 px-2 bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl">
          <h1 class="pb-8 pl-4 text-5xl md:text-6xl text-brand font-extrabold">
            Social Networks
          </h1>
          <span v-if="$store.state.AccountModule.profile.applicationLinks&&$store.state.AccountModule.profile.applicationLinks.length>0">
            <div class="grid grid-cols-12">
              <div class="col-span-12 mx-4">
                <div class="pt-2 pb-3 md:pt-6 px-2 bg-gray-100 dark:bg-denim-900 dark:bg-gray-700 rounded-3xl shadow-xl">
                  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 text-center">
                    <div
                      v-for="applicationLink in $store.state.AccountModule.profile.applicationLinks"
                      :key="applicationLink"
                      class="m-auto cursor-pointer"
                    >
                      <div class="bg-gray-200 dark:bg-gray-800 rounded-3xl w-16 h-16 md:w-20 md:h-20 m-auto hover:bg-gray-300 dark:hover:bg-gray-900 shadow-md">
                        <!-- Delete -->
                        <span class="absolute -mt-2 md:-mt-3">
                          <i
                            class="bi bi-dash-circle-fill text-gray-500 hover:text-red-600 text-2xl -ml-12 md:-ml-16"
                            @click="deleteApplicationLink(applicationLink)"
                          />
                        </span>

                        <!-- State indicators -->
                        <span class="absolute -mt-2 md:-mt-3 ml-5">

                          <!-- State Loading -->

                          <span
                            v-if="applicationLink.state==='APPLICATION_LINK_STATE_VERIFICATION_STARTED'|| applicationLink.state==='APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED' || applicationLink.state===0"
                            class="flex h-4 w-4 pt-1 md:pt-2 -ml-2 md:-ml-0"
                          >
                            <span class="animate-ping absolute h-4 w-4 inline-flex rounded-full bg-blue-400 opacity-75" />
                            <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-500" />
                          </span>

                          <!-- State Error -->
                          <i
                            v-if="applicationLink.state==='APPLICATION_LINK_STATE_VERIFICATION_ERROR' || applicationLink.state==='APPLICATION_LINK_STATE_TIMED_OUT' || applicationLink.state==='UNRECOGNIZED'"
                            class="bi bi-exclamation-circle-fill text-red-500 text-2xl cursor-default"
                          />
                        </span>
                        <img
                          class="p-4 pointer-events-auto select-none mb-4"
                          :src="applicationLink.logo"
                          alt=""
                          @click="openApplicationLink(applicationLink)"
                        >

                      </div>
                      <h4 class="dark:text-white select-none pt-1 text-xl font-medium">
                        {{ applicationLink.displayName }}
                      </h4>
                    </div>
                    <div class="m-auto cursor-pointer">
                      <div
                        class="bg-gray-200 dark:bg-gray-800 rounded-3xl w-16 h-16 md:w-20 md:h-20 m-auto hover:bg-gray-300 dark:hover:bg-gray-900 shadow-md p-4"
                        @click="toggleApplicationLinkEditor()"
                      >
                        <div class="bg-brand rounded-full text-2xl md:text-4xl font-bold text-white">
                          <i class="bi bi-plus align-middle h-full m-auto" />
                        </div>
                      </div>
                      <h4 class="dark:text-white select-none pt-1 text-xl font-medium">
                        New
                      </h4>
                    </div>
                  </div>

                </div>

                <!-- State help guide -->
                <section class="pt-4 md:pl-4">
                  <h1 class="text-gray-500 font-semibold">Help:</h1>
                  <div class="grid grid-cols-12">
                    <div class="col-span-12 md:col-span-6 xl:col-span-4 flex">
                      <span class="flex h-4 w-4 pt-1 md:pt-2 -ml-1 md:-ml-0">
                        <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-blue-400 opacity-75" />
                        <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-500" />
                      </span>
                      <p class="pt-0.5 pl-2 text-gray-500">
                        Verification in progress, may take a few minutes
                      </p>
                    </div>

                    <div class="col-span-12 md:col-span-6 xl:col-span-4 flex">
                      <i class="bi bi-exclamation-circle-fill text-red-500 text-xl cursor-default -ml-1.5" />
                      <p class="pt-0.5 pl-2 text-gray-500">
                        Verification failed, delete the application and try again
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </span>
          <span v-else>
            <div class="px-2 w-full ">
              <span v-if="!$store.state.DesmosNetworkModule.isTestnet">
                <h4 class="text-3xl text-center dark:text-white">
                  <!-- Wow, such empty -->
                  This feature will be enabled soon.
                </h4>
                <h5 class="text-lg text-gray-700 dark:text-gray-300 text-center">
                  Waiting IBC!
                  <!-- You don't have any Social Network connected to your profile -->
                </h5>
              </span>
              <span v-else>
                <h4 class="text-3xl text-center dark:text-white">
                  Wow, such empty
                </h4>
                <h5 class="text-lg text-gray-700 dark:text-gray-300 text-center">
                  You don't have any Blockchain connected to your profile
                </h5>
              </span>
            </div>
            <div
              v-if="$store.state.DesmosNetworkModule.isTestnet"
              class="w-full pt-5 px-2"
            >
              <button
                class="bg-brand hover:bg-yellow-600 w-full rounded-xl py-3 text-xl font-bold text-white"
                @click="toggleApplicationLinkEditor()"
              >Connect a new Social</button>
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
    </section>

    <!-- Editor -->
    <Dialog
      :open="isApplicationLinkEditorOpen"
      @close="toggleApplicationLinkEditor()"
    >
      <div class="fixed inset-0 z-20 overflow-y-auto bg-opacity-50 bg-gray-500">
        <div class="min-h-screen px-4 text-center">
          <span class="inline-block h-screen align-middle"> &#8203; </span>

          <div class="inline-block w-full max-w-6xl p-6 pb-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <DialogTitle class="text-3xl font-bold leading-6 text-gray-900 dark:text-white">
              <span class="flex">
                <div class="flex text-brand text-4xl">Connect a Social</div>
                <div class="flex-auto text-right">
                  <button>
                    <i
                      class="bi bi-x h-12 w-12"
                      @click="toggleApplicationLinkEditor()"
                    />
                  </button>
                </div>
              </span>
            </DialogTitle>

            <section class="p-4">
              <!-- Blockchain Select -->
              <div class="md:flex -mx-4">
                <div class="px-4">
                  <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-blue-600">
                    1
                  </span>
                </div>
                <div class=" w-full pb-4">
                  <h3 class="mt-0 text-2xl font-bold dark:text-white">
                    Select the Social Network
                  </h3>
                  <div class="grid grid-cols-12">
                    <div
                      v-for="application of supportedApplicationLinks"
                      class="col-span-12 md:col-span-4 xl:col-span-3 m-1 rounded-3xl bg-gray-100 dark:bg-denim-900 dark:hover:bg-purple-800 hover:bg-purple-200 cursor-pointer"
                      @click="selectApplication(application)"
                    >
                      <div class="grid grid-cols-12">
                        <div class="col-span-4">
                          <img
                            class="p-4 pointer-events-none select-none h-16 w-auto"
                            :src="require('@/assets/brands/'+application+'/logo.svg')"
                            alt=""
                          >
                        </div>
                        <div class="col-span-5 my-auto">
                          <h5 class="dark:text-white text-2xl capitalize">
                            {{ application }}
                          </h5>
                        </div>
                        <div class="col-span-3 text-right my-auto pr-4">
                          <i
                            v-if="selectedApplication===application"
                            class="bi bi-check-circle text-xl text-seagreen-500"
                          />
                          <i
                            v-else
                            class="bi bi-circle text-xl dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Wallet Input for tx signin -->
              <div
                v-if="selectedApplication!==''&&!hasUploadedProof"
                class="md:flex -mx-4"
              >
                <div class="px-4 pt-2">
                  <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-blue-600">
                    2
                  </span>
                </div>
                <div class="grid gird-cols-2 w-full">
                  <h3 class="mt-2 text-2xl font-bold dark:text-white">
                    Social Ownership proof
                  </h3>

                  <!-- Normal user signature -->
                  <div class="col-span-2 py-2">
                    <label
                      for="applicationUsername"
                      class="dark:text-white text-xl"
                    >
                      Your
                      <span class="capitalize text-brand">
                        {{ selectedApplication }}
                      </span> username
                    </label>
                    <input
                      id="applicationUsername"
                      v-model="applicationUsername"
                      type="text"
                      class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                      name="applicationUsername"
                      placeholder="Username"
                      @input="resetGeneratedProof()"
                    >
                  </div>
                  <div
                    v-if="!generatedProof&& $store.state.AuthModule._account.isUsingKeplr===false"
                    class="col-span-2 py-2"
                  >
                    <label
                      for="mPassword"
                      class="dark:text-white text-xl"
                    >
                      Wallet password
                    </label>
                    <input
                      id="mPassword"
                      v-model="mPassword"
                      type="password"
                      class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                      name="mPassword"
                      placeholder="Password"
                    >
                  </div>

                  <span
                    v-if="generateProofError"
                    class="text-red-700"
                  >
                    {{ generateProofError }}
                  </span>
                  <div
                    v-if="($store.state.AuthModule._account.isUsingKeplr===false && applicationUsername.length>0&&mPassword.length>0&&!generatedProof) || $store.state.AuthModule._account.isUsingKeplr===true"
                    class="col-span-2 py-2"
                  >
                    <button
                      type="button"
                      class="py-2 w-full px-4 bg-purple-600 hover:bg-purple-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                      @click="generateProof()"
                    >
                      Generate Proof
                    </button>
                  </div>
                </div>
              </div>

              <!-- Social proof tutorial -->
              <div
                v-if="selectedApplication!==''&&applicationUsername.length>0&&generatedProof"
                class="pt-8"
              >
                <h1 class="text-center w-full text-3xl font-bold pb-4 dark:text-white">
                  Verify the Account
                </h1>
                <div class="pb-4">
                  <AccountApplicationLinkTutorialDiscord v-if="selectedApplication==='discord'" />
                  <AccountApplicationLinkTutorialGithub
                    v-if="selectedApplication==='github'"
                    :username="applicationUsername"
                    :proof="generatedProof"
                    @applicationLinkSent="onApplicationLinkSent"
                  />
                  <AccountApplicationLinkTutorialTwitch
                    v-if="selectedApplication==='twitch'"
                    :username="applicationUsername"
                    :proof="generatedProof"
                    :proof-url="proofUrl"
                    @applicationLinkSent="onApplicationLinkSent"
                  />
                  <AccountApplicationLinkTutorialTwitter
                    v-if="selectedApplication==='twitter'"
                    :username="applicationUsername"
                    :proof="generatedProof"
                    :proof-url="proofUrl"
                    @applicationLinkSent="onApplicationLinkSent"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" src="./AccountAppLinks.ts"/>