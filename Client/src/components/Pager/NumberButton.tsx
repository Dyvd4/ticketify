import { Button } from "@chakra-ui/react";
import { actionBackgroundColor, actionBackgroundColorInactive } from "src/data/tailwind";
import { mapColorProps } from "src/utils/component";

type NumberButtonProps = React.PropsWithChildren<{
    active?: boolean
}> & React.ComponentPropsWithRef<"button">

function NumberButton({ children, active, ...props }: NumberButtonProps) {
    return (
        <Button
            {...props}
            className={`${!active
                ? mapColorProps([actionBackgroundColorInactive])
                : mapColorProps([actionBackgroundColor])}`}
            onClick={(e) => props.onClick && props.onClick(e)}>
            {children}
        </Button>
    );
}

export default NumberButton;