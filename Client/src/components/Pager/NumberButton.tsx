import { Button, ButtonProps } from "@chakra-ui/react";

type _NumberButtonProps = {
    active?: boolean;
};

type NumberButtonProps = _NumberButtonProps &
    Omit<React.PropsWithChildren<ButtonProps>, keyof _NumberButtonProps>;

function NumberButton({ children, active, ...props }: NumberButtonProps) {
    return (
        <Button
            data-testid="NumberButton"
            _dark={{
                backgroundColor: active ? "cyan.400" : "", // originial is 200
            }}
            backgroundColor={active ? "cyan.600" : ""} // original is 400
            colorScheme={"cyan"}
            {...props}
            onClick={(e) => props.onClick && props.onClick(e)}
        >
            {children}
        </Button>
    );
}

export default NumberButton;
