import { defineRule, configure } from 'vee-validate';
import { required, min, max, regex, confirmed } from '@vee-validate/rules';

function loadFormValidators(): void {
    defineRule('required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('regex', regex);
    defineRule('confirmed', confirmed);
    configure({ validateOnChange: true, validateOnInput: true })
}


export default loadFormValidators;