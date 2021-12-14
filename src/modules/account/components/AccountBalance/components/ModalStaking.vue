<template>
  <span>
    <div
      v-if="$store.state.AccountModule.account._balance>0"
      class="inline"
    >
      <button
        type="button"
        class="text-white dark:text-white hover:text-green-400 dark:hover:text-green-400"
        @click="toggleModal"
      >
        <div class="py-1.5 px-3 text-lg font-medium bg-blue-900 rounded-full focus:outline-none focus-visible:ring-2">
          <i class="bi bi-bank" />
        </div>
        <div class="dark:text-gray-200 text-black text-sm font-thin">Stake</div>
      </button>
    </div>
    <span>
      <Dialog
        :open="isOpen"
        @close="toggleModal"
      >
        <div class="fixed inset-0 z-40 overflow-y-auto bg-opacity-50 bg-gray-500">
          <div class="min-h-screen px-4 text-center">
            <span class="inline-block h-screen align-middle"> &#8203; </span>

            <div class="inline-block  w-full xl:w-11/12 2xl:w-10/12 p-6 pb-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <DialogTitle class="text-3xl font-bold leading-6 text-gray-900 dark:text-white">
                <span class="flex">
                  <div class="text-left my-auto">
                    <h1 class="text-brand text-4xl">Stake</h1>
                  </div>
                  <div class="flex-auto text-right">
                    <button class="bg-gray-200 dark:bg-gray-800 rounded-full p-1 hover:text-red-500">
                      <i
                        class="bi bi-x h-12 w-12"
                        @click="toggleModal"
                      />
                    </button>
                  </div>
                </span>
              </DialogTitle>
              <DialogOverlay />
              <div class="dark:text-white pt-3 pb-1 md:px-4">

                <section>
                  <div v-if="isLoadingValidators">
                    <SkeletonLoader
                      v-for="i in [1,2,3,4,5,6,7,8]"
                      :key="i"
                      class="w-full h-16 my-2"
                    />
                  </div>
                  <div
                    v-else
                    class="inline-block min-w-full shadow rounded-lg"
                  >
                    <div class="hidden w-1/12 w-2/12 w-3/12 w-4/12 w-5/12 w-6/12 w-7/12 w-8/12 w-9/12 w-10/12 w-12/12 " />
                    <div class="min-w-full leading-normal bg-white dark:bg-gray-900">
                      <div class=" hidden md:block">
                        <div class="grid grid-cols-12">
                          <div class="col-span-5 py-3 border-b border-gray-700 dark:text-white text-gray-800  text-left text-sm uppercase font-normal my-auto pl-2">
                            Validator
                          </div>
                          <div class="col-span-2 py-3 border-b border-gray-700 dark:text-white text-gray-800  text-center text-sm uppercase font-normal my-auto">
                            Voting Power
                          </div>
                          <div class="col-span-2 py-3 border-b border-gray-700 dark:text-white text-gray-800  text-center text-sm uppercase font-normal my-auto">
                            Commission
                          </div>
                          <div class="col-span-1 py-3 border-b border-gray-700 dark:text-white text-gray-800  text-center text-sm uppercase font-normal my-auto">
                            Delegators
                          </div>
                          <div class="col-span-2 py-3 border-b border-gray-700 dark:text-white text-gray-800  text-center text-sm uppercase font-normal my-auto">
                            Uptime
                          </div>
                        </div>
                      </div>
                      <div class="">
                        <div
                          v-for="(validator) in validators"
                          class="text-black dark:bg-gray-800 bg-gray-100 hover:bg-white dark:hover:bg-denim-900 hover:scale-x-105 duration-500 group grid grid-cols-12 hover:rounded-3xl rounded-sm mb-0.5 hover:shadow-xl py-3"
                        >
                          <!-- Moniker & icon -->
                          <div class="col-span-12 md:col-span-5 border-gray-300 dark:border-gray-700 text-sm text-center my-auto pl-3">
                            <div class="grid grid-cols-12 items-center">
                              <div class="col-span-12 md:col-span-2">
                                <a
                                  href="#"
                                  class="block relative"
                                >
                                  <img
                                    alt="profile"
                                    :src="validator.validator_descriptions[0].avatar_url || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
                                    class="mx-auto object-cover rounded-full h-10 w-10 "
                                  >
                                </a>
                              </div>
                              <div class="col-span-12 md:col-span-10 text-gray-900 dark:text-white text-left">
                                <p class=" whitespace-no-wrap  group-hover:text-lg group-hover:text-brand group-hover:font-bold text-center md:text-left">
                                  {{validator.validator_descriptions[0].moniker}}
                                </p>
                                <div class="hidden group-hover:block">
                                  <div
                                    class="text-sm group-hover:text-base prose dark:text-white prose-indigo dark:prose-blue"
                                    v-html="validator.validator_descriptions[0].details"
                                  />
                                  <a
                                    class="text-xs text-blue-500"
                                    :href="validator.validator_descriptions[0].website"
                                    target="_blank"
                                  >
                                    {{validator.validator_descriptions[0].website}}
                                  </a>
                                  <p class="text-xs">
                                    {{validator.validator_descriptions[0].security_contact}}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Power -->
                          <div class="col-span-12 md:col-span-2 border-gray-300 dark:border-gray-700 text-sm text-center my-auto py-2 md:py-0">
                            <p class="text-gray-900 whitespace-no-wrap dark:text-white">
                              {{toDigitsFormat(validator.validator_voting_powers[0].voting_power / totalVotingPower * 100)}}%
                            </p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">
                              {{toDigitsFormat(validator.validator_voting_powers[0].voting_power,0)}} {{coinDenom}}
                            </p>
                            <div
                              class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-0.5 mx-auto"
                              style="width:150px"
                            >
                              <div
                                class="h-full w-full text-center text-xs text-white bg-green-500 rounded-full"
                                :style="`width:${(validator.validator_voting_powers[0].voting_power / totalVotingPower * 150)}px`"
                              />
                            </div>
                          </div>

                          <!-- Commission -->
                          <div class="col-span-6 md:col-span-2 border-gray-300 dark:border-gray-700 text-sm text-center my-auto">
                            <div class="md:hidden text-gray-700 dark:text-gray-400">
                              Commission
                            </div>
                            <p class="text-gray-900 whitespace-no-wrap dark:text-white text-md">
                              {{toDigitsFormat(validator.validator_commissions[0].commission*100)}}%
                            </p>
                          </div>

                          <!-- Delegators -->
                          <div class="col-span-6 md:col-span-1 border-gray-300 dark:border-gray-700 text-sm text-center my-auto">
                            <div class="md:hidden text-gray-700 dark:text-gray-400">
                              Delegators
                            </div>
                            <p class="text-gray-900 whitespace-no-wrap dark:text-white">
                              {{validator.delegations_aggregate.aggregate.count}}
                            </p>
                          </div>

                          <!-- Uptime -->
                          <div
                            class="col-span-12 md:col-span-2 border-gray-300 dark:border-gray-700 text-sm text-center my-auto"
                            :set="uptime=toDigitsFormat((15000-validator.validator_signing_infos[0].missed_blocks_counter) / 15000 * 100,0)"
                          >
                            <span
                              class="relative inline-block px-3 py-1 font-semibold leading-tight"
                              :class="uptime >= 95 ? 'text-green-800' : (uptime >= 60 ? 'text-yellow-900':'text-red-900')"
                            >
                              <span
                                aria-hidden="true"
                                class="absolute inset-0  rounded-full"
                                :class="uptime >= 95 ? 'bg-green-500' : (uptime >= 60 ? 'bg-yellow-400':'bg-red-400')"
                              />
                              <span class="relative text-xs">
                                {{uptime}}%
                              </span>
                            </span>
                          </div>

                          <!-- Actions -->
                          <div
                            class="col-span-12 hidden group-hover:block py-2"
                            :class="validator.delegations[0]?.amount||0?'block':'hidden'"
                          >
                            <div class="grid grid-cols-12 pt-4">
                              <!-- Delegated -->
                              <div class="col-span-12 md:col-span-4 dark:border-gray-700 text-sm text-center my-auto py-2 md:py-0">
                                <div class="text-md text-yellow-900 dark:text-yellow-700 pt-1">
                                  <i class="bi bi-bank2 text-base text-yellow-700 dark:text-yellow-200 p-2 bg-yellow-500 rounded-full bg-opacity-50" />
                                  Delegated
                                </div>
                                <h6
                                  class="text-gray-900 whitespace-no-wrap dark:text-white pl-2 py-1.5 text-xl"
                                  :set="userDelegation=validator.delegations[0]?.amount.amount||0"
                                >
                                  {{toDigitsFormat(userDelegation/1000000,6)}} {{coinDenom}}
                                </h6>
                                <button
                                  class="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white mr-1"
                                  type="button"
                                  @click="onDelegate(validator)"
                                >
                                  Delegate
                                </button>
                                <button
                                  v-if="validator.delegations[0]?.amount.amount>0"
                                  class="px-4 py-1 bg-purple-500 hover:bg-purple-600 rounded-lg text-white ml-1"
                                  type="button"
                                  @click="onRedelegate(validator)"
                                >
                                  Redelegate
                                </button>
                              </div>

                              <!-- Unbonding -->
                              <div
                                class="col-span-12 md:col-span-4 dark:border-gray-700 text-sm my-auto text-center py-2 md:py-0"
                                :set="userUnbonding=validator.unbonding_delegations[0]?.amount.amount||0"
                              >
                                <div class="text-md text-seagreen-800 dark:text-green-600 pt-1">
                                  <i class="bi bi-hourglass-split text-base text-seagreen-700 dark:text-green-300 p-2 bg-seagreen-400 rounded-full bg-opacity-50" />
                                  Unbonding
                                </div>
                                <h6 class="text-gray-900 whitespace-no-wrap dark:text-white pl-2 py-1.5 text-xl">
                                  <span>
                                    {{toDigitsFormat(userUnbonding/1000000,6)}} {{coinDenom}}
                                  </span>
                                </h6>
                                <button
                                  v-if="validator.delegations[0]?.amount.amount>0"
                                  class="px-4 py-1 bg-seagreen-400 hover:bg-green-600 rounded-lg text-white"
                                  type="button"
                                  @click="onUnbond(validator)"
                                >
                                  Unbond
                                </button>
                              </div>

                              <!-- Rewards -->
                              <div
                                class="col-span-12 md:col-span-4 dark:border-gray-700 text-sm my-auto text-center bg-opacity-50 py-2 md:py-0"
                                :set="userRewards=validator.delegation_rewards[0]?.amount[0]?.amount||0"
                              >
                                <div class="text-md text-blue-700 pt-1">
                                  <i class="bi bi-stars text-base text-blue-700 p-2 bg-blue-300 rounded-full" />
                                  Rewards
                                </div>
                                <h6 class="text-gray-900 whitespace-no-wrap dark:text-white pl-2 py-1.5 text-xl">
                                  <span>
                                    {{toDigitsFormat(userRewards/1000000,6)}} {{coinDenom}}
                                  </span>
                                </h6>
                                <button
                                  v-if="userRewards > 0"
                                  class="px-4 py-1 bg-blue-300 hover:bg-blue-700 rounded-lg text-white"
                                  type="button"
                                  @click="onWithdrawRewards(validator)"
                                >
                                  Withdraw Rewards
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </span>

    <span>
      <Dialog
        :open="isStakingOperationOpen"
        @close="toggleStakingOperationModal"
      >
        <div class="fixed inset-0 z-40 overflow-y-auto bg-opacity-50 bg-gray-500">
          <div class="min-h-screen px-4 text-center">
            <span class="inline-block h-screen align-middle"> &#8203; </span>

            <div class="inline-block  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 2xl:w-4/12 p-6 pb-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <DialogTitle class="text-3xl font-bold leading-6 text-gray-900 dark:text-white">
                <span class="flex">
                  <div class="text-left my-auto">
                    <h1 class="text-brand text-4xl capitalize">{{stakingOperation}}</h1>
                  </div>
                  <div class="flex-auto text-right">
                    <button class="bg-gray-200 dark:bg-gray-800 rounded-full p-1 hover:text-red-500">
                      <i
                        class="bi bi-x h-12 w-12"
                        @click="toggleStakingOperationModal"
                      />
                    </button>
                  </div>
                </span>
              </DialogTitle>
              <DialogOverlay />
              <div class="dark:text-white pt-3 pb-1">
                <div>
                  <!-- Delegate -->
                  <span v-if="stakingOperation==='delegate'">
                    <div class="mb-6 text-sm border-l border-brand pl-2">
                      <h6 class="text-lg">Staking will lock your funds for 14 days!</h6>
                      <p class="font-light">You will need to <b>undelegate</b> in order for your staked assets to be liquid again. This process will take 14 days to complete.</p>
                    </div>
                  </span>
                  <!-- Unbond -->
                  <span v-if="stakingOperation==='unbond'">
                    <div class="mb-6 text-sm border-l border-brand pl-2">
                      <h6 class="text-lg">Asset will be liquid after 14 days</h6>
                    </div>
                  </span>

                  <!-- Amount -->
                  <div class="col-span-12 mx-auto mb-6 w-full md:w-2/3">
                    <div
                      class="text-center bg-gray-100 dark:bg-gray-800 rounded-3xl pt-2 pb-2 flex"
                      :class="{'ring-red-500 ring-1':!stakingOperationIsValidAmount}"
                    >
                      <input
                        v-model="stakingOperationAmountRaw"
                        class="font-bold flex-1 w-1/4 bg-gray-100 dark:bg-gray-800 appearance-none outline-none mx-5 text-right text-5xl"
                        :class="{'text-4xl': stakingOperationAmountRaw.length > 1 && stakingOperationAmountRaw.length < 5,'text-3xl': stakingOperationAmountRaw.length >= 5 && stakingOperationAmountRaw.length < 8,'text-2xl': stakingOperationAmountRaw.length >= 8 && stakingOperationAmountRaw.length < 14,'text-xl': stakingOperationAmountRaw.length >= 14 && stakingOperationAmountRaw.length < 18,'text-lg': stakingOperationAmountRaw.length >= 18}"
                        type="text"
                        @keyup="validateAmount"
                      >
                      <span class="text-brand text-2xl font-bold my-auto ring-0 pr-1">
                        <span class="mr-1">{{coinDenom}}</span><br>
                        <span
                          class="underline text-xs text-black dark:text-gray-400 flex font-normal cursor-pointer select-none"
                          @click="setMaxAmount"
                        >max</span>
                      </span>
                    </div>
                    <div
                      class="text-sm text-gray-500 text-center pt-1"
                      :class="{'text-red-500':stakingOperationAmount>stakingOperationMaxAmount}"
                    >
                      Available: {{stakingOperationMaxAmount}} {{coinDenom}}
                    </div>
                  </div>
                  <!-- From -->
                  <div
                    v-if="stakingOperationValidatorFrom!==null"
                    class="col-span-12 md:text-left py-1"
                  >
                    <div class="flex relative text-sm lg:text-base">
                      <span class="rounded-l-3xl inline-flex items-center px-3 bg-gray-100 dark:bg-gray-800 text-gray-500">
                        From:
                      </span>
                      <div class="rounded-r-3xl flex-1 bg-gray-100 dark:bg-gray-800">
                        <div class="grid grid-cols-12">
                          <div class="col-span-12 flex py-2">
                            <img
                              alt="profile"
                              :src="stakingOperationValidatorFrom.validator_descriptions[0].avatar_url || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
                              class="object-cover rounded-full h-10 w-10 "
                            >
                            <h6 class="my-auto pl-3 text-2xl">{{stakingOperationValidatorFrom.validator_descriptions[0].moniker}}</h6>
                          </div>
                          <!-- <div class="font-mono">
                          {{stakingOperationValidatorFrom.validator_info.operator_address}}
                        </div> -->
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- To -->
                  <div
                    v-if="stakingOperation==='redelegate'||stakingOperationValidatorTo"
                    class="col-span-12 md:text-left py-1"
                  >
                    <div class="flex relative text-sm lg:text-base">
                      <span class="rounded-l-3xl inline-flex items-center px-3 bg-gray-100 dark:bg-gray-800 text-gray-500">
                        To:
                      </span>
                      <div class="rounded-r-3xl flex-1 bg-gray-100 dark:bg-gray-800">

                        <!-- Can Select Validator To -->
                        <span v-if="stakingOperation==='redelegate'">
                          <button
                            type="button"
                            class="relative w-full rounded-3xl py-2 text-left cursor-default hover:cursor-pointer sm:text-sm"
                            @click="toggleSelectStakingOperationValidatorTo"
                          >
                            <div
                              v-if="stakingOperationValidatorTo"
                              class="flex pl-3"
                            >
                              <img
                                alt="profile"
                                :src="stakingOperationValidatorTo.validator_descriptions[0].avatar_url || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
                                class="object-cover rounded-full h-10 w-10 "
                              >
                              <h6 class="my-auto pl-3 text-2xl">{{stakingOperationValidatorTo.validator_descriptions[0].moniker}}</h6>
                            </div>
                            <div
                              v-else
                              class="text-xl pl-3"
                            >
                              <p>Select new validator</p>
                            </div>
                            <span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <svg
                                class="h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                  clip-rule="evenodd"
                                >
                                </path>
                              </svg>
                            </span>
                          </button>
                        </span>

                        <!-- Already has Validator To -->
                        <span v-else>
                          <div class="col-span-12 flex py-2">
                            <img
                              alt="profile"
                              :src="stakingOperationValidatorTo.validator_descriptions[0].avatar_url || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
                              class="object-cover rounded-full h-10 w-10 "
                            >
                            <h6 class="my-auto pl-3 text-2xl">{{stakingOperationValidatorTo.validator_descriptions[0].moniker}}</h6>
                          </div>
                        </span>
                      </div>
                    </div>

                    <!-- Select Validator To -->
                    <div
                      v-if="isOpenSelectStakingOperationValidatorTo"
                      class="mt-1 z-50 rounded-2xl bg-white dark:bg-denim-900 dark:text-white shadow-lg transition duration-300 ease-in-out"
                    >
                      <ul
                        tabindex="-1"
                        role="listbox"
                        aria-labelledby="listbox-label"
                        aria-activedescendant="listbox-item-3"
                        class="max-h-56 rounded-2xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                      >
                        <li
                          v-for="selectValidator in validators"
                          id="listbox-item-0"
                          role="option"
                          class="hover:bg-indigo-500 select-none relative py-2 pl-3 pr-9 cursor-pointer"
                          @click="onSelectStakingOperationValidatorTo(selectValidator)"
                        >
                          <div class="flex pl-3">
                            <img
                              alt="profile"
                              :src="selectValidator.validator_descriptions[0].avatar_url || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
                              class="object-cover rounded-full h-7 w-7 "
                            >
                            <h6 class="my-auto pl-3 text-lg">{{selectValidator.validator_descriptions[0].moniker}}</h6>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Delegate Button -->
                  <div
                    v-if="stakingOperation==='delegate'&&stakingOperationIsValidAmount&&stakingOperationValidatorTo"
                    class="col-span-12 mt-5 mx-auto w-full"
                  >
                    <button
                      class="bg-yellow-600 rounded-xl p-2 w-full text-white"
                      @click="delegate"
                    >
                      Delegate
                    </button>
                  </div>

                  <!-- Unbond Button -->
                  <div
                    v-if="stakingOperation==='unbond'&&stakingOperationIsValidAmount&&stakingOperationValidatorFrom"
                    class="col-span-12 mt-5 mx-auto w-full"
                  >
                    <button
                      class="bg-green-600 rounded-xl p-2 w-full text-white"
                      @click="unbond"
                    >
                      Unbond
                    </button>
                  </div>

                  <!-- Redelegate Button -->
                  <div
                    v-if="stakingOperation==='redelegate'&&stakingOperationIsValidAmount&&stakingOperationValidatorFrom&&stakingOperationValidatorTo"
                    class="col-span-12 mx-auto w-full mt-5"
                  >
                    <button
                      class="bg-purple-600 rounded-xl p-2 w-full text-white"
                      @click="redelegate"
                    >
                      Redelegate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </span>
  </span>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
