import { useAccountStore } from './AccountModule';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import Api from '@/core/api/Api';
import ChainLink from '@/core/types/ChainLink';



class AirdropConfig {
    public airdrop_enabled = false;
    public granter = "";

    constructor(airdrop_enabled: boolean, granter: string) {
        this.airdrop_enabled = airdrop_enabled;
        this.granter = granter;
    }
}

class AirdropChainAllocation {
    public address: string;
    public chain_name: string;
    public dsm_allotted: number;
    public claimed: boolean;
    public forbole_delegator: boolean;
    public isConnected: boolean;

    constructor(address: string, chain_name: string, dsm_allotted: number, claimed: boolean, forbole_delegator: boolean, isConnected = false) {
        this.address = address;
        this.chain_name = chain_name;
        this.dsm_allotted = dsm_allotted;
        this.claimed = claimed;
        this.forbole_delegator = forbole_delegator;
        this.isConnected = isConnected;
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

class AirdropGrantStatusResponse {
    public can_get_grant: boolean;
    public has_requested_grant: boolean;
    public can_claim_airdrop: boolean;
    public used_desmos_address: string;
    public has_enough_dsm: boolean;

    constructor(can_get_grant: boolean, has_requested_grant: boolean, can_claim_airdrop: boolean, used_desmos_address: string, has_enough_dsm: boolean) {
        this.can_get_grant = can_get_grant;
        this.has_requested_grant = has_requested_grant;
        this.can_claim_airdrop = can_claim_airdrop;
        this.used_desmos_address = used_desmos_address;
        this.has_enough_dsm = has_enough_dsm;
    }
}

enum GrantStatus {
    "None" = "None",
    "Loading" = "Loading",
    "GrantRequested" = "GrantRequested",
    "GrantReceived" = "GrantReceived",
    "Error" = "Error",
}

enum ClaimStatus {
    "None" = "None",
    "Loading" = "Loading",
    "ClaimRequested" = "ClaimRequested",
    "Error" = "Error",
}




const AIRDROP_ENDPOINT = import.meta.env.VITE_APP_API_AIRDROP_ENDPOINT;
export const useAirdropStore = defineStore({
    id: 'AirdropStore',
    state: () => ({

        isAirdropModalOpen: false,
        config: null as AirdropConfig | null,
        aidropAllocations: new Map() as Map<ChainLink, AirdropAllocation>,

        checkDelay: 15000, //ms
        claimAddress: "",
        claimStatus: ClaimStatus.None,
        grantStatus: GrantStatus.None,

        isLoadingAirdropAllocations: false,
        claimResponse: '',
        grantResponse: '',
    }),
    getters: {
    },
    actions: {

        /**
         * Toggle Airdrop modal
         */
        async toggleAirdropModal(): Promise<void> {
            this.isAirdropModalOpen = !this.isAirdropModalOpen;
            this.claimResponse = '';
            this.grantResponse = '';

            this.claimStatus = ClaimStatus.None;
            this.grantStatus = GrantStatus.None;
        },



        /**
         * Get the Airdrop Configuration
         * @returns AirdropConfig or null with unexpected errors
         */
        async loadAirdropConfig(): Promise<void> {
            try {
                this.config = await Api.get(`${AIRDROP_ENDPOINT}/config`) as AirdropConfig;
                return;
            } catch (e) {
                //empty
            }
            this.config = null;
        },

        async checkAirdrop(): Promise<any> {
            const accountStore = useAccountStore();
            this.isLoadingAirdropAllocations = true;
            if (accountStore.profile) {
                this.aidropAllocations = new Map();
                accountStore.profile.chainLinks.forEach(async (chainLink) => {
                    const allocation = (await checkAddressAirdrop(chainLink.address)) as AirdropAllocation;
                    if (allocation.dsm_allotted > 0) {
                        const found = Array.from(this.aidropAllocations.values()).find(element => JSON.stringify(element) === JSON.stringify(allocation));
                        if (!found && accountStore.profile) {
                            try {
                                // search staking_infos if the airdrop address is connected through a chain link
                                for (let i = 0; i < allocation.staking_infos.length; i++) {
                                    if (accountStore.profile) {
                                        accountStore.profile.chainLinks.forEach((chainLink) => {
                                            if (allocation.staking_infos[i].address === chainLink.address) {
                                                allocation.staking_infos[i].isConnected = true;
                                            }
                                        });
                                    }
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                            try {
                                // search lp_infos if the airdrop address is connected through a chain link
                                for (let i = 0; i < allocation.lp_infos.length; i++) {
                                    if (accountStore.profile) {
                                        accountStore.profile.chainLinks.forEach((chainLink) => {
                                            if (allocation.lp_infos[i].address === chainLink.address) {
                                                allocation.lp_infos[i].isConnected = true;
                                            }
                                        });
                                    }
                                }
                            } catch (e) {
                                console.log(e);
                            }
                            this.aidropAllocations.set(chainLink, allocation);
                        }
                    }
                    this.isLoadingAirdropAllocations = false;
                });
            }
        },

        /**
         * Check the grant status of the current user (requested, received, error)
         */
        async checkGrantStatus(eligibleAddress = ''): Promise<any> {
            const accountStore = useAccountStore();
            if (eligibleAddress) {
                // if sent from claim button use the address, otherwise use the in-memory claim address
                this.claimAddress = eligibleAddress;
            }
            this.grantStatus = GrantStatus.Loading;
            this.grantResponse = '';
            if (accountStore.account && this.claimAddress) {
                let exit = true;
                const endpoint = `${AIRDROP_ENDPOINT}/airdrop/grants/${accountStore.account.address}/${this.claimAddress}`

                do {
                    try {
                        const request = await fetch(endpoint, {
                            method: 'GET',
                        });
                        const contentType = request.headers.get('Content-Type') || ''; // retrieve the response type
                        if (/text\/plain/i.test(contentType)) {
                            // if text -> failed
                            this.grantResponse = await request.text();
                            this.grantStatus = GrantStatus.Error;
                            exit = true;
                        } else if (/application\/json/.test(contentType)) {
                            // if json -> success
                            const grantStatusResponse = await request.json() as AirdropGrantStatusResponse;
                            if (grantStatusResponse.can_claim_airdrop) {
                                // if grant has been issued
                                this.grantStatus = GrantStatus.GrantReceived;
                                accountStore.loadAccount(true);
                                exit = true;
                            } else if (grantStatusResponse.has_requested_grant) {
                                // if grant has been requested but not yet issued
                                if (grantStatusResponse.used_desmos_address === accountStore.account.address || grantStatusResponse.used_desmos_address === '') {
                                    this.grantStatus = GrantStatus.GrantRequested;
                                    exit = false;
                                } else {
                                    this.grantStatus = GrantStatus.Error;
                                    this.grantResponse = `Grant already requested by ${grantStatusResponse.used_desmos_address}`;
                                    exit = true;
                                }
                            } else if (grantStatusResponse.can_get_grant) {
                                // the grant can be requested
                                try {
                                    const grantRequestResponse = await requestGrant(accountStore.account.address, this.claimAddress);
                                    if (grantRequestResponse.status === 200) {
                                        this.grantStatus = GrantStatus.GrantRequested;
                                        exit = false;
                                    } else {
                                        this.grantStatus = GrantStatus.Error;
                                        this.grantResponse = await grantRequestResponse.text();
                                        exit = true;
                                    }
                                } catch (e) {
                                    this.grantStatus = GrantStatus.Error;
                                    this.grantResponse = JSON.stringify(e);
                                    exit = true;
                                }
                            } else if (grantStatusResponse.has_enough_dsm) {
                                this.grantStatus = GrantStatus.GrantReceived;
                                exit = true;
                            } else {
                                // Address not eligible, the grant can't be requested
                                this.grantStatus = GrantStatus.Error;
                                this.grantResponse = 'Address not eligible';
                                exit = true;
                            }
                        }
                    } catch (e) {
                        console.log(e)
                        this.grantStatus = GrantStatus.Error;
                        this.claimResponse = JSON.stringify(e)
                    }

                    if (!exit) {
                        await sleep(this.checkDelay);
                    }
                } while (!exit);
            } else {
                this.grantStatus = GrantStatus.None;
                this.claimResponse = 'Please refresh';
            }
        },


        /**
         * Request a claim for a given address
         * @param address 
         */
        async claimAirdrop(): Promise<any> {
            const accountStore = useAccountStore();
            const endpoint = `${AIRDROP_ENDPOINT}/airdrop/claims`;
            try {
                // ensure that is logged in
                if (accountStore.account) {
                    this.claimStatus = ClaimStatus.Loading;
                    try {
                        const request = await fetch(endpoint, {
                            method: 'POST',
                            headers: {
                            },
                            body: JSON.stringify({ desmos_address: accountStore.account.address })
                        });
                        const success = request.status === 200;
                        success ? this.claimStatus = ClaimStatus.ClaimRequested : this.claimStatus = ClaimStatus.Error;
                        this.claimResponse = await request.text();
                        accountStore.loadAccount(true);
                    } catch (e) {
                        this.claimResponse = JSON.stringify(e)
                        this.claimStatus = ClaimStatus.Error;
                    }
                } else {
                    this.claimStatus = ClaimStatus.Error;
                    this.claimResponse = 'Please refresh';
                }
            } catch (e) {
                this.claimStatus = ClaimStatus.Error;
                this.claimResponse = JSON.stringify(e);
            }
        }

    },
})


/**
 * Request a grant for a given address
 * @param desmosAddress desmos address
 * @param claimAddress eligible address
 * @returns raw endpoint response
 */
async function requestGrant(desmosAddress: string, claimAddress: string): Promise<Response> {
    const endpoint = `${AIRDROP_ENDPOINT}/airdrop/grants`;
    return await fetch(endpoint, {
        method: 'POST',
        headers: {
        },
        body: JSON.stringify({ desmos_address: desmosAddress, user_address: claimAddress })
    });
}


async function sleep(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if address is eligible for airdrop
 * @param address eligible address
 * @returns raw endpoint response
 */
async function checkAddressAirdrop(address: string): Promise<any> {
    const endpoint = `${AIRDROP_ENDPOINT}/users/${address}`;
    try {
        return await Api.get(endpoint);
    } catch (e) {
        //empty
    }
}


// Register the store to enable HMR
registerModuleHMR(useAirdropStore);