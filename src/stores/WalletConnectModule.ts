import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from "@walletconnect/qrcode-modal";
import { WalletConnectSigner, SigningMode } from "@desmoslabs/desmjs";
import { SupportedSigner, useWalletStore } from './WalletModule';



export const useWalletConnectStore = defineStore({
    id: 'WalletConnectStore',
    state: () => ({
        hasProfile: false,
        connectedAddress: '',
    }),
    getters: {
    },
    actions: {
        /**
         * Inizialize WalletConenct connection & listeners
         */
        async connect(): Promise<void> {
            const walletStore = useWalletStore();

            // create WalletConnect Signer
            const signer = new WalletConnectSigner(new WalletConnect({
                bridge: "https://bridge.walletconnect.org",
                qrcodeModal: QRCodeModal,
            }), {
                signingMode: SigningMode.AMINO
            });

            // Connect to the wallet with the WalletConnect signer
            walletStore.connect(signer, SupportedSigner.WALLETCONNECT);
        },
    },
});

// Register the store to enable HMR
registerModuleHMR(useWalletConnectStore);