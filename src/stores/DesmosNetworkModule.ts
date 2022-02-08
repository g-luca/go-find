import { DesmosJS, Network } from 'desmosjs';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
DesmosJS.chainId = import.meta.env.VITE_APP_CHAIN_ID as string;


export const useDesmosNetworkStore = defineStore({
    id: 'DesmosNetworkStore',
    state: () => ({
        chainId: `${import.meta.env.VITE_APP_CHAIN_ID}`,
        isTestnet: `${import.meta.env.VITE_APP_IS_TESTNET}` == 'true',
        network: new Network(`${import.meta.env.VITE_APP_LCD_ENDPOINT}`),
    }),
    getters: {
    },
    actions: {
    },
})

// Register the store to enable HMR
registerModuleHMR(useDesmosNetworkStore);