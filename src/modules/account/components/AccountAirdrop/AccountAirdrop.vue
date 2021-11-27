<template>
  <span>
    <Dialog
      :open="$store.state.AirdropModule.isAirdropModalOpen"
      @close="toggleAirdropModal()"
    >
      <div class="fixed inset-0 z-20 overflow-y-auto bg-opacity-50 bg-gray-500">
        <div class="min-h-screen px-4 text-center">
          <span class="inline-block h-screen align-middle"> &#8203; </span>

          <div class="inline-block w-full max-w-6xl p-6 pb-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <DialogTitle class="text-3xl font-bold leading-6 text-gray-900 dark:text-white">
              <span class="flex">
                <div class="flex-auto text-right">
                  <button class="bg-gray-200 dark:bg-gray-800 rounded-full p-1 hover:text-red-500">
                    <i
                      class="bi bi-x h-12 w-12"
                      @click="toggleAirdropModal()"
                    />
                  </button>
                </div>
              </span>
            </DialogTitle>
            <DialogOverlay />
            <div class="dark:text-white py-3 px-4">

              <!-- Requirements -->
              <section v-if="!$store.state.AirdropModule.hasRequestedClaim">
                <div class="grid grid-cols-12 md:pl-10">
                  <div class="col-span-12 md:col-span-7 mx-auto md:mx-0">
                    <h1 class="text-5xl font-bold text-brand">Ready to claim?</h1>
                    <h1 class="text-lg pt-3">This is what you need:</h1>
                    <ol class="list-decimal pl-6">
                      <li class="py-1">Saved Desmos Profile <i
                          v-if="$store.state.AccountModule.profile&&(!$store.state.AccountModule.isNewProfile||$store.state.AccountModule.account._balance)"
                          class="bi bi-check-lg text-green-500 text-lg align-middle"
                        /></li>
                      <li class="">
                        Connect eligible address using "Connect Blockchain" <i
                          v-if="$store.state.AirdropModule.aidropAllocations.size>0"
                          class="bi bi-check-lg text-green-500 text-lg align-middle"
                        /></li>
                      <li class="pt-1">
                        Connect <b>ALL</b> your eligible address to claim <b>all</b> the airdrop <i
                          v-if="$store.state.AirdropModule.aidropAllocations.size>0"
                          class="bi bi-check-lg text-green-500 text-lg align-middle"
                        /></li>
                    </ol>

                    <div class="pt-2 text-gray-700 dark:text-gray-400 text-md">Verify <a
                        href="https://airdrop.desmos.network/"
                        target="_blank"
                        class="text-brand"
                      >here</a> if your address is eligible</div>
                  </div>
                  <div class="col-span-12 md:col-span-5 mx-auto md:mx-0 md:pt-0 pt-4">
                    <img
                      class="h-60 "
                      src="@/assets/illustrations/airdrop/balloons.svg"
                      alt=""
                    >
                  </div>
                </div>
              </section>

              <!-- If profile exists on chain, claim! -->
              <span v-if="$store.state.AccountModule.profile&&(!$store.state.AccountModule.isNewProfile||$store.state.AccountModule.account._balance)">
                <!-- Available Airdrops / Claim -->
                <section v-if="$store.state.AccountModule && $store.state.AirdropModule.aidropAllocations && !$store.state.AirdropModule.hasRequestedClaim">
                  <div class="grid grid-cols-12 md:pl-10">
                    <div class="col-span-12 my-4">
                      <h1 class="text-4xl">Your Airdrops <i class="bi bi-gift-fill text-red-400" /> </h1>
                    </div>

                    <div
                      v-if="!$store.state.AirdropModule.isLoadingAirdropAllocations"
                      class="col-span-12"
                    >
                      <div
                        v-for="(allocation) in $store.state.AirdropModule.aidropAllocations"
                        class="col-span-12 md:ml-4"
                      >
                        <div class="grid grid-cols-12">
                          <!-- Staking -->
                          <div
                            v-for="stakingAllocation in allocation[1].staking_infos"
                            class="col-span-12 md:col-span-6"
                          >
                            <div class="grid grid-cols-12 py-1.5">
                              <div class="col-span-2 mx-auto">
                                <img
                                  class="pointer-events-none select-none h-8"
                                  :src="getChainLogo(stakingAllocation.chain_name)"
                                  alt=""
                                >
                              </div>
                              <div class="col-span-10 my-auto">
                                <span class="text-xl">
                                  <span class="capitalize">{{stakingAllocation.chain_name}}</span> staker: <span class="font-bold text-brand">{{stakingAllocation.dsm_allotted}}</span> DSM
                                  <span v-if="stakingAllocation.claimed">
                                    <span class="bg-green-400 text-black rounded-xl p-1 text-sm">Claimed</span>
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <!-- LP -->
                          <div
                            v-for="lpAllocation in allocation[1].lp_infos"
                            class="col-span-12 md:col-span-6"
                          >
                            <div class="grid grid-cols-12 py-1.5">
                              <div class="col-span-2 mx-auto">
                                <img
                                  class="pointer-events-none select-none h-8"
                                  :src="getChainLogo(lpAllocation.chain_name)"
                                  alt=""
                                >
                              </div>
                              <div class="col-span-10 my-auto">
                                <span class="text-xl">
                                  <span class="capitalize">{{lpAllocation.chain_name}}</span> LP: <span class="font-bold text-brand">{{lpAllocation.dsm_allotted}}</span> DSM
                                  <span v-if="lpAllocation.claimed">
                                    <span class="bg-green-400 text-black rounded-xl p-1 text-sm">Claimed</span>
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="$store.state.AirdropModule.aidropAllocations.size<=0"
                        class="text-red-500"
                      >
                        No claimable address found
                      </div>
                      <div class="col-span-12 pt-3">
                        <span v-if="!$store.state.AirdropModule.isLoadingClaim">
                          <button
                            class="rounded-3xl bg-brand hover:brightness-90 w-full py-1 text-xl brightness-100 transition ease-in duration-100"
                            @click="claimUserAirdrop()"
                          >Claim!</button>
                        </span>
                        <span v-else>
                          Claiming...
                        </span>
                      </div>
                    </div>
                    <div
                      v-else
                      class="col-span-12"
                    >
                      <span v-if="$store.state.AccountModule.profile.chainLinks.length<=0">
                        Connect an eligible address to get started
                      </span>
                      <span v-else>
                        Loading...
                      </span>
                    </div>

                  </div>
                </section>

                <!-- Claim Result -->
                <section v-if="$store.state.AccountModule && $store.state.AirdropModule.aidropAllocations && $store.state.AirdropModule.hasRequestedClaim">
                  <div class="grid grid-cols-12">
                    <div class="col-span-12 mx-auto">
                      <span v-if="$store.state.AirdropModule.isAirdropSuccess">
                        <img
                          class="h-52"
                          src="@/assets/illustrations/airdrop/claim_success.svg"
                          alt=""
                        >
                      </span>
                      <span v-else>
                        <img
                          class="h-52"
                          src="@/assets/illustrations/airdrop/claim_error.svg"
                          alt=""
                        >
                      </span>
                    </div>
                    <div class="col-span-12 dark:text-white text-xl text-center pt-8">
                      <div>
                        {{$store.state.AirdropModule.claimResponse}}
                      </div>

                      <span
                        v-if="$store.state.AirdropModule.isAirdropSuccess"
                        class="text-gray-800 dark:text-gray-400 text-sm"
                      >
                        Refresh the page in a few seconds to see the updated balance
                      </span>
                    </div>
                  </div>
                </section>
              </span>

              <span v-else>

                <div class="md:pl-10">
                  <!-- <div class="relative text-gray-700 dark:text-white">
                    <span v-if="!$store.state.AirdropModule.isLoadingGrant">
                      <span v-if="$store.state.AirdropModule.isGrantSuccess">
                        <h1 class="text-2xl text-center text-brand">Grant received!</h1>
                        <p class="text-center">You can now setup a free Desmos Profile and connect your eligible address to get your airdrop DSM!</p>
                      </span>
                      <span v-else>
                        <label for="inputElegibleAddress">
                          Your eligible address:
                        </label>
                        <input
                          id="inputElegibleAddress"
                          v-model="inputElegibleAddress"
                          type="text"
                          class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 dark:border-gray-700 w-full py-2 px-4 bg-white dark:bg-denim-900 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          name="inputElegibleAddress"
                          placeholder="Cosmos/Kava/Terra.. address"
                        >
                        <button
                          class="rounded-xl bg-brand hover:brightness-90 w-full py-1 text-xl brightness-100 transition ease-in duration-100 mt-4"
                          @click="askUserGrant()"
                        >Ask Grant</button>

                        {{$store.state.AirdropModule.grantResponse}}
                      </span>
                    </span>
                    <span v-else>
                      Loading...
                    </span>
                  </div> -->
                  <h1 class="dark:text-white">Claim for users without a profile and without paying fees will be enabled in the next days.</h1>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </span>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
import AirdropModule from "@/store/modules/AirdropModule";
const airdropModule = getModule(AirdropModule);

export default defineComponent({
  components: { Dialog, DialogOverlay, DialogTitle },
  setup() {
    return {
      inputElegibleAddress: "",
    };
  },
  methods: {
    toggleAirdropModal() {
      airdropModule.toggleAirdropModal();
    },
    getChainLogo(name: string) {
      try {
        return require("@/assets/brands/" + name.toLowerCase() + "/logo.svg");
      } catch (e) {
        return "";
      }
    },
    async claimUserAirdrop() {
      airdropModule.claimAirdrop();
    },
    async askUserGrant() {
      airdropModule.askGrant(this.inputElegibleAddress);
    },
  },
});
</script>