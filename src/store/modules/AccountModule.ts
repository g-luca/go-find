import Api from '@/core/api/Api';
import User from '@/core/types/User';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';

@Module({ store, name: 'AccountModule', dynamic: true })
export default class AccountModule extends VuexModule {
    private _user: User | false = false;
    public userLoadingStatus: LoadingStatus = LoadingStatus.Loading;


    /**
     * Retrieve a user Desmos profile from a given username
     * @param username username of the profile to get
     */
    @Mutation
    async loadAccount(username: string): Promise<void> {
        this.userLoadingStatus = LoadingStatus.Loading;
        const foundUser = await AccountModule.getDesmosProfile(username);
        if (foundUser !== false) {
            this._user = foundUser;
            this.userLoadingStatus = LoadingStatus.Loaded;
        } else {
            this.userLoadingStatus = LoadingStatus.Error;
        }
    }


    public static async getDesmosProfile(username: string): Promise<User | false> {
        const foundUser = await Api.get('https://lcd.go-find.me/desmos/profiles/v1beta1/profiles/' + username);
        if (foundUser['profile']) {
            const rawUser = foundUser['profile'];
            return new User(rawUser['dtag'], rawUser['account']['address'], rawUser['nickname'], rawUser['bio'], rawUser['pictures']['profile']);
        } else {
            return false
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