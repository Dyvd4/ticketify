import { Button } from "@chakra-ui/react";

type NumberButtonProps = React.PropsWithChildren<{
    active?: boolean
}> & React.ComponentPropsWithRef<"button">

function NumberButton({ children, active, ...props }: NumberButtonProps) {
    return (
        <Button
            _dark={{
                backgroundColor: active ? "cyan.400" : "" // originial is 200
            }}
            backgroundColor={active ? "cyan.600" : ""} // original is 400
            colorScheme={"cyan"}
            {...props}
            onClick={(e) => props.onClick && props.onClick(e)}>
            {children}
        </Button>
    );
}

export default NumberButton;