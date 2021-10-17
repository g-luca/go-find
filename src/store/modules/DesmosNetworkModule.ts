import store from '@/store';
import { Network } from 'desmosjs';
import { Module, VuexModule } from "vuex-module-decorators";

@Module({ store, name: 'DesmosNetworkModule', dynamic: true })
export default class DesmosNetworkModule extends VuexModule {
    public chainId = `${process.env.VUE_APP_CHAIN_ID}`;
    public network: Network = new Network(`${process.env.VUE_APP_LCD_ENDPOINT}`);
}