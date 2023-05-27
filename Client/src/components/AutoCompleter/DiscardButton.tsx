import { Tooltip } from "@chakra-ui/react";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mapColorProps } from "src/utils/component";

type DiscardButtonProps = {} & React.ComponentPropsWithRef<"div">;

function DiscardButton({ className, ...rest }: DiscardButtonProps) {
    const textColor = {
        value: "text-gray-500",
        hover: "text-gray-800",
        darkMode: {
            value: "text-gray-500",
            hover: "text-gray-400",
        },
    };
    return (
        <Tooltip label="discard" placement="top">
            <>
                <div
                    className={`cursor-pointer
                            ${mapColorProps([textColor])}  
                            ${className}`}
                    {...rest}
                >
                    <FontAwesomeIcon icon={faMinusCircle} size="lg" />
                </div>
            </>
        </Tooltip>
    );
}

export default DiscardButton;
