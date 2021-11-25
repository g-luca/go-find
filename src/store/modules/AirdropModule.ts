import Api from '@/core/api/Api';
import ChainLink from '@/core/types/ChainLink';
import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import AccountModule from './AccountModule';
import AuthModule from './AuthModule';

const accountModule = getModule(AccountModule);


class AirdropConfig {
    public enabled = false;
    public granter = "";

    constructor(enabled: boolean, granter: string) {
        this.enabled = enabled;
        this.granter = granter;
    }
}

class AirdropChainAllocation {
    public chain_name: string;
    public dsm_allotted: number;
    public claimed: boolean;
    public forbole_delegator: boolean;

    constructor(chain_name: string, dsm_allotted: number, claimed: boolean, forbole_delegator: boolean) {
        this.chain_name = chain_name;
        this.dsm_allotted = dsm_allotted;
        this.claimed = claimed;
        this.forbole_delegator = forbole_delegator;
    }
}

class AirdropAllocation {
    public lp_infos: AirdropChainAllocation[];
    public staking_infos: AirdropChainAllocation[];
    public dsm_allotted: number;

    constructor(lp_infos: AirdropChainAllocation[], staking_infos: AirdropChainAllocation[], dsm_allotted: number) {
        this.lp_infos = lp_infos;
        this.staking_infos = staking_infos;
        this.dsm_allotted = dsm_allotted;
    }
}


@Module({ store, name: 'AirdropModule', dynamic: true })
export default class AirdropModule extends VuexModule {
    private static airdrop_endpoint = `https://api.airdrop.desmos.network`;
    public isAirdropModalOpen = false;
    public config: AirdropConfig | null = null;
    public aidropAllocations: Map<ChainLink, AirdropAllocation> = new Map();

    public isLoadingAirdropAllocations = false;
    public hasRequestedClaim = false;
    public isLoadingClaim = false;
    public claimResponse = '';
    public isAirdropSuccess = false;

    public hasGrant = false;
    public hasRequestedGrant = false;
    public isLoadingGrant = false;
    public grantResponse = '';
    public isGrantSuccess = false;


    /**
     * Toggle Airdrop modal
     */
    @Mutation
    public async toggleAirdropModal(): Promise<void> {
        this.isAirdropModalOpen = !this.isAirdropModalOpen;
        this.claimResponse = '';
        this.isLoadingClaim = false;
        this.isAirdropSuccess = false;
        this.hasRequestedClaim = false;

        this.hasRequestedGrant = false;
        this.isLoadingGrant = false;
        this.grantResponse = '';
        this.isGrantSuccess = false;
    }



    /**
     * Get the Airdrop Configuration
     * @returns AirdropConfig or null with unexpected errors
     */
    @Mutation
    public async loadAirdropConfig(): Promise<void> {
        try {
            this.config = await Api.get(`${AirdropModule.airdrop_endpoint}/config`) as AirdropConfig;
            return;
        } catch (e) {
            //empty
        }
        this.config = null;
    }


    @Mutation
    public async checkAirdrop(): Promise<any> {
        this.isLoadingAirdropAllocations = true;
        if (accountModule.profile) {
            this.aidropAllocations = new Map();
            accountModule.profile.chainLinks.forEach(async (chainLink) => {
                const allocation = (await AirdropModule.checkAddressAirdrop(chainLink.address)) as AirdropAllocation;
                if (allocation.dsm_allotted > 0) {
                    const found = Array.from(this.aidropAllocations.values()).find(element => JSON.stringify(element) === JSON.stringify(allocation));
                    if (!found) {
                        this.aidropAllocations.set(chainLink, allocation);
                    }
                }
                this.isLoadingAirdropAllocations = false;
            });
        }
    }


    public static async checkAddressAirdrop(address: string): Promise<any> {
        const endpoint = `${AirdropModule.airdrop_endpoint}/users/${address}`;
        try {
            return await Api.get(endpoint);
        } catch (e) {
            //empty
        }
    }

    @Mutation
    public async claimAirdrop(): Promise<any> {
        const endpoint = `${AirdropModule.airdrop_endpoint}/airdrop/claims`;
        try {
            if (accountModule.account) {
                this.isLoadingClaim = true;
                try {
                    const request = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                        },
                        body: JSON.stringify({ desmos_address: accountModule.account.address })
                    });
                    this.hasRequestedClaim = true;
                    this.claimResponse = await request.text();
                    this.isAirdropSuccess = request.status === 200;
                    accountModule.loadAccount(true);
                } catch (e) {
                    this.claimResponse = JSON.stringify(e)
                    this.isAirdropSuccess = false;
                }
                this.isLoadingClaim = false;
            }
        } catch (e) {
            this.claimResponse = JSON.stringify(e);
            //empty
        }
    }


    @Mutation
    public async askGrant(user_address: string): Promise<any> {
        const endpoint = `${AirdropModule.airdrop_endpoint}/airdrop/grants`;
        try {
            if (accountModule.account) {
                this.isLoadingGrant = true;
                try {
                    const request = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                        },
                        body: JSON.stringify({ desmos_address: accountModule.account.address, user_address })
                    });
                    this.hasRequestedGrant = true;
                    this.grantResponse = await request.text();
                    this.isGrantSuccess = request.status === 200 || (request.status === 500 && this.grantResponse === 'Grant already requested');
                    if (accountModule.account.balance <= 0) {
                        this.hasGrant = true;
                        AuthModule.granterAddress = this.config!.granter;
                    }
                } catch (e) {
                    this.grantResponse = JSON.stringify(e)
                    this.isGrantSuccess = false;
                }
                this.isLoadingGrant = false;
            }
        } catch (e) {
            this.grantResponse = JSON.stringify(e);
            //empty
        }
    }
}