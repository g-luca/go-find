import User from "@/core/types/User";
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
            username: { required: true, regex: User.USERNAME_REGEX },
            ePassword: { required: true, regex: User.PASSWORD_REGEX },
            ePasswordConfirm: { required: true, regex: User.PASSWORD_REGEX, confirmed: "@ePassword" },
        };
        return {
            formSchema,
            isValidUsername: false,
            isUsernameAvailable: false,
            isVerifyingUsernameAvailability: false,
            isEPasswordEqual: false,
            inputUsername: "",
            inputEPassword: "",
            inputEPasswordConfirm: ""
        };
    },
    methods: {
        validateUsername() {
            this.isUsernameAvailable = false;
            this.isValidUsername = User.USERNAME_REGEX.test(this.inputUsername);
            if (this.isValidUsername) {
                this.isVerifyingUsernameAvailability = true;
                const username = this.inputUsername.toString(); // deep copy
                setTimeout(() => {
                    if (this.inputUsername === username) { // verify if the username is not changed while waiting the timeout
                        Api.get('https://lcd.go-find.me/desmos/profiles/v1beta1/profiles/' + this.inputUsername).then((response) => {
                            if (this.inputUsername === username && response['profile']) {
                                //username already taken
                                // the availability value depends if is recovering the account
                                this.isUsernameAvailable = registerModule.hasDesmosProfile;
                            } else {
                                this.isUsernameAvailable = !registerModule.hasDesmosProfile;;
                            }
                            this.isVerifyingUsernameAvailability = false;
                        })

                    } else {
                        this.isVerifyingUsernameAvailability = false;
                    }
                }, 200);
            }
            return this.isValidUsername;
        },
        setUserInfo() {
            registerModule.setUsername(this.inputUsername);
            registerModule.setEPassword(this.inputEPassword);
            registerModule.nextState(RegisterState.StateMPasswordInput);
        },
        setSignupWithDesmosProfile(has: boolean) {
            registerModule.setHasDesmosProfile(has);
            this.validateUsername();
        }
    },
});