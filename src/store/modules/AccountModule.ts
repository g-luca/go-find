import User from '@/core/types/User';
import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import AuthModule, { AuthLevel } from './AuthModule';
import { DesmosTypes } from 'desmosjs';
import ApplicationLink from '@/core/types/ApplicationLink';
import ApplicationLinkDiscord from '@/core/types/ApplicationLinks/ApplicationLinkDiscord';
import ApplicationLinkGithub from '@/core/types/ApplicationLinks/ApplicationLinkGithub';
import ApplicationLinkTwitter from '@/core/types/ApplicationLinks/ApplicationLinkTwitter';
import { useLazyQuery } from '@vue/apollo-composable';
import { AccountQuery } from '@/gql/AccountQuery';
const authModule = getModule(AuthModule);

@Module({ store, name: 'AccountModule', dynamic: true })
export default class AccountModule extends VuexModule {
    private _user: User | false = false;
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
                    if (result.data && result.data.profile[0] && !result.loading) {
                        const accountRaw = result.data.profile[0];
                        const applicationLinks: ApplicationLink[] = [];
                        if (accountRaw.application_links && accountRaw.application_links.length > 0) {
                            accountRaw.application_links.forEach((applicationLinkRaw: any) => {
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
                        this._user = new User(accountRaw.dtag, accountRaw.address, accountRaw.nickname, accountRaw.bio, accountRaw.profile_pic, accountRaw.cover_pic, applicationLinks);
                        this.userLoadingStatus = LoadingStatus.Loaded;
                    } else if (!result.loading) {
                        this._user = false;
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