import Api from '@/core/api/Api';
import User from '@/core/types/User';
import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';
import AuthModule, { AuthLevel } from './AuthModule';
import { DesmosTypes } from 'desmosjs';
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
                const foundUser = await AccountModule.getDesmosProfile(authModule.account?.username);
                if (foundUser !== false) {
                    this._user = foundUser;
                    this.userLoadingStatus = LoadingStatus.Loaded;
                } else {
                    this.userLoadingStatus = LoadingStatus.Error;
                }
            }
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