import store from '@/store';
import { DesmosJS, Network } from 'desmosjs';
import { Module, VuexModule } from "vuex-module-decorators";
DesmosJS.chainId = import.meta.env.VITE_APP_CHAIN_ID as string;

@Module({ store, name: 'DesmosNetworkModule', dynamic: true })
export default class DesmosNetworkModule extends VuexModule {
    public chainId = `${import.meta.env.VITE_APP_CHAIN_ID}`;
    public isTestnet = `${import.meta.env.VITE_APP_IS_TESTNET}` == 'true';
    public network: Network = new Network(`${import.meta.env.VITE_APP_LCD_ENDPOINT}`);
}