import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { provideApolloClient } from '@vue/apollo-composable';
import { apolloClientForbole } from '@/gql/ApolloForbole';
import { StatusSubscription } from '@/gql/StatusSubscription';

provideApolloClient(apolloClientForbole)


enum Status {
    /**
     * Connected to the Socket, Node ok
     */
    Ok = 0,

    /**
     * Disconneced from the Socket, unknwon Node status
     */
    Disconnected = 1,

    /**
     * Connected to the Socked, Node blocked
     */
    Blocked = 2,

}


export const useStatusStore = defineStore({
    id: 'StatusStore',
    state: () => ({
        status: Status.Disconnected,
        lastHeightDate: new Date(Date.now()),
    }),
    getters: {
    },
    actions: {
        async startStatusListening(): Promise<void> {
            const statusObserver = apolloClientForbole.subscribe({
                query: StatusSubscription,
            })
            statusObserver.subscribe((response) => {
                this.lastHeightDate = new Date(response.data.block[0].timestamp);
                this.status = calculateStatus(this.lastHeightDate);
            });
            window.setInterval(() => {
                this.status = calculateStatus(this.lastHeightDate, true);
            }, 20000);
        }
    },
})


/**
 * Determinate the Status of the Network
 * @param lastDate last block date
 * @param periodic if it is called from the periodic check (not from the response of the subscription)
 * @returns the Status value
 */
function calculateStatus(lastDate: Date, periodic = false): Status {
    const now = new Date(Date.now());
    const diffMs = (Number(now) - Number(lastDate)) + now.getTimezoneOffset() * 60 * 1000;
    if (diffMs < 20000) {
        return Status.Ok;
    } else {
        if (periodic) {
            return Status.Disconnected;
        } else {
            return Status.Blocked;
        }
    }
}

// Register the store to enable HMR
registerModuleHMR(useStatusStore);