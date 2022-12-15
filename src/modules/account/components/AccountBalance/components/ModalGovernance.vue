<template>
  <span>
    <div class="inline">
      <button
        type="button"
        class="text-white dark:text-white hover:text-purple-400 dark:hover:text-purple-400"
        @click="toggleModal"
      >
        <div class="py-1.5 px-3 text-lg font-medium bg-blue-900 rounded-full focus:outline-none focus-visible:ring-2 w-10 mx-auto">
          <i class="bi bi-journal-text" />
        </div>
        <div class="dark:text-gray-200 text-black text-sm font-thin">Proposals</div>
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
                    <h1 class="text-purple-800 text-4xl">Governance</h1>
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
                  <div v-if="isLoadinGovernance">
                    <div class="grid grid-cols-12">
                      <SkeletonLoader
                        v-for="i in [1,2,3,4,5]"
                        :key="i"
                        class="w-full h-52 p-4 col-span-12 md:col-span-6 lg:col-span-4 "
                      />
                    </div>
                  </div>
                  <div
                    v-else
                    class="grid grid-cols-12"
                  >
                    <div
                      v-if="proposals.length <= 0"
                      class="col-span-12"
                    >
                      <p class="text-2xl text-center py-4">
                        No active proposals at the moment.
                      </p>
                    </div>
                    <div
                      v-else
                      v-for="proposal in proposals"
                      class="col-span-12 md:col-span-6 lg:col-span-4 m-4"
                    >
                      <div class="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-6 pb-1 h-96">
                        <div class="flex-none">
                          <div class="flex">
                            <div class="flex-grow">
                              <h3 class="font-semibold text-lg">
                                <span class="text-gray-500">{{proposal.id}}. </span>{{proposal.title}}
                              </h3>
                            </div>
                            <div class="flex-grow-0">
                              <!-- Rejected -->
                              <span
                                v-if="proposal.status==='PROPOSAL_STATUS_REJECTED'"
                                class="bg-red-400 px-4 py-0.5 rounded-lg text-maroon-900"
                              >
                                Rejected
                              </span>

                              <!-- Failed -->
                              <span
                                v-if="proposal.status==='PROPOSAL_STATUS_FAILED'"
                                class="bg-red-400 px-4 py-0.5 rounded-lg text-maroon-900"
                              >
                                Failed
                              </span>

                              <!-- Passed -->
                              <span
                                v-if="proposal.status==='PROPOSAL_STATUS_PASSED'"
                                class="bg-green-400 px-4 py-0.5 rounded-lg text-green-900"
                              >
                                Passed
                              </span>

                              <!-- Passed -->
                              <span
                                v-if="proposal.status==='PROPOSAL_STATUS_VOTING_PERIOD'"
                                class="bg-yellow-400 px-4 py-0.5 rounded-lg text-yellow-900"
                              >
                                Voting
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          class="flex-grow overflow-y-auto text-gray-600 dark:text-gray-400 text-sm"
                          v-html="proposal.description"
                        />

                        <div class="flex-0 mt-auto pb-1">
                          <BarChart
                            class="min-w-full h-6 md:h-7 mt-4"
                            :chartData="proposal.tally_chart"
                            :options="chartOptions"
                          />
                          <div class="grid grid-cols-12 text-xs ">
                            <div
                              class="pt-1 pb-2"
                              :class="proposal.status==='PROPOSAL_STATUS_VOTING_PERIOD'?'col-span-7':'col-span-12'"
                            >
                              Quorum: {{proposal.proposal_tally_percentage.total_votes}}% / {{Number(governanceParams.tally_params.quorum*100).toFixed(1)}}%
                            </div>
                            <div
                              class="col-span-5 pt-1 pb-2"
                              v-if="proposal.status==='PROPOSAL_STATUS_VOTING_PERIOD'"
                            >
                              <div class="text-right">
                                End: {{new Date(proposal.voting_end_time + 'z').toLocaleString()}}
                              </div>
                            </div>
                            <div class="col-span-6 md:col-span-4 py-0.5">
                              <span
                                class="relative inline-flex rounded-full h-2 w-2"
                                style="background:#42f56f"
                              />
                              {{proposal.proposal_tally_percentage['yes']}}%
                              <span class="text-xs">
                                Yes
                              </span>
                            </div>
                            <div class="col-span-6 md:col-span-4 py-0.5">
                              <span
                                class="relative inline-flex rounded-full h-2 w-2"
                                style="background:#f55742"
                              />
                              {{proposal.proposal_tally_percentage['no']}}%
                              <span class="text-xs">
                                No
                              </span>
                            </div>
                            <div class="col-span-6 md:col-span-4 py-0.5">
                              <span
                                class="relative inline-flex rounded-full h-2 w-2"
                                style="background:#000000"
                              />
                              {{proposal.proposal_tally_percentage['no_with_veto']}}%
                              <span class="text-xs">
                                No (Veto)
                              </span>
                            </div>
                            <div class="col-span-6 md:col-span-4 py-0.5">
                              <span
                                class="relative inline-flex rounded-full h-2 w-2"
                                style="background:#949494"
                              />
                              {{proposal.proposal_tally_percentage['abstain']}}%
                              <span class="text-xs">
                                Abstained
                              </span>
                            </div>
                          </div>

                          <!-- Vote -->
                          <span>
                            <div class="grid grid-cols-12 py-2">
                              <div class="col-span-8">
                                <select
                                  v-if="proposal.status==='PROPOSAL_STATUS_VOTING_PERIOD'||selectedVotes[proposal.id]"
                                  v-model="selectedVotes[proposal.id]"
                                  class="block w-full text-gray-700 py-1 px-6 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:shadow-outline"
                                  :disabled="proposal.status!=='PROPOSAL_STATUS_VOTING_PERIOD'"
                                >
                                  <option value="">
                                    Select a vote
                                  </option>
                                  <option value="VOTE_OPTION_ABSTAIN">
                                    Abstain
                                  </option>
                                  <option value="VOTE_OPTION_YES">
                                    Yes
                                  </option>
                                  <option value="VOTE_OPTION_NO">
                                    No
                                  </option>
                                  <option value="VOTE_OPTION_NO_WITH_VETO">
                                    No With Veto
                                  </option>
                                </select>
                              </div>

                              <div class="col-span-4 text-right pl-4">
                                <button
                                  v-if="selectedVotes[proposal.id]&&proposal.status==='PROPOSAL_STATUS_VOTING_PERIOD'"
                                  class="bg-royalblue-600 text-white rounded-lg px-3 py-0.5 w-full"
                                  @click="onVote(proposal.id, selectedVotes[proposal.id])"
                                >
                                  Vote
                                </button>
                              </div>
                            </div>
                          </span>
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
  </span>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
