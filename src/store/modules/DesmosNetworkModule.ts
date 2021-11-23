import store from '@/store';
import { DesmosJS, Network } from 'desmosjs';
import { Module, VuexModule } from "vuex-module-decorators";
DesmosJS.chainId = process.env.VUE_APP_CHAIN_ID as string;

@Module({ store, name: 'DesmosNetworkModule', dynamic: true })
export default class DesmosNetworkModule extends VuexModule {
    public chainId = `${process.env.VUE_APP_CHAIN_ID}`;
    public isTestnet = `${process.env.VUE_APP_IS_TESTNET}` == 'true';
    public network: Network = new Network(`${process.env.VUE_APP_LCD_ENDPOINT}`);
}