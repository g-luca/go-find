import Api from '@/core/api/Api';
import User from '@/core/types/User';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import { useLazyQuery } from '@vue/apollo-composable';
import { ProfileSearchQuery } from '@/gql/ProfileSearchQuery';

@Module({ store, name: 'SearchModule', dynamic: true })
export default class SearchModule extends VuexModule {
    public users: Array<User> = [];
    public userSearchStatus: LoadingStatus = LoadingStatus.Loading;
    private searchingUsername = ""; // stores the newest username input value, used to avoid the search at every character

    /**
     * Search a user Desmos profile from a given username or from the search cache
     * @param username username to search
     */
    @Mutation
    async search(username: string): Promise<void> {
        this.searchingUsername = username;
        setTimeout(async () => {
            if (this.searchingUsername === username) {
                this.userSearchStatus = LoadingStatus.Loading;
                const getProfileQuery = useLazyQuery(
                    ProfileSearchQuery, {
                    query: `${username}%`
                });
                getProfileQuery.onResult((result) => {
                    if (result.loading) {
                        this.userSearchStatus = LoadingStatus.Loading;
                    }
                    if (result.data && result.data.profile.length > 0 && !result.loading) {
                        this.users = [];
                        const profilesRaw = result.data.profile;
                        profilesRaw.forEach((profileRaw: any) => {
                            const user = new User(profileRaw.dtag, profileRaw.address, profileRaw.nickname, profileRaw.bio, profileRaw.profile_pic, profileRaw.cover_pic);
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