import ReactDOM from "react-dom";

type _LoadingRippleProps = (
    | {
        /** position `absolute` is used to center the element */
        centered?: boolean
        usePortal?: never
    }
    | {
        centered?: never
        usePortal?: boolean
    }
)

type LoadingRippleProps = _LoadingRippleProps &
    Omit<React.ComponentPropsWithRef<"div">, keyof _LoadingRippleProps>

function LoadingRipple({ centered, usePortal, ...props }: LoadingRippleProps) {
    return usePortal
        ? ReactDOM.createPortal(
            <div
                data-testid="LoadingRipple"
                className={`lds-ripple absolute top-1/2 left-1/2 
                transform -translate-x-1/2 -translate-y-1/2`}
                {...props}>
                <div className="border-gray-800 dark:border-white"></div>
                <div className="border-gray-800 dark:border-white"></div>
            </div>
            , document.getElementById("loading-ripple-portal")!)
        : <div
            data-testid="LoadingRipple"
            className={`lds-ripple
                ${centered ? `absolute top-1/2 left-1/2 
                transform -translate-x-1/2 -translate-y-1/2` : ``}`}
            {...props}>
            <div className="border-gray-800 dark:border-white"></div>
            <div className="border-gray-800 dark:border-white"></div>
        </div>
}

export default LoadingRipple;