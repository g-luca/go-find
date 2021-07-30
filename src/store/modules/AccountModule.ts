import User from '@/core/types/User';
import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import AuthModule, { AuthLevel } from './AuthModule';
import ApplicationLink from '@/core/types/ApplicationLink';
import ApplicationLinkDiscord from '@/core/types/ApplicationLinks/ApplicationLinkDiscord';
import ApplicationLinkGithub from '@/core/types/ApplicationLinks/ApplicationLinkGithub';
import ApplicationLinkTwitter from '@/core/types/ApplicationLinks/ApplicationLinkTwitter';
import { useLazyQuery } from '@vue/apollo-composable';
import { AccountQuery } from '@/gql/AccountQuery';
import Account from '@/core/types/Account';
import ChainLink from '@/core/types/ChainLink';
const authModule = getModule(AuthModule);

@Module({ store, name: 'AccountModule', dynamic: true })
export default class AccountModule extends VuexModule {
    private _user: User | false = false;
    private _account: Account | false = false;
    public userLoadingStatus: LoadingStatus = LoadingStatus.Loading;


    /**
     * Retrieve a user Desmos profile from the auth username
     * 
     * @param force force the reload of the profile data
     */
    @Mutation
    async loadAccount(force = false): Promise<void> {
        if (this._user === false || force) {
            this.userLoadingStatus = LoadingStatus.Loading;
            if (authModule.authLevel > AuthLevel.None && authModule.account) {
                const getAccountQuery = useLazyQuery(
                    AccountQuery, {
                    dtag: authModule.account?.username,
                    address: authModule.account?.address,
                });
                getAccountQuery.onResult((result) => {
                    if (result.loading) {
                        this.userLoadingStatus = LoadingStatus.Loading;
                    }
                    if (result.data && !result.loading && authModule.account) {
                        // Manage Acccount info
                        if (result.data.profile[0]) {
                            // The profile exists
                            const profileRaw = result.data.profile[0];
                            const applicationLinks: ApplicationLink[] = [];
                            if (profileRaw.application_links && profileRaw.application_links.length > 0) {
                                profileRaw.application_links.forEach((applicationLinkRaw: any) => {
                                    //TODO: this has to be managed in a different place
                                    switch (applicationLinkRaw.application) {
                                        case "discord":
                                            applicationLinks.push(new ApplicationLinkDiscord(applicationLinkRaw.username));
                                            break;
                                        case "github":
                                            applicationLinks.push(new ApplicationLinkGithub(applicationLinkRaw.username));
                                            break;
                                        case "twitter":
                                            applicationLinks.push(new ApplicationLinkTwitter(applicationLinkRaw.username));
                                            break;
                                    }
                                })
                            }
                            const chainLinks: ChainLink[] = [];
                            if (profileRaw.chain_links && profileRaw.chain_links.length > 0) {
                                profileRaw.chain_links.forEach((chainLink: any) => {
                                    chainLinks.push(new ChainLink(chainLink.external_address, chainLink.chain_link_chain_config.name));
                                })
                            }
                            this._user = new User(profileRaw.dtag, profileRaw.address, profileRaw.nickname, profileRaw.bio, profileRaw.profile_pic, profileRaw.cover_pic, applicationLinks, chainLinks);
                        } else {
                            // The profile doesn't exists
                            this._user = new User(authModule.account?.username, authModule.account?.address, "", "", "", "", [], []);
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
                            this._account = new Account(authModule.account.address, Number(accountRaw.account_balances[0]?.coins[0]?.amount) / 1000000, delegationsTot / 1000000);
                        } else {
                            // The user hasn't done any transaction on chain, completelly new account
                            this._account = new Account(authModule.account.address, 0, 0);
                        }
                        this.userLoadingStatus = LoadingStatus.Loaded;
                    } else {
                        // Connection / graphQL issues
                        this._user = false;
                        this._account = false;
                        this.userLoadingStatus = LoadingStatus.Error;
                    }
                })
                getAccountQuery.load();
            }
        }
    }



    /**
     * Getter user
     * @return {User }
     */
    public get user(): User | false {
        return this._user;
    }

}