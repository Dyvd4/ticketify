import { ValidationConfig } from './Validation';

class ValidationHelper {
    inputs: HTMLInputElement[]
    configs: ValidationConfig[]
    formId: string
    excludeConfigKeys = ["name", "messages"]
    constructor(inputs: HTMLInputElement[], configs: ValidationConfig[], formId: string) {
        this.inputs = inputs;
        this.configs = configs;
        this.formId = formId;
    }
    run = () => {
        const eMailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "g");
        let inputs = this.inputs;
        let inputConfigs = this.configs;
        let newConfigs: ValidationConfig[] = [];
        for (let i = 0; i < inputs.length; i++) {
            let currentInput = inputs[i];
            let currentConfig = inputConfigs.find(config => {
                return config.name === currentInput.name
            });
            if (!currentConfig) continue
            else {

                if (currentConfig.isRequired) {
                    if (currentInput.value.length <= 0) {
                        currentConfig.isRequired.hasErrors = true;
                    }
                    else if (currentInput.localName === "select" && currentInput.value.toLowerCase() === "select") {
                        currentConfig.isRequired.hasErrors = true;
                    }
                    else {
                        currentConfig.isRequired.hasErrors = false;
                    }
                }

                if (currentConfig.minLength && currentConfig.minLength.value) {
                    if (currentInput.value.length < currentConfig.minLength.value) currentConfig.minLength.hasErrors = true;
                    else currentConfig.minLength.hasErrors = false;
                }

                if (currentConfig.maxLength && currentConfig.maxLength.value) {
                    if (currentInput.value.length > currentConfig.maxLength.value) currentConfig.maxLength.hasErrors = true;
                    else currentConfig.maxLength.hasErrors = false;
                }

                if (currentConfig.isEmail) {
                    if (!eMailRegex.test(currentInput.value)) currentConfig.isEmail.hasErrors = true;
                    else currentConfig.isEmail.hasErrors = false;
                }

                if (currentConfig.callback && currentConfig.callback.value) {
                    // note: promise cb maybe?
                    let result = currentConfig.callback.value(currentInput.value);
                    if (!result) currentConfig.callback.hasErrors = true;
                    else currentConfig.callback.hasErrors = false;
                }

                if (currentConfig.regexPattern) {
                    let pattern = new RegExp(currentConfig.regexPattern.value);
                    if (pattern.test(currentInput.value)) currentConfig.regexPattern.hasErrors = true;
                    else currentConfig.regexPattern.hasErrors = false;
                }
                newConfigs.push(currentConfig);
            }
        }
        this.configs = newConfigs;
        return newConfigs;
    }
    getInputConfig = (inputName: string) => this.configs.find(input => input.name === inputName);
    inputHasErrors = (inputName: string) => {
        let inputConfig = this.getInputConfig(inputName);
        if (!inputConfig) throw new Error(`Input with name: ${inputName} does not exist`);
        let keys = Object.keys(inputConfig);
        return keys.filter(key => !this.excludeConfigKeys.includes(key)).some(key => {
            // @ts-ignore
            return inputConfig[key].hasErrors;
        });
    }
    inputIsRequired = (inputName: string) => {
        let inputConfig = this.getInputConfig(inputName);
        if (!inputConfig) throw new Error(`Input with name: ${inputName} does not exist`);
        if (inputConfig.isRequired && inputConfig.isRequired) return true;
        return false;
    }
    resetInputError = (inputName: string) => {
        let inputConfig = this.getInputConfig(inputName);
        if (!inputConfig) throw new Error(`Input with name: ${inputName} does not exist`);
        let keys = Object.keys(inputConfig);
        keys.filter(key => !this.excludeConfigKeys.includes(key)).forEach(key => {
            // @ts-ignore
            inputConfig[key].hasErrors = false;
        });
        let newInputConfigs = [...this.configs];
        let spliceIndex = newInputConfigs.findIndex(element => { return element.name === inputName });
        newInputConfigs.splice(spliceIndex, 1, inputConfig);
        return newInputConfigs;
    }
    resetAllInputErrors = () => {
        let newInputConfigs = [...this.configs];
        newInputConfigs.forEach(inputConfig => {
            let keys = Object.keys(inputConfig);
            keys.filter(key => !this.excludeConfigKeys.includes(key)).forEach(key => {
                // @ts-ignore
                inputConfig[key].hasErrors = false;
            });
        });
        return newInputConfigs;
    }
    resetAllInputValues = () => {
        let form = document.getElementById(this.formId) as HTMLFormElement;
        if (!form) throw new Error(`From with id ${this.formId} does not exist`);
        if (!form.elements) return;
        Array.from(form.elements).forEach(element => {
            if (element instanceof HTMLInputElement) element.value = "";
        });
    }
    anyInputHasErrors = () => {
        if (this.configs.some(config => {
            let keys = Object.keys(config);
            return keys.filter(key => !this.excludeConfigKeys.includes(key)).some(key => {
                // @ts-ignore
                return config[key].hasErrors;
            })
        })) {
            return true;
        }
        return false;
    }

}
export { ValidationHelper };

