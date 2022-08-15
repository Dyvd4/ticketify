import React, { Component } from 'react';
import { ValidationConfig } from './Validation';

interface Props {
    children: React.ReactNode,
    config: ValidationConfig
}

interface State {

}

class Item extends Component<Props, State> {
    static defaultProps = {
        __TYPE: "Item"
    }
    render() {
        return this.props.children;
    }
}

export default Item;