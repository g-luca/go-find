import { LoadingStatus } from "@/core/types/LoadingStatus";
import { Profile } from "@/core/types/Profile";
import LinkBlockSample from "@/modules/landing/components/LinkBlockSample/LinkBlockSample.vue"
import LoginModule, { LoginState } from "@/store/modules/LoginModule";
import CryptoUtils from "@/utils/CryptoUtils";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
const loginModule = getModule(LoginModule);

export default defineComponent({
    components: {
        LinkBlockSample
    },
    data() {
        return {
            isLoading: LoadingStatus.Loaded,
            isValidDtag: false,
            isValidEPassword: false,
            isValidAddress: false,
            hasLoginError: false,
            isTouched: false,
            inputDtag: "",
            inputAddress: "",
            inputEPassword: "",
            isLoginWithAddress: false,
        };
    },
    methods: {
        validateDtag() {
            this.isValidDtag = Profile.DTAG_REGEX.test(this.inputDtag);
        },
        validatePassword() {
            this.isValidEPassword = Profile.PASSWORD_REGEX.test(this.inputEPassword);
        },
        validateAddress() {
            //TODO: add better control with regex
            this.isValidAddress = this.inputAddress.length > 10;
        },
        toggleAddressLogin() {
            this.isLoginWithAddress = !this.isLoginWithAddress;
            this.inputAddress = "";
        },
        async signin() {
            this.isTouched = true;
            this.validateDtag();
            this.validatePassword();
            this.validateAddress();

            if (this.isValidEPassword && this.isValidDtag && (!this.isLoginWithAddress) || (this.isLoginWithAddress && this.isValidAddress)) {
                const ePassword = CryptoUtils.sha256(this.inputEPassword); // generate the hashed ePassword

                // Call the login endpoint, if dtag and ePassword matches it will return eKey, empty string otherwise
                this.isLoading = LoadingStatus.Loading;
                await loginModule.login({ dtag: this.inputDtag, ePassword, address: this.inputAddress });
                const eKey = loginModule.eKey;
                if (eKey) {
                    this.isLoading = LoadingStatus.Loaded;
                    loginModule.nextState(LoginState.StateMLogin);
                } else {
                    this.hasLoginError = true;
                    this.isLoading = LoadingStatus.Error;
                }
            } else {
                this.hasLoginError = true;
            }
        },
    },
});