import { useApolloClient } from "@vue/apollo-composable";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import { GovernanceQuery } from "@/gql/GovernanceQuery";
import DOMPurify from "dompurify";
import { BarChart } from "vue-chart-3";
import { Chart, ChartOptions, registerables } from "chart.js";
import { marked } from "marked";
import { CosmosTxBody } from "desmosjs";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { BroadcastMode } from "@cosmjs/launchpad";
import { useTransactionStore } from "@/stores/TransactionModule";
import { useAuthStore } from "@/stores/AuthModule";
import Long from "long";
import { MsgVoteEncodeObject } from "@cosmjs/stargate";
import { apolloClientForbole } from "@/gql/ApolloForbole";

Chart.register(...registerables);

export default defineComponent({
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    SkeletonLoader,
    BarChart,
  },
  setup() {
    const chartOptions: ChartOptions = {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          stacked: true,
          display: false,
          max: 100,
        },
        y: {
          stacked: true,
          display: false,
          weight: 1,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    };
    return {
      authStore: useAuthStore(),
      transactionStore: useTransactionStore(),
      isOpen: ref(false),
      isLoadinGovernance: ref(false),
      proposals: ref([]),
      governanceParams: ref({}),
      chartOptions,
      selectedVotes: ref([] as string[]),
    };
  },
  methods: {
    async toggleModal() {
      this.isOpen = !this.isOpen;
      this.isLoadinGovernance = false;
      this.loadGovernance();
    },
    /**
     * Load active validators list and their profiles
     */
    async loadGovernance() {
      this.isLoadinGovernance = true;
      this.proposals = [];
      try {
        const governanceRaw = await apolloClientForbole.query({
          query: GovernanceQuery,
          variables: {
            address: this.authStore.account?.address,
          },
          fetchPolicy: "no-cache",
        });
        if (governanceRaw.data) {
          const proposalsRaw = governanceRaw.data.proposal_aggregate?.nodes;
          if (proposalsRaw.length > 0) {
            for (let i = 0; i < proposalsRaw.length; i++) {
              // set value if already voted
              this.selectedVotes[proposalsRaw[i].id] =
                proposalsRaw[i].proposal_votes[0]?.option || "";

              // sanitize description
              proposalsRaw[i].description = DOMPurify.sanitize(
                marked(proposalsRaw[i].description)
              ).replace(/\\n/g, "<br>");

              const maxVotes = Number(
                proposalsRaw[i].staking_pool_snapshot.bonded_tokens
              );
              const tallyYes = Number(
                proposalsRaw[i].proposal_tally_result["yes"]
              );
              const tallyNo = Number(
                proposalsRaw[i].proposal_tally_result["no"]
              );
              const tallyAbstain = Number(
                proposalsRaw[i].proposal_tally_result["abstain"]
              );
              const tallyNoWithVeto = Number(
                proposalsRaw[i].proposal_tally_result["no_with_veto"]
              );

              const tallyTotalVotes =
                tallyYes + tallyNo + tallyAbstain + tallyNoWithVeto;

              proposalsRaw[i].proposal_tally_percentage = {
                yes: ((tallyYes / tallyTotalVotes) * 100).toFixed(1),
                no: ((tallyNo / tallyTotalVotes) * 100).toFixed(1),
                abstain: ((tallyAbstain / tallyTotalVotes) * 100).toFixed(1),
                no_with_veto: (
                  (tallyNoWithVeto / tallyTotalVotes) *
                  100
                ).toFixed(1),
                total_votes: ((tallyTotalVotes / maxVotes) * 100).toFixed(1),
              };

              proposalsRaw[i].tally_chart = {
                type: "horizontalBar",
                labels: ["Results"],
                datasets: [
                  {
                    label: "Yes",
                    data: [this.parseTallyValue(tallyYes, tallyTotalVotes)],
                    backgroundColor: "#42f56f",
                    borderWidth: 1,
                  },
                  {
                    label: "No",
                    data: [this.parseTallyValue(tallyNo, tallyTotalVotes)],
                    backgroundColor: "#f55742",
                    borderWidth: 1,
                  },
                  {
                    label: "No with Veto",
                    data: [
                      this.parseTallyValue(tallyNoWithVeto, tallyTotalVotes),
                    ],
                    backgroundColor: "#000000",
                    borderWidth: 1,
                  },
                  {
                    label: "Abstain",
                    data: [this.parseTallyValue(tallyAbstain, tallyTotalVotes)],
                    backgroundColor: "#949494",
                    borderWidth: 1,
                  },
                ],
              };
            }
            this.proposals = proposalsRaw;
          }
          this.governanceParams = governanceRaw.data.gov_params[0];
        }
      } catch (e) {
        // continue
      }
      this.isLoadinGovernance = false;
    },
    parseTallyValue(value: number, max: number): number {
      return (value / max) * 100;
    },
    async onVote(proposalIdRaw: string, voteString: string) {
      const proposalId = Number(proposalIdRaw);
      const vote: VoteOption = (<any>VoteOption)[voteString]; // cast the vote from string to enum
      if (this.authStore.account) {
        const msgVote: MsgVoteEncodeObject = {
          typeUrl: "/cosmos.gov.v1beta1.MsgVote",
          value: {
            option: vote,
            proposalId: Long.fromNumber(proposalId),
            voter: this.authStore.account?.address,
          },
        };
        await this.toggleModal();
        this.transactionStore.start({
          messages: [msgVote],
          mode: BroadcastMode.Block,
          memo: "Vote | Go-find",
        });
      }
    },
  },
});
</script>