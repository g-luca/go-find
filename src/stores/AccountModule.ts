import { DesmosClient } from '@desmoslabs/desmjs';
import Account from '@/core/types/Account';
import { LoadingStatus } from '@/core/types/LoadingStatus';
import { Profile } from '@/core/types/Profile';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { AccountSubscription } from '@/gql/AccountSubscription';
import { ProfileSubscription } from '@/gql/ProfileSubscription';
import { AccountQuery } from '@/gql/AccountQuery';
import { ProfileQuery } from '@/gql/ProfileQuery';
import { apolloClientDesmos } from '@/gql/ApolloDesmos';
import { apolloClientForbole } from '@/gql/ApolloForbole';
import { AccountDelegation, AccountDelegations } from '@/core/types/Account';
import { ApplicationLinkSubscription } from '@/gql/ApplicationLinkSubscription';
import { useLazyQuery, useApolloClient } from '@vue/apollo-composable';
import ChainLink from '@/core/types/ChainLink';
import { useApplicationLinkStore } from './ApplicationLinkModule';
import { AuthLevel, useAuthStore } from './AuthModule';


export const useAccountStore = defineStore({
    id: 'AccountStore',
    state: () => ({
        profile: false as Profile | false,
        account: false as Account | false,
        profileLoadingStatus: LoadingStatus.Loading,
        isNewProfile: false,
    }),
    getters: {
    },
    actions: {
        /**
         * Retrieve the Desmos profile account. If already loaded, returns the cached value if not forced
         * @param force force the reload of the profile data
         */
        async loadAccount(force = false): Promise<void> {
            const authStore = useAuthStore();
            if (force) {
                this.profile = false;
                this.account = false;
            }
            if (this.profile === false || force) {
                this.profileLoadingStatus = LoadingStatus.Loading;
                if (authStore.authLevel > AuthLevel.None && authStore.account) {

                    /* Load Account data */
                    const getAccountQuery = apolloClientForbole.query({
                        query: AccountQuery, variables: {
                            address: authStore.account.address,
                        }
                    });
                    const accountRaw = await getAccountQuery;
                    if (accountRaw.error) {
                        this.account = false;
                        this.profileLoadingStatus = LoadingStatus.Error;
                    }
                    if (accountRaw.data) {
                        this.account = parseGqlAccountResult(accountRaw.data);
                    } else {
                        // The user hasn't done any transaction on chain, completelly new account
                        this.account = new Account(authStore.account.address, 0, { delegations: [], totalAmount: 0, totalRewards: 0, totalUnbonding: 0 });
                    }


                    /* Load Profile */
                    const getProfileQuery = apolloClientDesmos.query({
                        query: ProfileQuery, variables: {
                            dtag: authStore.account?.dtag,
                            address: authStore.account?.address,
                        }
                    });
                    const profileRaw = await getProfileQuery;
                    if (profileRaw.error) {
                        this.profile = false;
                        this.profileLoadingStatus = LoadingStatus.Error;
                    }

                    if (accountRaw.data) {
                        // The profile exists
                        this.profile = parseGqlProfileResult(profileRaw.data.profile[0]);
                    } else {
                        // The profile doesn't exists
                        this.isNewProfile = true;
                        this.profile = new Profile(authStore.account?.dtag, authStore.account?.address, "", "", "", "", [], []);
                    }


                    this.profileLoadingStatus = LoadingStatus.Loaded;



                    const accountSubscription = apolloClientForbole.subscribe({
                        query: AccountSubscription,
                        variables: {
                            address: authStore.account?.address,
                        }
                    });
                    const profileSubscription = apolloClientDesmos.subscribe({
                        query: ProfileSubscription,
                        variables: {
                            dtag: authStore.account?.dtag,
                        }
                    });


                    const applicationLinkObserver = apolloClientDesmos.subscribe({
                        query: ApplicationLinkSubscription,
                        variables: {
                            dtag: authStore.account?.dtag,
                        },
                    })
                    applicationLinkObserver.subscribe((response) => {
                        const newApplicationLinks = useApplicationLinkStore().parseApplicationLinks(response['data']['profile'][0]);
                        if (this.profile) {
                            this.profile.applicationLinks = newApplicationLinks;
                        }
                    })

                    // subscribe to balance changes
                    accountSubscription.subscribe((response) => {
                        if (response && response.data.account[0]) {
                            this.account = parseGqlAccountResult(response.data.account[0]);
                        }
                    });

                    // subscribe to profile changes
                    profileSubscription.subscribe((response) => {
                        if (response && response.data.profile[0]) {
                            this.profile = parseGqlProfileResult(response.data.profile[0]);
                        }
                    });
                }
            }
        },


        /**
         * Retrieve a profile from the DTag
         * @param dtag DTag of the profile to retrieve
         * @returns the profile if found, null otherwise
         */
        async getProfile(dtag: string): Promise<Profile | null> {
            const apollo = useApolloClient();
            let profile: Profile | null = null;
            try {
                const profileRaw = await apollo.client.query({
                    query: AccountQuery, variables: { dtag, address: "" }, fetchPolicy: "no-cache"
                });
                if (profileRaw.data && profileRaw.data.profile[0]) {
                    profile = parseGqlProfileResult(profileRaw.data.profile[0]);
                }
            } catch (e) {
                // continue
            }
            return profile;
        },

        setNotNewProfile(): void {
            this.isNewProfile = false;
        },

        /**
         * Set a profile as new
         * @param dtag optional new dtag to set
         */
        setIsNewProfile(dtag = ''): void {
            this.isNewProfile = true;
            if (this.profile && dtag) {
                this.profile.dtag = dtag;
            }
        },

        /**
         * Reset the AccountModule state
         */
        reset(): void {
            this.profile = false;
            this.account = false;
            this.isNewProfile = false;
            this.profileLoadingStatus = LoadingStatus.Loading;
        },

    },
})