import { ValidatorsQuery } from "@/gql/ValidatorsQuery";
import { useApolloClient } from "@vue/apollo-composable";
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
import { ProfileQuery } from "@/gql/ProfileQuery";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import { sanitize } from "dompurify";
import marked from "marked";
import AccountModule from "@/store/modules/AccountModule";
import {
  CosmosBroadcastMode,
  CosmosMsgBeginRedelegate,
  CosmosMsgDelegate,
  CosmosMsgUndelegate,
  CosmosMsgWithdrawDelegatorReward,
  CosmosTxBody,
} from "desmosjs";
import TransactionModule from "@/store/modules/TransactionModule";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);
const transactionModule = getModule(TransactionModule);

enum StakingOperations {
  None = "none",
  Delegate = "delegate",
  Redelegate = "redelegate",
  Unbond = "unbond",
  Withdraw = "withdraw",
}

export default defineComponent({
  components: { Dialog, DialogOverlay, DialogTitle, SkeletonLoader },
  setup() {
    return {
      isOpen: ref(false),
      isStakingOperationOpen: ref(false),
      isLoadingValidators: ref(false),
      totalVotingPower: ref(0),
      validators: ref([]),

      stakingOperation: ref(StakingOperations.None),
      stakingOperationAmount: ref(0),
      stakingOperationAmountRaw: ref("0"),
      stakingOperationIsValidAmount: ref(false),
      stakingOperationMaxAmount: ref(0),
      stakingOperationValidatorFrom: ref(null) as any,
      stakingOperationValidatorTo: ref(null) as any,
      stakingOperationValidatorError: ref(""),

      isOpenSelectStakingOperationValidatorTo: ref(false),

      coinDenom: process.env.VUE_APP_COIN_DENOM,
      ucoinDenom: process.env.VUE_APP_COIN_FEE_DENOM,
    };
  },
  methods: {
    async toggleModal() {
      this.isOpen = !this.isOpen;
      this.isLoadingValidators = false;
      this.totalVotingPower = 0;
      this.loadValidators();
    },
    async toggleStakingOperationModal() {
      this.isStakingOperationOpen = !this.isStakingOperationOpen;
      this.stakingOperationAmount = 0;
      this.stakingOperationMaxAmount = 0;
      this.stakingOperationAmountRaw = "0";
      this.stakingOperationIsValidAmount = false;
      this.stakingOperationValidatorFrom = null;
      this.stakingOperationValidatorTo = null;
      this.stakingOperationValidatorError = "";
      this.isOpenSelectStakingOperationValidatorTo = false;
      this.updateMaxAmount();
    },
    async loadValidators() {
      this.isLoadingValidators = true;
      const apollo = useApolloClient();
      this.validators = [];
      try {
        const validatorsRaw = await apollo.client.query({
          query: ValidatorsQuery,
          variables: {
            address: authModule.account?.address,
          },
          fetchPolicy: "no-cache",
        });
        if (validatorsRaw.data) {
          this.validators = validatorsRaw.data.validator_aggregate.nodes;

          for (let i = 0; i < this.validators.length; i++) {
            this.totalVotingPower += Number(
              this.validators[i]["validator_voting_powers"][0]["voting_power"]
            );
            try {
              apollo.client
                .query({
                  query: ProfileQuery,
                  variables: {
                    address:
                      this.validators[i]["validator_info"]["account"][
                        "address"
                      ],
                    dtag: "",
                  },
                })
                .then((res) => {
                  if (res.data && res.data.profile.length > 0) {
                    const validatorProfile = res.data.profile[0];

                    /* Replace validator image with profile pricture*/
                    if (validatorProfile["profile_pic"]) {
                      try {
                        (this.validators[i]["validator_descriptions"][0][
                          "avatar_url"
                        ] as any) = validatorProfile["profile_pic"];
                      } catch (e) {
                        // skip
                      }
                    }

                    if (validatorProfile["bio"]) {
                      try {
                        (this.validators[i]["validator_descriptions"][0][
                          "details"
                        ] as any) = sanitize(marked(validatorProfile["bio"]));
                      } catch (e) {
                        // skip
                      }
                    }
                  }
                });
            } catch (e) {
              // skip
            }
          }
        }
      } catch (e) {
        // continue
      }
      this.isLoadingValidators = false;
    },
    toDigitsFormat(value: number, digits = 2) {
      return value > 0 ? Number(value).toFixed(digits).toString() : 0;
    },
    toVotingPower(amount: number) {
      return Number((amount / this.totalVotingPower) * 100).toFixed(2);
    },
    async onDelegate(validator: any) {
      this.stakingOperationValidatorError = "";
      this.stakingOperation = StakingOperations.Delegate;
      await this.toggleModal();
      await this.toggleStakingOperationModal();

      // ensure that all the needed data is available
      if (
        validator &&
        validator.validator_info &&
        validator.validator_info.operator_address
      ) {
        this.stakingOperationValidatorTo = validator;
      } else {
        this.stakingOperationValidatorError =
          "Ops, an error occured while loading validator info";
      }
      await this.updateMaxAmount();
    },
    async onUnbond(validator: any) {
      this.stakingOperationValidatorError = "";
      this.stakingOperation = StakingOperations.Unbond;
      await this.toggleModal();
      await this.toggleStakingOperationModal();

      // ensure that all the needed data is available
      if (
        validator &&
        validator.validator_info &&
        validator.validator_info.operator_address
      ) {
        this.stakingOperationValidatorFrom = validator;
      } else {
        this.stakingOperationValidatorError =
          "Ops, an error occured while loading validator info";
      }
      await this.updateMaxAmount();
    },
    async onRedelegate(validator: any) {
      this.stakingOperationValidatorError = "";
      this.stakingOperation = StakingOperations.Redelegate;
      await this.toggleModal();
      await this.toggleStakingOperationModal();

      // ensure that all the needed data is available
      if (
        validator &&
        validator.validator_info &&
        validator.validator_info.operator_address
      ) {
        this.stakingOperationValidatorFrom = validator;
      } else {
        this.stakingOperationValidatorError =
          "Ops, an error occured while loading validator info";
      }
      await this.updateMaxAmount();
    },
    async toggleSelectStakingOperationValidatorTo() {
      this.isOpenSelectStakingOperationValidatorTo =
        !this.isOpenSelectStakingOperationValidatorTo;
    },
    async onSelectStakingOperationValidatorTo(validator: any) {
      this.stakingOperationValidatorTo = validator;
      this.isOpenSelectStakingOperationValidatorTo = false;
    },
    async onWithdrawRewards(validator: any) {
      this.stakingOperationValidatorError = "";
      this.stakingOperation = StakingOperations.Withdraw;
      await this.toggleModal();
      this.withdrawRewards(validator.validator_info.operator_address);
    },
    async updateMaxAmount() {
      let maxAmount = 0;
      try {
        if (
          this.stakingOperation === StakingOperations.Unbond ||
          this.stakingOperation === StakingOperations.Redelegate
        ) {
          maxAmount =
            this.stakingOperationValidatorFrom.delegations[0]?.amount.amount /
              1000000 || 0;
        } else {
          if (accountModule.account) {
            maxAmount = accountModule.account.balance;
          }
        }
      } catch (e) {
        // skip
      }
      this.stakingOperationMaxAmount = maxAmount;
    },
    async setMaxAmount() {
      await this.updateMaxAmount();
      /* FIXME: subtract commissions */
      if (accountModule.account) {
        this.stakingOperationAmount = this.stakingOperationMaxAmount;
        this.stakingOperationAmountRaw = String(this.stakingOperationMaxAmount);
        this.stakingOperationIsValidAmount = true;
      }
    },
    validateAmount() {
      let isValidNumber = false;
      if (accountModule.account) {
        //this.updateMaxAmount();
        // check regex
        const amountRegex = /^[0-9.,]{1,}$/;
        const validAmountRaw = amountRegex.exec(this.stakingOperationAmountRaw);
        if (validAmountRaw) {
          const amountParsed = Number(
            Number(this.stakingOperationAmountRaw).toFixed(6)
          ); // can use exponential notation
          if (amountParsed >= 0) {
            this.stakingOperationAmount = amountParsed;
            isValidNumber = true;
          }
          this.stakingOperationIsValidAmount =
            this.stakingOperationAmount >= 0.000001 &&
            this.stakingOperationAmount <= this.stakingOperationMaxAmount;
        }
      }

      if (this.stakingOperationAmountRaw === "") {
        this.stakingOperationAmount = 0;
        this.stakingOperationAmountRaw = "";
      }
      if (!isValidNumber && this.stakingOperationAmountRaw !== "") {
        this.stakingOperationAmountRaw = String(this.stakingOperationAmount);
      }
    },
    async delegate() {
      const amount = this.stakingOperationAmount * 1000000;
      const toValidatorAddress =
        this.stakingOperationValidatorTo.validator_info.operator_address;
      if (accountModule.profile) {
        const msgDelegate: CosmosMsgDelegate = {
          delegatorAddress: accountModule.profile.address,
          validatorAddress: toValidatorAddress,
          amount: {
            denom: this.ucoinDenom!,
            amount: amount.toString(),
          },
        };
        const txBody: CosmosTxBody = {
          memo: "Delegate | Go-find",
          messages: [
            {
              typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
              value: CosmosMsgDelegate.encode(msgDelegate).finish(),
            },
          ],
          extensionOptions: [],
          nonCriticalExtensionOptions: [],
          timeoutHeight: 0,
        };
        await this.toggleStakingOperationModal();
        transactionModule.start({
          tx: txBody,
          mode: CosmosBroadcastMode.BROADCAST_MODE_BLOCK,
        });
      }
    },
    async redelegate() {
      const amount = this.stakingOperationAmount * 1000000;
      this.isOpenSelectStakingOperationValidatorTo = false;
      const toValidatorAddress =
        this.stakingOperationValidatorTo.validator_info.operator_address;
      const fromValidatorAddress =
        this.stakingOperationValidatorFrom.validator_info.operator_address;
      if (accountModule.profile) {
        const msgRedelegate: CosmosMsgBeginRedelegate = {
          delegatorAddress: accountModule.profile.address,
          validatorSrcAddress: fromValidatorAddress,
          validatorDstAddress: toValidatorAddress,
          amount: {
            denom: this.ucoinDenom!,
            amount: amount.toString(),
          },
        };
        const txBody: CosmosTxBody = {
          memo: "Redelegate | Go-find",
          messages: [
            {
              typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
              value: CosmosMsgBeginRedelegate.encode(msgRedelegate).finish(),
            },
          ],
          extensionOptions: [],
          nonCriticalExtensionOptions: [],
          timeoutHeight: 0,
        };
        await this.toggleStakingOperationModal();
        transactionModule.start({
          tx: txBody,
          mode: CosmosBroadcastMode.BROADCAST_MODE_BLOCK,
        });
      }
    },
    async unbond() {
      const amount = this.stakingOperationAmount * 1000000;
      const fromValidatorAddress =
        this.stakingOperationValidatorFrom.validator_info.operator_address;
      if (accountModule.profile) {
        const msgUnbond: CosmosMsgUndelegate = {
          delegatorAddress: accountModule.profile.address,
          validatorAddress: fromValidatorAddress,
          amount: {
            denom: this.ucoinDenom!,
            amount: amount.toString(),
          },
        };
        const txBody: CosmosTxBody = {
          memo: "Unbond | Go-find",
          messages: [
            {
              typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
              value: CosmosMsgUndelegate.encode(msgUnbond).finish(),
            },
          ],
          extensionOptions: [],
          nonCriticalExtensionOptions: [],
          timeoutHeight: 0,
        };
        await this.toggleStakingOperationModal();
        transactionModule.start({
          tx: txBody,
          mode: CosmosBroadcastMode.BROADCAST_MODE_BLOCK,
        });
      }
    },
    async withdrawRewards(validatorAddress: string) {
      if (accountModule.profile) {
        const msgWithdrawRewards: CosmosMsgWithdrawDelegatorReward = {
          delegatorAddress: accountModule.profile.address,
          validatorAddress: validatorAddress,
        };
        const txBody: CosmosTxBody = {
          memo: "Withdraw Rewards | Go-find",
          messages: [
            {
              typeUrl:
                "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
              value:
                CosmosMsgWithdrawDelegatorReward.encode(
                  msgWithdrawRewards
                ).finish(),
            },
          ],
          extensionOptions: [],
          nonCriticalExtensionOptions: [],
          timeoutHeight: 0,
        };
        transactionModule.start({
          tx: txBody,
          mode: CosmosBroadcastMode.BROADCAST_MODE_BLOCK,
        });
      }
    },
  },
});
</script>