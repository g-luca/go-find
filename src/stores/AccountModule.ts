import Account from '@/core/types/Account';
import { LoadingStatus } from '@/core/types/LoadingStatus';
import { Profile } from '@/core/types/Profile';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { AccountSubscription } from '@/gql/AccountSubscription';
import { ProfileSubscription } from '@/gql/ProfileSubscription';
import { AccountQuery } from '@/gql/AccountQuery';
import { apolloClient } from '@/gql/Apollo';
import { ApplicationLinkSubscription } from '@/gql/ApplicationLinkSubscription';
import { useLazyQuery, useApolloClient } from '@vue/apollo-composable';
import { getModule } from 'vuex-module-decorators';
import AuthModule, { AuthLevel } from '@/store/modules/AuthModule';
import ApplicationLinkModule from '@/store/modules/ApplicationLinkModule';
import ChainLink from '@/core/types/ChainLink';
const authModule = getModule(AuthModule);


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
         * Retrieve the account Desmos profile. If already loaded, returns the cached value if not forced
         * @param force force the reload of the profile data
         */
        async loadAccount(force = false): Promise<void> {
            this.isNewProfile = false;
            this.profile = false;
            this.account = false;
            this.profileLoadingStatus = LoadingStatus.Loading;
            if (this.profile === false || force) {
                this.profileLoadingStatus = LoadingStatus.Loading;
                if (authModule.authLevel > AuthLevel.None && authModule.account) {
                    const getAccountQuery = useLazyQuery(
                        AccountQuery, {
                        dtag: authModule.account?.dtag,
                        address: authModule.account?.address,
                    });
                    const accountSubscription = apolloClient.subscribe({
                        query: AccountSubscription,
                        variables: {
                            address: authModule.account?.address,
                        }
                    });
                    const profileSubscription = apolloClient.subscribe({
                        query: ProfileSubscription,
                        variables: {
                            dtag: authModule.account?.dtag,
                        }
                    });


                    const applicationLinkObserver = apolloClient.subscribe({
                        query: ApplicationLinkSubscription,
                        variables: {
                            dtag: authModule.account?.dtag,
                        },
                    })
                    applicationLinkObserver.subscribe((response) => {
                        const newApplicationLinks = ApplicationLinkModule.parseApplicationLinks(response['data']['profile'][0]);
                        if (this.profile) {
                            this.profile.applicationLinks = newApplicationLinks;
                        }
                    })

                    // parse account result query/subscription
                    getAccountQuery.onResult((result) => {
                        if (result.loading) {
                            this.profileLoadingStatus = LoadingStatus.Loading;
                        }
                        if (result.data && !result.loading && authModule.account) {
                            // Manage Acccount info
                            if (result.data.profile[0]) {
                                // The profile exists
                                this.profile = parseGqlProfileResult(result.data.profile[0]);
                            } else {
                                // The profile doesn't exists
                                this.isNewProfile = true;
                                this.profile = new Profile(authModule.account?.dtag, authModule.account?.address, "", "", "", "", [], []);
                            }

                            // Manage acccount data
                            if (result.data.account[0]) {
                                this.account = parseGqlAccountResult(result.data.account[0]);
                            } else {
                                // The user hasn't done any transaction on chain, completelly new account
                                this.account = new Account(authModule.account.address, 0, 0, 0, 0);
                            }
                            this.profileLoadingStatus = LoadingStatus.Loaded;
                        } else {
                            // Connection / graphQL issues
                            this.profile = false;
                            this.account = false;
                            this.profileLoadingStatus = LoadingStatus.Error;
                        }
                    })
                    getAccountQuery.load();

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

        setIsNewProfile(): void {
            this.isNewProfile = true;
        },

        /**
         * Reset the AccountModule state
         */
        reset(): void {
            this.profile = false;
            this.account = false;
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
    let delegationsTot = 0;
    let rewardsTot = 0;
    let unbondingTot = 0;
    try {
        accountRaw.delegations?.forEach((delegation: any) => {
            delegationsTot += Number(delegation.amount?.amount);
        });
    } catch { null }

    try {
        accountRaw.delegation_rewards?.forEach((reward: any) => {
            rewardsTot += Number(reward.amount[0].amount);
        });
    } catch { null }

    try {
        accountRaw.unbonding_delegations?.forEach((unbond: any) => {
            unbondingTot += Number(unbond.amount[0].amount);
        });
    } catch { null }
    return new Account(accountRaw.address, Number(accountRaw.account_balances[0]?.coins[0]?.amount || 0) / 1000000, delegationsTot / 1000000, rewardsTot / 1000000, unbondingTot / 1000000);
}




/**
 * Parse profile result from GQL query/subscription
 * @param raw response raw from GQL query/subscription
 * @returns parsed profile
 */
function parseGqlProfileResult(profileRaw: any): Profile {
    // calculate the total of the delegations (if they exists)
    const applicationLinks = ApplicationLinkModule.parseApplicationLinks(profileRaw);
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