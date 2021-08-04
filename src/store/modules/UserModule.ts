import User from '@/core/types/User';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import { provideApolloClient, useLazyQuery } from '@vue/apollo-composable';
import { apolloClient } from '@/gql/Apollo';
import { ProfileQuery } from '@/gql/ProfileQuery';
import ApplicationLinkDiscord from '@/core/types/ApplicationLinks/ApplicationLinkDiscord';
import ApplicationLink from '@/core/types/ApplicationLink';
import ApplicationLinkGithub from '@/core/types/ApplicationLinks/ApplicationLinkGithub';
import ApplicationLinkTwitter from '@/core/types/ApplicationLinks/ApplicationLinkTwitter';
import ChainLink from '@/core/types/ChainLink';


provideApolloClient(apolloClient)

@Module({ store, name: 'UserModule', dynamic: true })
export default class UserModule extends VuexModule {
    protected user: User | false = false;
    public userLoadingStatus: LoadingStatus = LoadingStatus.Loading;


    /**
     * Retrieve a user Desmos profile from a given dtag
     * @param dtag dtag of the profile to get
     */
    @Mutation
    async loadUser(dtag: string): Promise<void> {
        const getProfileQuery = useLazyQuery(
            ProfileQuery, {
            dtag: dtag
        });
        getProfileQuery.onResult((result) => {
            if (result.loading) {
                this.userLoadingStatus = LoadingStatus.Loading;
            }
            if (result.data && result.data.profile[0] && !result.loading) {
                const profileRaw = result.data.profile[0];
                const applicationLinks: ApplicationLink[] = [];
                if (profileRaw.application_links && profileRaw.application_links.length > 0) {
                    profileRaw.application_links.forEach((applicationLinkRaw: any) => {
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
                this.user = new User(profileRaw.dtag, profileRaw.address, profileRaw.nickname, profileRaw.bio, profileRaw.profile_pic, profileRaw.cover_pic, applicationLinks, chainLinks);
                this.userLoadingStatus = LoadingStatus.Loaded;
            } else if (!result.loading) {
                this.user = false;
                this.userLoadingStatus = LoadingStatus.Error;
            }
        })
        getProfileQuery.load();
    }
}