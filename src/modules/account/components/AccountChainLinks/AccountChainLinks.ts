import { Any } from 'cosmjs-types/google/protobuf/any';
import CryptoUtils from '@/utils/CryptoUtils';
import { EncodeObject } from '@cosmjs/proto-signing';
import { TerraSigner, TerraChainLinkSignerResponse } from './../../../../core/signer/TerraSigner';
import InputMnemonic from '@/ui/components/InputMnemonic.vue';
import { MsgLinkChainAccountEncodeObject, MsgUnlinkChainAccountEncodeObject, SigningMode } from '@desmoslabs/desmjs';
import { KeplrSigner } from '@/core/signer/KeplrSigner';
import { useAuthStore } from '@/stores/AuthModule';
import { Buffer } from "buffer";
import { useKeplrStore } from '@/stores/KeplrModule';
import { useAccountStore } from '@/stores/AccountModule';
import { defineComponent, ref, watchEffect } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import { Proof, Bech32Address, SingleSignature, SignatureValueType, HexAddress } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links";
import { ethers } from "ethers";

import { BroadcastMode } from "@cosmjs/launchpad";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { supportedChainLinks } from "@/core/types/SupportedChainLinks";
import Blockchain from "@/core/types/Blockchain";
import ChainLink from "@/core/types/ChainLink";
import { Key } from "@keplr-wallet/types";
import { useTransactionStore, TransactionStatus } from '@/stores/TransactionModule';
import { useLedgerStore } from "@/stores/LedgerModule";
import { ChainLinkConnectionMethod } from '@/core/types/ChainLinkConnectionMethod';
import Long from 'long';
import { SignMode } from '@desmoslabs/desmjs-types/cosmos/tx/signing/v1beta1/signing';
import { Bip39, EnglishMnemonic, Secp256k1 } from '@cosmjs/crypto';
import { Wallet } from 'desmosjs';
import { Secp256k1Wallet } from '@cosmjs/amino';



