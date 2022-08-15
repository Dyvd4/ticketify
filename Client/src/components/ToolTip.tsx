import React from 'react';


export type ToolTipDirection = "up" | "right" | "down" | "left"

interface Props {
    title: string
    direction?: ToolTipDirection
    className?: string
    onClick?(...params: any[]): void
    children: React.ReactNode
}
interface State {
    isActive: boolean
}

class ToolTip extends React.Component<Props, State> {

    state = {
        isActive: false
    }

    getTransformStyle = () => {
        let position = {
            top: "0%",
            left: "50%"
        }
        let transform = {
            x: "-50%",
            y: "-110%"
        }
        switch (this.props.direction) {
            case "down":
                return {
                    bottom: "0%",
                    left: "50%",
                    transform: "translate(-50%, 110%)"
                }
            case "right":
                return {
                    top: "50%",
                    right: "0%",
                    transform: `translate(110%, -50%)`
                }

            case "left":
                return {
                    top: "50%",
                    left: "0%",
                    transform: `translate(-110%, -50%)`
                }
            default:
                return {
                    ...position,
                    transform: `translate(${transform.x}, ${transform.y})`
                }
        }

    }
    render() {
        let { className, onClick } = this.props;
        className = (className) ? className : "";
        return (
            <div
                onClick={onClick}
                onMouseOut={() => { this.setState({ isActive: false }) }}
                onMouseOver={() => { this.setState({ isActive: true }) }}
                className={className + "z-50 inline-flex justify-center items-center relative cursor-pointer select-none"}>
                <div
                    style={this.getTransformStyle()}
                    className={`tooltip rounded-md ${(this.state.isActive) ? "visible" : "invisible opacity-0"}`}>{this.props.title}</div>
                {this.props.children}
            </div>
        );
    }
}

export default ToolTip;