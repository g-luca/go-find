import User from '@/core/types/User';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import { provideApolloClient, useLazyQuery, useQuery } from '@vue/apollo-composable';
import { apolloClient } from '@/gql/Apollo';
import { ProfileQuery } from '@/gql/ProfileQuery';


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
                this.user = new User(profileRaw.dtag, profileRaw.address, profileRaw.nickname, profileRaw.bio, profileRaw.profile_pic, profileRaw.cover_pic);
                this.userLoadingStatus = LoadingStatus.Loaded;
            } else if (!result.loading) {
                this.user = false;
                this.userLoadingStatus = LoadingStatus.Error;
            }
        })
        getProfileQuery.load();
    }
}