export default defineComponent({
    components: {
        SkeletonLoader,
        ModalTransaction,
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        InputMnemonic
    },
    data() {
        return {
            authStore: useAuthStore(),
            accountStore: useAccountStore(),
            transactionStore: useTransactionStore(),
            ledgerStore: useLedgerStore(),
            selectedConnectionMethod: null as ChainLinkConnectionMethod | null,
            supportedChainLinks,
            filteredSupportedChainLinks: supportedChainLinks,
            selectedChain: null as Blockchain | null,
            isChainLinkEditorOpen: false,
            isSigningProof: false,
            isLinkingWithKeplr: false,
            isExecutingTransaction: false,
            txMessage: null as EncodeObject | null,
            newChainLink: null as ChainLink | null,
            deletedChainLink: null as ChainLink | null,

            generatedProof: null as Proof | null,
            generateProofError: "",

            inputMnemonic: new Array<string>(24),
        }
    },
    beforeMount() {
        ref(this.transactionStore);
        watchEffect(() => {
            // check if is processing the right transaction and the status
            if (this.accountStore.profile && this.transactionStore.tx === this.txMessage && (this.transactionStore.transactionStatus === TransactionStatus.Error || this.transactionStore.transactionStatus === TransactionStatus.Success)) {
                if (this.transactionStore.errorMessage) {
                    // the transaction has an error message, failed
                    console.log('chain link failure!')
                } else {
                    // the tx went well! update the data 

                    // handle new chain link
                    if (this.txMessage?.typeUrl === "/desmos.profiles.v2.MsgLinkChainAccount" && this.newChainLink) {
                        console.log('chain link success!')
                        this.accountStore.profile.chainLinks.push(new ChainLink(this.newChainLink.address, this.newChainLink.chain));
                        this.newChainLink = null;
                        this.deletedChainLink = null;
                    }

                    // handle chain unlink
                    if (this.txMessage?.typeUrl === "/desmos.profiles.v2.MsgUnlinkChainAccount" && this.deletedChainLink) {
                        this.accountStore.profile.chainLinks.slice(this.accountStore.profile.chainLinks.indexOf(new ChainLink(this.deletedChainLink.address, this.deletedChainLink.chain)), 1);
                        this.accountStore.profile.chainLinks = this.accountStore.profile.chainLinks.filter((chainLink) => {
                            return chainLink.address !== this.deletedChainLink?.address && chainLink.chain !== this.deletedChainLink?.chain;
                        });
                        this.newChainLink = null;
                        this.deletedChainLink = null;
                    }
                    this.txMessage = null;
                }
            }
        })
    }, methods: {
        async toggleChainLinkEditor(): Promise<void> {
            this.generateProofError = ''
            this.selectedChain = null;
            this.selectedConnectionMethod = null;
            this.isChainLinkEditorOpen = !this.isChainLinkEditorOpen;
            this.filteredSupportedChainLinks = this.supportedChainLinks;
            this.isSigningProof = false;
            const keplrStore = useKeplrStore();
            await keplrStore.setupTerraMainnet();
            await keplrStore.setupJunoMainnet();
            await keplrStore.setupBandMainnet();
        },
        /**
         * Filter supported chain links by text input
         * @param e input event
         */
        searchChainLink(e: any) {
            const input = (e.target.value as string).toLowerCase();
            if (input) {
                this.filteredSupportedChainLinks = this.supportedChainLinks.filter(x => x.name.toLowerCase().match(input) || x.symbol.toLowerCase().match(input))
            } else {
                this.filteredSupportedChainLinks = this.supportedChainLinks
            }
        },
        /**
         * Delete a connected chain link
         * @param chainLink chainLink to delete
         */
        deleteChainLink(chainLink: ChainLink): void {
            if (this.authStore.account) {
                const msgUnlink: MsgUnlinkChainAccountEncodeObject = {
                    typeUrl: "/desmos.profiles.v2.MsgUnlinkChainAccount",
                    value: {
                        chainName: chainLink.chain,
                        owner: this.authStore.account?.address,
                        target: chainLink.address,
                    }
                }
                this.txMessage = msgUnlink;
                this.newChainLink = null;
                this.deletedChainLink = chainLink;
                this.transactionStore.start({
                    messages: [msgUnlink],
                    mode: BroadcastMode.Async,
                    memo: "Chain unlink | Go-find",
                });
            }
        },
        /**
         * Generate Chain Link proof for user with Keplr
         * @param extKeplrWallet Keplr wallet of the external chain to link
         * @returns success value
         */
        async generateProofWithKeplr(extKeplrWallet: Key): Promise<boolean> {
            const canCreateChainLink = await this.verifyChainLinkRequirements(extKeplrWallet.bech32Address, this.selectedChain?.id || '');

            if (!window.keplr) {
                this.generateProofError = "Keplr is not installed. Please install it to use this feature.";
                return false;
            }

            // check if can create the chain link
            if (!canCreateChainLink || this.selectedChain === null) {
                this.generateProofError = "Connection already exists or profile not found";
                return false;
            }

            try {
                // avoid keplr custom values
                (window.keplr as any).defaultOptions = {
                    sign: {
                        preferNoSetFee: true,
                        preferNoSetMemo: true,
                    }
                }


                // connect to the Keplr signer
                const signer = new KeplrSigner(window.keplr, {
                    chainInfo: {
                        chainId: this.selectedChain.chainId
                    } as any,
                    preferNoSetFee: true,
                    preferNoSetMemo: true,
                    signingMode: SigningMode.AMINO,
                })
                await signer.connect();


                const proofObj = this.prepareChainLinkProof();

                // sign the proof
                const signedTx = await signer.signAmino(extKeplrWallet.bech32Address, proofObj); // sign with Keplr
                const plainText = JSON.stringify(proofObj, null, 0); // convert to string to be used as plain_text


                // ensure that signed the proof
                if (!signedTx || this.authStore.account === null) {
                    this.generateProofError = "Proof authorization failed";
                    return false;
                }

                // finalize the Keplr chain link proof
                const finalProof: Proof = {
                    pubKey: {
                        typeUrl: '/cosmos.crypto.secp256k1.PubKey',
                        value: PubKey.encode({
                            key: extKeplrWallet.pubKey
                        }).finish()
                    },
                    signature: {
                        typeUrl: '/desmos.profiles.v2.SingleSignatureData',
                        value: SingleSignature.encode({
                            valueType: SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_DIRECT,
                            signature: Buffer.from(signedTx.signature.signature, 'base64')
                        }).finish()
                    },
                    plainText: Buffer.from(plainText).toString('hex'),
                }

                const chainAddress: Any = {
                    typeUrl: "/desmos.profiles.v2.Bech32Address",
                    value: Bech32Address.encode({
                        prefix: this.selectedChain.bechPrefix,
                        value: extKeplrWallet.bech32Address
                    }).finish(),
                };
                await this.sendChainLink(this.selectedChain, extKeplrWallet.bech32Address, this.authStore.account.address, finalProof, chainAddress);
                return true;
            } catch (e) {
                console.log(e)
                this.isLinkingWithKeplr = false;
                this.generateProofError = "";
            }
            return false;
        }, async selectChain(chain: Blockchain | null): Promise<void> {
            this.selectedChain = chain || null;
            this.selectedConnectionMethod = null;
            this.isSigningProof = false;
            this.generateProofError = "";
        },

        async selectChainConnectionMethod(connectionMethod: ChainLinkConnectionMethod): Promise<void> {
            this.selectedConnectionMethod = connectionMethod;
            this.isSigningProof = false;
            this.generateProofError = "";
        },
        /**
         * Verify if the user can create a chain link for the selected chain/address. Checks if it is valid and if it already exists
         * @param extAddress bech32 address to connect
         * @param chain chain name to connect
         * @returns true if the user can create the chain link
         */
        async verifyChainLinkRequirements(extAddress: string, chain: string): Promise<boolean> {
            let profileExists = false;
            let chainLinkExists = false;
            if (this.authStore.account) {

                // parse new data to ensure that the profile exists
                const profile = await this.accountStore.getProfile(this.authStore.account.dtag);
                if (profile) {
                    profileExists = true;
                    try {
                        // check if the chain link with the same address-chainId already exists

                        if (this.accountStore.profile) {
                            // parse local chain links first
                            const localChainLink = this.accountStore.profile.chainLinks.find(c => (c.address === extAddress && c.chain.toLowerCase() === chain.toLowerCase()));
                            if (localChainLink) {
                                chainLinkExists = true;
                            }
                        }

                        // parse remote then
                        const chainLink = profile.chainLinks.find(c => (c.address === extAddress && c.chain.toLowerCase() === chain.toLowerCase()));
                        if (chainLink) {
                            chainLinkExists = true;
                        }
                    } catch (e) {
                        // do nothing
                    }
                }
            }
            return profileExists && !chainLinkExists;
        },
        async connectWithKeplr(): Promise<void> {
            this.isSigningProof = true;
            try {
                if (window.keplr && this.selectedChain && this.selectedChain.chainId) {
                    // get the dest chain Keplr wallet
                    const keplrWallet = await window.keplr?.getKey(this.selectedChain.chainId);
                    // if the wallet exists & is approved by the user, proceed with the custom chain-link Keplr flow
                    if (keplrWallet.address) {
                        this.isLinkingWithKeplr = true;
                        await this.generateProofWithKeplr(keplrWallet);
                    }
                } else {
                    this.generateProofError = "Keplr not available";
                }
            } catch (e) {
                this.generateProofError = "Keplr permission denied";
                // persmission to use Keplr refused
            }
            this.isLinkingWithKeplr = false;
            this.isSigningProof = false;
        },
        async connectWithMetaMask(): Promise<void> {
            if (!this.selectedChain || !this.authStore.account) {
                return;
            }
            const metamaskClient = window['ethereum'];
            if (metamaskClient && metamaskClient.isMetaMask) {
                try {
                    /* this.isSigningProof = true;
                    const addresses = await metamaskClient.request({ method: 'eth_requestAccounts' }); // request connection and sign permissions
                    const address = addresses[0];

                    const msg = this.authStore.account.address;
                    //const tmp = await metamaskClient.request({ method: 'eth_sign', params: [address, Buffer.from("0x" + Buffer.from(' ciao').toString('hex'))] }); // sign the message
                    const wr = Buffer.from(String(address).substring(2), 'hex').toString('utf8');
                    console.log(wr)
                    console.log(Web3.utils.sha3(msg))
                    const tmp = await metamaskClient.request({ method: 'eth_sign', params: [address, Web3.utils.sha3(msg)] })

                    console.log(tmp)


                    const signatureRaw = await metamaskClient.request({ method: 'personal_sign', params: [address, Buffer.from(msg).toString('hex')], from: address }); // sign the message
                    const signature = String(signatureRaw).substring(2); // hex signature without first 0x

                    // How MetaMask signs messages:
                    const tmpProof = "\x19Ethereum Signed Message:\n" + msg.length + msg
                    const hashedProof = CryptoUtils.keccak256(tmpProof)

                    // decode the pubKey from the signature
                    // Metamask doesn't use the secp256k1 curve to generate the pubKey but X25519_XSalsa20_Poly1305, so we need to decode the signature to get the correct pubKey
                    const pubKeyExpanded = recoverPublicKey(
                        signature,
                        hashedProof
                    );
                    const pubKey = Buffer.from(EthPublicKey.compress(pubKeyExpanded), 'hex');

                    const sigOnly = signature.substring(0, signature.length - 2); // remove last 2 chars
                    //Wallet.verifySignature(Buffer.from(hashedProof, 'hex'), pubKey, Buffer.from(sigOnly, 'hex'));
                    const finalProof = {
                        plainText: hashedProof,
                        pubKey: {
                            typeUrl: '/cosmos.crypto.secp256k1.PubKey',
                            value: PubKey.encode({
                                key: pubKey,
                            }).finish(),
                        },
                        signature: {
                            typeUrl: '/desmos.profiles.v2.SingleSignatureData',
                            value: SingleSignatureData.encode({
                                mode: SignMode.SIGN_MODE_TEXTUAL,
                                signature: Buffer.from(sigOnly, 'hex')
                            }).finish()
                        },
                    }
                    await this.sendChainLink(this.selectedChain, address, this.authStore.account.address, finalProof); */
                } catch (e: any) {
                    // Connection refused or failed
                    this.generateProofError = e.message || "MetaMask permission denied";
                    console.log(e);
                }
            }
            this.isSigningProof = false;
        },
        async connectWithMnemonic(mnemonic: string): Promise<void> {
            if (!this.selectedChain || !this.authStore.account) {
                return;
            }
            this.isSigningProof = true;
            try {
                const msg = this.authStore.account.address;

                const ethWallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0");
                const privKey = Buffer.from(ethWallet.privateKey.substring(2), 'hex');
                const address = ethWallet.address;


                const compressedPubKeyRaw = ethers.utils.computePublicKey(privKey, true);
                const compressedPubKey = Buffer.from(compressedPubKeyRaw.substring(2), 'hex');
                const pubKey = compressedPubKey;

                const hashedMsg = Buffer.from(CryptoUtils.sha256(msg), 'hex');
                const signatureRaw = Buffer.from((await Secp256k1.createSignature(hashedMsg, privKey)).toFixedLength()).toString('hex')
                const sigOnly = signatureRaw.substring(0, signatureRaw.length - 2); // remove last 2 chars

                const ver = Wallet.verifySignature(hashedMsg, pubKey, Buffer.from(sigOnly, 'hex'));
                const finalProof = {
                    plainText: Buffer.from(msg).toString('hex'),
                    pubKey: {
                        typeUrl: '/cosmos.crypto.secp256k1.PubKey',
                        value: PubKey.encode({
                            key: pubKey,
                        }).finish(),
                    },
                    signature: {
                        typeUrl: '/desmos.profiles.v2.SingleSignatureData',
                        value: SingleSignatureData.encode({
                            mode: SignMode.SIGN_MODE_TEXTUAL,
                            signature: Buffer.from(sigOnly, 'hex')
                        }).finish()
                    },
                }

                const chainAddress: Any = {
                    typeUrl: "/desmos.profiles.v2.HexAddress",
                    value: HexAddress.encode({
                        prefix: this.selectedChain.bechPrefix,
                        value: address
                    }).finish(),
                };
                await this.sendChainLink(this.selectedChain, address, this.authStore.account.address, finalProof, chainAddress);
            } catch (e) {
                console.log(e)
            }
            this.isSigningProof = false;
        },
        async connectWithTerrastation(): Promise<void> {
            this.isSigningProof = true;
            if (!this.selectedChain || !this.authStore.account) {
                return;
            }
            try {
                this.isSigningProof = true;
                const signResult = (await TerraSigner.generateChainLinkProof(this.selectedChain));
                if (signResult.error || signResult.proof === null) {
                    this.generateProofError = signResult.error;
                    return;
                }

                const chainAddress: Any = {
                    typeUrl: "/desmos.profiles.v2.Bech32Address",
                    value: Bech32Address.encode({
                        prefix: this.selectedChain.bechPrefix,
                        value: signResult.address
                    }).finish(),
                };
                await this.sendChainLink(this.selectedChain, signResult.address, this.authStore.account.address, signResult.proof, chainAddress);
            } catch (e) {
                this.generateProofError = (<TerraChainLinkSignerResponse>e).error;
            }
            this.isSigningProof = false;
        },
        async connectWithLedger(ledgerAppName: string): Promise<void> {
            if (this.selectedChain && ledgerAppName && this.selectedChain) {
                const selectedChain = this.selectedChain;
                await this.toggleChainLinkEditor();
                const proofObj = this.prepareChainLinkProof();
                await this.ledgerStore.setLedgerAction({ app: selectedChain, ledgerAppName: ledgerAppName, message: proofObj });
                await this.ledgerStore.startLedgerAction();

                ref(this.ledgerStore.actionSignature);
                watchEffect(async () => {
                    if (this.ledgerStore.actionSignature !== null) {
                        setTimeout(async () => {
                            if (selectedChain && this.authStore.account) {
                                await this.ledgerStore.toggleModal();
                                await this.ledgerStore.setLedgerAction({ app: selectedChain, ledgerAppName: ledgerAppName, message: '' });
                                const finalProof: Proof = {
                                    pubKey: {
                                        typeUrl: '/cosmos.crypto.secp256k1.PubKey',
                                        value: PubKey.encode({
                                            key: Buffer.from(this.ledgerStore.ledgerPubKey, 'hex')
                                        }).finish()
                                    },
                                    signature: {
                                        typeUrl: '/desmos.profiles.v2.SingleSignatureData',
                                        value: SingleSignatureData.encode({
                                            mode: SignMode.SIGN_MODE_DIRECT,
                                            signature: Buffer.from(this.ledgerStore.actionSignature!, 'hex')
                                        }).finish()
                                    },
                                    plainText: Buffer.from(JSON.stringify(proofObj, null, 0)).toString('hex'),
                                }
                                const chainAddress: Any = {
                                    typeUrl: "/desmos.profiles.v2.Bech32Address",
                                    value: Bech32Address.encode({
                                        prefix: selectedChain.bechPrefix,
                                        value: this.ledgerStore.address
                                    }).finish(),
                                };

                                await this.sendChainLink(selectedChain, this.ledgerStore.ledgerAddress, this.authStore.account?.address, finalProof, chainAddress);
                            }
                        }, 2000)
                    }
                })
            }
        },
        /**
         * Sign and broadcast a chain link transaction
         * @param selectedChain selected chain object
         * @param destAdress destination chain address
         * @param userAddress signer address
         * @param proof original raw proof object
         */
        async sendChainLink(selectedChain: Blockchain, destAdress: string, userAddress: string, proof: Proof, chainAddress: Any) {
            const msgLinkChain: MsgLinkChainAccountEncodeObject = {
                typeUrl: "/desmos.profiles.v2.MsgLinkChainAccount",
                value: {
                    chainAddress,
                    proof,
                    chainConfig: {
                        name: selectedChain?.id.toLowerCase(),
                    },
                    signer: userAddress,
                }
            }
            console.log(msgLinkChain)
            this.newChainLink = new ChainLink(destAdress, selectedChain.id);
            this.isExecutingTransaction = true;

            this.transactionStore.start({
                messages: [msgLinkChain],
                mode: BroadcastMode.Async,
                memo: "Chain link | Go-find",
            });
            this.txMessage = msgLinkChain;
            this.generateProofError = "";
        },
        /**
         * Prepare the chain link proof to be signed
         * @returns chain link proof object
         */
        prepareChainLinkProof(): any {
            if (!this.selectedChain) {
                return null;
            }
            return {
                account_number: '0',
                chain_id: this.selectedChain.chainId,
                fee: {
                    amount: [
                        {
                            amount: '0',
                            denom: `${this.selectedChain.symbol}`,
                        },
                    ],
                    gas: '1',
                },
                memo: `${this.authStore.account?.address}`,
                msgs: [],
                sequence: '0',
            }
        },
        getChainName(nameRaw: string) {
            const supportedChain = supportedChainLinks.find((v) => {
                return v.id === nameRaw;
            });
            if (supportedChain) {
                return supportedChain.name;
            } else {
                return nameRaw;
            }
        },
    },
});