import ReactDOM from "react-dom";

type LoadingRippleProps = (
    | {
        /** position `absolute` is used to center the element */
        centered?: boolean
        usePortal?: never
    }
    | {
        centered?: never
        usePortal?: boolean
    }
) & React.ComponentPropsWithRef<"div">

function LoadingRipple(props: LoadingRippleProps) {
    return "usePortal" in props && props.usePortal
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
                ${"centered" in props && props.centered ? `absolute top-1/2 left-1/2 
                transform -translate-x-1/2 -translate-y-1/2` : ``}`}
            {...props}>
            <div className="border-gray-800 dark:border-white"></div>
            <div className="border-gray-800 dark:border-white"></div>
        </div>
}

export default LoadingRipple;