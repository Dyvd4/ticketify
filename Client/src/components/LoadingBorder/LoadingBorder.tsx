import { ComponentPropsWithRef, PropsWithChildren, useEffect } from "react";
import "./LoadingBorder.styles.scss";

type _LoadingBorderProps = {
    animationDurationMs?: number;
};

export type LoadingBorderProps = PropsWithChildren<_LoadingBorderProps> &
    Omit<ComponentPropsWithRef<"div">, keyof _LoadingBorderProps>;

function LoadingBorder({ className, animationDurationMs, ...props }: LoadingBorderProps) {
    useEffect(() => {
        if (animationDurationMs) {
            document.documentElement.style.setProperty(
                "--loading-border-animation-durationMs",
                animationDurationMs + "ms"
            );
        }
    }, []);

    return (
        <div
            id="test"
            className={`loading-border relative overflow-hidden ${className}`}
            {...props}
        >
            <div
                className="h-1 w-full
                            bg-gradient-to-r from-transparent to-cyan-500"
            ></div>
            <div
                className="h-full w-1
                            bg-gradient-to-b from-transparent to-cyan-500"
            ></div>
            <div
                className="h-1 w-full
                            bg-gradient-to-l from-transparent to-cyan-500"
            ></div>
            <div
                className="h-full w-1
                            bg-gradient-to-t from-transparent to-cyan-500"
            ></div>
            {props.children}
        </div>
    );
}

export default LoadingBorder;
