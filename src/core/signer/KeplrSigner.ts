import { AccountData, DirectSignResponse } from "@cosmjs/proto-signing";
import { Keplr } from "@keplr-wallet/types"
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { AminoSignResponse, StdSignDoc, Algo } from "@cosmjs/amino";
import { assert } from "@cosmjs/utils";
import { Signer, SignerStatus, SigningMode } from "@desmoslabs/desmjs";


export interface KeplrSignerOptions {
    signingMode: SigningMode;
    preferNoSetFee: boolean;
    preferNoSetMemo: boolean;
    chainId: string;
}

/**
 * Signer that use Keplr to sign a transaction.
 */
export class KeplrSigner extends Signer {
    public readonly chainId: string = 'desmos-mainnet';
    public readonly signingMode: SigningMode = SigningMode.AMINO;
    public readonly preferNoSetFee: boolean = false;
    public readonly preferNoSetMemo: boolean = false;

    private readonly client: Keplr;

    private accountData: AccountData | undefined;

    constructor(
        keplrClient: Keplr,
        options: KeplrSignerOptions
    ) {
        super(SignerStatus.NotConnected);
        this.signingMode = options.signingMode;
        this.preferNoSetFee = options.preferNoSetFee;
        this.preferNoSetMemo = options.preferNoSetMemo;
        this.chainId = options.chainId;
        this.client = keplrClient;

        // If the client is already connected, populate the data
        if (this.client) {
            this.updateStatus(SignerStatus.Connected);
            this.subscribeToEvents();
        }
    }


    /**
     * Callback called when a client terminates a wallet connect session.
     */
    private async onDisconnect() {
        await this.disconnect();
    }


    /**
     * Subscribes to all the WalletConnect events.
     * @private
     */
    private subscribeToEvents() {
        // Subscribe to the Keplr Storage events
        window.addEventListener("keplr_keystorechange", () => {
            console.log("keplr_keystorechange")

            // disconnect from the current wallet
            this.onDisconnect();

            // connect to the new wallet
            this.connect();
        });
    }

    /**
     * Implements Signer.
     */
    async connect(): Promise<void> {
        const account = await this.client.getKey(this.chainId);
        this.accountData = {
            address: account.bech32Address,
            algo: account.algo as Algo,
            pubkey: account.pubKey,
        };

        //TODO: necessary with Keplr?
        if (this.status !== SignerStatus.NotConnected) {
            return;
        }

        this.subscribeToEvents();

        this.updateStatus(SignerStatus.Connecting);

        // Connect Keplr client to the current chainId
        await this.client.enable(this.chainId);

        this.updateStatus(SignerStatus.Connected);
    }

    /**
     * Implements Signer.
     */
    async disconnect(): Promise<void> {
        if (this.status !== SignerStatus.Connected) {
            return;
        }

        this.updateStatus(SignerStatus.Disconnecting);
        this.accountData = undefined;
        this.updateStatus(SignerStatus.NotConnected);
    }

    /**
     * Implements Signer.
     */
    async getCurrentAccount(): Promise<AccountData | undefined> {
        return this.accountData;
    }

    /**
     * Implements Signer.
     *
     */
    async getAccounts(): Promise<readonly AccountData[]> {
        this.assertConnected();
        const result = await this.client!.getKey(this.chainId);

        return [{
            address: result.bech32Address,
            algo: result.algo as Algo,
            pubkey: result.pubKey,
        }];
    }

    /**
     * Implements OfflineDirectSigner.
     */
    async signDirect(
        signerAddress: string,
        signDoc: SignDoc
    ): Promise<DirectSignResponse> {
        this.assertConnected();
        assert(this.accountData);

        const result = await this.client!.signDirect(this.chainId, signerAddress, signDoc);

        return result
    }

    /**
     * Implements OfflineDirectSigner.
     */
    async signAmino(
        signerAddress: string,
        signDoc: StdSignDoc
    ): Promise<AminoSignResponse> {
        this.assertConnected();
        assert(this.accountData);
        return await this.client!.signAmino(this.chainId, signerAddress, signDoc);
    }
}
