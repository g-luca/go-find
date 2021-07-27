import { defineRule, configure } from 'vee-validate';
import { required, min, max, regex } from '@vee-validate/rules';

function loadFormValidators(): void {
    defineRule('required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('regex', regex);
    configure({ validateOnChange: true, validateOnInput: true })
}


export default loadFormValidators;