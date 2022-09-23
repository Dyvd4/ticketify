import { Button } from "@chakra-ui/react";

type NumberButtonProps = React.PropsWithChildren<{
    active?: boolean
}> & React.ComponentPropsWithRef<"button">

function NumberButton({ children, active, ...props }: NumberButtonProps) {
    return (
        <Button
            {...props}
            className={`${!active
                ? 'text-primary-inactive'
                : 'text-primary'}`}
            onClick={(e) => props.onClick && props.onClick(e)}>
            {children}
        </Button>
    );
}

export default NumberButton;