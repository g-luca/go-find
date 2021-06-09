import store from '@/store'
import { Action, Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import Api from '@/core/api/Api';
import Account from '@/core/types/Account';


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



    @MutationAction({ mutate: ['eKey', 'ePassword', 'username'] })
    async login(payload: { username: string, ePassword: string }): Promise<{ eKey: string, ePassword: string, username: string }> {
        if (payload.username && payload.ePassword) {
            const response = await Api.post('signin', JSON.stringify({
                username: payload.username,
                ePassword: payload.ePassword,
            }));
            if (response.success) {
                const ePassword: string = payload.ePassword;
                const username: string = payload.username;
                const eKey: string = response.eKey;
                return { eKey, ePassword, username };
            } else {
                return { eKey: '', ePassword: '', username: '' };
            }
        }
        // update the store variables
        return { eKey: '', ePassword: '', username: '' };
    }



    @Mutation
    nextState(newState: LoginState): void {
        this.currentState = newState;
    }
}