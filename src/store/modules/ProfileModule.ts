import { Profile } from '@/core/types/Profile';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import { provideApolloClient, useLazyQuery } from '@vue/apollo-composable';
import { apolloClientDesmos } from '@/gql/ApolloDesmos';
import { ProfileQuery } from '@/gql/ProfileQuery';
import ChainLink from '@/core/types/ChainLink';
import ApplicationLinkModule from './ApplicationLinkModule';


provideApolloClient(apolloClientDesmos)

@Module({ store, name: 'ProfileModule', dynamic: true })
export default class ProfileModule extends VuexModule {
    public profile: Profile | false = false;
    public profileLoadingStatus: LoadingStatus = LoadingStatus.Loading;


    /**
     * Retrieve a user Desmos profile from a given dtag or address
     * @param dtag if set retrieve the Desmos profile using the DTag
     *@param address if set retrieve the Desmos profile using the address
     */
    @Mutation
    async loadUser(payload: { dtag: string, address: string }): Promise<void> {
        const getProfileQuery = useLazyQuery(
            ProfileQuery, {
            dtag: payload.dtag,
            address: payload.address
        });
        getProfileQuery.onResult((result) => {
            if (result.loading) {
                this.profileLoadingStatus = LoadingStatus.Loading;
            }
            if (result.data && result.data.profile[0] && !result.loading) {
                const profileRaw = result.data.profile[0];
                const applicationLinks = ApplicationLinkModule.parseApplicationLinks(profileRaw);
                const chainLinks: ChainLink[] = [];
                if (profileRaw.chain_links && profileRaw.chain_links.length > 0) {
                    profileRaw.chain_links.forEach((chainLink: any) => {
                        chainLinks.push(new ChainLink(chainLink.external_address, chainLink.chain_config.name));
                    })
                }
                this.profile = new Profile(profileRaw.dtag, profileRaw.address, profileRaw.nickname, profileRaw.bio, profileRaw.profile_pic, profileRaw.cover_pic, applicationLinks, chainLinks);
                this.profileLoadingStatus = LoadingStatus.Loaded;
            } else if (!result.loading) {
                this.profile = false;
                this.profileLoadingStatus = LoadingStatus.Error;
            }
        })
        getProfileQuery.load();
    }
}