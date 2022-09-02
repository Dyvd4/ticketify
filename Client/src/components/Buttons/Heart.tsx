import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

type HeartProps = {
    color?: Tailwind.Color
    size?: SizeProp
    active?: boolean
} & React.ComponentPropsWithRef<"div">

interface HeartState { }

interface Heart {
    heartRef: React.RefObject<HTMLDivElement>
}

class Heart extends React.Component<HeartProps, HeartState> {
    state = {
        mouseDown: false
    }
    constructor(props) {
        super(props);
        this.heartRef = React.createRef();
    }
    render() {
        const { mouseDown } = this.state;
        const {
            color = {
                value: "text-gray-400",
                hover: "text-gray-300"
            },
            size = "1x",
            active
        } = this.props;
        return (
            <div
                ref={this.heartRef}
                className="inline-block relative"
                {...this.props}>
                <div className="heart-button-circles"></div>
                <FontAwesomeIcon
                    onMouseDown={() => { this.setState({ mouseDown: true }) }}
                    onMouseUp={() => { this.setState({ mouseDown: false }) }}
                    onMouseLeave={() => { this.setState({ mouseDown: false }) }}
                    className={`transform
                    ${active ? "text-green-400" : color.value} 
                    ${!active ? `hover:${color.hover}` : ""}
                    active:${color.value} active:scale-90
                    ${active ? "heart-button--mount" : "heart-button--unmount"}
                    cursor-pointer`}
                    icon={(mouseDown || active) ? faHeart : farHeart}
                    size={size}
                />
            </div>
        );
    }
}

export default Heart;