import Api from '@/core/api/Api';
import User from '@/core/types/User';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import { LoadingStatus } from '@/core/types/LoadingStatus';

@Module({ store, name: 'UserModule', dynamic: true })
export default class UserModule extends VuexModule {
    protected user: User | false = false;
    public userLoadingStatus: LoadingStatus = LoadingStatus.Loading;


    /**
     * Retrieve a user Desmos profile from a given username
     * @param username username of the profile to get
     */
    @Mutation
    async loadUser(username: string): Promise<void> {
        this.userLoadingStatus = LoadingStatus.Loading;
        const foundUser = await Api.get('https://lcd.go-find.me/desmos/profiles/v1beta1/profiles/' + username);
        if (foundUser['profile']) {
            const rawUser = foundUser['profile'];
            this.user = new User(rawUser['dtag'], rawUser['account']['address'], rawUser['nickname'], rawUser['bio'], rawUser['pictures']['profile']);
            this.userLoadingStatus = LoadingStatus.Loaded;
        } else {
            this.userLoadingStatus = LoadingStatus.Error;
        }
    }
}