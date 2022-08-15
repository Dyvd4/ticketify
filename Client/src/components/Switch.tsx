import * as React from "react";

interface SwitchProps {
  onToggle(result: any): void;
  property: boolean;
  children?: React.ReactNode;
  className?: string;
}

interface SwitchState { }

class Switch extends React.Component<SwitchProps, SwitchState> {
  render() {
    let { property, children, className, onToggle } = this.props;
    if (!children) {
      return (
        <div onClick={() => { onToggle((property) ? false : true) }} className="wrap-switch">
          <div className={property ? "switch-active bg-blue-600" : "switch"}></div>
        </div>
      );
    } else {
      return (
        <div className={`flex justify-center items-center ${className}`}>
          <div>{children}</div> &nbsp;
          <div onClick={() => { onToggle((property) ? false : true) }} className="wrap-switch">
            <div className={property ? "switch-active  bg-blue-600" : "switch"}></div>
          </div>
        </div>
      );
    }
  }
}

export default Switch;