/**
 * Parse account result from GQL query/subscription
 * @param raw response raw from GQL query/subscription
 * @returns parsed account
 */
function parseGqlAccountResult(accountRaw: any): Account {
    // calculate the total of the delegations/rewards/unbonding (if they exists)
    // calculate the total of the delegations/rewards/unbonding (if they exists)
    let delegationsTot = 0;
    let rewardsTot = 0;
    let unbondingTot = 0;
    const finalDelegations: AccountDelegations = {
        delegations: [],
        totalAmount: 0,
        totalRewards: 0,
        totalUnbonding: 0,
    }

    const table = new Map<string, AccountDelegation>();
    try {
        accountRaw.delegations?.delegations?.forEach((delegation: any) => {
            table.set(delegation.validator_address, { amount: Number(delegation?.coins[0]?.amount), validator_address: delegation?.validator_address, rewards: 0 / 1000000, unbonding: 0 / 1000000 })
            delegationsTot += Number(delegation?.coins[0]?.amount / 1000000);
        });
        finalDelegations.totalAmount = delegationsTot;
    } catch { null }

    try {
        accountRaw.delegation_rewards?.forEach((reward: any) => {
            const tmp = table.get(reward.validator_address)
            tmp!.rewards = Number(reward.coins[0].amount);
            table.set(reward.validator_address, tmp!);
            rewardsTot += Number(reward.coins[0].amount);
        });
        finalDelegations.totalRewards = rewardsTot / 1000000;
    } catch { null }

    try {
        accountRaw.unbonding_delegations?.unbonding_delegations?.forEach((unbond: any) => {
            unbond.entries.forEach((unbondEntry: any) => {
                const tmp = table.get(unbond.validator_address)
                tmp!.unbonding = Number(unbondEntry.balance);
                table.set(unbond.validator_address, tmp!);
                unbondingTot += Number(unbondEntry.balance);
            });
        });
        finalDelegations.totalUnbonding = unbondingTot / 1000000;
    } catch { null }

    table.forEach((entry, key) => {
        finalDelegations.delegations.push({
            validator_address: key,
            amount: entry.amount,
            rewards: entry.rewards,
            unbonding: entry.unbonding,
        });
    })
    return new Account(accountRaw.account[0].address, Number(accountRaw.account_balances?.coins[0]?.amount || 0) / 1000000, finalDelegations);
}




/**
 * Parse profile result from GQL query/subscription
 * @param raw response raw from GQL query/subscription
 * @returns parsed profile
 */
function parseGqlProfileResult(profileRaw: any): Profile {
    // calculate the total of the delegations (if they exists)
    const applicationLinks = useApplicationLinkStore().parseApplicationLinks(profileRaw);
    const chainLinks: ChainLink[] = [];
    if (profileRaw.chain_links && profileRaw.chain_links.length > 0) {
        profileRaw.chain_links.forEach((chainLink: any) => {
            chainLinks.push(new ChainLink(chainLink.external_address, chainLink.chain_config.name));
        })
    }
    return new Profile(profileRaw.dtag, profileRaw.address, profileRaw.nickname, profileRaw.bio, profileRaw.profile_pic, profileRaw.cover_pic, applicationLinks, chainLinks);

}



// Register the store to enable HMR
registerModuleHMR(useAccountStore);