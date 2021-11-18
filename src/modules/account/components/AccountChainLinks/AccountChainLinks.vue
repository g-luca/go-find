<template>
  <div>
    <section v-if="$store.state.AccountModule.profileLoadingStatus==0||$store.state.AccountModule.profileLoadingStatus">
      <span v-if="$store.state.AccountModule.profileLoadingStatus">
        <div class="pt-2 pb-3 md:pt-6 px-2 bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl">
          <h1 class="pb-8 pl-4 text-5xl text-purple-600 dark:text-purple-700 font-extrabold">
            Blockchains
          </h1>
          <span v-if="$store.state.AccountModule.profile.chainLinks&&$store.state.AccountModule.profile.chainLinks.length>0">
            <div
              class="grid grid-cols-2 gap-3 text-center"
              :class="{
                'md:overflow-y-auto md:max-h-96':$store.state.AccountModule.profile.chainLinks.length>3
              }"
            >
              <div
                v-for="chainLink in $store.state.AccountModule.profile.chainLinks"
                :key="chainLink"
                class="m-auto col-span-2 w-full px-2"
              >
                <div class="w-full grid grid-cols-12 bg-indigo-50 dark:bg-denim-900 rounded-3xl">
                  <div
                    class="col-span-1 my-auto cursor-pointer"
                    @click="deleteChainLink(chainLink)"
                  >
                    <i class="bi bi-dash-lg rounded-full text-red-600 p-2 bg-gray-200 dark:bg-gray-900 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white" />
                  </div>
                  <div class="w-14 sm:w-16 md:w-20 m-auto col-span-2">
                    <img
                      class="p-4 pointer-events-none select-none text-left"
                      :src="getChainLogo(chainLink.chain)"
                      alt=""
                    >
                  </div>
                  <div class="col-span-7 my-auto text-left">
                    <h1 class="dark:text-white text-xl font-bold">
                      {{ getChainName(chainLink.chain) }}
                    </h1>
                    <h4 class="dark:text-white text-md md:font-mono truncate">
                      {{ chainLink.address }}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </span>
          <span v-else>
            <div class="px-2 w-full ">
              <h4 class="text-3xl text-center dark:text-white">
                Wow, such empty
              </h4>
              <h5 class="text-lg text-gray-700 dark:text-gray-300 text-center">
                You don't have any Blockchain connected to your profile
              </h5>
            </div>
          </span>
          <div class="w-full pt-5 px-2">
            <button
              class="bg-indigo-800 hover:bg-indigo-900 w-full rounded-xl py-3 text-xl font-bold text-white"
              @click="toggleChainLinkEditor()"
            >Connect a Blockchain</button>
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

    <!-- Editor -->
    <Dialog
      :open="isChainLinkEditorOpen"
      @close="toggleChainLinkEditor()"
    >
      <div class="fixed inset-0 z-20 overflow-y-auto bg-opacity-50 bg-gray-500">
        <div class="min-h-screen px-4 text-center">
          <span class="inline-block h-screen align-middle"> &#8203; </span>

          <div class="inline-block w-full max-w-6xl p-6 pb-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <DialogTitle class="text-3xl font-bold leading-6 text-gray-900 dark:text-white">
              <span class="flex">
                <div class="flex dark:text-purple-700 text-purple-600 text-4xl">Connect a Blockchain</div>
                <div class="flex-auto text-right">
                  <button>
                    <i
                      class="bi bi-x h-12 w-12"
                      @click="toggleChainLinkEditor()"
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
                <div class="w-full pb-4  overflow-y-scroll">
                  <div class="fixed">
                    <h3 class="mt-4 text-2xl font-bold dark:text-white ">
                      Select the Blockchain
                    </h3>
                    <input
                      class="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg focus:outline-none focus:ring-0 dark:text-white"
                      placeholder="Search..."
                      type="text"
                      @input="searchChainLink"
                    >
                  </div>
                  <div class="flex flex-nowrap min-w-full mt-24">
                    <div
                      v-for="chain of filteredSupportedChainLinks"
                      class="flex-initial m-1 rounded-3xl bg-gray-100 dark:bg-denim-900 dark:hover:bg-purple-800 hover:bg-purple-200 cursor-pointer select-none"
                      @click="selectChain(chain)"
                    >
                      <div class="grid grid-cols-12 w-44 md:w-60">
                        <div class="col-span-4">
                          <img
                            class="p-3 pointer-events-none select-none h-16 w-16"
                            :src="getChainLogo(chain.id)"
                            alt=""
                          >
                        </div>
                        <div class="col-span-5 my-auto">
                          <h5 class="dark:text-white text-2xl lg:block hidden">
                            {{ chain.name }}
                          </h5>
                          <h5 class="dark:text-white text-2xl capitalize block lg:hidden">
                            {{ chain.symbol }}
                          </h5>
                        </div>
                        <div class="col-span-3 text-right my-auto pr-4">
                          <i
                            v-if="selectedChain&&chain.id===selectedChain.id"
                            class="bi bi-check-circle text-xl text-seagreen-500"
                          />
                          <i
                            v-else
                            class="bi bi-circle text-xl dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <!-- <div
                      class="flex-initial m-1 rounded-3xl bg-gray-100 dark:bg-denim-900 dark:hover:bg-purple-800 hover:bg-purple-200 cursor-pointer"
                      @click="selectChain(null)"
                    >
                      <div class="grid grid-cols-12 w-44 md:w-60 py-3">
                        <div class="col-span-4">
                          <i class="p-3 pointer-events-none select-none text-4xl w-auto my-auto bi bi-link text-seagreen-500" />
                        </div>
                        <div class="col-span-5 my-auto">
                          <h5 class="dark:text-white text-2xl capitalize">
                            Other
                          </h5>
                        </div>
                        <div class="col-span-3 text-right my-auto pr-4">
                          <i
                            v-if="isCustomChain"
                            class="bi bi-check-circle text-xl text-seagreen-500"
                          />
                          <i
                            v-else
                            class="bi bi-circle text-xl dark:text-white"
                          />
                        </div>
                      </div>
                    </div> -->
                  </div>

                  <div v-if="isCustomChain">
                    <label
                      for="chainName"
                      class="text-gray-700 text-sm"
                    >
                      Chain name
                    </label>
                    <input
                      id="chainName"
                      v-model="customChainName"
                      type="text"
                      class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                      name="chainName"
                      placeholder="Chain name"
                    >
                  </div>
                </div>
              </div>
              <span v-if="!isLinkingWithKeplr">

                <!-- Mnemonic Input -->
                <div
                  v-if="selectedChain||isCustomChain"
                  class="md:flex -mx-4"
                >
                  <div class="px-4">
                    <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-blue-600">
                      2
                    </span>
                  </div>
                  <div class="px-4 w-full">
                    <h3 class="mt-4 text-2xl font-bold dark:text-white">
                      Enter the <span
                        v-if="!isCustomChain"
                        class="capitalize font-bolder text-brand"
                      >{{ selectedChain.name }}</span> mnemonic
                    </h3>
                    <h4 class="dark:text-white">
                      <span class="text-yellow-400">Keep calm</span>: your mnemonic <strong><u>never</u></strong> leaves this form
                    </h4>
                    <InputMnemonic
                      :skip-valid-mnemonic-check="true"
                      :custom-hd-path="customHdPath"
                      :custom-bech32-prefix="customBechPrefix"
                      @onMnemonic="onMnemonic($event)"
                    />
                    <h4 class="text-gray-600 dark:text-gray-300 text-xs pb-6">
                      Note: You can also use mnemonic of 12 and 18 words.
                    </h4>

                    <div class="">
                      <h4 class="dark:text-white text-xl font-bold">
                        Advanced Options
                        <i
                          v-if="!isAdvancedOptionsOpen"
                          class="bi bi-chevron-down cursor-pointer"
                          @click="toggleAdvancedOptions()"
                        />
                        <i
                          v-else
                          class="bi bi-chevron-up cursor-pointer"
                          @click="toggleAdvancedOptions()"
                        />
                        <div
                          v-if="isAdvancedOptionsOpen"
                          class=""
                        >
                          <div>
                            <label
                              for="hdpath"
                              class="text-gray-700 text-sm"
                            >
                              Derivation Path
                            </label>
                            <input
                              id="hdpath"
                              v-model="customHdPath"
                              type="text"
                              class=" rounded-lg w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                              name="hdpath"
                              :placeholder="(selectedChain)? selectedChain.hdpath : supportedChainLinks[0].hdpath"
                            >
                          </div>

                          <div class="pt-4">
                            <label
                              for="bechPrefix"
                              class="text-gray-700 text-sm"
                            >
                              Address Prefix
                            </label>
                            <input
                              id="bechPrefix"
                              v-model="customBechPrefix"
                              type="text"
                              class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none"
                              name="bechPrefix"
                            >
                          </div>
                        </div>
                      </h4>
                    </div>

                    <div class="pt-4">
                      <button
                        type="button"
                        class="py-2 px-4 w-full bg-purple-600 hover:bg-purple-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                        @click="generateProof()"
                      >
                        Connect
                      </button>
                      <div class="pt-4">
                        <span v-if="generateProofError">
                          <h6 class="text-red-700">
                            {{ generateProofError }}
                          </h6>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Confirm -->
                <div
                  v-if="generatedProof"
                  class="md:flex -mx-4 w-full"
                >
                  <div class="px-4">
                    <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-blue-600">
                      3
                    </span>
                  </div>
                  <div class="px-4 w-full">
                    <h3 class="my-4 text-2xl font-bold dark:text-white">
                      Confirm the operation
                    </h3>
                    <button
                      type="button"
                      :disabled="isExecutingTransaction||generatedProof===''"
                      class="py-2 px-4 w-6/12 bg-purple-600 hover:bg-purple-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                      @click="submitChainLink()"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </span>
            </section>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" src="./AccountChainLinks.ts"/>
<style scoped>
* {
  scrollbar-width: thin;
  scrollbar-color: rgb(55, 48, 163) transparent;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: rgb(55, 48, 163);
  border-radius: 20px;
  border: 3px solid transparent;
}
</style>