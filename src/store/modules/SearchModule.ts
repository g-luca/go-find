import Api from '@/core/api/Api';
import { Profile } from '@/core/types/Profile';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import { useLazyQuery } from '@vue/apollo-composable';
import { ProfileSearchQuery } from '@/gql/ProfileSearchQuery';

@Module({ store, name: 'SearchModule', dynamic: true })
export default class SearchModule extends VuexModule {
    public users: Array<Profile> = [];
    public userSearchStatus: LoadingStatus = LoadingStatus.Loading;
    private searchingDtag = ""; // stores the newest dtag input value, used to avoid the search at every character

    /**
     * Search a user Desmos profile from a given dtag or from the search cache
     * @param dtag dtag to search
     */
    @Mutation
    async search(dtag: string): Promise<void> {
        this.searchingDtag = dtag;
        setTimeout(async () => {
            if (this.searchingDtag === dtag) {
                this.userSearchStatus = LoadingStatus.Loading;
                const getProfileQuery = useLazyQuery(
                    ProfileSearchQuery, {
                    query: `${dtag}%`
                });
                getProfileQuery.onResult((result) => {
                    if (result.loading) {
                        this.userSearchStatus = LoadingStatus.Loading;
                    }
                    if (result.data && result.data.profile.length > 0 && !result.loading) {
                        this.users = [];
                        const profilesRaw = result.data.profile;
                        profilesRaw.forEach((profileRaw: any) => {
                            const user = new Profile(profileRaw.dtag, profileRaw.address, profileRaw.nickname, profileRaw.bio, profileRaw.profile_pic, profileRaw.cover_pic);
                            this.users.push(user);
                        });
                        this.userSearchStatus = LoadingStatus.Loaded;
                    } else if (!result.loading) {
                        this.users = [];
                        this.userSearchStatus = LoadingStatus.Error;
                    }
                })
                getProfileQuery.load();
            }
        }, 250);
    }
}