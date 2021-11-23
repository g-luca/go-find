import { Profile } from "@/core/types/Profile";
import RegisterModule, { RegisterState } from "@/store/modules/RegisterModule";
import LinkBlockSample from "@/modules/landing/components/LinkBlockSample/LinkBlockSample.vue"
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
import { Form, Field } from "vee-validate";
import Api from "@/core/api/Api";
const registerModule = getModule(RegisterModule)

export default defineComponent({
    components: {
        LinkBlockSample,
        Form,
        Field,
    },
    data() {
        const formSchema = {
            dtag: { required: true, regex: Profile.DTAG_REGEX },
            ePassword: { required: true, regex: Profile.PASSWORD_REGEX },
            ePasswordConfirm: { required: true, regex: Profile.PASSWORD_REGEX, confirmed: "@ePassword" },
        };
        return {
            formSchema,
            isValidDtag: false,
            isDtagAvailable: false,
            isVerifyingDtagAvailability: false,
            isEPasswordEqual: false,
            inputDtag: "",
            inputEPassword: "",
            inputEPasswordConfirm: ""
        };
    },
    methods: {
        validateDtag() {
            this.isDtagAvailable = false;
            this.isValidDtag = Profile.DTAG_REGEX.test(this.inputDtag);
            if (this.isValidDtag) {
                this.isVerifyingDtagAvailability = true;
                const dtag = this.inputDtag.toString(); // deep copy
                setTimeout(() => {
                    if (this.inputDtag === dtag) { // verify if the dtag is not changed while waiting the timeout
                        Api.get(`${process.env.VUE_APP_LCD_ENDPOINT}/desmos/profiles/v1beta1/profiles/` + this.inputDtag).then((response) => {
                            if (this.inputDtag === dtag && response['profile']) {
                                // dtag already taken
                                // the availability value depends if is recovering the account
                                this.isDtagAvailable = registerModule.hasDesmosProfile;
                            } else {
                                this.isDtagAvailable = !registerModule.hasDesmosProfile;;
                            }
                            this.isVerifyingDtagAvailability = false;
                        })

                    } else {
                        this.isVerifyingDtagAvailability = false;
                    }
                }, 200);
            }
            return this.isValidDtag;
        },
        setUserInfo() {
            registerModule.setDtag(this.inputDtag);
            registerModule.setEPassword(this.inputEPassword);
            registerModule.nextState(RegisterState.StateMPasswordInput);
        },
        setSignupWithDesmosProfile(has: boolean) {
            registerModule.setHasDesmosProfile(has);
            this.validateDtag();
        }
    },
});