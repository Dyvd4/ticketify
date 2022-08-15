import React from "react";

type InputGroupProps = React.PropsWithChildren<{}>
    & React.ComponentPropsWithRef<"div">

function InputGroup(props: InputGroupProps) {
    const { children, className, ...rest } = props;
    return <div className={`flex flex-col mb-4 ${className}`} {...rest}>
        {children}
    </div>
}

export default InputGroup;