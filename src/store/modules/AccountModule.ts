import { AccountDelegation, AccountDelegations } from './../../core/types/Account';
import { ProfileQuery } from '@/gql/ProfileQuery';
import { Profile } from '@/core/types/Profile';
import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import AuthModule, { AuthLevel } from './AuthModule';
import { useLazyQuery, useApolloClient } from '@vue/apollo-composable';
import { AccountQuery } from '@/gql/AccountQuery';
import Account from '@/core/types/Account';
import ChainLink from '@/core/types/ChainLink';
import { apolloClientDesmos } from '@/gql/ApolloDesmos';
import { apolloClientForbole } from '@/gql/ApolloForbole';
import { ApplicationLinkSubscription } from '@/gql/ApplicationLinkSubscription';
import ApplicationLinkModule from './ApplicationLinkModule';
import { AccountSubscription } from '@/gql/AccountSubscription';
import { ProfileSubscription } from '@/gql/ProfileSubscription';
const authModule = getModule(AuthModule);

@Module({ store, name: 'AccountModule', dynamic: true })
export default class AccountModule extends VuexModule {
    public profile: Profile | false = false;
    public account: Account | false = false;
    public profileLoadingStatus: LoadingStatus = LoadingStatus.Loading;
    public isNewProfile = false;


    /**
     * Retrieve the account Desmos profile. If already loaded, returns the cached value if not forced
     * @param force force the reload of the profile data
     */
    @Mutation
    async loadAccount(force = false): Promise<void> {
        this.isNewProfile = false;
        this.profile = false;
        this.account = false;
        this.profileLoadingStatus = LoadingStatus.Loading;
        if (this.profile === false || force) {
            this.profileLoadingStatus = LoadingStatus.Loading;
            if (authModule.authLevel > AuthLevel.None && authModule.account) {
                this.profileLoadingStatus = LoadingStatus.Loading; // set loading


                /* Load Account data */
                const getAccountQuery = apolloClientForbole.query({
                    query: AccountQuery, variables: {
                        address: authModule.account?.address,
                    }
                });
                const accountRaw = await getAccountQuery;
                if (accountRaw.error) {
                    this.account = false;
                    this.profileLoadingStatus = LoadingStatus.Error;
                }

                if (accountRaw.data) {
                    this.account = AccountModule.parseGqlAccountResult(accountRaw.data);
                } else {
                    // The user hasn't done any transaction on chain, completelly new account
                    this.account = new Account(authModule.account.address, 0, { delegations: [], totalAmount: 0, totalRewards: 0, totalUnbonding: 0 });
                }

                /* Load Profile */
                const getProfileQuery = apolloClientDesmos.query({
                    query: ProfileQuery, variables: {
                        dtag: authModule.account?.dtag,
                        address: authModule.account?.address,
                    }
                });
                const profileRaw = await getProfileQuery;
                if (profileRaw.error) {
                    this.profile = false;
                    this.profileLoadingStatus = LoadingStatus.Error;
                }

                if (accountRaw.data) {
                    // The profile exists
                    this.profile = AccountModule.parseGqlProfileResult(profileRaw.data.profile[0]);
                } else {
                    // The profile doesn't exists
                    this.isNewProfile = true;
                    this.profile = new Profile(authModule.account?.dtag, authModule.account?.address, "", "", "", "", [], []);
                }


                this.profileLoadingStatus = LoadingStatus.Loaded;



                // subscribe to profile changes
                const profileSubscription = apolloClientDesmos.subscribe({
                    query: ProfileSubscription,
                    variables: {
                        dtag: authModule.account?.dtag,
                    }
                });
                profileSubscription.subscribe((response) => {
                    if (response && response.data.profile[0]) {
                        this.profile = AccountModule.parseGqlProfileResult(response.data.profile[0]);
                    }
                });

                /* 
                                // subscribe to application links changes
                                const applicationLinkObserver = apolloClientDesmos.subscribe({
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
                 */

                // subscribe to balance changes
                //TODO: FIX
                /*const accountSubscription = apolloClientForbole.subscribe({
                    query: AccountSubscription,
                    variables: {
                        address: authModule.account?.address,
                    }
                });
                accountSubscription.subscribe((response) => {
                    if (response && response.data.account[0]) {
                        this.account = AccountModule.parseGqlAccountResult(response.data.account[0]);
                    }
                }); */

            }
        }
    }

    @Mutation
    setNotNewProfile(): void {
        this.isNewProfile = false;
    }

    @Mutation
    setIsNewProfile(): void {
        this.isNewProfile = true;
    }

    /**
     * Reset the AccountModule state
     */
    @Mutation
    reset(): void {
        this.profile = false;
        this.account = false;
        this.profileLoadingStatus = LoadingStatus.Loading;
    }


    /**
     * Retrieve a profile from the DTag
     * @param dtag DTag of the profile to retrieve
     * @returns the profile if found, null otherwise
     */
    public static async getProfile(dtag: string): Promise<Profile | null> {
        const apollo = useApolloClient();
        let profile: Profile | null = null;
        try {
            const profileRaw = await apollo.client.query({
                query: ProfileQuery, variables: { dtag, address: "" }, fetchPolicy: "no-cache"
            });
            if (profileRaw.data && profileRaw.data.profile[0]) {
                profile = AccountModule.parseGqlProfileResult(profileRaw.data.profile[0]);
            }
        } catch (e) {
            // continue
        }
        return profile;
    }


    /**
     * Parse account result from GQL query/subscription
     * @param raw response raw from GQL query/subscription
     * @returns parsed account
     */
    private static parseGqlAccountResult(accountRaw: any): Account {
        // calculate the total of the delegations/rewards/unbonding (if they exists)
        let delegationsTot = 0;
        let rewardsTot = 0;
        let unbondingTot = 0;
        let finalDelegations: AccountDelegations = {
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
                let tmp = table.get(reward.validator_address)
                tmp!.rewards = Number(reward.coins[0].amount);
                table.set(reward.validator_address, tmp!);
                rewardsTot += Number(reward.coins[0].amount);
            });
            finalDelegations.totalRewards = rewardsTot / 1000000;
        } catch { null }

        try {
            accountRaw.unbonding_delegations?.unbonding_delegations?.forEach((unbond: any) => {
                unbond.entries.forEach((unbondEntry: any) => {
                    let tmp = table.get(unbond.validator_address)
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
    private static parseGqlProfileResult(profileRaw: any): Profile {
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

}