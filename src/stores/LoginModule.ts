import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import Api from '@/core/api/Api';



/**
 * Represents the phases of the login process
 */
export enum LoginState {
    StateELogin = 'StateELogin',
    StateMLogin = 'StateMLogin',
}


export const useLoginStore = defineStore({
    id: 'LoginStore',
    state: () => ({
        currentState: LoginState.StateELogin,
        dtag: "",
        eKey: "",
        ePassword: "",
        address: "",


    }),
    getters: {
    },
    actions: {


        /**
         * Auth login backend call
         * @param payload payload to send to the backend login endpoint
         * @returns the auth params if succeeded, emppty otherwise
         */
        async login(payload: { dtag: string, ePassword: string, address: string }): Promise<{ eKey: string, ePassword: string, dtag: string, address: string }> {
            let ePassword = '';
            let dtag = '';
            let eKey = '';
            let address = '';
            if (payload.dtag && payload.ePassword) {
                const response = await Api.post(Api.endpoint + 'signin', JSON.stringify({
                    dtag: payload.dtag,
                    ePassword: payload.ePassword,
                    address: payload.address,
                }));
                if (response.success) {
                    ePassword = payload.ePassword;
                    dtag = payload.dtag;
                    eKey = response.eKey;
                    address = response.address;
                }
            }
            // update the store variables
            this.ePassword = ePassword;
            this.dtag = dtag;
            this.eKey = eKey;
            this.address = address;
            return { eKey, ePassword, dtag, address };
        },



        /**
         * Change the state to the given one
         * @param newState state to load
         */
        nextState(newState: LoginState): void {
            this.currentState = newState;
        },

        /**
         * Reset the LoginModule state
         */
        reset(): void {
            this.currentState = LoginState.StateELogin;
            this.dtag = "";
            this.eKey = "";
            this.ePassword = "";
            this.address = "";
        }
    },
})

// Register the store to enable HMR
registerModuleHMR(useLoginStore);