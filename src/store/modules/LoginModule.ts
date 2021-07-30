import store from '@/store'
import { Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import Api from '@/core/api/Api';


export enum LoginState {
    StateELogin = 'StateELogin',
    StateMLogin = 'StateMLogin',
}


@Module({ store, name: 'LoginModule', dynamic: true })
export default class LoginModule extends VuexModule {
    public currentState: LoginState = LoginState.StateELogin;
    public username = "";
    public eKey = "";
    public ePassword = "";
    public address = "";



    @MutationAction({ mutate: ['eKey', 'ePassword', 'username', 'address'] })
    async login(payload: { username: string, ePassword: string, address: string }): Promise<{ eKey: string, ePassword: string, username: string, address: string }> {
        if (payload.username && payload.ePassword) {
            const response = await Api.post(Api.endpoint + 'signin', JSON.stringify({
                username: payload.username,
                ePassword: payload.ePassword,
                address: payload.address,
            }));
            if (response.success) {
                const ePassword: string = payload.ePassword;
                const username: string = payload.username;
                const eKey: string = response.eKey;
                const address: string = response.address;
                return { eKey, ePassword, username, address };
            } else {
                return { eKey: '', ePassword: '', username: '', address: '' };
            }
        }
        // update the store variables
        return { eKey: '', ePassword: '', username: '', address: '' };
    }



    @Mutation
    nextState(newState: LoginState): void {
        this.currentState = newState;
    }
}