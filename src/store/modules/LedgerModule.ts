import { supportedChainLinks } from '@/core/types/SupportedChainLinks';
import Blockchain from '@/core/types/Blockchain';
import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Transport from "@ledgerhq/hw-transport";
import { LedgerSigner } from '@cosmjs/ledger-amino';
import { stringToPath } from '@cosmjs/crypto'


@Module({ store, name: 'LedgerModule', dynamic: true })
export default class LedgerModule extends VuexModule {
    public isInstalled = false;
    public isWaitingAuthentication = false;
    public address = "";
    public hasProfile = false;

    public isLoadingTransport = false;
    public isLedgerReady = false;

    private transport: Transport | null = null;
    private signer: LedgerSigner | null = null;
    public transportError = "";

    public ledgerAddress = "";
    public ledgerPubKey = "";


    public isModalOpen = false;

    public actionLedgerAppName = 'cosmos';
    public actionApp = supportedChainLinks[0];
    public actionMessage = ''
    public actionError = '';
    public actionSignature: string | null = null;
    public isExecutingActionMessage = false;

    /**
     * Setup Ledger action
     * @param data Ledger action params
     */
    @Mutation
    public async setLedgerAction(data: { app: Blockchain, ledgerAppName: string, message: string }): Promise<any> {
        this.actionApp = data.app;
        this.actionLedgerAppName = data.ledgerAppName;
        this.actionMessage = data.message;
    }

    /**
     * Connect to Ledger device & perform the requested action
     */
    @Mutation
    public async startLedgerAction(): Promise<void> {
        const resetLedger = async () => {
            this.isLedgerReady = false;
            this.actionError = '';
            this.isLoadingTransport = false;
            this.ledgerAddress = "";
            this.ledgerPubKey = "";
            if (this.transport) {
                await this.transport.close();
            }
            this.transport = null;
            this.signer = null;
        };
        this.isModalOpen = true;
        this.actionSignature = null;
        this.transportError = "";
        this.isLoadingTransport = true;
        await resetLedger();



        // Check if Ledger WEBHID is available
        const isSupportedWebHID = await TransportWebHID.isSupported();
        if (!isSupportedWebHID) {
            this.transportError = "WebHID not supported";
            await resetLedger();
            return;
        }

        // Connect to Ledger device
        try {
            this.transport = this.transport || await TransportWebHID.create();
            this.transport.on("disconnect", async () => {
                await resetLedger();
            });
        } catch (e) {
            this.transportError = "Ledger not connected";
            await resetLedger();
            return;
        }

        // Create Ledger signer
        try {
            this.signer = this.signer || new LedgerSigner(this.transport, {
                hdPaths: [stringToPath(this.actionApp.hdpath) as any],
                prefix: this.actionApp.bechPrefix,
                ledgerAppName: this.actionApp.ledgerAppNames[0],
            });
        } catch (e) {
            this.transportError = "Ledger blocked";
            await resetLedger();
            return;
        }


        // Get Ledger address
        try {
            const [account] = await this.signer.getAccounts();
            this.ledgerAddress = account.address;
            this.ledgerPubKey = Buffer.from(account.pubkey).toString('hex');
        } catch (e) {
            const appName = this.actionLedgerAppName.charAt(0).toUpperCase() + this.actionLedgerAppName.slice(1);
            this.transportError = `Unlock your Ledger and open the ${appName} app`
            await resetLedger();
            return;
        }

        // Ledger is ready, unlocked, has account & app open
        this.isLoadingTransport = false;
        this.isLedgerReady = true;


        // Execute action
        this.isExecutingActionMessage = true;
        try {
            if (this.actionMessage) {
                const { signature } = await this.signer.signAmino(this.ledgerAddress, this.actionMessage as any);
                this.actionSignature = Buffer.from(signature.signature, 'base64').toString('hex');
                this.isExecutingActionMessage = false;
            }
        } catch (e) {
            this.actionError = "Operation failed or refused by the user";
            this.isExecutingActionMessage = false;
        }
    }

    @Mutation
    public async toggleModal(): Promise<void> {
        this.isModalOpen = !this.isModalOpen;
    }


}