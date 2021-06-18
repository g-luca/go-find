import Account from "@/core/types/Account";
import User from "@/core/types/User";
import LinkBlockSample from "@/modules/landing/components/LinkBlockSample/LinkBlockSample.vue"
import router from "@/router";
import AuthModule from "@/store/modules/AuthModule";
import LoginModule from "@/store/modules/LoginModule";
import CryptoUtils from "@/utils/CryptoUtils";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
const loginModule = getModule(LoginModule);
const authModule = getModule(AuthModule);

export default defineComponent({
    components: {
        LinkBlockSample
    },
    data() {
        return {
            isValidMPassword: false,
            hasLoginError: false,
            isTouched: false,
            inputMPassword: "",
        };
    },
    methods: {
        validatePassword() {
            this.isValidMPassword = User.PASSWORD_REGEX.test(this.inputMPassword);
        },
        signin() {
            this.validatePassword();
            if (this.isValidMPassword) {
                const mPassword = CryptoUtils.sha256(this.inputMPassword); // generate hashed mPassword
                try {
                    const mKey = CryptoUtils.decryptAes(loginModule.ePassword, loginModule.eKey).split('#ok')[0]; // decrypt mKey
                    CryptoUtils.decryptAes(mPassword, mKey); // try to decrypt privKey
                    this.hasLoginError = false
                    authModule.saveMKey({ mKey, mPassword });
                    authModule.saveAccount({ account: new Account(loginModule.username, '') });
                    router.push({ path: '/me' });
                } catch (e) {
                    this.hasLoginError = true;
                }
            } else {
                this.hasLoginError = true;
            }
        }

    },
});