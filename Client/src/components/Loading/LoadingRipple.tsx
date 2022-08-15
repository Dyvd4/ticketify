type LoadingRippleProps = {
    centered?: boolean
}

function LoadingRipple({ centered }: LoadingRippleProps) {
    return (
        <div className={`lds-ripple
            ${centered ? `absolute top-1/2 left-1/2 
            transform -translate-x-1/2 -translate-y-1/2` : ``}`}>
            <div className="border-gray-800 dark:border-white"></div>
            <div className="border-gray-800 dark:border-white"></div>
        </div>
    );
}

export default LoadingRipple;