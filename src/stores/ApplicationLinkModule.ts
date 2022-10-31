import { EncodeObject } from '@cosmjs/proto-signing';
import { useAuthStore } from './AuthModule';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import ApplicationLink from '@/core/types/ApplicationLink';
import ApplicationLinkDiscord from '@/core/types/ApplicationLinks/ApplicationLinkDiscord';
import ApplicationLinkDomain from '@/core/types/ApplicationLinks/ApplicationLinkDomain';
import ApplicationLinkGithub from '@/core/types/ApplicationLinks/ApplicationLinkGithub';
import ApplicationLinkTwitch from '@/core/types/ApplicationLinks/ApplicationLinkTwitch';
import ApplicationLinkTwitter from '@/core/types/ApplicationLinks/ApplicationLinkTwitter';
import { MsgLinkApplicationEncodeObject } from '@desmoslabs/desmjs';
import Long from 'long';
import { TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';


export const useApplicationLinkStore = defineStore({
    id: 'ApplicationLinkStore',
    state: () => ({
    }),
    getters: {
    },
    actions: {

        /**
         * Generate the TxBody needed for a MsgLinkApplication
         * @param application application name (ex. "twitter")
         * @param username dtag to link to the application 
         * @param callData callData related to the specific application
         * @returns Builded ApplicationLink TxBody 
         */
        generateApplicationLinkWrapperObject(application: string, username: string, callData: string): { message: EncodeObject, memo: string } | null {
            const authStore = useAuthStore();
            if (!authStore.account) {
                return null;
            }

            const msgLinkApplication: MsgLinkApplicationEncodeObject = {
                typeUrl: "/desmos.profiles.v3.MsgLinkApplication",
                value: {
                    callData: callData,
                    linkData: {
                        application: application,
                        username: username
                    },
                    sender: authStore.account?.address,
                    sourceChannel: import.meta.env.VITE_APP_IBC_PROFILES_CHANNEL || "",
                    sourcePort: "ibc-profiles",
                    timeoutTimestamp: Long.fromNumber((Date.now() + 3600000) * 1000000),
                }
            }
            return {
                message: msgLinkApplication,
                memo: `Application link ${application} | Go-find`,
            };
        },

        /**
         * Parse into Application Links the graphQL object of the profile response
         * @param profileRaw GraphQL profile raw object
         * @returns 
         */
        parseApplicationLinks(profileRaw: any): ApplicationLink[] {
            const applicationLinks: ApplicationLink[] = [];
            try {
                if (!profileRaw.application_links && !(profileRaw.application_links.length > 0))
                    return [];

                profileRaw.application_links.forEach((applicationLinkRaw: any) => {
                    switch (applicationLinkRaw.application) {
                        case "discord":
                            applicationLinks.push(new ApplicationLinkDiscord(applicationLinkRaw.username, applicationLinkRaw.state));
                            break;
                        case "github":
                            applicationLinks.push(new ApplicationLinkGithub(applicationLinkRaw.username, applicationLinkRaw.state));
                            break;
                        case "twitter":
                            applicationLinks.push(new ApplicationLinkTwitter(applicationLinkRaw.username, applicationLinkRaw.state));
                            break;
                        case "twitch":
                            applicationLinks.push(new ApplicationLinkTwitch(applicationLinkRaw.username, applicationLinkRaw.state));
                            break;
                        case "domain":
                            applicationLinks.push(new ApplicationLinkDomain(applicationLinkRaw.username, applicationLinkRaw.state));
                            break;
                        default:
                            console.warn(`Application link ${applicationLinkRaw.application} not supported`);
                    }
                })
            } catch (e) {
                return [];
            }
            return applicationLinks;
        }
    },
})

// Register the store to enable HMR
registerModuleHMR(useApplicationLinkStore);