import AuthUser from '@/core/types/AuthUser';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";



@Module({ store, name: 'AuthModule', dynamic: true })
export default class AuthModule extends VuexModule {
    private _authUser: AuthUser | false = false;


    get authUser(): AuthUser | false {
        return this._authUser;
    }
}