import { useAtom } from "jotai";
import ReactDOM from "react-dom";
import { portalIsRenderedAtom } from "src/context/atoms";

type _LoadingRippleProps =
    | {
          /** position `absolute` is used to center the element */
          centered?: boolean;
          usePortal?: never;
      }
    | {
          centered?: never;
          usePortal?: boolean;
      };

type LoadingRippleProps = _LoadingRippleProps &
    Omit<React.ComponentPropsWithRef<"div">, keyof _LoadingRippleProps>;

function LoadingRipple({ centered, usePortal, className, ...props }: LoadingRippleProps) {
    const [portalIsRendered] = useAtom(portalIsRenderedAtom);

    return portalIsRendered && usePortal ? (
        ReactDOM.createPortal(
            <div
                data-testid="LoadingRipple"
                className={`${className} lds-ripple absolute top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2 transform`}
                {...props}
            >
                <div className="border-gray-800 dark:border-white"></div>
                <div className="border-gray-800 dark:border-white"></div>
            </div>,
            document.getElementById("portal")!
        )
    ) : (
        <div
            data-testid="LoadingRipple"
            className={`${className} lds-ripple
                ${
                    centered
                        ? `absolute top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2 transform`
                        : ``
                }`}
            {...props}
        >
            <div className="border-gray-800 dark:border-white"></div>
            <div className="border-gray-800 dark:border-white"></div>
        </div>
    );
}

export default LoadingRipple;
