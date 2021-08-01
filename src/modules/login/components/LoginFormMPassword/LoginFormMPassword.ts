import AuthAccount from "@/core/types/AuthAccount";
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
                    //ePaassword is already hashed
                    const mKeyRaw = CryptoUtils.decryptAes(loginModule.ePassword, loginModule.eKey); // decrypt mKey
                    const mKey = mKeyRaw.split('#ok')[0];
                    CryptoUtils.decryptAes(mPassword, mKey); // try to decrypt privKey
                    this.hasLoginError = false
                    authModule.saveMKey({ mKey, mPassword });

                    authModule.saveAuthAccount({ account: new AuthAccount(loginModule.username, loginModule.address) });
                    loginModule.reset();
                    router.push({ path: '/me' });
                } catch (e) {
                    console.log(e)
                    this.hasLoginError = true;
                }
            } else {
                this.hasLoginError = true;
            }
        }

    },
});