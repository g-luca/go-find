import { Profile } from '@/core/types/Profile';
import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import AuthModule, { AuthLevel } from './AuthModule';
import { useLazyQuery } from '@vue/apollo-composable';
import { AccountQuery } from '@/gql/AccountQuery';
import Account from '@/core/types/Account';
import ChainLink from '@/core/types/ChainLink';
import { apolloClient } from '@/gql/Apollo';
import { ApplicationLinkSubscription } from '@/gql/ApplicationLinkSubscription';
import ApplicationLinkModule from './ApplicationLinkModule';
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
                const getAccountQuery = useLazyQuery(
                    AccountQuery, {
                    dtag: authModule.account?.dtag,
                    address: authModule.account?.address,
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

                getAccountQuery.onResult((result) => {
                    if (result.loading) {
                        this.profileLoadingStatus = LoadingStatus.Loading;
                    }
                    if (result.data && !result.loading && authModule.account) {
                        // Manage Acccount info
                        if (result.data.profile[0]) {
                            // The profile exists
                            const profileRaw = result.data.profile[0];
                            const applicationLinks = ApplicationLinkModule.parseApplicationLinks(profileRaw);
                            const chainLinks: ChainLink[] = [];
                            if (profileRaw.chain_links && profileRaw.chain_links.length > 0) {
                                profileRaw.chain_links.forEach((chainLink: any) => {
                                    chainLinks.push(new ChainLink(chainLink.external_address, chainLink.chain_config.name));
                                })
                            }
                            this.profile = new Profile(profileRaw.dtag, profileRaw.address, profileRaw.nickname, profileRaw.bio, profileRaw.profile_pic, profileRaw.cover_pic, applicationLinks, chainLinks);
                        } else {
                            // The profile doesn't exists
                            this.isNewProfile = true;
                            this.profile = new Profile(authModule.account?.dtag, authModule.account?.address, "", "", "", "", [], []);
                        }

                        // Manage acccount data
                        if (result.data.account[0]) {
                            // Even if the profile hasn't been created on chain, has a balance > 0 or had transactions in the past
                            const accountRaw = result.data.account[0];

                            // calculate the total of the delegations (if they exists)
                            let delegationsTot = 0;
                            try {
                                accountRaw.delegations?.forEach((delegation: any) => {
                                    delegationsTot += Number(delegation.amount?.amount);
                                });
                            } catch { null }
                            this.account = new Account(authModule.account.address, Number(accountRaw.account_balances[0]?.coins[0]?.amount) / 1000000, delegationsTot / 1000000);
                        } else {
                            // The user hasn't done any transaction on chain, completelly new account
                            this.account = new Account(authModule.account.address, 0, 0);
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


}