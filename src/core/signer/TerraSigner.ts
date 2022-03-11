import { useAuthStore } from '@/stores/AuthModule';
import CryptoUtils from "@/utils/CryptoUtils";
import { Extension as TerraExtension, MsgSend as TerraMsgSend, Fee as TerraFee, LCDClient as TerraLCDClient, TxBody as TerraTxBody, AuthInfo as TerraAuthInfo, SignDoc as TerraSignDoc } from "@terra-money/terra.js";
import { CosmosPubKey, DesmosProof } from 'desmosjs';
import Blockchain from '../types/Blockchain';
import { Buffer } from "buffer";

export type TerraChainLinkSignerResponse = {
    address: string;
    proof: DesmosProof | null;
    error: string;
}

export class TerraSigner {
    static terraExtension = null as TerraExtension | null
    static chain_id = "bombay-12"; // mainnet: columbus-5 / testnet: bombay-12
    static lcd_url = "https://bombay-lcd.terra.dev"; // mainnet: https://lcd.terra.dev / testnet: https://bombay-lcd.terra.dev


    public static async generateChainLinkProof(selectedChain: Blockchain): Promise<TerraChainLinkSignerResponse> {
        const authStore = useAuthStore();
        // Check if Terra Extension is already initialized
        if (this.terraExtension === null) {
            this.terraExtension = new TerraExtension();
        }


        // If Terra Extension is still not initialized or available
        if (!this.terraExtension || !this.terraExtension.isAvailable) {
            return { address: '', proof: null, error: "Terra extension not available" };
        }

        // If initialized and available, connect
        this.terraExtension.connect();
        return new Promise((resolve, reject) => {
            this.terraExtension!.once(({ error, address }) => {
                if (error) {
                    reject({ proof: null, error: error.message || 'Unknown Error' });
                }
                try {
                    // Request transaction sign
                    this.terraExtension!.sign({
                        msgs: [new TerraMsgSend(address, address, { uluna: 0 })],
                        memo: `${authStore.account?.address}`,
                        fee: TerraFee.fromAmino({
                            amount: [{
                                amount: '0',
                                denom: 'uluna',
                            }],
                            gas: '1'
                        }),
                    });


                    // Catch & handle sign response
                    this.terraExtension!.once(async (payload) => {
                        if (payload.error) {
                            if (payload.error.message === "Unknown Status Code: 27404") {
                                payload.error.message += " (Make sure your Ledger is unlocked)";
                            }
                            if ((payload.error.message as string).includes("rpc error: code = NotFound desc = account")) {
                                payload.error.message += " (Make sure that your account exists, has a positive balance, or has made at least one transaction)";
                            }
                            reject({ proof: null, error: payload.error.message || 'Unknown Error' });
                        } else {
                            try {
                                const terraAddress = payload.result.body.messages[0].from_address
                                const terraSignature = payload.result.signatures[0]
                                const terraPubkey = Buffer.from(payload.result.auth_info.signer_infos[0].public_key.key, 'base64')
                                const terraSignMode = payload.result.auth_info.signer_infos[0].mode_info.single.mode
                                const terraSequence = payload.result.auth_info.signer_infos[0].sequence || 0;
                                const terraBody = payload.result.body || {};
                                const terraAuthInfo = payload.result.auth_info;
                                const terraLCDClient = new TerraLCDClient({
                                    URL: this.lcd_url,
                                    chainID: this.chain_id,
                                })
                                const auth = await terraLCDClient.auth.accountInfo(terraAddress)
                                const terraAccountNumber = auth.getAccountNumber() || 0;

                                let finalProof = null as DesmosProof | null;

                                // Terra Station sign
                                if (terraSignMode === 'SIGN_MODE_DIRECT') {
                                    const txBody = terraBody
                                    const signDoc = new TerraSignDoc(
                                        selectedChain.chainId,
                                        terraAccountNumber,
                                        terraSequence,
                                        TerraAuthInfo.fromData(terraAuthInfo),
                                        TerraTxBody.fromData(txBody)
                                    )
                                    finalProof = {
                                        pubKey: {
                                            typeUrl: '/cosmos.crypto.secp256k1.PubKey',
                                            value: CosmosPubKey.encode({
                                                key: terraPubkey,
                                            }).finish(),
                                        },
                                        signature: Buffer.from(terraSignature, 'base64').toString('hex'),
                                        plainText: Buffer.from(signDoc.toBytes()).toString('hex'),
                                    }
                                } else {
                                    // Terra Station + Ledger sign
                                    const tmpProof = {
                                        account_number: String(terraAccountNumber),
                                        chain_id: selectedChain.chainId,
                                        fee: {
                                            amount: [
                                                {
                                                    amount: '0',
                                                    denom: 'uluna',
                                                },
                                            ],
                                            gas: '1',
                                        },
                                        memo: `${authStore.account!.address}`,
                                        msgs: (payload.result.body.messages || []).map((m: any) => TerraMsgSend.fromData(m).toAmino()),
                                        sequence: String(terraSequence),
                                    }
                                    finalProof = {
                                        plainText: Buffer.from(CryptoUtils.sortedJsonStringify(tmpProof)).toString('hex'),
                                        pubKey: {
                                            typeUrl: '/cosmos.crypto.secp256k1.PubKey',
                                            value: CosmosPubKey.encode({
                                                key: terraPubkey,
                                            }).finish(),
                                        },
                                        signature: Buffer.from(terraSignature, 'base64').toString('hex'),
                                    }
                                }
                                resolve({ address: terraAddress, proof: finalProof, error: '' });

                            } catch (e) {
                                console.log(e)
                                reject({ address: '', proof: null, error: 'Terra LCD error or invalid payload' });
                            }
                        }

                    })
                } catch (e) {
                    reject({ address: '', proof: null, error: 'Unknown Terra Station Error' });
                }
            })
        });
    };
}