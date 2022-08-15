import React, { Component } from 'react';

interface Props {
    id: string
    children: React.ReactNode
    className?: string
    onChange?(): void
}

interface State {

}

class Form extends Component<Props, State> {
    static defaultProps = {
        __TYPE: "Form"
    }
    render() {
        return (
            <form
                onSubmit={(e) => { e.preventDefault() }}
                onChange={this.props.onChange}
                className={this.props.className}
                id={this.props.id}>
                {this.props.children}
            </form>
        );
    }
}

export default Form;