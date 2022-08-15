import { Component } from 'react';
import ComponentHelper from '../../utils/component';
import { ValidationHelper } from './Helper';

const validInputs = ["textarea", "input", "select"];
const errorClassName = {
    input: "validation-input-error",
    requiredIcon: "validation-required-icon"
}
const requiredIcon = '\u002A';

interface OnChange {
    name: "onChange"
}
interface OnClick {
    name: "onClick"
    resetAllErrors: boolean
}

interface Props {
    children: React.ReactNode
    type?: OnChange | OnClick
    onSubmit(hasErrors: boolean): void
}

interface State {
    formId: string
    inputs: HTMLInputElement[]
    configs: ValidationConfig[]
}

export interface ValidationConfig {
    name: string
    minLength?: {
        value: number,
        messages: string[],
        hasErrors?: boolean
    }
    maxLength?: {
        value: number,
        messages: string[],
        hasErrors?: boolean
    }
    isRequired?: {
        messages?: string[],
        hasErrors?: boolean
    }
    isEmail?: {
        messages?: string[],
        hasErrors?: boolean
    }
    regexPattern?: {
        value: string,
        messages: string[],
        hasErrors?: boolean
    },
    callback?: {
        value(value: string): boolean,
        messages: string[],
        hasErrors?: boolean
    }
    messages?: string[]
}

class Validation extends Component<Props, State> {
    myValidation: ValidationHelper
    state = {
        formId: "",
        inputs: [] as HTMLInputElement[],
        configs: [] as ValidationConfig[]
    }
    componentDidMount = () => {
        let form = ComponentHelper.getChildrenByType(["Form"], [this.props.children])[0];
        if (!form) throw new Error("Validation must have a form");
        // register validation to helper
        this.myValidation = new ValidationHelper(this.state.inputs, this.state.configs, form.props.id);
        let formDOM = document.getElementById(form.props.id)! as HTMLFormElement;
        formDOM.addEventListener("submit", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.runValidation(true);
        });
        //get all configs and set state 
        let formItems = ComponentHelper.getChildrenByType(["Item"], form.props.children.length ? form.props.children : [form.props.children]);
        let configs = formItems.map(item => item.props.config);
        let inputs = Array.from(formDOM.elements).filter(input => validInputs.includes(input.localName)) as HTMLInputElement[];

