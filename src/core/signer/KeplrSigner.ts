import { AccountData, DirectSignResponse } from "@cosmjs/proto-signing";
import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { AminoSignResponse, StdSignDoc, Algo } from "@cosmjs/amino";
import { assert } from "@cosmjs/utils";
import { Signer, SignerStatus, SigningMode } from "@desmoslabs/desmjs";

declare global {
  interface Window extends KeplrWindow { }
}

export interface KeplrSignerOptions {
  chainId: string;
  signingMode: SigningMode;
  preferNoSetFee: boolean;
  preferNoSetMemo: boolean;
}

/**
 * Signer that use Keplr to sign a transaction.
 */
export class KeplrSigner extends Signer {
  public readonly chainId: string = "desmos-mainnet";

  public readonly signingMode: SigningMode = SigningMode.AMINO;

  public readonly preferNoSetFee: boolean = false;

  public readonly preferNoSetMemo: boolean = false;

  private readonly client: Keplr;

  private accountData: AccountData | undefined;

  constructor(keplrClient: Keplr, options: KeplrSignerOptions) {
    super(SignerStatus.NotConnected);
    this.signingMode = options.signingMode;
    this.preferNoSetFee = options.preferNoSetFee;
    this.preferNoSetMemo = options.preferNoSetMemo;
    this.chainId = options.chainId;
    this.client = keplrClient;

    if (this.client) {
      this.updateStatus(SignerStatus.Connected);
      this.subscribeToEvents();
    }
  }

  /**
   * Subscribes to all the Keplr events.
   * @private
   */
  private subscribeToEvents() {
    // Subscribe to the Keplr Storage events
    window.addEventListener("keplr_keystorechange", async () => {
      // disconnect from the current wallet
      await this.disconnect();

      // connect to the new wallet
      await this.connect();
    });
  }

  /**
   * Implements Signer.
   */
  async connect(): Promise<void> {
    const account = await this.client.getKey(this.chainId);
    this.accountData = {
      address: account.bech32Address,
      algo: <Algo>account.algo,
      pubkey: account.pubKey,
    };

    if (this.status !== SignerStatus.NotConnected) {
      return;
    }

    this.subscribeToEvents();

    this.updateStatus(SignerStatus.Connecting);

    // prompt the Keplr Desmos network configuration
    await this.setupDesmosMainnetNetwork();

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
    return [
      {
        address: result.bech32Address,
        algo: <Algo>result.algo,
        pubkey: result.pubKey,
      },
    ];
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
    return this.client.signDirect(this.chainId, signerAddress, signDoc);
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
    return this.client.signAmino(this.chainId, signerAddress, signDoc);
  }

  private async setupDesmosMainnetNetwork(): Promise<void> {
    assert(window.keplr);
    await window.keplr.experimentalSuggestChain({
      chainId: "desmos-mainnet",
      chainName: "Desmos",
      rpc: "https://rpc.mainnet.desmos.network",
      rest: "https://api.mainnet.desmos.network",
      bip44: {
        coinType: 852,
      },
      bech32Config: {
        bech32PrefixAccAddr: "desmos",
        bech32PrefixAccPub: "desmospub",
        bech32PrefixValAddr: "desmosvaloper",
        bech32PrefixValPub: "desmosvaloperpub",
        bech32PrefixConsAddr: "desmosvalcons",
        bech32PrefixConsPub: "desmosvalconspub",
      },
      currencies: [
        {
          coinDenom: "DSM",
          coinMinimalDenom: "udsm",
          coinDecimals: 6,
          coinGeckoId: "desmos",
        },
      ],
      feeCurrencies: [
        {
          coinDenom: "udsm",
          coinMinimalDenom: "udsm",
          coinDecimals: 6,
          coinGeckoId: "desmos",
        },
      ],
      stakeCurrency: {
        coinDenom: "DSM",
        coinMinimalDenom: "udsm",
        coinDecimals: 6,
        coinGeckoId: "desmos",
      },
      coinType: 852,
      gasPriceStep: {
        low: 0.002,
        average: 0.035,
        high: 0.05,
      },
      features: ["no-legacy-stdTx"],
    });
  }
}
