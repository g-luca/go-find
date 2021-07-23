import Api from '@/core/api/Api';
import User from '@/core/types/User';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';

@Module({ store, name: 'SearchModule', dynamic: true })
export default class SearchModule extends VuexModule {
    public user: User | false = false;
    public userSearchStatus: LoadingStatus = LoadingStatus.Loading;
    private cachedUsers: Map<string, User | false> = new Map([]); // cache the searched users
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
                const cachedUser = this.cachedUsers.get(username);
                if (cachedUser || cachedUser == false) {
                    this.user = cachedUser;
                    this.userSearchStatus = LoadingStatus.Loaded;
                } else {
                    const foundUser = await Api.get('https://lcd.go-find.me/desmos/profiles/v1beta1/profiles/' + username);
                    if (foundUser['profile']) {
                        const rawUser = foundUser['profile'];
                        const user = new User(rawUser['dtag'], '', rawUser['nickname'], '', rawUser['pictures']['profile'], rawUser['pictures']['cover']);
                        this.cachedUsers.set(username, user);
                        this.user = user;
                        this.userSearchStatus = LoadingStatus.Loaded;
                    } else {
                        this.user = false;
                        this.cachedUsers.set(username, false);
                        this.userSearchStatus = LoadingStatus.Error;
                    }
                }
            }
        }, 250);
    }
}