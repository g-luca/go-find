import { LoadingStatus } from '@/core/types/LoadingStatus';
import { Profile } from '@/core/types/Profile';
import { ProfileSearchQuery } from '@/gql/ProfileSearchQuery';
import { useLazyQuery } from '@vue/apollo-composable';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';



export const useSearchStore = defineStore({
    id: 'SearchStore',
    state: () => ({
        users: [] as Profile[],
        userSearchStatus: LoadingStatus.Loading,
        searchingDtag: "", // stores the newest dtag input value, used to avoid the search at every character
    }),
    getters: {
    },
    actions: {

        /**
         * Search a user Desmos profile from a given dtag or from the search cache
         * @param dtag dtag to search
         */
        async search(dtag: string): Promise<void> {
            this.searchingDtag = dtag;
            // debounce to avoid the search at every character
            setTimeout(async () => {
                if (this.searchingDtag !== dtag) {
                    return;
                }
                this.userSearchStatus = LoadingStatus.Loading;
                const getProfileQuery = useLazyQuery(
                    ProfileSearchQuery, {
                    query: `%${dtag}%`
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

            }, 250);
        }
    },
})

// Register the store to enable HMR
registerModuleHMR(useSearchStore);