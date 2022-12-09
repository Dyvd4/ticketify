import { ComponentPropsWithRef } from "react";

type CircleProps = {
    /** the size from tailwind's width or height sizes */
    size?: number
    /** 
     * The bg-color from tailwind's color palette. 
     * Will be string-interpolated like bg-${bgColor}.
     * */
    bgColor?: string
} & ComponentPropsWithRef<"div">

function Circle({ size = 4, bgColor = "green-500", className, ...props }: CircleProps) {
    return (
        <div className={`rounded-full w-${size} h-${size} 
                         bg-${bgColor} ${className}`}
            {...props}>
        </div>
    );
}

export default Circle;