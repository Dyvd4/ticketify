import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

interface HeartProps {
    color: Tailwind.Color
    onClick?(...args): void
    size: SizeProp
}

interface HeartState {

}

interface Heart {
    heartRef: React.RefObject<HTMLDivElement>
}

class Heart extends React.Component<HeartProps, HeartState> {
    state = {
        active: false,
        mouseDown: false
    }
    constructor(props) {
        super(props);
        this.heartRef = React.createRef();
    }
    static defaultProps: HeartProps = {
        color: {
            value: "text-gray-400",
            hover: "text-gray-300"
        },
        size: "1x"
    }
    handleClick = (active: boolean) => {
        let heart = this.heartRef.current;
        if (heart) {
            heart.classList.remove(active ? "heart-button--unmount" : "heart-button--mount");
            heart.classList.add(active ? "heart-button--mount" : "heart-button--unmount");
        }
        this.setState({ active });
        if (this.props.onClick) this.props.onClick(this.state.active);
    }
    render() {
        const { mouseDown, active } = this.state;
        const { color, size } = this.props;
        return (
            <div ref={this.heartRef} className="inline-block relative">
                <div className="heart-button-circles"></div>
                <FontAwesomeIcon
                    onMouseDown={() => { this.setState({ mouseDown: true }) }}
                    onMouseUp={() => { this.setState({ mouseDown: false }) }}
                    onMouseLeave={() => { this.setState({ mouseDown: false }) }}
                    onClick={() => { this.handleClick(!this.state.active) }}
                    className={`transform
                    ${active ? "text-green-400" : color.value} 
                    ${!active ? `hover:${color.hover}` : ""}
                    active:${color.value} active:scale-90
                    cursor-pointer`}
                    icon={(mouseDown || active) ? faHeart : farHeart}
                    size={size} />
            </div>
        );
    }
}

export default Heart;