        this.validateConfigs(configs, inputs);
        this.setInitialState(configs, inputs, form.props.id);
    }
    componentDidUpdate = () => {
        this.myValidation.inputs = this.state.inputs;
        this.myValidation.configs = this.state.configs;
        this.setDisplayErrors();
    }
    setInitialState = (configs: ValidationConfig[], inputs: HTMLInputElement[], formId: string) => {
        this.setState({
            configs,
            inputs,
            formId
        }, () => {
            this.state.inputs.forEach(input => {
                //add eventListener
                if (this.props.type && this.props.type.name === "onClick") input.addEventListener("click", this.handleResetInputError);
                else {
                    input.addEventListener("input", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.runValidation(false);
                        this.setDisplayErrors();
                    });
                }
                let inputConfig = this.state.configs.find(config => { return config.name === input.name });
                if (inputConfig) {
                    // set error message container for error-messsages
                    if (!input.nextElementSibling?.classList.contains("validation-error-wrapper")) {
                        let errorMessagesContainer = document.createElement("span");
                        errorMessagesContainer.className += "validation-error-wrapper text-red-500";
                        input.parentNode?.insertBefore(errorMessagesContainer, input.nextElementSibling);
                    }
                    // set error-span for required icon
                    let inputLabel = Array.from(document.getElementById(formId)!.getElementsByTagName("label"))
                        .filter(label => label.htmlFor === input.name)[0];
                    if (inputLabel && !inputLabel.querySelector(`.${errorClassName.requiredIcon}`) &&
                        (inputConfig.isRequired || inputConfig.isEmail)) {
                        let requiredIconContainer = document.createElement("span");
                        requiredIconContainer.classList.add(errorClassName.requiredIcon);
                        requiredIconContainer.innerText = requiredIcon;
                        inputLabel.appendChild(requiredIconContainer);
                    }
                    // set default error messages
                    Object.keys(inputConfig).filter(key => key !== "name").forEach(key => {
                        if (!inputConfig![key].messages || inputConfig![key].messages.length === 0) {
                            let defaultMessage = "";
                            switch (key) {
                                case "isRequired":
                                    defaultMessage = "This field is required"
                                    break;
                                case "isEmail":
                                    defaultMessage = "This field is required"
                                    break;
                            }
                            inputConfig![key].messages = [defaultMessage];
                        }
                    })
                }
            });
        });
    }
    runValidation = (isSubmit: boolean) => {
        let validatedInputConfigs = this.myValidation.run();
        let form = document.getElementById(this.state.formId)! as HTMLFormElement;
        let inputs = Array.from(form.elements).filter(function (input) {
            return validInputs.includes(input.localName)
        }) as HTMLInputElement[];
        let errorResult = this.myValidation.anyInputHasErrors();
        if (this.props.onSubmit && isSubmit) this.props.onSubmit(errorResult);
        this.setState({
            inputs,
            configs: validatedInputConfigs
        });
    }
    setDisplayErrors = () => {
        this.state.configs.forEach(config => {
            let keys = Object.keys(config);
            if (this.myValidation.inputHasErrors(config.name)) {
                let input = Array.from(this.state.inputs).find(input => input.name === config.name)!;
                // set input error
                input.classList.add(errorClassName.input);
                if (config.isRequired) {
                    //set required icon error
                    let inputLabel = Array.from(document.getElementsByTagName("label"))
                        .find(label => label.htmlFor === input.name);
                    let requiredIconContainer = inputLabel!.getElementsByClassName(errorClassName.requiredIcon)[0];
                    requiredIconContainer.classList.add("text-red-500");
                }
                // set error messages
                let errorMessagesContainer = input.nextElementSibling!;
                if (errorMessagesContainer.innerHTML === "") {
                    keys.filter(key => key !== "name").forEach(key => {
                        if (config[key].hasErrors && config[key].messages) {
                            config[key].messages.forEach(message => {
                                let messageSpan = document.createElement("span");
                                messageSpan.innerText = message;
                                errorMessagesContainer.appendChild(messageSpan);
                            });
                        }
                    });
                    if (config.messages) {
                        config.messages.forEach(message => {
                            let messageSpan = document.createElement("span");
                            messageSpan.innerText = message;
                            errorMessagesContainer.appendChild(messageSpan);
                        });
                    }
                }
            }
            else {
                let input = Array.from(this.state.inputs).find(input => input.name === config.name)!;
                //set input error
                input.classList.remove(errorClassName.input);
                if (config.isRequired) {
                    //set required icon error
                    let inputLabel = Array.from(document.getElementsByTagName("label"))
                        .find(label => label.htmlFor === input.name);
                    let requiredIconContainer = inputLabel!.getElementsByClassName(errorClassName.requiredIcon)[0];
                    requiredIconContainer?.classList.remove("text-red-500");
                }
                // set error messages
                let errorMessagesContainer = input.nextElementSibling;
                if (errorMessagesContainer) errorMessagesContainer.innerHTML = "";
            }
        });
    }
    handleResetInputError = (e: any) => {
        let updatedInputConfigs: ValidationConfig[] = [];
        // @ts-ignore
        if (!this.props.type.resetAllErrors) {
            updatedInputConfigs = this.myValidation.resetInputError(e.target.name);
        }
        else {
            updatedInputConfigs = this.myValidation.resetAllInputErrors();
        }
        this.setState({
            configs: updatedInputConfigs
        });
    }
    validateConfigs = (configs: ValidationConfig[], inputs: HTMLInputElement[]) => {
        configs.forEach(config => {
            let configHasInput = (Array.from(inputs).filter(input => { return input.name === config.name }).length === 0) ? false : true;
            if (!configHasInput) throw new Error("Config must have an input");
        });
    }
    render() {
        return this.props.children;
    }
}

export default Validation;