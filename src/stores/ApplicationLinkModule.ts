import { useAuthStore } from './AuthModule';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import ApplicationLink from '@/core/types/ApplicationLink';
import ApplicationLinkDiscord from '@/core/types/ApplicationLinks/ApplicationLinkDiscord';
import ApplicationLinkDomain from '@/core/types/ApplicationLinks/ApplicationLinkDomain';
import ApplicationLinkGithub from '@/core/types/ApplicationLinks/ApplicationLinkGithub';
import ApplicationLinkTwitch from '@/core/types/ApplicationLinks/ApplicationLinkTwitch';
import ApplicationLinkTwitter from '@/core/types/ApplicationLinks/ApplicationLinkTwitter';
import { CosmosTxBody, DesmosMsgLinkApplication } from 'desmosjs';


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
         * @param dtag dtag to link to the application 
         * @param callData callData related to the specific application
         * @returns 
         */
        generateApplicationLinkTxBody(application: string, username: string, callData: string): CosmosTxBody | null {
            const authStore = useAuthStore();
            if (authStore.account) {
                const msgLinkApplication: DesmosMsgLinkApplication = {
                    callData: callData,
                    sender: authStore.account?.address,
                    sourceChannel: import.meta.env.VITE_APP_IBC_PROFILES_CHANNEL || "",
                    sourcePort: "ibc-profiles",
                    linkData: {
                        application: application,
                        username: username
                    },
                    timeoutTimestamp: (Date.now() + 3600000) * 1000000,
                    timeoutHeight: undefined,

                }
                const txBody: CosmosTxBody = {
                    memo: `Linking ${username} to ${application} | Go-find`,
                    messages: [
                        {
                            typeUrl: "/desmos.profiles.v1beta1.MsgLinkApplication",
                            value: msgLinkApplication as any,
                        }
                    ],
                    extensionOptions: [],
                    nonCriticalExtensionOptions: [],
                    timeoutHeight: 0,
                }
                return txBody;
            }
            return null;
        },

        /**
         * Parse into Application Links the graphQL object of the profile response
         * @param profileRaw GraphQL profile raw object
         * @returns 
         */
        parseApplicationLinks(profileRaw: any): ApplicationLink[] {
            const applicationLinks: ApplicationLink[] = [];
            try {
                if (profileRaw.application_links && profileRaw.application_links.length > 0) {
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
                        }
                    })
                }
            } catch (e) {
                // do nothing
            }
            return applicationLinks;
        }
    },
})

// Register the store to enable HMR
registerModuleHMR(useApplicationLinkStore);