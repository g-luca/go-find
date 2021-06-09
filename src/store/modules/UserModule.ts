import User from '@/core/types/User';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";



@Module({ store, name: 'UserModule', dynamic: true })
export default class UserModule extends VuexModule {
    protected user: User | false = false;


    /**
     * Retrieve a user Desmos profile from a given username
     * @param username username of the profile to get
     */
    @Mutation
    loadUser(username: string): void {
        //TODO: replace with LCD request
        this.user = new User(username, 'desmos16c60y8t8vra27zjg2arlcd58dck9cwn7p6fwtd', 'Luca G.', 'Hello there!');
    }
}